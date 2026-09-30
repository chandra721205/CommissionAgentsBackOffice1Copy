import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  CheckCircle2, Lock, QrCode, Download, Share2, Brain, FileText,
  Shield, Database, TrendingUp, Package, DollarSign, Calendar
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export function ConfirmedAppendLedger() {
  const [showQRDialog, setShowQRDialog] = useState(false);

  const record = {
    serialNo: 'TRD-2025-B001',
    date: '2025-10-27',
    buyerName: 'Rajesh Kumar',
    company: 'Kumar Traders Ltd',
    commodity: 'Wheat',
    weight: 5000,
    totalPayable: 1161.50,
    productAmount: 1100.00,
    packagingAmount: 50.00,
    tax: 11.50,
    paymentMethod: 'Bank Wire (NEFT)',
    paymentDetails: 'A/C: 123456789, IFSC: HDFC0001234',
    dueDate: '2025-11-11',
    dueDateType: 'Regulatory (15 days)',
    blockchainHash: '0x7f3a...c9d2',
    polygonNetwork: 'Polygon Mumbai Testnet',
    timestamp: '2025-10-27 14:35:22 UTC',
    aiRiskScore: 2,
    yardLedgerSync: 'Synced',
    taxCalc: '₹11.50 (1%)',
    agentCommission: '₹11.62 (1%)',
    bankAdvanceReflected: 'Yes',
  };

  const yardLedgerEntries = [
    { field: 'Serial No', value: record.serialNo, status: 'synced' },
    { field: 'Buyer', value: record.buyerName, status: 'synced' },
    { field: 'Amount', value: `₹${record.totalPayable.toFixed(2)}`, status: 'synced' },
    { field: 'Tax (1%)', value: record.taxCalc, status: 'calculated' },
    { field: 'Agent Commission', value: record.agentCommission, status: 'calculated' },
    { field: 'Bank Advance', value: record.bankAdvanceReflected, status: 'reflected' },
  ];

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            Confirmed & Appended to Ledger
          </h1>
          <p className="text-slate-600 mt-1">Bill: {record.serialNo} • Immutable Record</p>
        </div>
        <Badge className="bg-green-500 text-white gap-1 text-base px-4 py-2">
          <Lock className="w-4 h-4" />
          Confirmed
        </Badge>
      </div>

      {/* Blockchain Confirmation */}
      <Alert className="border-green-500 bg-green-50 border-2">
        <Shield className="h-5 w-5 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="flex items-center justify-between">
            <div>
              <strong>Transaction Secure - Immutable on Blockchain</strong>
              <br />
              <span className="text-xs">Hash: {record.blockchainHash} • Network: {record.polygonNetwork}</span>
              <br />
              <span className="text-xs">Timestamp: {record.timestamp}</span>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowQRDialog(true)}>
              <QrCode className="w-4 h-4" />
              View QR
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* AI Risk Score */}
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm">AI Risk Assessment</p>
                <p className="text-slate-900">Transaction Secure - Risk Score: {record.aiRiskScore}%</p>
              </div>
            </div>
            <Badge className="bg-green-500 text-white">Low Risk</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Immutable Record */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-600" />
              Immutable Bill Record
            </CardTitle>
            <Badge variant="outline" className="gap-1">
              <Database className="w-3 h-3" />
              All fields locked
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Basic Info - Locked */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-100 rounded-lg border-2 border-slate-300 relative">
              <Lock className="absolute top-2 right-2 w-4 h-4 text-slate-400" />
              <p className="text-xs text-slate-500 mb-1">Serial Number</p>
              <p className="text-slate-700">{record.serialNo}</p>
            </div>
            <div className="p-4 bg-slate-100 rounded-lg border-2 border-slate-300 relative">
              <Lock className="absolute top-2 right-2 w-4 h-4 text-slate-400" />
              <p className="text-xs text-slate-500 mb-1">Date</p>
              <p className="text-slate-700">{record.date}</p>
            </div>
          </div>

          <Separator />

          {/* Buyer Info - Locked */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-100 rounded-lg border-2 border-slate-300 relative">
              <Lock className="absolute top-2 right-2 w-4 h-4 text-slate-400" />
              <p className="text-xs text-slate-500 mb-1">Buyer Name</p>
              <p className="text-slate-700">{record.buyerName}</p>
            </div>
            <div className="p-4 bg-slate-100 rounded-lg border-2 border-slate-300 relative">
              <Lock className="absolute top-2 right-2 w-4 h-4 text-slate-400" />
              <p className="text-xs text-slate-500 mb-1">Company</p>
              <p className="text-slate-700">{record.company}</p>
            </div>
          </div>

          <Separator />

          {/* Commodity - Locked */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-100 rounded-lg border-2 border-slate-300 relative">
              <Lock className="absolute top-2 right-2 w-4 h-4 text-slate-400" />
              <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                <Package className="w-3 h-3" />
                Commodity
              </p>
              <p className="text-slate-700">{record.commodity}</p>
            </div>
            <div className="p-4 bg-slate-100 rounded-lg border-2 border-slate-300 relative">
              <Lock className="absolute top-2 right-2 w-4 h-4 text-slate-400" />
              <p className="text-xs text-slate-500 mb-1">Weight</p>
              <p className="text-slate-700">{record.weight} kg</p>
            </div>
          </div>

          <Separator />

          {/* Financial - Locked */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-green-100 rounded-lg border-2 border-green-300 relative">
                <Lock className="absolute top-1 right-1 w-3 h-3 text-green-500" />
                <p className="text-xs text-green-700">Product</p>
                <p className="text-green-900 text-sm">₹{record.productAmount.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg border-2 border-blue-300 relative">
                <Lock className="absolute top-1 right-1 w-3 h-3 text-blue-500" />
                <p className="text-xs text-blue-700">Packaging</p>
                <p className="text-blue-900 text-sm">₹{record.packagingAmount.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg border-2 border-purple-300 relative">
                <Lock className="absolute top-1 right-1 w-3 h-3 text-purple-500" />
                <p className="text-xs text-purple-700">Tax (1%)</p>
                <p className="text-purple-900 text-sm">₹{record.tax.toFixed(2)}</p>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-4 border-green-400 relative">
              <Lock className="absolute top-2 right-2 w-5 h-5 text-green-600" />
              <p className="text-sm text-green-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                Total Payable (Immutable)
              </p>
              <p className="text-green-900">₹{record.totalPayable.toFixed(2)}</p>
            </div>
          </div>

          <Separator />

          {/* Payment - Locked */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-100 rounded-lg border-2 border-slate-300 relative">
              <Lock className="absolute top-2 right-2 w-4 h-4 text-slate-400" />
              <p className="text-xs text-slate-500 mb-1">Payment Method</p>
              <p className="text-slate-700">{record.paymentMethod}</p>
            </div>
            <div className="p-4 bg-slate-100 rounded-lg border-2 border-slate-300 relative">
              <Lock className="absolute top-2 right-2 w-4 h-4 text-slate-400" />
              <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Due Date
              </p>
              <p className="text-slate-700">{record.dueDate} ({record.dueDateType})</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yard Ledger Sync */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Auto-Sync: Yard Ledger & Tax Calculation
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yardLedgerEntries.map((entry, idx) => (
                <TableRow key={idx}>
                  <TableCell>{entry.field}</TableCell>
                  <TableCell>{entry.value}</TableCell>
                  <TableCell>
                    <Badge className={
                      entry.status === 'synced' ? 'bg-green-500' :
                      entry.status === 'calculated' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }>
                      {entry.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Alert className="border-blue-500 bg-blue-50 mt-4">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              <strong>Ledger Synchronized:</strong> All entries appended to yard ledger. Tax calculated at 1%. Agent commission and bank advances reflected.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Button variant="outline" size="lg" className="gap-2">
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
        <Button variant="outline" size="lg" className="gap-2">
          <FileText className="w-4 h-4" />
          Export Excel (Audit Trail)
        </Button>
        <Button variant="outline" size="lg" className="gap-2" onClick={() => setShowQRDialog(true)}>
          <Share2 className="w-4 h-4" />
          Share QR Code
        </Button>
      </div>

      {/* Blockchain QR Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-blue-600" />
              Blockchain Verification QR Code
            </DialogTitle>
            <DialogDescription>
              Scan to verify on {record.polygonNetwork}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-slate-100 rounded-lg flex items-center justify-center border-4 border-blue-500">
                <QrCode className="w-32 h-32 text-slate-400" />
              </div>
            </div>

            <Alert className="border-green-500 bg-green-50">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 text-xs">
                <strong>Immutable on Polygon</strong>
                <br />
                Transaction Hash: {record.blockchainHash}
                <br />
                Block Time: {record.timestamp}
                <br />
                This record cannot be altered or deleted
              </AlertDescription>
            </Alert>

            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 space-y-1">
              <p><strong>Serial:</strong> {record.serialNo}</p>
              <p><strong>Buyer:</strong> {record.buyerName}</p>
              <p><strong>Amount:</strong> ₹{record.totalPayable.toFixed(2)}</p>
              <p><strong>Network:</strong> {record.polygonNetwork}</p>
            </div>

            <Button className="w-full" onClick={() => setShowQRDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
