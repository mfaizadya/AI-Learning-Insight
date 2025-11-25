import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, User, BarChart3, Grid3x3, ClipboardList, LogOut } from 'lucide-react';

export default function Dashboard() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userEmail = 'user@gmail.com';
  
  // Sample data - replace with actual data from your backend
  const stats = {
    daysStreak: 30,
    learningStyle: 'Visual Learner',
    learningPattern: 'Consistent Learner',
    visualPercentage: 90,
    auditoryPercentage: 7,
    kinestheticPercentage: 3
  };

  return (
    <div className="min-h-screen bg-gray-700 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-purple-700 text-white p-6 flex flex-col">
        {/* User Profile */}
        <div className="bg-purple-200 rounded-2xl p-6 text-center mb-8">
          <div className="w-20 h-20 bg-purple-300 rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="w-16 h-16 bg-green-600 rounded-full"></div>
          </div>
          <h2 className="text-purple-900 font-bold text-lg">Hai, User!</h2>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-800 transition">
            <Grid3x3 size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-600 transition">
            <ClipboardList size={20} />
            <span className="font-medium">Pretest</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-600 transition">
            <User size={20} />
            <span className="font-medium">Akun</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Top Bar */}
        <div className="bg-white rounded-lg shadow mb-8 p-4 flex justify-between items-center">
          <div className="bg-purple-100 px-6 py-2 rounded-full">
            <span className="text-purple-900 font-semibold">Dashboard</span>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-purple-300 rounded-full hover:bg-purple-50 transition"
            >
              <User size={20} className="text-purple-700" />
              <span className="text-gray-700">{userEmail}</span>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">
                  Account
                </button>
                <button
                  onClick={() => onNavigate('login')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Days Streak Card */}
          <Card className="bg-purple-100 border-none">
            <CardContent className="p-6">
              <div className="text-5xl font-bold text-purple-900 mb-1">{stats.daysStreak}</div>
              <div className="text-2xl font-semibold text-purple-900">Days</div>
              <div className="text-xl text-purple-700">Streak</div>
            </CardContent>
          </Card>

          {/* Learning Style Card */}
          <Card className="bg-purple-100 border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-gray-700 mb-2">Gaya belajarmu:</div>
                  <div className="bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-center">
                    {stats.learningStyle}
                  </div>
                </div>
                <Eye size={48} className="text-purple-700" />
              </div>
            </CardContent>
          </Card>

          {/* Learning Pattern Card */}
          <Card className="bg-purple-100 border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-gray-700 mb-2">Pola belajarmu:</div>
                  <div className="text-purple-900 font-bold text-xl">Consistent</div>
                  <div className="text-purple-900 font-bold text-xl">Learner</div>
                </div>
                <BarChart3 size={64} className="text-purple-700" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Actionable Insights */}
          <Card className="bg-purple-100 border-none">
            <CardContent className="p-6">
              <h3 className="text-purple-900 font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">🔑</span>
                Actionable Insight untukmu
              </h3>
              
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Anda merupakan Visual Learner:</span> oleh karena itu, maksimalkan materi belajar yang berbasis visual
                  </p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Kamu menyelesaikan .......:</span> Lorem ipsum dolor sit amet, lorem ipsum dolor ....
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Statistik Gaya Belajarmu:</h3>
            
            <Card className="bg-purple-800 border-none mb-4">
              <CardContent className="p-8 flex items-center justify-center">
                {/* Pie Chart Representation */}
                <div className="w-32 h-32 rounded-full border-8 border-purple-300 relative">
                  <div className="absolute inset-0 rounded-full" 
                       style={{
                         background: `conic-gradient(
                           #e9d5ff 0% ${stats.visualPercentage}%,
                           transparent ${stats.visualPercentage}% 100%
                         )`
                       }}>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-2">
              <Card className="bg-purple-100 border-none">
                <CardContent className="p-4 flex items-center gap-2">
                  <Eye size={20} className="text-purple-700" />
                  <span className="font-semibold text-purple-900">Visual {stats.visualPercentage}%</span>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-100 border-none">
                <CardContent className="p-4 flex items-center gap-2">
                  <Eye size={20} className="text-purple-700" />
                  <span className="font-semibold text-purple-900">Auditori {stats.auditoryPercentage}%</span>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-100 border-none">
                <CardContent className="p-4 flex items-center gap-2">
                  <Eye size={20} className="text-purple-700" />
                  <span className="font-semibold text-purple-900">Kinestetik {stats.kinestheticPercentage}%</span>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}