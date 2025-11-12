import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TopMoversProps {
  onStockClick: (symbol: string) => void;
}

const topGainers = [
  { symbol: 'ADANIPORTS', name: 'Adani Ports', price: '789.50', change: '+5.67%', isPositive: true },
  { symbol: 'TATASTEEL', name: 'Tata Steel', price: '118.45', change: '+4.89%', isPositive: true },
  { symbol: 'HINDALCO', name: 'Hindalco Industries', price: '456.80', change: '+4.23%', isPositive: true },
  { symbol: 'JSWSTEEL', name: 'JSW Steel', price: '689.30', change: '+3.95%', isPositive: true },
  { symbol: 'COALINDIA', name: 'Coal India', price: '234.60', change: '+3.78%', isPositive: true },
];

const topLosers = [
  { symbol: 'ASIANPAINT', name: 'Asian Paints', price: '3,245.70', change: '-3.45%', isPositive: false },
  { symbol: 'NESTLEIND', name: 'Nestle India', price: '22,456.30', change: '-2.89%', isPositive: false },
  { symbol: 'BRITANNIA', name: 'Britannia Industries', price: '4,567.80', change: '-2.34%', isPositive: false },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: '2,678.90', change: '-2.12%', isPositive: false },
  { symbol: 'ITC', name: 'ITC Limited', price: '445.60', change: '-1.87%', isPositive: false },
];

export function TopMovers({ onStockClick }: TopMoversProps) {
  return (
    <div>
      <h2 className="text-gray-900 mb-4">Top Movers</h2>
      <Card className="p-6">
        <Tabs defaultValue="gainers">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
            <TabsTrigger value="losers">Top Losers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gainers" className="space-y-3">
            {topGainers.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                onClick={() => onStockClick(stock.symbol)}
              >
                <div>
                  <p className="text-gray-900">{stock.symbol}</p>
                  <p className="text-sm text-gray-500">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900">₹{stock.price}</p>
                  <div className="flex items-center gap-1 justify-end">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-sm text-green-600">{stock.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="losers" className="space-y-3">
            {topLosers.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                onClick={() => onStockClick(stock.symbol)}
              >
                <div>
                  <p className="text-gray-900">{stock.symbol}</p>
                  <p className="text-sm text-gray-500">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900">₹{stock.price}</p>
                  <div className="flex items-center gap-1 justify-end">
                    <TrendingDown className="h-3 w-3 text-red-600" />
                    <span className="text-sm text-red-600">{stock.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
