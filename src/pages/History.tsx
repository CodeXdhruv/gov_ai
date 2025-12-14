import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, Users, AlertTriangle, RefreshCw } from 'lucide-react';
import { getHistory, HistoryEntry } from '../api/client';

const History = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistory();
      setHistory(data.history || []);
    } catch (err) {
      setError('Failed to load analysis history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const totalConsumers = history.reduce((sum, h) => sum + h.total_consumers, 0);
  const totalAnomalies = history.reduce((sum, h) => sum + h.anomalies_detected, 0);
  const autoencoderCount = history.filter((h) => h.used_autoencoder).length;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Analysis History</h1>
            <p className="text-slate-600">View all previous analyses and download reports</p>
          </div>
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-white text-slate-700 font-medium px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500">Loading history...</p>
            </div>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Analysis History</h3>
            <p className="text-slate-500">Run your first analysis to see it here.</p>
          </div>
        ) : (
          <>
            {/* History Cards */}
            <div className="space-y-4 mb-8">
              {history.map((entry, index) => (
                <motion.div
                  key={entry.analysis_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-wrap items-center gap-4 lg:gap-8">
                    {/* File Info */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{entry.filename}</h3>
                        <p className="text-xs text-slate-500">ID: {entry.analysis_id.slice(0, 8)}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-6 flex-1">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-slate-900 font-semibold">
                          <Users className="w-4 h-4 text-slate-400" />
                          {entry.total_consumers}
                        </div>
                        <div className="text-xs text-slate-500">Consumers</div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center gap-1 text-red-600 font-semibold">
                          <AlertTriangle className="w-4 h-4" />
                          {entry.anomalies_detected}
                        </div>
                        <div className="text-xs text-slate-500">Anomalies</div>
                      </div>

                      <div className="text-center">
                        <div className="text-amber-600 font-semibold">
                          {(entry.contamination * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-500">Threshold</div>
                      </div>

                      <div className="text-center">
                        <div className="text-slate-600">
                          {new Date(entry.timestamp).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="text-xs text-slate-500">Date</div>
                      </div>
                    </div>

                    {/* Model Tag */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        entry.used_autoencoder
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {entry.used_autoencoder ? 'Autoencoder' : 'Isolation Forest'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Analyses', value: history.length, color: 'bg-blue-500' },
                { label: 'Consumers Analyzed', value: totalConsumers, color: 'bg-emerald-500' },
                { label: 'Total Anomalies', value: totalAnomalies, color: 'bg-red-500' },
                { label: 'With Autoencoder', value: autoencoderCount, color: 'bg-purple-500' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="bg-white rounded-xl border border-slate-200 p-5 text-center"
                >
                  <div className={`w-2 h-2 ${stat.color} rounded-full mx-auto mb-2`}></div>
                  <div className="text-2xl font-bold text-slate-900">{stat.value.toLocaleString()}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default History;
