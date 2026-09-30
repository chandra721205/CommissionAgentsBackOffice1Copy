-- ================================================================================
-- TRADIE Producer Ledger - PostgreSQL DDL Schema
-- ================================================================================
-- Production-ready schema for commission agent producer credit/debit management
-- Supports: Credits, Debits, Sales, Expenses, AI Risk Scoring, Staff Permissions
-- Version: 1.0
-- Date: October 28, 2025
-- ================================================================================

-- ================================================================================
-- 1. CORE TABLES: Producer Credit Lifecycle
-- ================================================================================

-- Credit requests raised by producers (or by agent on their behalf)
CREATE TABLE producer_credit_requests (
  id                  BIGSERIAL PRIMARY KEY,
  producer_user_id    BIGINT NOT NULL REFERENCES users(id),
  commission_agent_id BIGINT NOT NULL REFERENCES users(id),
  request_amount      NUMERIC(14,2) NOT NULL,
  purpose             TEXT,                         -- inputs, harvest, transport, etc.
  village             TEXT,
  state_region        TEXT,
  requested_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status              TEXT NOT NULL DEFAULT 'PENDING',  -- PENDING|APPROVED|REJECTED|CLOSED
  ai_risk_rank        INTEGER,                      -- 1..5 (5 = highest risk)
  ai_comment          TEXT
);

-- Indexes for performance
CREATE INDEX idx_credit_requests_producer ON producer_credit_requests(producer_user_id);
CREATE INDEX idx_credit_requests_agent ON producer_credit_requests(commission_agent_id);
CREATE INDEX idx_credit_requests_status ON producer_credit_requests(status);
CREATE INDEX idx_credit_requests_requested_at ON producer_credit_requests(requested_at DESC);

-- Approved advances (2FA via OTP for grant/closure)
CREATE TABLE producer_advances (
  id                  BIGSERIAL PRIMARY KEY,
  producer_user_id    BIGINT NOT NULL REFERENCES users(id),
  commission_agent_id BIGINT NOT NULL REFERENCES users(id),
  credit_request_id   BIGINT REFERENCES producer_credit_requests(id),
  principal_amount    NUMERIC(14,2) NOT NULL,
  interest_pct        NUMERIC(6,3) DEFAULT 0,
  tenure_days         INT,
  village             TEXT,
  state_region        TEXT,
  approved_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  otp_grant_last4     TEXT,                         -- last 4 digits for audit
  status              TEXT NOT NULL DEFAULT 'OPEN'   -- OPEN|PARTIALLY_SETTLED|CLOSED|DEFAULTED
);

-- Indexes
CREATE INDEX idx_advances_producer ON producer_advances(producer_user_id);
CREATE INDEX idx_advances_agent ON producer_advances(commission_agent_id);
CREATE INDEX idx_advances_status ON producer_advances(status);
CREATE INDEX idx_advances_approved_at ON producer_advances(approved_at DESC);
CREATE INDEX idx_advances_credit_request ON producer_advances(credit_request_id);

-- Repayments can be partial; also support "deduction at payout"
CREATE TABLE producer_repayments (
  id                  BIGSERIAL PRIMARY KEY,
  advance_id          BIGINT NOT NULL REFERENCES producer_advances(id) ON DELETE CASCADE,
  amount_paid         NUMERIC(14,2) NOT NULL,
  mode                TEXT,                         -- CASH|UPI|NEFT|LEDGER_DEDUCTION|OTHER
  note                TEXT,
  paid_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  otp_close_last4     TEXT
);

-- Indexes
CREATE INDEX idx_repayments_advance ON producer_repayments(advance_id);
CREATE INDEX idx_repayments_paid_at ON producer_repayments(paid_at DESC);

