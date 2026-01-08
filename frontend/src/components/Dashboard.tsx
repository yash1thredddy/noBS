import { useSignals } from '@preact/signals-react/runtime';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { motion } from "motion/react";
import { Search, Plus, Microscope, FileText, User, LogOut } from "lucide-react";
import companyLogo from 'figma:asset/3719964460fd60c11f6876da44f351cf07902b42.png';
import { user, logout } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  useSignals(); // Enable signal reactivity
  const navigate = useNavigate();

  // Access user signal - component auto re-renders when it changes
  const currentUser = user.value;

  const handleLogout = async () => {
    try {
      // Call backend to revoke token
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';
      const token = localStorage.getItem('nobs_access_token');
      
      if (token) {
        await fetch(`${apiUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).catch(() => {
          // Backend logout failed, but continue with frontend logout
        });
      }
      
      // Clear frontend data
      logout();
      
      // Fast logout - ORCID session stays active for quick re-login
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear frontend data even if backend fails
      logout();
      navigate('/login');
    }
  };

  // Fallback if somehow accessed without auth (shouldn't happen with ProtectedRoute)
  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/70 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={companyLogo} 
              alt="noBS Consortium" 
              className="h-10 w-auto"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User className="w-4 h-4" />
              <span>{currentUser.name}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl mb-2 text-slate-900">
              Welcome back, {currentUser.name.split(' ')[currentUser.name.split(' ').length - 1]}!
            </h1>
            <p className="text-slate-600">
              {currentUser.institution || 'Research Institution'} • ORCID: {currentUser.orcid}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-12"
          >
            <Card className="shadow-lg border-green-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Search className="w-6 h-6 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search compounds, proteins, or studies..."
                    className="flex-1 outline-none text-slate-900 placeholder:text-slate-400"
                  />
                  <Button className="bg-[#A6CE39] hover:bg-[#92B830]">
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl mb-6 text-slate-900">Quick Actions</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card
                className="shadow-md border-green-100 hover:shadow-xl transition-shadow cursor-pointer group"
                onClick={() => navigate('/entry/new')}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <Plus className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-slate-900">New Entry</h3>
                  <p className="text-sm text-slate-600">
                    Add a new compound
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md border-green-100 hover:shadow-xl transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <Microscope className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-slate-900">Molecular Docking</h3>
                  <p className="text-sm text-slate-600">
                    Run protein simulations
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md border-green-100 hover:shadow-xl transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-slate-900">My Projects</h3>
                  <p className="text-sm text-slate-600">
                    View research projects
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md border-green-100 hover:shadow-xl transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <Search className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-slate-900">Advanced Search</h3>
                  <p className="text-sm text-slate-600">
                    Filter by properties
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Recent Activity & Stats */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card className="shadow-lg border-green-100">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest searches and analyses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Curcumin Docking Analysis", time: "2 hours ago", type: "Docking" },
                      { title: "Resveratrol Database Search", time: "5 hours ago", type: "Search" },
                      { title: "Alkaloid Structure Study", time: "1 day ago", type: "Analysis" },
                      { title: "Flavonoid Project Review", time: "2 days ago", type: "Project" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
                        <div>
                          <div className="text-sm text-slate-900">{item.title}</div>
                          <div className="text-xs text-slate-500">{item.time}</div>
                        </div>
                        <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                          {item.type}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card className="shadow-lg border-green-100">
                <CardHeader>
                  <CardTitle>Your Statistics</CardTitle>
                  <CardDescription>Research activity overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Compounds Analyzed</span>
                        <span className="text-slate-900">127</span>
                      </div>
                      <div className="w-full bg-green-100 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Docking Simulations</span>
                        <span className="text-slate-900">43</span>
                      </div>
                      <div className="w-full bg-green-100 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '43%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Active Projects</span>
                        <span className="text-slate-900">8</span>
                      </div>
                      <div className="w-full bg-green-100 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Saved Searches</span>
                        <span className="text-slate-900">15</span>
                      </div>
                      <div className="w-full bg-green-100 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-6 bg-white/50 border-t border-green-100 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
          <p>© 2024 noBS Consortium • Terms of Service • Privacy Policy</p>
        </div>
      </footer>
    </div>
  );
}
