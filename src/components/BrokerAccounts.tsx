import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Building2, Plus, TrendingUp, TrendingDown, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from './ui/use-toast';
import { connectBroker, getConnectedBrokers, syncBrokerData, disconnectBroker, getPortfolioData } from '../utils/api';
import { Skeleton } from './ui/skeleton';

interface BrokerAccountsProps {
  userId: string;
  onBrokerUpdate: () => void;
}

const availableBrokers = [
  { name: 'Zerodha', logo: '🔷', value: 'zerodha' },
  { name: 'Groww', logo: '🟢', value: 'groww' },
  { name: 'Upstox', logo: '🟣', value: 'upstox' },
  { name: 'Angel One', logo: '🔴', value: 'angelone' },
  { name: 'ICICI Direct', logo: '🟠', value: 'icicidirect' },
  { name: '5Paisa', logo: '🔵', value: '5paisa' },
];

export function BrokerAccounts({ userId, onBrokerUpdate }: BrokerAccountsProps) {
  const [connectedBrokersList, setConnectedBrokersList] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState('');
  const [clientId, setClientId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  const fetchBrokers = async () => {
    try {
      setLoading(true);
      const [brokersRes, portfolioRes] = await Promise.all([
        getConnectedBrokers(userId),
        getPortfolioData(userId)
      ]);
      setConnectedBrokersList(brokersRes.brokers || []);
      setPortfolios(portfolioRes.portfolios || []);
    } catch (error) {
      console.error('Error fetching brokers:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch broker accounts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
  }, [userId]);

  const handleConnect = async () => {
    if (!selectedBroker || !clientId) {
      toast({
        title: 'Missing Information',
        description: 'Please select a broker and enter your client ID',
        variant: 'destructive',
      });
      return;
    }

    try {
      setConnecting(true);
      await connectBroker(userId, {
        broker: selectedBroker,
        clientId,
        apiKey,
        apiSecret,
      });

      toast({
        title: 'Success',
        description: `${selectedBroker} connected successfully`,
      });

      // Sync data immediately after connection
      await handleSync(selectedBroker);

      setOpen(false);
      setSelectedBroker('');
      setClientId('');
      setApiKey('');
      setApiSecret('');
      
      await fetchBrokers();
      onBrokerUpdate();
    } catch (error: any) {
      console.error('Error connecting broker:', error);
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect broker',
        variant: 'destructive',
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleSync = async (broker: string) => {
    try {
      setSyncing(broker);
      await syncBrokerData(userId, broker);
      
      toast({
        title: 'Sync Complete',
        description: `Portfolio synced successfully from ${broker}`,
      });

      await fetchBrokers();
      onBrokerUpdate();
    } catch (error: any) {
      console.error('Error syncing broker:', error);
      toast({
        title: 'Sync Failed',
        description: error.message || 'Failed to sync portfolio',
        variant: 'destructive',
      });
    } finally {
      setSyncing(null);
    }
  };

  const handleDisconnect = async (broker: string) => {
    if (!confirm(`Are you sure you want to disconnect ${broker}?`)) {
      return;
    }

    try {
      await disconnectBroker(userId, broker);
      
      toast({
        title: 'Disconnected',
        description: `${broker} disconnected successfully`,
      });

      await fetchBrokers();
      onBrokerUpdate();
    } catch (error: any) {
      console.error('Error disconnecting broker:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to disconnect broker',
        variant: 'destructive',
      });
    }
  };

  const getBrokerPortfolio = (brokerName: string) => {
    return portfolios.find((p: any) => p.broker?.toLowerCase() === brokerName.toLowerCase());
  };

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-16 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl text-gray-900">Broker Accounts</h1>
          <p className="text-gray-500 mt-1">Manage your connected broker accounts</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Broker
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect Broker Account</DialogTitle>
              <DialogDescription>
                Select your broker and enter your credentials to sync your portfolio
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Select Broker</Label>
                <Select value={selectedBroker} onValueChange={setSelectedBroker}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your broker" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBrokers.map((broker) => (
                      <SelectItem key={broker.value} value={broker.value}>
                        <div className="flex items-center gap-2">
                          <span>{broker.logo}</span>
                          <span>{broker.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Client ID</Label>
                <Input 
                  placeholder="Enter your client ID" 
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>API Key (Optional)</Label>
                <Input 
                  placeholder="Enter API key if required" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>API Secret (Optional)</Label>
                <Input 
                  type="password"
                  placeholder="Enter API secret if required" 
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="mb-1">Your credentials are encrypted and stored securely.</p>
                  <p className="text-blue-700">We only read your portfolio data and never execute trades.</p>
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={handleConnect}
                disabled={connecting}
              >
                {connecting ? 'Connecting...' : 'Connect Broker'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {connectedBrokersList.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No brokers connected</p>
          <p className="text-sm text-gray-400 mb-4">Connect your broker accounts to track your portfolio</p>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Broker
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {connectedBrokersList.map((brokerData: any) => {
              const brokerInfo = availableBrokers.find(b => b.value === brokerData.broker?.toLowerCase());
              const portfolio = getBrokerPortfolio(brokerData.broker);
              const summary = portfolio?.summary || {
                invested: 0,
                currentValue: 0,
                returns: 0,
                returnsPercent: 0,
              };
              const holdingsCount = portfolio?.holdings?.length || 0;
              const isPositive = summary.returns >= 0;

              return (
                <Card key={brokerData.broker} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{brokerInfo?.logo || '📊'}</div>
                      <div>
                        <h3 className="text-gray-900">{brokerInfo?.name || brokerData.broker}</h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 mt-1">
                          Connected
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Holdings</span>
                      <span className="text-gray-900">{holdingsCount} stocks</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Invested</span>
                      <span className="text-gray-900">₹{summary.invested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Current Value</span>
                      <span className="text-gray-900">₹{summary.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Returns</span>
                      <div className="text-right">
                        <p className={isPositive ? 'text-green-600' : 'text-red-600'}>
                          {isPositive ? '+' : ''}₹{Math.abs(summary.returns).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                        <div className="flex items-center gap-1">
                          {isPositive ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          )}
                          <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}{summary.returnsPercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Synced {formatTimestamp(brokerData.lastSynced)}
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSync(brokerData.broker)}
                        disabled={syncing === brokerData.broker}
                        className="gap-1"
                      >
                        <RefreshCw className={`h-3 w-3 ${syncing === brokerData.broker ? 'animate-spin' : ''}`} />
                        {syncing === brokerData.broker ? 'Syncing...' : 'Sync'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDisconnect(brokerData.broker)}
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Available Brokers to Connect</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {availableBrokers
                .filter(broker => !connectedBrokersList.find(cb => cb.broker?.toLowerCase() === broker.value))
                .map((broker) => (
                  <div
                    key={broker.value}
                    className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    onClick={() => {
                      setSelectedBroker(broker.value);
                      setOpen(true);
                    }}
                  >
                    <div className="text-3xl mb-2">{broker.logo}</div>
                    <p className="text-sm text-center text-gray-900">{broker.name}</p>
                  </div>
                ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