-- Expenses paid on producer's behalf (to be deducted later)
CREATE TABLE producer_expenses (
  id                  BIGSERIAL PRIMARY KEY,
  producer_user_id    BIGINT NOT NULL REFERENCES users(id),
  commission_agent_id BIGINT NOT NULL REFERENCES users(id),
  lot_id              BIGINT REFERENCES lots(id),
  category            TEXT NOT NULL,                -- transport, loading, storage, bags, etc.
  description         TEXT,
  qty                 NUMERIC(14,3),
  unit_price          NUMERIC(14,2),
  amount              NUMERIC(14,2) GENERATED ALWAYS AS (
    COALESCE(qty,0) * COALESCE(unit_price,0)
  ) STORED,
  incurred_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_expenses_producer ON producer_expenses(producer_user_id);
CREATE INDEX idx_expenses_agent ON producer_expenses(commission_agent_id);
CREATE INDEX idx_expenses_lot ON producer_expenses(lot_id);
CREATE INDEX idx_expenses_incurred_at ON producer_expenses(incurred_at DESC);

-- Sales entries credited to the producer (gross); net is after deductions
CREATE TABLE producer_sales (
  id                  BIGSERIAL PRIMARY KEY,
  producer_user_id    BIGINT NOT NULL REFERENCES users(id),
  commission_agent_id BIGINT NOT NULL REFERENCES users(id),
  lot_id              BIGINT NOT NULL REFERENCES lots(id),
  bill_id             BIGINT REFERENCES bills(id),
  commodity           TEXT,
  qty_units           NUMERIC(14,3),
  unit                TEXT,                          -- Kg/MT/Bag/etc.
  price_per_unit      NUMERIC(14,2),
  gross_amount        NUMERIC(14,2) GENERATED ALWAYS AS (
    COALESCE(qty_units,0) * COALESCE(price_per_unit,0)
  ) STORED,
  realized_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sales_producer ON producer_sales(producer_user_id);
CREATE INDEX idx_sales_agent ON producer_sales(commission_agent_id);
CREATE INDEX idx_sales_lot ON producer_sales(lot_id);
CREATE INDEX idx_sales_bill ON producer_sales(bill_id);
CREATE INDEX idx_sales_realized_at ON producer_sales(realized_at DESC);

-- ================================================================================
-- 2. AI RISK & ALERTS (Producer-Focused)
-- ================================================================================

-- Periodic risk snapshot for producers
CREATE TABLE ai_producer_scores (
  id                  BIGSERIAL PRIMARY KEY,
  producer_user_id    BIGINT NOT NULL REFERENCES users(id),
  risk_rank           INTEGER NOT NULL,             -- 1..5
  risk_score          NUMERIC(6,2) NOT NULL,        -- 0..100
  pending_credits     NUMERIC(14,2) NOT NULL DEFAULT 0,
  overdue_credits     NUMERIC(14,2) NOT NULL DEFAULT 0,
  comment             TEXT,
  generated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ai_scores_producer ON ai_producer_scores(producer_user_id);
CREATE INDEX idx_ai_scores_generated_at ON ai_producer_scores(generated_at DESC);
CREATE INDEX idx_ai_scores_risk_rank ON ai_producer_scores(risk_rank);

-- ================================================================================
-- 3. STAFF ROLES & PERMISSIONS (Fine-Grained)
-- ================================================================================

-- Add detailed operational roles
CREATE TYPE staff_role AS ENUM (
  'WATCHMAN','RECEIVER','LABORER','MARKET_SALESMAN','WEIGHING_LABORER',
  'QUALITY_SUPERVISOR','SAMPLE_MOVER','OTHER'
);

-- Staff linked to an agent, can have multiple roles & scoped access
CREATE TABLE agent_staff (
  id                  BIGSERIAL PRIMARY KEY,
  agent_user_id       BIGINT NOT NULL REFERENCES users(id),
  staff_user_id       BIGINT NOT NULL REFERENCES users(id),
  active              BOOLEAN NOT NULL DEFAULT TRUE,
  assigned_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agent_user_id, staff_user_id)
);

-- Indexes
CREATE INDEX idx_agent_staff_agent ON agent_staff(agent_user_id);
CREATE INDEX idx_agent_staff_staff ON agent_staff(staff_user_id);
CREATE INDEX idx_agent_staff_active ON agent_staff(active);

CREATE TABLE agent_staff_roles (
  id                  BIGSERIAL PRIMARY KEY,
  agent_staff_id      BIGINT NOT NULL REFERENCES agent_staff(id) ON DELETE CASCADE,
  role                staff_role NOT NULL,
  scope_json          JSONB,                        -- e.g., { "villages":["X","Y"], "ops":["WEIGHMENT","DISPATCH"] }
  can_view_financials BOOLEAN NOT NULL DEFAULT FALSE,
  can_edit_ledgers    BOOLEAN NOT NULL DEFAULT FALSE,
  can_authorize_otp   BOOLEAN NOT NULL DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_staff_roles_agent_staff ON agent_staff_roles(agent_staff_id);
CREATE INDEX idx_staff_roles_role ON agent_staff_roles(role);
CREATE INDEX idx_staff_roles_scope ON agent_staff_roles USING gin(scope_json);

-- ================================================================================
-- 4. UNIFIED PRODUCER LEDGER (Credits, Debits, Expenses, Sales)
-- ================================================================================

-- Credits (money going to producer → positive)
CREATE VIEW v_producer_credits AS
SELECT
  a.producer_user_id,
  a.commission_agent_id,
  a.id AS advance_id,
  a.approved_at AS txn_date,
  'ADVANCE'::TEXT AS entry_type,
  a.principal_amount AS amount,
  a.village,
  a.state_region
FROM producer_advances a
UNION ALL
SELECT
  s.producer_user_id,
  s.commission_agent_id,
  s.id AS ref_id,
  s.realized_at,
  'SALE_GROSS'::TEXT,
  s.gross_amount,
  (SELECT l.village FROM lots l WHERE l.id = s.lot_id) AS village,
  (SELECT l.state_region FROM lots l WHERE l.id = s.lot_id) AS state_region
FROM producer_sales s;

-- Debits (money deducted from producer → negative)
CREATE VIEW v_producer_debits AS
SELECT
  r.advance_id,
  (SELECT producer_user_id FROM producer_advances a WHERE a.id=r.advance_id) AS producer_user_id,
  (SELECT commission_agent_id FROM producer_advances a WHERE a.id=r.advance_id) AS commission_agent_id,
  r.paid_at AS txn_date,
  'REPAYMENT'::TEXT AS entry_type,
  -r.amount_paid AS amount,
  (SELECT village FROM producer_advances a WHERE a.id=r.advance_id) AS village,
  (SELECT state_region FROM producer_advances a WHERE a.id=r.advance_id) AS state_region
FROM producer_repayments r
UNION ALL
SELECT
  e.id AS ref_id,
  e.producer_user_id,
  e.commission_agent_id,
  e.incurred_at,
  'EXPENSE'::TEXT,
  -e.amount,
  (SELECT l.village FROM lots l WHERE l.id = e.lot_id),
  (SELECT l.state_region FROM lots l WHERE l.id = e.lot_id)
FROM producer_expenses e;

-- Combined ledger with running balance (per agent+producer)
CREATE VIEW v_producer_ledger AS
WITH all_txn AS (
  SELECT producer_user_id, commission_agent_id, txn_date, entry_type, amount, village, state_region
  FROM v_producer_credits
  UNION ALL
  SELECT producer_user_id, commission_agent_id, txn_date, entry_type, amount, village, state_region
  FROM v_producer_debits
)
SELECT
  producer_user_id,
  commission_agent_id,
  txn_date,
  entry_type,
  amount,
  village,
  state_region,
  SUM(amount) OVER (
    PARTITION BY producer_user_id, commission_agent_id
    ORDER BY txn_date, entry_type
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_balance
FROM all_txn
ORDER BY producer_user_id, commission_agent_id, txn_date;

-- ================================================================================
-- 5. STATUS VIEWS (What an Agent Needs at a Glance)
-- ================================================================================

-- Open credit exposure & delinquency snapshot
CREATE VIEW v_producer_credit_status AS
SELECT
  a.producer_user_id,
  a.commission_agent_id,
  COUNT(*) FILTER (WHERE a.status IN ('OPEN','PARTIALLY_SETTLED')) AS open_advances,
  SUM(a.principal_amount) FILTER (WHERE a.status IN ('OPEN','PARTIALLY_SETTLED')) AS open_principal,
  COALESCE((
    SELECT SUM(r.amount_paid) FROM producer_repayments r WHERE r.advance_id = a.id
  ),0) AS total_repaid_for_this_advance,
  MAX(a.approved_at) AS last_credit_at
FROM producer_advances a
GROUP BY a.producer_user_id, a.commission_agent_id;

-- Portfolio risk for an agent
CREATE VIEW v_agent_portfolio_risk AS
SELECT
  a.commission_agent_id,
  COUNT(DISTINCT a.producer_user_id) AS producers_count,
  SUM(a.principal_amount) AS total_principal,
  COUNT(*) FILTER (WHERE a.status='OPEN') AS active_loans,
  COUNT(*) FILTER (WHERE a.status='DEFAULTED') AS defaults_count
FROM producer_advances a
GROUP BY a.commission_agent_id;

-- ================================================================================
-- 6. COMMENTS & CONSTRAINTS
-- ================================================================================

COMMENT ON TABLE producer_credit_requests IS 'Producer credit requests - tracks all funding requests with AI risk assessment';
COMMENT ON TABLE producer_advances IS 'Approved advances with OTP audit trail for grant/closure';
COMMENT ON TABLE producer_repayments IS 'Partial repayments including ledger deductions at payout';
COMMENT ON TABLE producer_expenses IS 'Expenses paid on behalf of producer (transport, labor, storage, etc.)';
COMMENT ON TABLE producer_sales IS 'Sales credited to producer - gross amount before deductions';
COMMENT ON TABLE ai_producer_scores IS 'AI-generated risk scores and pending/overdue credit tracking';
COMMENT ON TABLE agent_staff IS 'Staff members assigned to commission agents';
COMMENT ON TABLE agent_staff_roles IS 'Role assignments with granular permissions and village/operation scopes';

COMMENT ON VIEW v_producer_ledger IS 'Unified ledger view combining credits, debits, expenses, and sales with running balance';
COMMENT ON VIEW v_producer_credit_status IS 'Current credit exposure and repayment status per producer';
COMMENT ON VIEW v_agent_portfolio_risk IS 'Portfolio-level risk metrics for commission agents';

-- ================================================================================
-- 7. SAMPLE QUERIES
-- ================================================================================

-- A) Producer ledger by village & date
-- SELECT * FROM v_producer_ledger
-- WHERE commission_agent_id = $1
--   AND village ILIKE $2        -- '%MyVillage%'
--   AND txn_date::date BETWEEN $3 AND $4
-- ORDER BY txn_date DESC;

-- B) Producers needing attention (high risk / pending credits)
-- SELECT ps.producer_user_id, u.full_name, aps.risk_rank, aps.risk_score, ps.open_principal
-- FROM v_producer_credit_status ps
-- JOIN users u ON u.id = ps.producer_user_id
-- LEFT JOIN LATERAL (
--   SELECT * FROM ai_producer_scores s
--   WHERE s.producer_user_id = ps.producer_user_id
--   ORDER BY s.generated_at DESC
--   LIMIT 1
-- ) aps ON TRUE
-- WHERE ps.commission_agent_id = $1
--   AND (aps.risk_rank >= 4 OR ps.open_principal > 0)
-- ORDER BY aps.risk_rank DESC NULLS LAST, ps.open_principal DESC;

-- C) Partial repayments and remaining due for a single advance
-- SELECT
--   a.id AS advance_id,
--   a.principal_amount,
--   COALESCE(SUM(r.amount_paid),0) AS total_repaid,
--   (a.principal_amount - COALESCE(SUM(r.amount_paid),0)) AS remaining_due
-- FROM producer_advances a
-- LEFT JOIN producer_repayments r ON r.advance_id = a.id
-- WHERE a.id = $1
-- GROUP BY a.id;

-- D) Deduct expenses at payout (net payable for a sale/lot)
-- SELECT
--   s.id AS sale_id,
--   s.gross_amount,
--   COALESCE((SELECT SUM(amount) FROM producer_expenses e WHERE e.producer_user_id=s.producer_user_id AND e.lot_id=s.lot_id),0) AS total_expenses,
--   COALESCE((SELECT SUM(amount_paid) FROM producer_repayments r WHERE r.advance_id IN (
--       SELECT id FROM producer_advances a
--       WHERE a.producer_user_id=s.producer_user_id AND a.commission_agent_id=s.commission_agent_id
--   )),0) AS total_repaid_already,
--   (s.gross_amount - 
--    COALESCE((SELECT SUM(amount) FROM producer_expenses e WHERE e.producer_user_id=s.producer_user_id AND e.lot_id=s.lot_id),0)
--   ) AS net_payable_before_advance_deduction
-- FROM producer_sales s
-- WHERE s.id = $1;

-- ================================================================================
-- END OF SCHEMA
-- ================================================================================
