import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './ui/card';

const indices = [
  { name: 'NIFTY 50', value: '19,674.25', change: '+125.30', changePercent: '+0.64%', isPositive: true },
  { name: 'SENSEX', value: '65,828.51', change: '+398.27', changePercent: '+0.61%', isPositive: true },
  { name: 'NIFTY BANK', value: '44,156.70', change: '-89.45', changePercent: '-0.20%', isPositive: false },
  { name: 'NIFTY IT', value: '29,847.15', change: '+234.60', changePercent: '+0.79%', isPositive: true },
];

export function MarketOverview() {
  return (
    <div>
      <h2 className="text-gray-900 mb-4">Market Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.map((index) => (
          <Card key={index.name} className="p-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">{index.name}</span>
              <span className="text-2xl text-gray-900 mb-2">{index.value}</span>
              <div className="flex items-center gap-2">
                {index.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={index.isPositive ? 'text-green-600' : 'text-red-600'}>
                  {index.change} ({index.changePercent})
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
