import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { ZoneStats } from '../api/client';

interface RegionMapProps {
  zones: ZoneStats[];
}

const RegionMap = ({ zones }: RegionMapProps) => {
  const getZoneGradient = (anomalyRate: number) => {
    if (anomalyRate >= 0.1) return 'from-red-500 to-red-600';
    if (anomalyRate >= 0.05) return 'from-amber-500 to-amber-600';
    if (anomalyRate >= 0.02) return 'from-yellow-400 to-yellow-500';
    return 'from-emerald-500 to-emerald-600';
  };

  const getZoneBg = (anomalyRate: number) => {
    if (anomalyRate >= 0.1) return 'bg-red-50 border-red-200 hover:border-red-300';
    if (anomalyRate >= 0.05) return 'bg-amber-50 border-amber-200 hover:border-amber-300';
    if (anomalyRate >= 0.02) return 'bg-yellow-50 border-yellow-200 hover:border-yellow-300';
    return 'bg-emerald-50 border-emerald-200 hover:border-emerald-300';
  };

  const getZoneTextColor = (anomalyRate: number) => {
    if (anomalyRate >= 0.1) return 'text-red-700';
    if (anomalyRate >= 0.05) return 'text-amber-700';
    if (anomalyRate >= 0.02) return 'text-yellow-700';
    return 'text-emerald-700';
  };

  const maxAnomalyRate = Math.max(...zones.map((z) => z.anomaly_rate), 0.1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Zone Analysis</h3>
          <p className="text-sm text-slate-500">{zones.length} zones monitored</p>
        </div>
      </div>

      {zones.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No zone data available
        </div>
      ) : (
        <>
          {/* Zone Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {zones.map((zone, index) => (
              <motion.div
                key={zone.zone}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${getZoneBg(zone.anomaly_rate)}`}
              >
                {/* Zone indicator dot */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${getZoneGradient(zone.anomaly_rate)} shadow-sm`} />
                  <span className="font-bold text-slate-900 text-sm">{zone.zone}</span>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Anomalies</span>
                    <span className={`text-lg font-bold ${getZoneTextColor(zone.anomaly_rate)}`}>
                      {zone.anomaly_count}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Rate</span>
                    <span className={`text-sm font-semibold ${getZoneTextColor(zone.anomaly_rate)}`}>
                      {(zone.anomaly_rate * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Intensity bar */}
                <div className="mt-3 h-1.5 bg-white/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(zone.anomaly_rate / maxAnomalyRate) * 100}%` }}
                    transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                    className={`h-full rounded-full bg-gradient-to-r ${getZoneGradient(zone.anomaly_rate)}`}
                  />
                </div>

                {/* Consumer count badge */}
                <div className="absolute top-2 right-2">
                  <span className="text-xs text-slate-400 font-medium">
                    {zone.consumer_count}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-100 flex-wrap">
            {[
              { gradient: 'from-emerald-500 to-emerald-600', label: 'Low (<2%)' },
              { gradient: 'from-yellow-400 to-yellow-500', label: 'Medium (2-5%)' },
              { gradient: 'from-amber-500 to-amber-600', label: 'High (5-10%)' },
              { gradient: 'from-red-500 to-red-600', label: 'Critical (>10%)' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${item.gradient}`} />
                <span className="text-xs text-slate-500 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RegionMap;
