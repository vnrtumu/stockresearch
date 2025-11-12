import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

interface HoldingsListProps {
  limit?: number;
  holdings: any[];
  loading?: boolean;
}

const getBrokerColor = (broker: string) => {
  const colors: Record<string, string> = {
    'zerodha': 'bg-blue-100 text-blue-700',
    'groww': 'bg-green-100 text-green-700',
    'upstox': 'bg-purple-100 text-purple-700',
    'angelone': 'bg-red-100 text-red-700',
    'icicidirect': 'bg-orange-100 text-orange-700',
  };
  return colors[broker.toLowerCase()] || 'bg-gray-100 text-gray-700';
};

export function HoldingsList({ limit, holdings, loading }: HoldingsListProps) {
  const displayedHoldings = limit ? holdings.slice(0, limit) : holdings;
  const showViewAll = limit && holdings.length > limit;

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-7 w-32" />
        </div>
        <Card className="overflow-hidden p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (!holdings || holdings.length === 0) {
    return (
      <div>
        <h2 className="text-gray-900 mb-4">Your Holdings</h2>
        <Card className="p-12 text-center">
          <p className="text-gray-500 mb-2">No holdings found</p>
          <p className="text-sm text-gray-400">Connect a broker and sync your portfolio to see your holdings</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-900">Your Holdings</h2>
        {!limit && (
          <div className="text-sm text-gray-500">
            Total {holdings.length} stocks
          </div>
        )}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm text-gray-700">Stock</th>
                <th className="text-left py-3 px-4 text-sm text-gray-700">Broker</th>
                <th className="text-right py-3 px-4 text-sm text-gray-700">Qty</th>
                <th className="text-right py-3 px-4 text-sm text-gray-700">Avg Price</th>
                <th className="text-right py-3 px-4 text-sm text-gray-700">Current Price</th>
                <th className="text-right py-3 px-4 text-sm text-gray-700">Invested</th>
                <th className="text-right py-3 px-4 text-sm text-gray-700">Current Value</th>
                <th className="text-right py-3 px-4 text-sm text-gray-700">Returns</th>
              </tr>
            </thead>
            <tbody>
              {displayedHoldings.map((holding, index) => {
                const returns = holding.currentValue - holding.investedValue;
                const returnsPercent = ((returns / holding.investedValue) * 100).toFixed(2);
                const isPositive = returns >= 0;
                
                return (
                  <tr key={`${holding.symbol}-${holding.broker || 'unknown'}-${index}`} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-gray-900">{holding.symbol}</p>
                        <p className="text-sm text-gray-500">{holding.name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary" className={getBrokerColor(holding.broker || 'Unknown')}>
                        {holding.broker || 'Unknown'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-900">{holding.quantity}</td>
                    <td className="py-4 px-4 text-right text-gray-600">₹{holding.avgPrice.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right text-gray-900">₹{holding.currentPrice.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right text-gray-600">₹{holding.investedValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="py-4 px-4 text-right text-gray-900">₹{holding.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="py-4 px-4 text-right">
                      <div>
                        <p className={isPositive ? 'text-green-600' : 'text-red-600'}>
                          {isPositive ? '+' : ''}₹{Math.abs(returns).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                        <div className="flex items-center gap-1 justify-end">
                          {isPositive ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          )}
                          <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}{returnsPercent}%
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {showViewAll && (
          <div className="p-4 border-t border-gray-200 text-center">
            <Button variant="ghost">View All Holdings</Button>
          </div>
        )}
      </Card>
    </div>
  );
}