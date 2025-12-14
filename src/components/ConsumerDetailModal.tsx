import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, TrendingUp, Moon, Calendar, Brain, FileWarning, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { ConsumerDetail } from '../api/client';
import ConsumptionTrendChart from './Charts/ConsumptionTrendChart';

interface ConsumerDetailModalProps {
  consumer: ConsumerDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

const ConsumerDetailModal = ({ consumer, isOpen, onClose }: ConsumerDetailModalProps) => {
  const [showAllRecords, setShowAllRecords] = useState(false);

  if (!consumer) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'High Risk':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Suspicious':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Review Needed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  const stats = [
    {
      label: 'Avg Consumption',
      value: `${consumer.avg_consumption.toFixed(3)}`,
      unit: 'kWh',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Night/Day Ratio',
      value: consumer.night_day_ratio.toFixed(2),
      icon: Moon,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Weekend Ratio',
      value: consumer.weekend_weekday_ratio.toFixed(2),
      icon: Calendar,
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      label: 'Anomaly Score',
      value: consumer.anomaly_score.toFixed(4),
      icon: AlertTriangle,
      color: consumer.anomaly_score >= 0.75 ? 'from-red-500 to-red-600' : 'from-amber-500 to-amber-600',
    },
  ];

  const displayedAnomalousRecords = showAllRecords
    ? consumer.anomalous_records
    : consumer.anomalous_records?.slice(0, 10);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="modal-content max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-dark-900">
                    {consumer.consumer_id}
                  </h2>
                  <p className="text-dark-500">
                    {consumer.region} • {consumer.consumption_profile}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-4 py-2 rounded-full font-semibold border-2 ${getStatusColor(consumer.status)}`}
                >
                  {consumer.status}
                </span>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-dark-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-dark-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-dark-50 rounded-2xl p-4 text-center"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} mx-auto mb-3 flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-dark-900">
                      {stat.value}
                      {stat.unit && <span className="text-sm font-normal text-dark-400 ml-1">{stat.unit}</span>}
                    </div>
                    <div className="text-xs text-dark-500 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Anomalous Records Section */}
              {consumer.anomalous_records && consumer.anomalous_records.length > 0 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <FileWarning className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-red-800 text-lg">
                        Anomalous Readings
                      </h3>
                      <p className="text-sm text-red-600">
                        {consumer.anomalous_record_count} suspicious out of {consumer.total_records} readings
                      </p>
                    </div>
                  </div>

                  {/* Anomalous Records Table */}
                  <div className="bg-white rounded-xl overflow-hidden border border-red-200">
                    <table className="w-full text-sm">
                      <thead className="bg-red-100">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-red-800">Timestamp</th>
                          <th className="px-4 py-3 text-left font-semibold text-red-800">Consumption</th>
                          <th className="px-4 py-3 text-left font-semibold text-red-800">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedAnomalousRecords?.map((record, index) => (
                          <tr key={index} className="border-t border-red-100 hover:bg-red-50/50">
                            <td className="px-4 py-3 text-dark-700">
                              {record.timestamp
                                ? new Date(record.timestamp).toLocaleString('en-IN', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short'
                                })
                                : 'N/A'
                              }
                            </td>
                            <td className="px-4 py-3 font-mono text-red-700 font-bold">
                              {record.consumption.toFixed(4)} kWh
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                <AlertTriangle className="w-3 h-3" />
                                {record.anomaly_reason}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Show more/less button */}
                    {consumer.anomalous_records.length > 10 && (
                      <button
                        onClick={() => setShowAllRecords(!showAllRecords)}
                        className="w-full py-3 text-center text-sm font-semibold text-red-700 hover:bg-red-50 border-t border-red-200 flex items-center justify-center gap-2"
                      >
                        {showAllRecords ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Show All {consumer.anomalous_records.length} Records
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* AI Explanation */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl p-6 mb-8 border border-primary-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark-900 mb-2 text-lg">
                      AI Analysis
                    </h3>
                    <p className="text-dark-600 leading-relaxed">
                      {consumer.ai_explanation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Consumption Range */}
              <div className="mb-8">
                <h3 className="font-bold text-dark-900 mb-4 text-lg">
                  Consumption Range
                </h3>
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <div className="text-sm text-dark-500">Min</div>
                    <div className="text-lg font-bold text-dark-900">
                      {consumer.min_consumption.toFixed(3)}
                    </div>
                  </div>
                  <div className="flex-1 h-4 bg-dark-100 rounded-full relative overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 rounded-full"
                      style={{
                        width: `${((consumer.avg_consumption - consumer.min_consumption) /
                            (consumer.max_consumption - consumer.min_consumption || 1)) *
                          100
                          }%`,
                      }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-3 border-primary-600 rounded-full shadow-lg"
                      style={{
                        left: `${((consumer.avg_consumption - consumer.min_consumption) /
                            (consumer.max_consumption - consumer.min_consumption || 1)) *
                          100
                          }%`,
                        transform: 'translateX(-50%) translateY(-50%)',
                      }}
                    />
                  </div>
                  <div className="text-center min-w-[60px]">
                    <div className="text-sm text-dark-500">Max</div>
                    <div className="text-lg font-bold text-dark-900">
                      {consumer.max_consumption.toFixed(3)}
                    </div>
                  </div>
                </div>
                <div className="text-center mt-3 text-sm text-dark-500">
                  Average: <strong className="text-dark-700">{consumer.avg_consumption.toFixed(3)} kWh</strong> •
                  Std Dev: <strong className="text-dark-700">{consumer.std_consumption.toFixed(3)}</strong>
                </div>
              </div>

              {/* Time Series Chart */}
              {consumer.timeseries && consumer.timeseries.length > 0 && (
                <div>
                  <h3 className="font-bold text-dark-900 mb-4 text-lg flex items-center gap-2">
                    Consumption History
                    <span className="text-sm font-normal text-dark-400">
                      (Red dots = anomalies)
                    </span>
                  </h3>
                  <ConsumptionTrendChart
                    timeseries={consumer.timeseries}
                    avgConsumption={consumer.avg_consumption}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsumerDetailModal;
