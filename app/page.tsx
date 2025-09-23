import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Train, BarChart3, Bot, AlertTriangle, TrendingUp, Heart, Settings, Zap, Activity, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-gradient-to-r from-indigo-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>
      
      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-md shadow-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3 hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="relative">
                  <Train className="w-10 h-10 text-blue-600 drop-shadow-lg" />
                  <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-20 animate-pulse"></div>
                </div>
                SpeedLine
              </h1>
              <span className="ml-4 text-sm text-blue-700 font-medium px-4 py-2 bg-blue-100 rounded-full border border-blue-200">
                AI-Powered Railway Control
              </span>
            </div>
            <div className="flex space-x-3">
              <Link href="/dashboard">
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 backdrop-blur-sm shadow-md">
                  Dashboard
                </Button>
              </Link>
              <Link href="/health">
                <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300 backdrop-blur-sm shadow-md">
                  System Health
                </Button>
              </Link>
              <Link href="/optimization-engine">
                <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 backdrop-blur-sm shadow-md">
                  Live Engine
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="mb-16">
            <div className="relative inline-block mb-8">
              {/* Animated Train on Track */}
              <div className="relative w-80 h-32 mx-auto">
                {/* Railway Track */}
                <div className="absolute bottom-8 left-0 right-0 h-2">
                  <div className="w-full h-0.5 bg-gray-400 mb-1"></div>
                  <div className="w-full h-0.5 bg-gray-400"></div>
                  {/* Railway Ties */}
                  <div className="absolute top-0 left-0 w-full h-2 flex justify-between items-center">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-1 h-4 bg-gray-500 opacity-60"></div>
                    ))}
                  </div>
                </div>
                
                {/* Animated Train */}
                <div className="absolute bottom-6 animate-moveRail left-0">
                  <div className="relative">
                    {/* Train Body */}
                    <div className="w-20 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg relative animate-trainPulse">
                      {/* Windows */}
                      <div className="absolute top-2 left-2 w-3 h-3 bg-blue-100 rounded-sm"></div>
                      <div className="absolute top-2 left-6 w-3 h-3 bg-blue-100 rounded-sm"></div>
                      <div className="absolute top-2 left-10 w-3 h-3 bg-blue-100 rounded-sm"></div>
                      <div className="absolute top-2 left-14 w-3 h-3 bg-blue-100 rounded-sm"></div>
                      
                      {/* Front of train */}
                      <div className="absolute -right-2 top-1 w-4 h-10 bg-blue-700 rounded-r-full"></div>
                      
                      {/* Headlight */}
                      <div className="absolute -right-1 top-4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* Wheels */}
                    <div className="absolute -bottom-1 left-2 w-3 h-3 bg-gray-700 rounded-full animate-spin"></div>
                    <div className="absolute -bottom-1 left-7 w-3 h-3 bg-gray-700 rounded-full animate-spin"></div>
                    <div className="absolute -bottom-1 left-12 w-3 h-3 bg-gray-700 rounded-full animate-spin"></div>
                    
                    {/* Steam/Smoke */}
                    <div className="absolute -top-6 left-4">
                      <div className="w-2 h-2 bg-gray-300 rounded-full opacity-70 animate-floatSmoke"></div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full opacity-50 animate-floatSmoke ml-1 mt-1" style={{animationDelay: '0.5s'}}></div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full opacity-30 animate-floatSmoke ml-2 mt-1" style={{animationDelay: '1s'}}></div>
                    </div>
                  </div>
                </div>
                
                {/* Glowing effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold text-gray-800 mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                SpeedLine
              </span>
              <span className="block text-4xl md:text-5xl bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent font-light mt-4">
                Train Management
              </span>
            </h1>
            <p className="mt-8 max-w-4xl mx-auto text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
              Real-time train traffic monitoring, AI-driven optimization, and intelligent disruption management for 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold"> modern railway operations</span>.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="group">
              <Link href="/dashboard">
                <Button size="lg" className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-12 py-4 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 border-0">
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <Activity className="w-6 h-6" />
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Button>
              </Link>
            </div>
            <div className="group">
              <Link href="/disruptions">
                <Button variant="outline" size="lg" className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 px-8 py-4 rounded-2xl backdrop-blur-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <AlertTriangle className="w-6 h-6 mr-2" />
                  View Disruptions
                </Button>
              </Link>
            </div>
            <div className="group">
              <Link href="/health">
                <Button variant="outline" size="lg" className="border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 px-8 py-4 rounded-2xl backdrop-blur-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <Heart className="w-6 h-6 mr-2" />
                  System Health
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Comprehensive Railway Management
              </span>
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
              Monitor, analyze, and optimize train operations with advanced real-time insights and cutting-edge technology
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Real-time Dashboard */}
            <div className="group relative bg-white/70 backdrop-blur-lg border border-blue-200 rounded-3xl p-8 hover:bg-white/90 hover:border-blue-300 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-blue-600 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-16 h-16 drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-700 transition-colors duration-300">Real-time Dashboard</h3>
                <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                  Live train positions, section occupancy, and system status with interactive visualizations
                </p>
                <div className="mt-6">
                  <Link href="/dashboard">
                    <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 rounded-xl px-6 py-2 font-semibold shadow-md">
                      View Dashboard →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Real-time Engine */}
            <div className="group relative bg-white/70 backdrop-blur-lg border border-emerald-200 rounded-3xl p-8 hover:bg-white/90 hover:border-emerald-300 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/50 to-green-100/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-emerald-600 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <Bot className="w-16 h-16 drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-emerald-700 transition-colors duration-300">Live AI Engine</h3>
                <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                  Real-time optimization engine with continuous AI-powered decision making
                </p>
                <div className="mt-6">
                  <Link href="/optimization-engine">
                    <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300 rounded-xl px-6 py-2 font-semibold shadow-md">
                      View Live Engine →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Live Route */}
            <div className="group relative bg-white/70 backdrop-blur-lg border border-purple-200 rounded-3xl p-8 hover:bg-white/90 hover:border-purple-300 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-pink-100/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-purple-600 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-16 h-16 drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-purple-700 transition-colors duration-300">Live Route</h3>
                <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                  Interactive geographic visualization with real-time train positioning and route tracking
                </p>
                <div className="mt-6">
                  <Link href="/optimization">
                    <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 rounded-xl px-6 py-2 font-semibold shadow-md">
                      View Live Map →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Disruption Alerts */}
            <div className="group relative bg-white/70 backdrop-blur-lg border border-red-200 rounded-3xl p-8 hover:bg-white/90 hover:border-red-300 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/10">
              <div className="absolute inset-0 bg-gradient-to-r from-red-100/50 to-orange-100/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-red-600 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="w-16 h-16 drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-red-700 transition-colors duration-300">Disruption Management</h3>
                <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                  Real-time alerts, impact analysis, and recovery planning for service disruptions
                </p>
                <div className="mt-6">
                  <Link href="/disruptions">
                    <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 transition-all duration-300 rounded-xl px-6 py-2 font-semibold shadow-md">
                      View Disruptions →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Performance Analytics */}
            <div className="group relative bg-white/70 backdrop-blur-lg border border-indigo-200 rounded-3xl p-8 hover:bg-white/90 hover:border-indigo-300 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/10">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-blue-100/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-indigo-600 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-16 h-16 drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-indigo-700 transition-colors duration-300">Performance Analytics</h3>
                <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                  KPI tracking, trend analysis, and operational efficiency metrics
                </p>
                <div className="mt-6">
                  <Link href="/dashboard">
                    <Button variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-300 rounded-xl px-6 py-2 font-semibold shadow-md">
                      View Analytics →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="group relative bg-white/70 backdrop-blur-lg border border-emerald-200 rounded-3xl p-8 hover:bg-white/90 hover:border-emerald-300 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/50 to-green-100/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-emerald-600 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-16 h-16 drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-emerald-700 transition-colors duration-300">System Health</h3>
                <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                  Infrastructure monitoring, capacity utilization, and system status tracking
                </p>
                <div className="mt-6">
                  <Link href="/health">
                    <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300 rounded-xl px-6 py-2 font-semibold shadow-md">
                      Check Health →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Configuration */}
            <div className="group relative bg-white/70 backdrop-blur-lg border border-gray-300 rounded-3xl p-8 hover:bg-white/90 hover:border-gray-400 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/10 col-span-full sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-slate-100/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-gray-600 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <Settings className="w-16 h-16 drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-gray-700 transition-colors duration-300">Smart Configuration</h3>
                <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                  Customizable dashboards, alert preferences, and system settings
                </p>
                <div className="mt-6">
                  <Link href="/dashboard">
                    <Button variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500 transition-all duration-300 rounded-xl px-6 py-2 font-semibold shadow-md">
                      Configure →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-indigo-100/30 to-purple-100/30 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl p-12 shadow-2xl">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-gray-800 mb-12">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Powered by Modern Technology
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="group flex flex-col items-center p-6 rounded-2xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 border border-blue-200 hover:border-blue-300 shadow-md hover:shadow-lg">
                  <div className="text-blue-600 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    <Activity className="w-12 h-12 drop-shadow-lg" />
                  </div>
                  <span className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">React & Next.js</span>
                  <span className="text-sm text-gray-600 mt-1">Frontend Framework</span>
                </div>
                <div className="group flex flex-col items-center p-6 rounded-2xl hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 border border-purple-200 hover:border-purple-300 shadow-md hover:shadow-lg">
                  <div className="text-purple-600 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    <Settings className="w-12 h-12 drop-shadow-lg" />
                  </div>
                  <span className="text-lg font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">Tailwind CSS</span>
                  <span className="text-sm text-gray-600 mt-1">Styling Engine</span>
                </div>
                <div className="group flex flex-col items-center p-6 rounded-2xl hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 border border-emerald-200 hover:border-emerald-300 shadow-md hover:shadow-lg">
                  <div className="text-emerald-600 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-12 h-12 drop-shadow-lg" />
                  </div>
                  <span className="text-lg font-bold text-gray-800 group-hover:text-emerald-700 transition-colors duration-300">Recharts</span>
                  <span className="text-sm text-gray-600 mt-1">Data Visualization</span>
                </div>
                <div className="group flex flex-col items-center p-6 rounded-2xl hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 border border-orange-200 hover:border-orange-300 shadow-md hover:shadow-lg">
                  <div className="text-orange-600 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-12 h-12 drop-shadow-lg" />
                  </div>
                  <span className="text-lg font-bold text-gray-800 group-hover:text-orange-700 transition-colors duration-300">Real-time Updates</span>
                  <span className="text-sm text-gray-600 mt-1">Live Streaming</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/80 backdrop-blur-md border-t border-gray-200 mt-32">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Train className="w-8 h-8 text-blue-600 mr-3" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SpeedLine</span>
            </div>
            <p className="text-gray-700 text-lg font-medium mb-2">
              © 2025 SpeedLine Train Management System. Built for SIH 2025.
            </p>
            <p className="text-gray-600 text-sm">
              Real-time railway operations management with AI-powered optimization
            </p>
            <div className="mt-6 flex justify-center space-x-6">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full text-blue-700 text-sm font-medium shadow-md">
                Intelligent
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-200 rounded-full text-emerald-700 text-sm font-medium shadow-md">
                Real-time
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-full text-purple-700 text-sm font-medium shadow-md">
                Future-ready
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}