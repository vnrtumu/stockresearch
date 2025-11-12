import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StockDetailProps {
  symbol: string;
  onBack: () => void;
}

const stockData = {
  RELIANCE: {
    name: 'Reliance Industries Limited',
    price: '2,456.80',
    change: '+57.40',
    changePercent: '+2.34%',
    isPositive: true,
    open: '2,410.30',
    high: '2,478.90',
    low: '2,405.20',
    prevClose: '2,399.40',
    marketCap: '16.5T',
    pe: '28.45',
    sector: 'Oil & Gas',
    about: 'Reliance Industries Limited is an Indian multinational conglomerate company headquartered in Mumbai. It has diverse businesses including energy, petrochemicals, natural gas, retail, telecommunications, mass media, and textiles.'
  },
  TCS: {
    name: 'Tata Consultancy Services Limited',
    price: '3,589.50',
    change: '+65.85',
    changePercent: '+1.87%',
    isPositive: true,
    open: '3,545.20',
    high: '3,598.30',
    low: '3,540.10',
    prevClose: '3,523.65',
    marketCap: '13.2T',
    pe: '32.10',
    sector: 'Information Technology',
    about: 'Tata Consultancy Services is an Indian multinational information technology services and consulting company. It is part of the Tata Group and operates in 46 countries.'
  },
};

const chartData = [
  { time: '9:15', price: 2400 },
  { time: '10:00', price: 2415 },
  { time: '11:00', price: 2408 },
  { time: '12:00', price: 2425 },
  { time: '13:00', price: 2418 },
  { time: '14:00', price: 2440 },
  { time: '15:00', price: 2457 },
];

export function StockDetail({ symbol, onBack }: StockDetailProps) {
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const stock = stockData[symbol as keyof typeof stockData] || stockData.RELIANCE;

  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-4 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Market
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl text-gray-900 mb-1">{symbol}</h1>
                <p className="text-gray-500">{stock.name}</p>
              </div>
              <Button
                variant={isWatchlisted ? 'default' : 'outline'}
                onClick={() => setIsWatchlisted(!isWatchlisted)}
                className="gap-2"
              >
                <Star className={`h-4 w-4 ${isWatchlisted ? 'fill-current' : ''}`} />
                {isWatchlisted ? 'Watchlisted' : 'Add to Watchlist'}
              </Button>
            </div>

            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-4xl text-gray-900">₹{stock.price}</span>
              <div className="flex items-center gap-2">
                {stock.isPositive ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
                <span className={`text-lg ${stock.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.change} ({stock.changePercent})
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-6">As of Nov 12, 2025</p>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <Tabs defaultValue="fundamentals">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              <TabsContent value="fundamentals">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Market Cap</p>
                    <p className="text-gray-900">₹{stock.marketCap}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">P/E Ratio</p>
                    <p className="text-gray-900">{stock.pe}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Sector</p>
                    <p className="text-gray-900">{stock.sector}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Prev. Close</p>
                    <p className="text-gray-900">₹{stock.prevClose}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="about">
                <p className="text-gray-600 leading-relaxed">{stock.about}</p>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Key Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Open</span>
                <span className="text-gray-900">₹{stock.open}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">High</span>
                <span className="text-green-600">₹{stock.high}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Low</span>
                <span className="text-red-600">₹{stock.low}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Prev. Close</span>
                <span className="text-gray-900">₹{stock.prevClose}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Company Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Sector</p>
                <p className="text-gray-900">{stock.sector}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Market Cap</p>
                <p className="text-gray-900">₹{stock.marketCap}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">P/E Ratio</p>
                <p className="text-gray-900">{stock.pe}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
