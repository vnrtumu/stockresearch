import { TrendingUp, BarChart3, Building2, User } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  currentView: string;
  onViewChange: (view: "portfolio" | "holdings" | "brokers") => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => onViewChange("portfolio")}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <span className="text-xl text-gray-900">Portfolio Tracker</span>
            </button>

            {/* show nav on mobile too; on very small screens hide text and show icons only */}
            <nav className="flex items-center gap-1 overflow-x-auto">
              <Button
                size="sm"
                variant={currentView === "portfolio" ? "default" : "ghost"}
                onClick={() => onViewChange("portfolio")}
                className="gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Portfolio</span>
              </Button>
              <Button
                size="sm"
                variant={currentView === "holdings" ? "default" : "ghost"}
                onClick={() => onViewChange("holdings")}
                className="gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Holdings</span>
              </Button>
              <Button
                size="sm"
                variant={currentView === "brokers" ? "default" : "ghost"}
                onClick={() => onViewChange("brokers")}
                className="gap-2"
              >
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Brokers</span>
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
