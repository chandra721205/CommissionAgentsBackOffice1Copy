import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  AlertTriangle, Brain, TrendingDown, Star, AlertCircle, CheckCircle2,
  User, Calendar, FileText, MessageSquare
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Pattern {
  id: string;
  type: 'buyer' | 'agent';
  entity: string;
  changeCount: number;
  frequency: string;
  ratingBefore: number;
  ratingAfter: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  history: { date: string; reason: string; justification: string }[];
}

export function WarningRatingSystem() {
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const patterns: Pattern[] = [
    {
      id: '1',
      type: 'buyer',
      entity: 'Sunita Reddy (Reddy Commodities)',
      changeCount: 5,
      frequency: '5 changes in 1 month',
      ratingBefore: 4.5,
      ratingAfter: 4.0,
      riskLevel: 'medium',
      recommendations: [
        'Review next transaction with increased scrutiny',
        'Verify measurement accuracy before weighing',
        'Consider requesting advance documentation'
      ],
      history: [
        { date: '2025-10-27', reason: 'Quality Mismatch', justification: 'Buyer reported moisture content issue' },
        { date: '2025-10-25', reason: 'Measurement Error', justification: 'Scale calibration off by 2%' },
        { date: '2025-10-23', reason: 'Agreement Change', justification: 'Buyer changed packaging preference' },
        { date: '2025-10-20', reason: 'Quality Mismatch', justification: 'Grade mismatch reported' },
        { date: '2025-10-18', reason: 'Other', justification: 'Payment method changed' },
      ]
    },
    {
      id: '2',
      type: 'agent',
      entity: 'Agent C (Multiple Buyers)',
      changeCount: 8,
      frequency: '8 changes across 4 buyers',
      ratingBefore: 4.0,
      ratingAfter: 3.5,
      riskLevel: 'high',
      recommendations: [
        'Cross-warning sent to all associated buyers',
        'Suggest alternative agents for new buyers',
        'Mandatory supervisor review for next 5 transactions',
        'Additional training recommended'
      ],
      history: [
        { date: '2025-10-27', reason: 'Measurement Error', justification: 'Weigh bridge reading error' },
        { date: '2025-10-26', reason: 'Quality Mismatch', justification: 'Visual inspection discrepancy' },
        { date: '2025-10-25', reason: 'Agreement Change', justification: 'Buyer changed terms' },
        { date: '2025-10-24', reason: 'Measurement Error', justification: 'Manual calculation error' },
        { date: '2025-10-23', reason: 'Quality Mismatch', justification: 'Grade confusion' },
        { date: '2025-10-22', reason: 'Other', justification: 'Documentation incomplete' },
        { date: '2025-10-21', reason: 'Measurement Error', justification: 'Unit conversion error' },
        { date: '2025-10-20', reason: 'Agreement Change', justification: 'Payment terms updated' },
      ]
    },
    {
      id: '3',
      type: 'buyer',
      entity: 'Amit Patel (Patel Foods & Co)',
      changeCount: 3,
      frequency: '3 changes in 2 weeks',
      ratingBefore: 4.2,
      ratingAfter: 3.7,
      riskLevel: 'medium',
      recommendations: [
        'Monitor next 2 transactions closely',
        'Request pre-approval for any changes',
        'Document all communications'
      ],
      history: [
        { date: '2025-10-26', reason: 'Agreement Change', justification: 'Due date extension requested' },
        { date: '2025-10-24', reason: 'Measurement Error', justification: 'Additional bags added' },
        { date: '2025-10-22', reason: 'Quality Mismatch', justification: 'Variety specification changed' },
      ]
    },
  ];

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
          />
        ))}
        <span className="ml-1 text-sm text-slate-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const getRiskBadge = (level: string) => {
    const configs = {
      low: { color: 'bg-green-500', label: 'Low Risk' },
      medium: { color: 'bg-amber-500', label: 'Medium Risk' },
      high: { color: 'bg-red-500 animate-pulse', label: 'High Risk' },
    };
    const config = configs[level as keyof typeof configs];
    return <Badge className={`${config.color} text-white`}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 flex items-center gap-2">
            <Brain className="w-8 h-8 text-purple-600" />
            Warning & Rating System
          </h1>
          <p className="text-slate-600 mt-1">AI-powered pattern detection and risk assessment</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">High Risk Patterns</p>
            <p className="text-slate-900 mt-1">{patterns.filter(p => p.riskLevel === 'high').length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">Medium Risk Patterns</p>
            <p className="text-slate-900 mt-1">{patterns.filter(p => p.riskLevel === 'medium').length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">Total Changes Monitored</p>
            <p className="text-slate-900 mt-1">{patterns.reduce((sum, p) => sum + p.changeCount, 0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Patterns List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Patterns</TabsTrigger>
          <TabsTrigger value="buyers">Buyers</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {patterns.map((pattern) => (
            <Card 
              key={pattern.id} 
              className={`border-l-4 hover:shadow-lg transition-shadow ${
                pattern.riskLevel === 'high' ? 'border-l-red-500' :
                pattern.riskLevel === 'medium' ? 'border-l-amber-500' :
                'border-l-green-500'
              }`}
            >
              <CardContent className="p-5">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-slate-900">{pattern.entity}</h3>
                        <Badge variant="outline" className="text-xs">
                          {pattern.type === 'buyer' ? <User className="w-3 h-3 mr-1" /> : <MessageSquare className="w-3 h-3 mr-1" />}
                          {pattern.type}
                        </Badge>
                        {getRiskBadge(pattern.riskLevel)}
                        {pattern.riskLevel === 'high' && (
                          <Badge className="bg-red-500 text-white gap-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                            Action Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        {pattern.frequency} • {pattern.changeCount} total changes
                      </p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Rating:</span>
                          {getRatingStars(pattern.ratingBefore)}
                          <TrendingDown className="w-4 h-4 text-red-500" />
                          {getRatingStars(pattern.ratingAfter)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {pattern.riskLevel === 'high' && (
                    <Alert className="border-red-500 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />
                      <AlertDescription className="text-red-800 text-sm">
                        <strong>AI Insight - Pattern Detected:</strong> {pattern.type === 'buyer' ? 
                          `Precaution: ${pattern.entity.split('(')[0]} has made ${pattern.changeCount} changes. Consider assessing alternatives or requesting documentation.` :
                          `Cross-Warning: ${pattern.entity} has ${pattern.changeCount} disputes across multiple buyers. Suggest alternative agents for new transactions.`}
                      </AlertDescription>
                    </Alert>
                  )}

                  {pattern.riskLevel === 'medium' && (
                    <Alert className="border-amber-500 bg-amber-50">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800 text-sm">
                        <strong>Precaution:</strong> Repeated changes detected. Review history and proceed with caution on next transaction.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Separator />

                  <div>
                    <p className="text-xs text-slate-500 mb-2">AI Recommendations:</p>
                    <ul className="space-y-1">
                      {pattern.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Dialog open={showDetailsDialog && selectedPattern?.id === pattern.id} onOpenChange={setShowDetailsDialog}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedPattern(pattern)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View History
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Justification History</DialogTitle>
                          <DialogDescription>
                            {pattern.entity} - {pattern.frequency}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          <Alert className={`${
                            pattern.riskLevel === 'high' ? 'border-red-500 bg-red-50' :
                            pattern.riskLevel === 'medium' ? 'border-amber-500 bg-amber-50' :
                            'border-green-500 bg-green-50'
                          }`}>
                            <Brain className={`h-4 w-4 ${
                              pattern.riskLevel === 'high' ? 'text-red-600' :
                              pattern.riskLevel === 'medium' ? 'text-amber-600' :
                              'text-green-600'
                            }`} />
                            <AlertDescription className={
                              pattern.riskLevel === 'high' ? 'text-red-800' :
                              pattern.riskLevel === 'medium' ? 'text-amber-800' :
                              'text-green-800'
                            }>
                              <strong>Risk Level:</strong> {pattern.riskLevel.toUpperCase()} • 
                              <strong> Rating Drop:</strong> {pattern.ratingBefore.toFixed(1)} → {pattern.ratingAfter.toFixed(1)} (-{(pattern.ratingBefore - pattern.ratingAfter).toFixed(1)})
                            </AlertDescription>
                          </Alert>

                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Justification</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {pattern.history.map((entry, idx) => (
                                <TableRow key={idx}>
                                  <TableCell className="text-sm">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3 text-slate-400" />
                                      {entry.date}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="text-xs">{entry.reason}</Badge>
                                  </TableCell>
                                  <TableCell className="text-sm text-slate-600">{entry.justification}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>

                          <div className="p-4 bg-slate-50 rounded-lg">
                            <p className="text-sm text-slate-600 mb-2">
                              <strong>Analysis:</strong> Pattern shows {pattern.changeCount} changes over time. 
                              {pattern.riskLevel === 'high' && ' High-risk threshold exceeded - immediate review recommended.'}
                              {pattern.riskLevel === 'medium' && ' Medium-risk threshold - monitor closely.'}
                            </p>
                          </div>

                          <Button className="w-full" onClick={() => setShowDetailsDialog(false)}>
                            Acknowledge & Close
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {pattern.riskLevel === 'high' && (
                      <Button variant="outline" size="sm" className="border-red-500 text-red-600">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Escalate Dispute
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="buyers">
          {patterns.filter(p => p.type === 'buyer').map((pattern) => (
            <Card key={pattern.id} className="border-l-4 border-l-amber-500">
              <CardContent className="p-5">
                <h3 className="text-slate-900 mb-2">{pattern.entity}</h3>
                <p className="text-sm text-slate-600">{pattern.frequency}</p>
                <div className="flex items-center gap-2 mt-2">
                  {getRatingStars(pattern.ratingAfter)}
                  {getRiskBadge(pattern.riskLevel)}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="agents">
          {patterns.filter(p => p.type === 'agent').map((pattern) => (
            <Card key={pattern.id} className="border-l-4 border-l-red-500">
              <CardContent className="p-5">
                <h3 className="text-slate-900 mb-2">{pattern.entity}</h3>
                <p className="text-sm text-slate-600">{pattern.frequency}</p>
                <div className="flex items-center gap-2 mt-2">
                  {getRatingStars(pattern.ratingAfter)}
                  {getRiskBadge(pattern.riskLevel)}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
