import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Upload, 
  BarChart3, 
  Shield, 
  FileText, 
  MapPin, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Activity
} from 'lucide-react';
import { AnalysisResult } from '../App';

interface HomeProps {
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
}

const Home = ({ setAnalysisResult, setIsAnalyzing }: HomeProps) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Upload,
      title: 'Easy Data Upload',
      description: 'Upload smart meter CSV data with automatic format detection.',
      color: 'bg-blue-500',
    },
    {
      icon: BarChart3,
      title: 'AI-Powered Analysis',
      description: 'Unsupervised ML detects anomalies without predefined patterns.',
      color: 'bg-purple-500',
    },
    {
      icon: Shield,
      title: 'Accurate Detection',
      description: 'Isolation Forest identifies suspicious consumption patterns.',
      color: 'bg-emerald-500',
    },
    {
      icon: MapPin,
      title: 'Zone Visualization',
      description: 'View high-risk areas and regional anomaly distribution.',
      color: 'bg-amber-500',
    },
    {
      icon: AlertTriangle,
      title: 'Risk Assessment',
      description: 'Automatic classification into risk categories.',
      color: 'bg-red-500',
    },
    {
      icon: FileText,
      title: 'Report Generation',
      description: 'Download detailed PDF or Excel reports.',
      color: 'bg-cyan-500',
    },
  ];

  const handleGetStarted = () => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 border border-white/20">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-white">Government AI System</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                <span className="text-white">Unsupervised Electricity</span>
                <br />
                <span className="text-amber-400">Theft Detection</span>
              </h1>

              <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
                Upload your smart meter data to automatically detect abnormal electricity 
                usage patterns using advanced AI. Designed for government electricity boards.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGetStarted}
                  className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg shadow-xl transition-all"
                >
                  <Upload className="w-5 h-5" />
                  Upload Data
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/history')}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg border border-white/20 transition-all"
                >
                  View History
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { value: '99.2%', label: 'Detection Accuracy', icon: Activity },
              { value: '<5s', label: 'Analysis Time', icon: Zap },
              { value: '10K+', label: 'Consumers/Batch', icon: BarChart3 },
              { value: '24/7', label: 'Availability', icon: Shield },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <stat.icon className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-blue-200 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Powerful Detection Tools
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Advanced tools designed for electricity board officers to identify 
              and investigate potential theft cases efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Simple three-step process to detect anomalies in your smart meter data.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Upload Data',
                description: 'Upload your smart meter CSV file. The system validates and previews data automatically.',
                icon: Upload,
                color: 'bg-blue-500',
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our ML models analyze patterns, extract features, and identify anomalous behavior.',
                icon: BarChart3,
                color: 'bg-purple-500',
              },
              {
                step: '03',
                title: 'Review Results',
                description: 'View flagged consumers, explore analytics, and download comprehensive reports.',
                icon: FileText,
                color: 'bg-emerald-500',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl ${item.color} flex items-center justify-center relative`}>
                  <item.icon className="w-10 h-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-slate-900 font-bold text-sm shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
            Ready to Detect Anomalies?
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Start analyzing your smart meter data today and identify potential 
            electricity theft cases in minutes.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGetStarted}
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-12 py-5 rounded-xl text-lg shadow-2xl transition-all"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/favicon.svg" alt="GovAI Logo" className="w-10 h-10 rounded-xl" />
              <span className="font-bold text-white">Gov<span className="text-amber-400">AI</span></span>
            </div>
            <p className="text-sm text-center md:text-right">
              © 2025 GovAI – Unsupervised Electricity Theft Detection System.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
