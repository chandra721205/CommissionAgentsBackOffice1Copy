// ==========================================
// TRADIE Complete Workflow Implementations
// Matching the example SQL workflows provided
// ==========================================

import { api } from './api';
import {
  AuthStatus,
  PaymentMethod,
  CreateBillRequest,
  CreateChangeRequestRequest,
  Create2FAAuthorizationRequest,
  Bill,
  BillAuthorization,
  LedgerEntry,
  BillChangeRequest,
  Role
} from '../types/database';

// ==========================================
// WORKFLOW 1: Create Bill after Weighment
// ==========================================

/**
 * SQL Example:
 * INSERT INTO bills (lot_id,buyer_entity_id,price_per_unit,quantity_units,packaging_cost,currency_code,due_date_type,due_date)
 * VALUES ($1,$2,$3,$4,$5,'INR',$6,$7)
 * RETURNING id;
 */
export async function createBillAfterWeighment(params: {
  lot_id: bigint;
  buyer_entity_id: bigint;
  price_per_unit: number;
  quantity_units: number;
  packaging_cost: number;
  due_date_type: 'REGULATION' | 'ASSOCIATION' | 'CUSTOM' | 'AI_SUGGESTED';
  custom_days?: number;
  items?: {
    label: string;
    qty: number;
    unit_price: number;
  }[];
}): Promise<Bill> {
  // Calculate due date based on type
  let due_date: Date;
  const today = new Date();

  switch (params.due_date_type) {
    case 'REGULATION':
      // Standard 15 days from delivery
      due_date = new Date(today);
      due_date.setDate(due_date.getDate() + 15);
      break;
    
    case 'ASSOCIATION':
      // Standard 30 days from delivery
      due_date = new Date(today);
      due_date.setDate(due_date.getDate() + 30);
      break;
    
    case 'CUSTOM':
      // Custom days specified
      due_date = new Date(today);
      due_date.setDate(due_date.getDate() + (params.custom_days || 30));
      break;
    
    case 'AI_SUGGESTED':
      // Get AI suggestion from buyer history
      const aiSuggestion = await api.getAISuggestedDueDate(params.buyer_entity_id);
      due_date = new Date(today);
      due_date.setDate(due_date.getDate() + aiSuggestion.suggested_days);
      break;
    
    default:
      due_date = new Date(today);
      due_date.setDate(due_date.getDate() + 30);
  }

  const billData: CreateBillRequest = {
    lot_id: params.lot_id,
    buyer_entity_id: params.buyer_entity_id,
    price_per_unit: params.price_per_unit,
    quantity_units: params.quantity_units,
    packaging_cost: params.packaging_cost,
    currency_code: 'INR',
    due_date_type: params.due_date_type,
    due_date: due_date,
    items: params.items
  };

  // Create bill (status defaults to PENDING_BUYER)
  const bill = await api.createBill(billData);

  console.log(`✅ Bill created: ${bill.id} - Status: ${bill.status} (PENDING_BUYER)`);
  
  return bill;
}

// ==========================================
// WORKFLOW 2: Buyer requests a change
// ==========================================

/**
 * SQL Example:
 * INSERT INTO bill_change_requests (bill_id,requested_by_user,field_name,old_value,new_value,justification)
 * VALUES ($billId,$buyerUserId,'price_per_unit','22.00','21.50','Grade marginally lower on sample');
 * UPDATE bills SET status='MODIFIED_NEEDS_JUSTIFICATION' WHERE id=$billId;
 */
export async function requestBillChange(params: {
  bill_id: bigint;
  buyer_user_id: bigint;
  field_name: string;
  old_value: string;
  new_value: string;
  justification: string;
}): Promise<BillChangeRequest> {
  const changeRequestData: CreateChangeRequestRequest = {
    bill_id: params.bill_id,
    requested_by_user: params.buyer_user_id,
    field_name: params.field_name,
    old_value: params.old_value,
    new_value: params.new_value,
    justification: params.justification
  };

  // Create change request (API automatically updates bill status to MODIFIED_NEEDS_JUSTIFICATION)
  const changeRequest = await api.createChangeRequest(changeRequestData);

  console.log(`✅ Change request created: ${changeRequest.id}`);
  console.log(`   Field: ${params.field_name}`);
  console.log(`   Old: ${params.old_value} → New: ${params.new_value}`);
  console.log(`   Justification: ${params.justification}`);
  console.log(`   Bill status updated to: MODIFIED_NEEDS_JUSTIFICATION`);

  return changeRequest;
}

