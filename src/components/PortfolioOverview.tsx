import { TrendingUp, TrendingDown, Wallet, PiggyBank, TrendingUpIcon } from 'lucide-react';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface PortfolioOverviewProps {
  portfolioData: any;
  loading: boolean;
}

export function PortfolioOverview({ portfolioData, loading }: PortfolioOverviewProps) {
  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-9 w-40 mb-2" />
              <Skeleton className="h-4 w-24" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const summary = portfolioData?.summary || {
    totalInvestment: 0,
    totalCurrentValue: 0,
    totalReturns: 0,
    returnsPercent: 0,
  };

  const isPositive = summary.totalReturns >= 0;
  const dayChange = summary.totalReturns * 0.05; // Mock day change as 5% of total returns
  const isDayPositive = dayChange >= 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl text-gray-900">Portfolio Overview</h1>
          <p className="text-gray-500 mt-1">Track your investments across all brokers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-5 w-5 opacity-80" />
            <span className="text-sm opacity-80">Total Networth</span>
          </div>
          <div className="text-3xl mb-2">₹{summary.totalCurrentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="flex items-center gap-2 text-sm">
            {isDayPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>
              {isDayPositive ? '+' : ''}₹{Math.abs(dayChange).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} today
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">Total Investment</span>
          </div>
          <div className="text-3xl text-gray-900 mb-2">₹{summary.totalInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-sm text-gray-400">Across all accounts</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUpIcon className={`h-5 w-5 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
            <span className="text-sm text-gray-500">Total Returns</span>
          </div>
          <div className="text-3xl text-gray-900 mb-2">₹{Math.abs(summary.totalReturns).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
              {isPositive ? '+' : ''}{summary.returnsPercent}%
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">XIRR</span>
          </div>
          <div className="text-3xl text-gray-900 mb-2">{summary.returnsPercent > 0 ? (parseFloat(summary.returnsPercent) * 0.8).toFixed(1) : '0.0'}%</div>
          <div className="text-sm text-gray-400">Annualized returns</div>
        </Card>
      </div>
    </div>
  );
}