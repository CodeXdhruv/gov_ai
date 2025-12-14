import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';

// Types
export interface Summary {
  total_consumers: number;
  anomalies_detected: number;
  high_risk_count: number;
  suspicious_count: number;
  review_needed_count: number;
  avg_anomaly_score: number;
  high_risk_zones: string[];
  zone_anomaly_counts: Record<string, number>;
}

export interface Consumer {
  consumer_id: string;
  region: string;
  avg_consumption: number;
  anomaly_score: number;
  status: string;
  is_anomaly: boolean;
  consumption_profile?: string;
}

export interface AnalysisResult {
  analysis_id: string;
  summary: Summary;
  consumers: Consumer[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  <Home 
                    setAnalysisResult={setAnalysisResult}
                    setIsAnalyzing={setIsAnalyzing}
                  />
                } 
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard 
                      analysisResult={analysisResult}
                      setAnalysisResult={setAnalysisResult}
                      isAnalyzing={isAnalyzing}
                      setIsAnalyzing={setIsAnalyzing}
                    />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/history" 
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