// ==========================================
// WORKFLOW 3: 2FA authorization (Buyer approves)
// ==========================================

/**
 * SQL Example:
 * INSERT INTO bill_authorizations (bill_id,by_role,by_user_id,otp_last4,approved,note)
 * VALUES ($billId,'BUYER',$buyerUserId,$last4,true,'Approved by finance');
 * UPDATE bills SET status='PENDING_AGENT' WHERE id=$billId;
 */
export async function buyerApproveWithOTP(params: {
  bill_id: bigint;
  buyer_user_id: bigint;
  otp_code: string;
  note?: string;
}): Promise<BillAuthorization> {
  // Step 1: Send OTP to buyer
  await api.sendOTP(params.buyer_user_id, 'SMS');
  console.log(`📱 OTP sent to buyer ${params.buyer_user_id}`);

  // Step 2: Buyer enters OTP and approves
  const authData: Create2FAAuthorizationRequest = {
    bill_id: params.bill_id,
    by_role: Role.BUYER,
    by_user_id: params.buyer_user_id,
    otp_code: params.otp_code,
    approved: true,
    note: params.note || 'Approved by buyer'
  };

  // Create authorization (API verifies OTP and updates bill status to PENDING_AGENT)
  const authorization = await api.authorizeBillAsBuyer(authData);

  console.log(`✅ Buyer authorization recorded: ${authorization.id}`);
  console.log(`   OTP verified (last 4: ${authorization.otp_last4})`);
  console.log(`   Bill status updated to: PENDING_AGENT`);

  return authorization;
}

// ==========================================
// WORKFLOW 4: Agent final approval → freeze ledger
// ==========================================

/**
 * SQL Example:
 * INSERT INTO bill_authorizations (bill_id,by_role,by_user_id,otp_last4,approved,note)
 * VALUES ($billId,'COMMISSION_AGENT',$agentUserId,$last4,true,'Final check done');
 * 
 * UPDATE bills SET status='AUTHORIZED' WHERE id=$billId;
 * 
 * INSERT INTO ledger_entries (bill_id,snapshot_json)
 * SELECT b.id, jsonb_build_object(
 *   'bill', to_jsonb(b.*),
 *   'total', (SELECT total_payable FROM v_bill_totals v WHERE v.bill_id=b.id),
 *   'weighment', to_jsonb(w.*)
 * )
 * FROM bills b
 * JOIN weighments w ON w.lot_id=b.lot_id
 * WHERE b.id=$billId;
 */
export async function agentFinalApprovalAndFreeze(params: {
  bill_id: bigint;
  agent_user_id: bigint;
  otp_code: string;
  note?: string;
}): Promise<{
  authorization: BillAuthorization;
  ledger_entry: LedgerEntry;
}> {
  // Step 1: Send OTP to agent
  await api.sendOTP(params.agent_user_id, 'SMS');
  console.log(`📱 OTP sent to agent ${params.agent_user_id}`);

  // Step 2: Agent enters OTP and gives final approval
  const authData: Create2FAAuthorizationRequest = {
    bill_id: params.bill_id,
    by_role: Role.COMMISSION_AGENT,
    by_user_id: params.agent_user_id,
    otp_code: params.otp_code,
    approved: true,
    note: params.note || 'Final check done'
  };

  // Create authorization and ledger entry
  // API automatically:
  // 1. Verifies OTP
  // 2. Creates authorization record
  // 3. Updates bill status to AUTHORIZED
  // 4. Creates immutable ledger entry with snapshot
  const result = await api.authorizeBillAsAgent(authData);

  console.log(`✅ Agent authorization recorded: ${result.authorization.id}`);
  console.log(`   OTP verified (last 4: ${result.authorization.otp_last4})`);
  console.log(`   Bill status updated to: AUTHORIZED`);
  console.log(`✅ Ledger entry created: ${result.ledger_entry.id}`);
  console.log(`   Snapshot frozen (immutable)`);

  return result;
}

// ==========================================
// WORKFLOW 5: AI refresh buyer score
// ==========================================

