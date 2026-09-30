import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  Star, TrendingDown, TrendingUp, Calendar, User, AlertTriangle,
  Brain, FileText, MessageSquare, Filter, Search, ArrowDown, ArrowUp
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RatingChange {
  id: string;
  entityType: 'buyer' | 'agent';
  entityName: string;
  date: string;
  ratingBefore: number;
  ratingAfter: number;
  change: number;
  reason: string;
  triggeredBy: string;
  relatedRecords: string[];
  notes: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface EntityRatingHistory {
  name: string;
  type: 'buyer' | 'agent';
  currentRating: number;
  initialRating: number;
  totalChanges: number;
  history: { date: string; rating: number }[];
  flags: number;
  transactions: number;
}

export function RatingHistoryPanel() {
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'buyer' | 'agent'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'impact'>('date');

  const ratingChanges: RatingChange[] = [
    {
      id: '1',
      entityType: 'buyer',
      entityName: 'Sunita Reddy',
      date: '2025-10-27',
      ratingBefore: 4.5,
      ratingAfter: 4.0,
      change: -0.5,
      reason: 'Multiple value changes (5 times in 1 month)',
      triggeredBy: 'AI System',
      relatedRecords: ['TRD-2025-B001', 'TRD-2025-B002', 'TRD-2025-B003'],
      notes: 'Pattern detected: Repeated corrections by Agent C',
      riskLevel: 'medium',
    },
    {
      id: '2',
      entityType: 'agent',
      entityName: 'Agent C',
      date: '2025-10-27',
      ratingBefore: 4.0,
      ratingAfter: 3.5,
      change: -0.5,
      reason: 'Multiple buyer disputes (20% dispute rate)',
      triggeredBy: 'AI System',
      relatedRecords: ['TRD-2025-B001', 'TRD-2025-B004', 'TRD-2025-B005', 'TRD-2025-B006'],
      notes: 'High dispute rate across 4 different buyers',
      riskLevel: 'high',
    },
    {
      id: '3',
      entityType: 'buyer',
      entityName: 'Amit Patel',
      date: '2025-10-26',
      ratingBefore: 4.2,
      ratingAfter: 3.7,
      change: -0.5,
      reason: '3 changes in 2 weeks',
      triggeredBy: 'AI System',
      relatedRecords: ['TRD-2025-B007', 'TRD-2025-B008'],
      notes: 'Frequent agreement changes and measurement adjustments',
      riskLevel: 'medium',
    },
    {
      id: '4',
      entityType: 'buyer',
      entityName: 'Priya Sharma',
      date: '2025-10-25',
      ratingBefore: 4.0,
      ratingAfter: 4.5,
      change: +0.5,
      reason: 'Consistent payments and no disputes',
      triggeredBy: 'System Auto-Reward',
      relatedRecords: ['TRD-2025-B009', 'TRD-2025-B010'],
      notes: '10 successful transactions with no issues',
      riskLevel: 'low',
    },
    {
      id: '5',
      entityType: 'agent',
      entityName: 'Agent B',
      date: '2025-10-24',
      ratingBefore: 4.3,
      ratingAfter: 4.8,
      change: +0.5,
      reason: 'Excellent performance (0% error rate)',
      triggeredBy: 'System Auto-Reward',
      relatedRecords: ['TRD-2025-B011', 'TRD-2025-B012'],
      notes: '15 perfect transactions with accurate measurements',
      riskLevel: 'low',
    },
  ];

  const entityHistory: EntityRatingHistory[] = [
    {
      name: 'Sunita Reddy',
      type: 'buyer',
      currentRating: 4.0,
      initialRating: 5.0,
      totalChanges: 3,
      history: [
        { date: '2025-10-01', rating: 5.0 },
        { date: '2025-10-10', rating: 4.5 },
        { date: '2025-10-20', rating: 4.2 },
        { date: '2025-10-27', rating: 4.0 },
      ],
      flags: 2,
      transactions: 12,
    },
    {
      name: 'Agent C',
      type: 'agent',
      currentRating: 3.5,
      initialRating: 4.5,
      totalChanges: 4,
      history: [
        { date: '2025-10-01', rating: 4.5 },
        { date: '2025-10-08', rating: 4.2 },
        { date: '2025-10-15', rating: 3.8 },
        { date: '2025-10-22', rating: 3.6 },
        { date: '2025-10-27', rating: 3.5 },
      ],
      flags: 5,
      transactions: 45,
    },
    {
      name: 'Priya Sharma',
      type: 'buyer',
      currentRating: 4.5,
      initialRating: 4.0,
      totalChanges: 1,
      history: [
        { date: '2025-10-01', rating: 4.0 },
        { date: '2025-10-25', rating: 4.5 },
      ],
      flags: 0,
      transactions: 15,
    },
  ];

  const getRatingStars = (rating: number, showNumber = true) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
          />
        ))}
        {showNumber && <span className="ml-1 text-sm text-slate-600">{rating.toFixed(1)}</span>}
      </div>
    );
  };

  const getRatingChangeBadge = (change: number) => {
    if (change > 0) {
      return (
        <Badge className="bg-green-500 text-white gap-1">
          <ArrowUp className="w-3 h-3" />
          +{change.toFixed(1)}
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-500 text-white gap-1">
          <ArrowDown className="w-3 h-3" />
          {change.toFixed(1)}
        </Badge>
      );
    }
  };

  const getRiskBadge = (risk: string) => {
    const configs = {
      low: { color: 'bg-green-500', label: 'Low Risk' },
      medium: { color: 'bg-amber-500', label: 'Medium Risk' },
      high: { color: 'bg-red-500 animate-pulse', label: 'High Risk' },
    };
    const config = configs[risk as keyof typeof configs];
    return <Badge className={`${config.color} text-white`}>{config.label}</Badge>;
  };

  const filteredChanges = ratingChanges
    .filter(change => filterType === 'all' || change.entityType === filterType)
    .filter(change => selectedEntity === 'all' || change.entityName === selectedEntity)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return Math.abs(b.change) - Math.abs(a.change);
      }
    });

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 flex items-center gap-2">
            <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
            Rating History & Performance Tracking
          </h1>
          <p className="text-slate-600 mt-1">Complete rating change history for buyers and agents</p>
        </div>
        <Button className="gap-2">
          <FileText className="w-4 h-4" />
          Export Rating Report
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <p className="text-xs text-slate-600">Total Rating Changes</p>
            </div>
            <p className="text-slate-900">{ratingChanges.length}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <p className="text-xs text-slate-600">Rating Decreases</p>
            </div>
            <p className="text-slate-900">{ratingChanges.filter(c => c.change < 0).length}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <p className="text-xs text-slate-600">Rating Increases</p>
            </div>
            <p className="text-slate-900">{ratingChanges.filter(c => c.change > 0).length}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-blue-500" />
              <p className="text-xs text-slate-600">AI Triggered</p>
            </div>
            <p className="text-slate-900">{ratingChanges.filter(c => c.triggeredBy === 'AI System').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="changes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="changes" className="gap-2">
            <FileText className="w-4 h-4" />
            Rating Changes
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Trends & Analysis
          </TabsTrigger>
          <TabsTrigger value="entities" className="gap-2">
            <User className="w-4 h-4" />
            Entity History
          </TabsTrigger>
        </TabsList>

        {/* Rating Changes Tab */}
        <TabsContent value="changes" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-600">Entity Type</label>
                  <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="buyer">Buyers Only</SelectItem>
                      <SelectItem value="agent">Agents Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-600">Entity Name</label>
                  <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                    <SelectTrigger>
                      <User className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Entities</SelectItem>
                      {Array.from(new Set(ratingChanges.map(c => c.entityName))).map((name) => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-600">Sort By</label>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date (Recent First)</SelectItem>
                      <SelectItem value="impact">Impact (Highest First)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-600">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search..." className="pl-10" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Changes List */}
          {filteredChanges.map((change) => (
            <Card 
              key={change.id} 
              className={`border-l-4 ${
                change.change < 0 ? 'border-l-red-500' : 'border-l-green-500'
              }`}
            >
              <CardContent className="p-5">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-slate-900">{change.entityName}</h3>
                        <Badge variant="outline" className="gap-1">
                          {change.entityType === 'buyer' ? <User className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                          {change.entityType}
                        </Badge>
                        {getRatingChangeBadge(change.change)}
                        {getRiskBadge(change.riskLevel)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>{change.date}</span>
                        <span>•</span>
                        <span>Triggered by: {change.triggeredBy}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Before</p>
                      {getRatingStars(change.ratingBefore)}
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500 mb-1">After</p>
                      {getRatingStars(change.ratingAfter)}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm mb-2">
                      <strong className="text-slate-900">Reason:</strong> {change.reason}
                    </p>
                    {change.notes && (
                      <Alert className="border-blue-500 bg-blue-50">
                        <Brain className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800 text-sm">
                          <strong>AI Analysis:</strong> {change.notes}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {change.relatedRecords.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Related Records:</p>
                      <div className="flex flex-wrap gap-2">
                        {change.relatedRecords.map((record) => (
                          <Badge key={record} variant="outline" className="text-xs">{record}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Trends & Analysis Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rating Trends Over Time */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Rating Trends Over Time</CardTitle>
                <CardDescription>Historical rating changes by entity type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={entityHistory[0].history}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={2} name="Rating" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Rating Change Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Rating Change Distribution</CardTitle>
                <CardDescription>Positive vs negative rating changes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { type: 'Increase', buyers: 1, agents: 1 },
                    { type: 'Decrease', buyers: 2, agents: 1 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="buyers" fill="#3b82f6" name="Buyers" />
                    <Bar dataKey="agents" fill="#f59e0b" name="Agents" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                AI Rating Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <Alert className="border-red-500 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 text-sm">
                  <strong>High Risk Alert:</strong> Agent C shows declining trend (4.0 → 3.5) with 20% dispute rate. Recommend additional training and supervision.
                </AlertDescription>
              </Alert>

              <Alert className="border-amber-500 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-sm">
                  <strong>Medium Risk:</strong> Sunita Reddy rating dropped from 5.0 to 4.0 over 3 changes. Monitor next transactions closely.
                </AlertDescription>
              </Alert>

              <Alert className="border-green-500 bg-green-50">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 text-sm">
                  <strong>Positive Trend:</strong> Priya Sharma and Agent B showing improvement. Continue current practices.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Entity History Tab */}
        <TabsContent value="entities" className="space-y-4">
          {entityHistory.map((entity) => (
            <Card key={entity.name} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {entity.name}
                      <Badge variant="outline" className="gap-1">
                        {entity.type === 'buyer' ? <User className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                        {entity.type}
                      </Badge>
                    </CardTitle>
                    <CardDescription>Complete rating history and performance metrics</CardDescription>
                  </div>
                  <div className="text-right">
                    {getRatingStars(entity.currentRating)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Initial Rating</p>
                    <p className="text-slate-900">{entity.initialRating.toFixed(1)} ⭐</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Current Rating</p>
                    <p className="text-slate-900">{entity.currentRating.toFixed(1)} ⭐</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Total Changes</p>
                    <p className="text-slate-900">{entity.totalChanges}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Transactions</p>
                    <p className="text-slate-900">{entity.transactions}</p>
                  </div>
                </div>

                {/* Rating History Chart */}
                <div>
                  <p className="text-sm text-slate-600 mb-3">Rating History Timeline</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={entity.history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="rating" 
                        stroke={entity.currentRating < entity.initialRating ? '#ef4444' : '#10b981'} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Flags and Warnings */}
                {entity.flags > 0 && (
                  <Alert className="border-red-500 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 text-sm">
                      <strong>{entity.flags} Active Flags:</strong> This {entity.type} has been flagged {entity.flags} times. Review required.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
