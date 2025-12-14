import { motion } from 'framer-motion';
import { Users, AlertTriangle, TrendingUp, MapPin } from 'lucide-react';
import { Summary } from '../App';

interface DashboardSummaryProps {
    summary: Summary;
}

const DashboardSummary = ({ summary }: DashboardSummaryProps) => {
    const stats = [
        {
            label: 'Total Consumers',
            value: summary.total_consumers.toLocaleString(),
            icon: Users,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-100',
        },
        {
            label: 'Anomalies Detected',
            value: summary.anomalies_detected.toString(),
            icon: AlertTriangle,
            bgColor: 'bg-red-50',
            iconColor: 'text-red-600',
            borderColor: 'border-red-100',
            subtext: `${((summary.anomalies_detected / summary.total_consumers) * 100).toFixed(1)}% of total`,
        },
        {
            label: 'Avg Anomaly Score',
            value: summary.avg_anomaly_score.toFixed(3),
            icon: TrendingUp,
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600',
            borderColor: 'border-amber-100',
        },
        {
            label: 'High-Risk Zones',
            value: summary.high_risk_zones.length.toString(),
            icon: MapPin,
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            borderColor: 'border-emerald-100',
            subtext: summary.high_risk_zones.slice(0, 2).join(', ') || 'None',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${stat.bgColor} rounded-xl p-5 border ${stat.borderColor}`}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
                            <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                        </div>
                    </div>

                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-600 font-medium">{stat.label}</div>

                    {stat.subtext && (
                        <div className="mt-2 text-xs text-slate-500">{stat.subtext}</div>
                    )}
                </motion.div>
            ))}
        </div>
    );
};

export default DashboardSummary;