/**
 * SQL Example:
 * INSERT INTO ai_buyer_scores (buyer_entity_id,reliability_score,discrepancy_ratio,on_time_pay_ratio,comment)
 * VALUES ($buyerEntityId,$score,$discRatio,$otpRatio,'Updated by nightly job');
 */
export async function refreshBuyerAIScore(buyer_entity_id: bigint) {
  console.log(`🤖 Refreshing AI score for buyer ${buyer_entity_id}...`);

  // API calculates score based on:
  // - Historical payment patterns
  // - Modification frequency
  // - Dispute rate
  // - On-time payment ratio
  const score = await api.refreshBuyerScore(buyer_entity_id);

  console.log(`✅ AI score updated:`);
  console.log(`   Reliability: ${score.reliability_score}%`);
  console.log(`   Discrepancy Ratio: ${(score.discrepancy_ratio * 100).toFixed(2)}%`);
  console.log(`   On-Time Pay Ratio: ${(score.on_time_pay_ratio * 100).toFixed(2)}%`);
  console.log(`   Comment: ${score.comment}`);

  return score;
}

// ==========================================
// COMPLETE END-TO-END WORKFLOW
// ==========================================

/**
 * Complete bill lifecycle from weighment to ledger
 */
export async function completeBillLifecycle(params: {
  lot_id: bigint;
  buyer_entity_id: bigint;
  buyer_user_id: bigint;
  agent_user_id: bigint;
  price_per_unit: number;
  quantity_units: number;
  packaging_cost: number;
  due_date_type: 'REGULATION' | 'ASSOCIATION' | 'CUSTOM' | 'AI_SUGGESTED';
  buyer_otp: string;
  agent_otp: string;
}) {
  console.log('🚀 Starting complete bill lifecycle...\n');

  // Step 1: Create bill after weighment
  console.log('📋 STEP 1: Creating bill after weighment');
  const bill = await createBillAfterWeighment({
    lot_id: params.lot_id,
    buyer_entity_id: params.buyer_entity_id,
    price_per_unit: params.price_per_unit,
    quantity_units: params.quantity_units,
    packaging_cost: params.packaging_cost,
    due_date_type: params.due_date_type
  });
  console.log(`   ✅ Bill ${bill.id} created with status: ${bill.status}\n`);

  // Step 2: Buyer approves with 2FA
  console.log('🔐 STEP 2: Buyer 2FA approval');
  const buyerAuth = await buyerApproveWithOTP({
    bill_id: bill.id,
    buyer_user_id: params.buyer_user_id,
    otp_code: params.buyer_otp,
    note: 'Approved by buyer finance team'
  });
  console.log(`   ✅ Buyer approved, status now: PENDING_AGENT\n`);

  // Step 3: Agent final approval and freeze ledger
  console.log('🔒 STEP 3: Agent final approval & ledger freeze');
  const finalResult = await agentFinalApprovalAndFreeze({
    bill_id: bill.id,
    agent_user_id: params.agent_user_id,
    otp_code: params.agent_otp,
    note: 'Final verification complete'
  });
  console.log(`   ✅ Bill ${bill.id} AUTHORIZED and frozen in ledger\n`);

  // Step 4: Refresh AI scores
  console.log('🤖 STEP 4: Refreshing AI scores');
  const buyerScore = await refreshBuyerAIScore(params.buyer_entity_id);
  console.log(`   ✅ Buyer reliability updated: ${buyerScore.reliability_score}%\n`);

  console.log('✅ COMPLETE: Bill lifecycle finished successfully!');
  
  return {
    bill,
    buyerAuth,
    agentAuth: finalResult.authorization,
    ledgerEntry: finalResult.ledger_entry,
    buyerScore
  };
}

// ==========================================
// WORKFLOW WITH CHANGE REQUEST
// ==========================================

/**
 * Bill lifecycle with change request in the middle
 */
