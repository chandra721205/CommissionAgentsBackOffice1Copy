import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Brain, AlertTriangle, TrendingDown, TrendingUp, Shield, 
  User, Users, FileEdit, BarChart3, Activity
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AIInsightsProps {
  userRole: string;
}

interface AIAlert {
  id: string;
  type: 'buyer' | 'agent';
  severity: 'high' | 'medium' | 'low';
  name: string;
  entity: string;
  editCount: number;
  lastEdit: string;
  pattern: string;
  riskScore: number;
}

interface TrustRating {
  name: string;
  type: 'buyer' | 'agent';
  rating: number;
  totalTransactions: number;
  editFrequency: number;
  trend: 'up' | 'down' | 'stable';
}

export function AIInsights({ userRole }: AIInsightsProps) {
  const alerts: AIAlert[] = [
    {
      id: '1',
      type: 'buyer',
      severity: 'high',
      name: 'Sunita Reddy',
      entity: 'Reddy Commodities',
      editCount: 5,
      lastEdit: '2025-10-26',
      pattern: 'Multiple corrections across different agents',
      riskScore: 85,
    },
    {
      id: '2',
      type: 'agent',
      severity: 'medium',
      name: 'Agent A',
      entity: 'TRADIE',
      editCount: 8,
      lastEdit: '2025-10-27',
      pattern: 'Repeated corrections across multiple buyers',
      riskScore: 65,
    },
    {
      id: '3',
      type: 'buyer',
      severity: 'low',
      name: 'Amit Patel',
      entity: 'Patel Foods & Co',
      editCount: 3,
      lastEdit: '2025-10-25',
      pattern: 'Frequent weight adjustments',
      riskScore: 45,
    },
  ];

  const trustRatings: TrustRating[] = [
    { name: 'Priya Sharma', type: 'buyer', rating: 98, totalTransactions: 145, editFrequency: 2, trend: 'up' },
    { name: 'Rajesh Kumar', type: 'buyer', rating: 95, totalTransactions: 89, editFrequency: 3, trend: 'stable' },
    { name: 'Agent B', type: 'agent', rating: 96, totalTransactions: 234, editFrequency: 5, trend: 'up' },
    { name: 'Agent C', type: 'agent', rating: 78, totalTransactions: 156, editFrequency: 12, trend: 'down' },
    { name: 'Sunita Reddy', type: 'buyer', rating: 45, totalTransactions: 23, editFrequency: 15, trend: 'down' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-green-600';
  };

  const getTrustColor = (rating: number) => {
    if (rating >= 90) return 'text-green-600';
    if (rating >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const canViewInsights = ['admin', 'manager', 'auditor'].includes(userRole);

  if (!canViewInsights) {
    return (
      <Alert className="border-amber-500 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          You don't have permission to view AI insights. Please contact your administrator.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">High Risk Alerts</p>
                <p className="text-slate-900 mt-1">3</p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Monitoring</p>
                <p className="text-slate-900 mt-1">24 Entities</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Trust Score</p>
                <p className="text-slate-900 mt-1">82.5%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="bg-white shadow-md">
          <TabsTrigger value="alerts" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Active Alerts
            <Badge className="bg-red-500 text-white ml-2">{alerts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="ratings" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Trust Ratings
          </TabsTrigger>
          <TabsTrigger value="patterns" className="gap-2">
            <Brain className="w-4 h-4" />
            Behavioral Patterns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                AI-Detected Risk Alerts
              </CardTitle>
              <CardDescription>
                Automatic warnings for unusual edit patterns and suspicious behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 hover:shadow-md transition-shadow"
                      style={{
                        borderLeftColor: 
                          alert.severity === 'high' ? '#ef4444' :
                          alert.severity === 'medium' ? '#f59e0b' :
                          '#3b82f6'
                      }}>
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {alert.type === 'buyer' ? (
                              <User className="w-4 h-4 text-slate-500" />
                            ) : (
                              <Users className="w-4 h-4 text-slate-500" />
                            )}
                            <h3 className="text-slate-900">{alert.name}</h3>
                            <Badge className={`${getSeverityColor(alert.severity)} text-white`}>
                              {alert.severity.toUpperCase()} RISK
                            </Badge>
                            <Badge variant="outline">
                              {alert.type === 'buyer' ? 'Buyer' : 'Agent'}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600">{alert.entity}</p>
                        </div>
                      </div>

                      <Alert className="border-amber-500 bg-amber-50">
                        <FileEdit className="h-4 w-4 text-amber-600" />
                        <AlertTitle className="text-amber-900">Detected Pattern</AlertTitle>
                        <AlertDescription className="text-amber-800">
                          {alert.pattern}
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-slate-500">Edit Count</p>
                          <p className="text-slate-900 mt-1">{alert.editCount} corrections</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Last Edit</p>
                          <p className="text-slate-900 mt-1">{alert.lastEdit}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Risk Score</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className={`${getRiskColor(alert.riskScore)}`}>{alert.riskScore}%</p>
                            <Progress value={alert.riskScore} className="flex-1 h-2" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Button variant="outline" size="sm">
                          View History
                        </Button>
                        <Button variant="outline" size="sm">
                          Add to Watchlist
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Investigate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Trust & Reliability Ratings
              </CardTitle>
              <CardDescription>
                AI-calculated trust scores based on transaction history and edit patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {trustRatings.map((entity, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {entity.type === 'buyer' ? (
                            <User className="w-4 h-4 text-slate-500" />
                          ) : (
                            <Users className="w-4 h-4 text-slate-500" />
                          )}
                          <h3 className="text-slate-900">{entity.name}</h3>
                          <Badge variant="outline">
                            {entity.type === 'buyer' ? 'Buyer' : 'Agent'}
                          </Badge>
                          {entity.trend === 'up' && (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          )}
                          {entity.trend === 'down' && (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                          <div>
                            <p className="text-xs text-slate-500">Transactions</p>
                            <p className="text-slate-700 mt-1">{entity.totalTransactions}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Edit Frequency</p>
                            <p className="text-slate-700 mt-1">{entity.editFrequency}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Trend</p>
                            <p className="text-slate-700 mt-1 capitalize">{entity.trend}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-1">Trust Score</p>
                          <div className={`text-3xl ${getTrustColor(entity.rating)}`}>
                            {entity.rating}
                          </div>
                        </div>
                        <div className="w-32">
                          <Progress value={entity.rating} className="h-3" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Behavioral Pattern Analysis
              </CardTitle>
              <CardDescription>
                AI-driven insights into transaction and edit behaviors
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <Alert className="border-blue-500 bg-blue-50">
                <Brain className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900">Pattern Detection Active</AlertTitle>
                <AlertDescription className="text-blue-800">
                  The system continuously analyzes transaction patterns, edit frequencies, and cross-entity behaviors to identify potential risks and anomalies.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-5">
                    <h3 className="text-slate-900 mb-2">Frequent Edit Patterns</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Identified 3 entities with edit frequency above 10%
                    </p>
                    <Badge className="bg-amber-500 text-white">Needs Review</Badge>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-5">
                    <h3 className="text-slate-900 mb-2">Consistent Performers</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      12 buyers with 100% accuracy in last 30 days
                    </p>
                    <Badge className="bg-green-500 text-white">Excellent</Badge>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                  <CardContent className="p-5">
                    <h3 className="text-slate-900 mb-2">Cross-Agent Anomalies</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      1 buyer showing correction pattern across multiple agents
                    </p>
                    <Badge className="bg-red-500 text-white">High Alert</Badge>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-5">
                    <h3 className="text-slate-900 mb-2">Seasonal Variations</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Normal edit spike detected during harvest season
                    </p>
                    <Badge className="bg-blue-500 text-white">Normal</Badge>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
