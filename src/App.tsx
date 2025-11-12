import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PortfolioOverview } from './components/PortfolioOverview';
import { HoldingsList } from './components/HoldingsList';
import { BrokerAccounts } from './components/BrokerAccounts';
import { AssetAllocation } from './components/AssetAllocation';
import { PerformanceChart } from './components/PerformanceChart';
import { Toaster } from './components/ui/toaster';
import { getPortfolioData } from './utils/api';

export default function App() {
  const [currentView, setCurrentView] = useState<'portfolio' | 'holdings' | 'brokers'>('portfolio');
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // For demo purposes, using a fixed userId. In production, this would come from auth
  const userId = 'demo-user-001';

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const data = await getPortfolioData(userId);
      setPortfolioData(data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleBrokerUpdate = () => {
    fetchPortfolio();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentView === 'portfolio' && (
          <>
            <PortfolioOverview portfolioData={portfolioData} loading={loading} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <PerformanceChart />
              </div>
              <div>
                <AssetAllocation holdings={portfolioData?.holdings || []} />
              </div>
            </div>
            <div className="mt-6">
              <HoldingsList limit={10} holdings={portfolioData?.holdings || []} loading={loading} />
            </div>
          </>
        )}

        {currentView === 'holdings' && (
          <HoldingsList holdings={portfolioData?.holdings || []} loading={loading} />
        )}

        {currentView === 'brokers' && (
          <BrokerAccounts userId={userId} onBrokerUpdate={handleBrokerUpdate} />
        )}
      </main>
      <Toaster />
    </div>
  );
}