export async function billLifecycleWithChangeRequest(params: {
  lot_id: bigint;
  buyer_entity_id: bigint;
  buyer_user_id: bigint;
  agent_user_id: bigint;
  initial_price: number;
  revised_price: number;
  quantity_units: number;
  packaging_cost: number;
  change_justification: string;
  buyer_otp: string;
  agent_otp: string;
}) {
  console.log('🚀 Starting bill lifecycle WITH change request...\n');

  // Step 1: Create initial bill
  console.log('📋 STEP 1: Creating initial bill');
  const bill = await createBillAfterWeighment({
    lot_id: params.lot_id,
    buyer_entity_id: params.buyer_entity_id,
    price_per_unit: params.initial_price,
    quantity_units: params.quantity_units,
    packaging_cost: params.packaging_cost,
    due_date_type: 'REGULATION'
  });
  console.log(`   ✅ Bill ${bill.id} created\n`);

  // Step 2: Buyer requests price change
  console.log('✏️  STEP 2: Buyer requesting price change');
  const changeRequest = await requestBillChange({
    bill_id: bill.id,
    buyer_user_id: params.buyer_user_id,
    field_name: 'price_per_unit',
    old_value: params.initial_price.toString(),
    new_value: params.revised_price.toString(),
    justification: params.change_justification
  });
  console.log(`   ✅ Change request ${changeRequest.id} created`);
  console.log(`   ⚠️  Bill status: MODIFIED_NEEDS_JUSTIFICATION\n`);

  // Step 3: Agent reviews and approves change
  console.log('👨‍💼 STEP 3: Agent reviewing change request');
  await api.decideChangeRequest(changeRequest.id, true, 'Agreed - quality grade adjustment');
  console.log(`   ✅ Change request approved\n`);

  // Step 4: Buyer approves revised bill
  console.log('🔐 STEP 4: Buyer approving revised bill');
  const buyerAuth = await buyerApproveWithOTP({
    bill_id: bill.id,
    buyer_user_id: params.buyer_user_id,
    otp_code: params.buyer_otp
  });
  console.log(`   ✅ Buyer approved revised bill\n`);

  // Step 5: Agent final approval
  console.log('🔒 STEP 5: Agent final approval');
  const finalResult = await agentFinalApprovalAndFreeze({
    bill_id: bill.id,
    agent_user_id: params.agent_user_id,
    otp_code: params.agent_otp
  });
  console.log(`   ✅ Bill AUTHORIZED and frozen\n`);

  // Step 6: Update AI scores (will reflect the change pattern)
  console.log('🤖 STEP 6: Updating AI scores');
  const buyerScore = await refreshBuyerAIScore(params.buyer_entity_id);
  
  if (buyerScore.discrepancy_ratio > 0.1) {
    console.log(`   ⚠️  Warning: Buyer discrepancy ratio elevated: ${(buyerScore.discrepancy_ratio * 100).toFixed(2)}%`);
  }
  
  console.log(`   ✅ AI score updated\n`);

  console.log('✅ COMPLETE: Bill lifecycle with change request finished!');

  return {
    bill,
    changeRequest,
    buyerAuth,
    agentAuth: finalResult.authorization,
    ledgerEntry: finalResult.ledger_entry,
    buyerScore
  };
}

// ==========================================
// ANALYTICS WORKFLOWS
// ==========================================

/**
 * Get comprehensive analytics for dashboard
 */
export async function getComprehensiveAnalytics() {
  const [
    dashboard,
    topFlagged,
    modFlags
  ] = await Promise.all([
    api.getAnalyticsDashboard(),
    api.getTopFlaggedBuyers(3),
    api.getBuyerModFlags()
  ]);

  return {
    dashboard,
    topFlagged,
    modFlags
  };
}

/**
 * Monitor buyer behavior patterns
 */
export async function monitorBuyerBehavior(buyer_entity_id: bigint) {
  const [
    score,
    insights,
    modFlags
  ] = await Promise.all([
    api.getBuyerScore(buyer_entity_id),
    api.getBuyerAIInsights(buyer_entity_id),
    api.getBuyerModificationFlags(buyer_entity_id)
  ]);

  // Check for warning conditions
  const warnings = [];
  
  if (score && score.reliability_score < 70) {
    warnings.push(`Low reliability score: ${score.reliability_score}%`);
  }
  
  if (score && score.discrepancy_ratio > 0.15) {
    warnings.push(`High discrepancy ratio: ${(score.discrepancy_ratio * 100).toFixed(2)}%`);
  }
  
  if (modFlags.approved_changes_30d >= 3) {
    warnings.push(`Frequent modifications: ${modFlags.approved_changes_30d} in 30 days`);
  }

  return {
    score,
    insights,
    modFlags,
    warnings,
    riskLevel: warnings.length >= 2 ? 'HIGH' : warnings.length === 1 ? 'MEDIUM' : 'LOW'
  };
}
