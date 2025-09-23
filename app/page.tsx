import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Train, BarChart3, Bot, AlertTriangle, TrendingUp, Heart, Settings, Zap, Activity, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
                <Train className="w-8 h-8 text-blue-600" />
                SpeedLine
              </h1>
              <span className="ml-3 text-sm text-gray-500 font-medium">Real-time Train Traffic Management</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" className="nav-link">Dashboard</Button>
              </Link>
              <Link href="/health">
                <Button variant="outline" className="nav-link">System Health</Button>
              </Link>
              <Link href="/optimization-engine">
                <Button variant="outline" className="nav-link">Live Engine</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mb-8">
            <div className="animate-pulse">
              <Train className="w-20 h-20 mx-auto text-blue-600 mb-4" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl animate-fade-in">
              <span className="block">SpeedLine</span>
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Train Management
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl font-medium animate-slide-up">
              Real-time train traffic monitoring, AI-driven optimization, and intelligent disruption management for modern railway operations.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto btn-primary flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Link href="/disruptions">
                <Button variant="outline" size="lg" className="w-full sm:w-auto btn-secondary flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  View Disruptions
                </Button>
              </Link>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Link href="/health">
                <Button variant="outline" size="lg" className="w-full sm:w-auto btn-secondary flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  System Health
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Comprehensive Railway Management
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Monitor, analyze, and optimize train operations with advanced real-time insights
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Real-time Dashboard */}
            <div className="card-futuristic p-6 group">
              <div className="text-blue-600 mb-4">
                <BarChart3 className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Dashboard</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Live train positions, section occupancy, and system status with interactive visualizations
              </p>
              <div className="mt-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="group-hover:bg-blue-50 transition-colors">
                    View Dashboard →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Real-time Engine */}
            <div className="card-futuristic p-6 group">
              <div className="text-green-600 mb-4">
                <Bot className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live AI Engine</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Real-time optimization engine with continuous AI-powered decision making
              </p>
              <div className="mt-4">
                <Link href="/optimization-engine">
                  <Button variant="outline" size="sm" className="group-hover:bg-green-50 transition-colors">
                    View Live Engine →
                  </Button>
                </Link>
              </div>
            </div>

            {/* AI Optimization */}
            <div className="card-futuristic p-6 group">
              <div className="text-purple-600 mb-4">
                <Zap className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Optimization</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Smart routing decisions, delay predictions, and automated traffic management
              </p>
              <div className="mt-4">
                <Link href="/optimization">
                  <Button variant="outline" size="sm" className="group-hover:bg-purple-50 transition-colors">
                    View AI Results →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Disruption Alerts */}
            <div className="card-futuristic p-6 group">
              <div className="text-red-600 mb-4">
                <AlertTriangle className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Disruption Management</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Real-time alerts, impact analysis, and recovery planning for service disruptions
              </p>
              <div className="mt-4">
                <Link href="/disruptions">
                  <Button variant="outline" size="sm" className="group-hover:bg-red-50 transition-colors">
                    View Disruptions →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Performance Analytics */}
            <div className="card-futuristic p-6 group">
              <div className="text-indigo-600 mb-4">
                <TrendingUp className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Analytics</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                KPI tracking, trend analysis, and operational efficiency metrics
              </p>
              <div className="mt-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="group-hover:bg-indigo-50 transition-colors">
                    View Analytics →
                  </Button>
                </Link>
              </div>
            </div>

            {/* System Health */}
            <div className="card-futuristic p-6 group">
              <div className="text-green-600 mb-4">
                <Heart className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">System Health</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Infrastructure monitoring, capacity utilization, and system status tracking
              </p>
              <div className="mt-4">
                <Link href="/health">
                  <Button variant="outline" size="sm" className="group-hover:bg-green-50 transition-colors">
                    Check Health →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Configuration */}
            <div className="card-futuristic p-6 group col-span-full sm:col-span-2 lg:col-span-1">
              <div className="text-gray-600 mb-4">
                <Settings className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Configuration</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Customizable dashboards, alert preferences, and system settings
              </p>
              <div className="mt-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="group-hover:bg-gray-50 transition-colors">
                    Configure →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 card-futuristic p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Built with Modern Technology
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="text-blue-600 mb-2">
                  <Activity className="w-8 h-8" />
                </div>
                <span className="text-sm font-semibold text-gray-700">React & Next.js</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="text-purple-600 mb-2">
                  <Settings className="w-8 h-8" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Tailwind CSS</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="text-green-600 mb-2">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Recharts</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="text-orange-600 mb-2">
                  <Zap className="w-8 h-8" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium">
              © 2025 SpeedLine Train Management System. Built for SIH 2025.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Real-time railway operations management with AI-powered optimization
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}