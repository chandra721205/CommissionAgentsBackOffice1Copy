import { useState } from 'react';
import { AgentDashboard } from './agent/AgentDashboard';
import { ProducerManagement } from './agent/ProducerManagement';
import { ProduceListing } from './agent/ProduceListing';
import { BuyerVerification } from './agent/BuyerVerification';
import { BuyerRating } from './agent/BuyerRating';
import { SamplingVerification } from './agent/SamplingVerification';
import { BillDiscounting } from './agent/BillDiscounting';
import { WeighmentResolution } from './agent/WeighmentResolution';
import { TransportTracking } from './agent/TransportTracking';
import { AgentAIInsights } from './agent/AgentAIInsights';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, Bell, Menu, Home, TrendingUp, Users, 
  DollarSign, User, Moon, Sun, MessageCircle
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useMediaQuery } from './hooks/useMediaQuery';

export function CommissionAgentApp() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [previousScreen, setPreviousScreen] = useState<string[]>([]);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const navigateTo = (screen: string) => {
    setPreviousScreen([...previousScreen, currentScreen]);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    if (previousScreen.length > 0) {
      const prev = [...previousScreen];
      const last = prev.pop();
      setPreviousScreen(prev);
      setCurrentScreen(last || 'dashboard');
    }
  };

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'producers', label: 'Producers', icon: Users },
    { id: 'produce', label: 'Produce Listing', icon: TrendingUp },
    { id: 'buyers', label: 'Buyer Verification', icon: User },
    { id: 'rating', label: 'Buyer Rating', icon: TrendingUp },
    { id: 'sampling', label: 'Sampling', icon: TrendingUp },
    { id: 'finance', label: 'Bill Discounting', icon: DollarSign },
    { id: 'weighment', label: 'Weighment', icon: TrendingUp },
    { id: 'transport', label: 'Transport', icon: TrendingUp },
    { id: 'insights', label: 'AI Insights', icon: TrendingUp },
  ];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard': return <AgentDashboard onNavigate={navigateTo} />;
      case 'producers': return <ProducerManagement onNavigate={navigateTo} />;
      case 'produce': return <ProduceListing onNavigate={navigateTo} />;
      case 'buyers': return <BuyerVerification onNavigate={navigateTo} />;
      case 'rating': return <BuyerRating onNavigate={navigateTo} />;
      case 'sampling': return <SamplingVerification onNavigate={navigateTo} />;
      case 'finance': return <BillDiscounting onNavigate={navigateTo} />;
      case 'weighment': return <WeighmentResolution onNavigate={navigateTo} />;
      case 'transport': return <TransportTracking onNavigate={navigateTo} />;
      case 'insights': return <AgentAIInsights onNavigate={navigateTo} />;
      default: return <AgentDashboard onNavigate={navigateTo} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-[#F7FAFC] via-[#D9F2FF] to-[#F7FAFC]'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} border-b shadow-sm`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo and Back Button */}
            <div className="flex items-center gap-3">
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64">
                    <div className="py-4">
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-gradient-to-br from-[#D4AF37] to-amber-600 p-2 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h2 className={`${isDarkMode ? 'text-white' : 'text-slate-900'}`}>TRADIE</h2>
                            <p className="text-xs text-slate-500">v3.0 Agent</p>
                          </div>
                        </div>
                      </div>
                      <nav className="space-y-1">
                        {navigation.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Button
                              key={item.id}
                              variant={currentScreen === item.id ? 'default' : 'ghost'}
                              className="w-full justify-start gap-2"
                              onClick={() => setCurrentScreen(item.id)}
                            >
                              <Icon className="w-4 h-4" />
                              {item.label}
                            </Button>
                          );
                        })}
                      </nav>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              
              {previousScreen.length > 0 && (
                <Button variant="ghost" size="sm" onClick={goBack} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {!isMobile && 'Back'}
                </Button>
              )}

              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-[#D4AF37] to-amber-600 p-2 rounded-lg shadow-md">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                {!isMobile && (
                  <div>
                    <h1 className={`${isDarkMode ? 'text-white' : 'text-slate-900'}`}>TRADIE</h1>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Commission Agent v3.0
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#D4AF37] text-white text-xs">
                  5
                </Badge>
              </Button>

              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#D4AF37] to-amber-600 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#D4AF37]">
                  A
                </div>
                {!isMobile && (
                  <div className="text-sm">
                    <div className="text-white">Agent Kumar</div>
                    <div className="text-amber-100 text-xs">Commission Agent</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className={`w-64 min-h-screen ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} border-r sticky top-[73px] h-[calc(100vh-73px)]`}>
            <nav className="p-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentScreen === item.id ? 'default' : 'ghost'}
                    className={`w-full justify-start gap-2 ${
                      currentScreen === item.id 
                        ? 'bg-gradient-to-r from-[#D4AF37] to-amber-600 text-white hover:from-amber-600 hover:to-[#D4AF37]' 
                        : ''
                    }`}
                    onClick={() => setCurrentScreen(item.id)}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${isMobile ? 'pb-20' : 'p-6'}`}>
          {renderScreen()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} border-t shadow-lg`}>
          <div className="grid grid-cols-5 gap-1 p-2">
            {navigation.slice(0, 5).map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col gap-1 h-auto py-2 ${
                    currentScreen === item.id ? 'text-[#D4AF37]' : ''
                  }`}
                  onClick={() => setCurrentScreen(item.id)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label.split(' ')[0]}</span>
                </Button>
              );
            })}
          </div>
        </nav>
      )}

      {/* AI Chat Assistant (Bottom Right) */}
      <Button
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-[#D4AF37] to-amber-600 shadow-lg hover:shadow-xl"
        size="icon"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
}
