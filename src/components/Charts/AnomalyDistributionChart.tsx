import { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface ScoreDistribution {
    range: string;
    count: number;
    percentage: number;
}

interface AnomalyDistributionChartProps {
    consumers: { anomaly_score: number }[];
}

const AnomalyDistributionChart = ({ consumers }: AnomalyDistributionChartProps) => {
    const distribution = useMemo(() => {
        const ranges = [
            { range: '0.0-0.2', min: 0, max: 0.2 },
            { range: '0.2-0.4', min: 0.2, max: 0.4 },
            { range: '0.4-0.6', min: 0.4, max: 0.6 },
            { range: '0.6-0.8', min: 0.6, max: 0.8 },
            { range: '0.8-1.0', min: 0.8, max: 1.0 },
        ];

        const total = consumers.length;

        return ranges.map((r) => {
            const count = consumers.filter(
                (c) => c.anomaly_score >= r.min && c.anomaly_score < (r.max === 1.0 ? 1.01 : r.max)
            ).length;
            return {
                range: r.range,
                count,
                percentage: total > 0 ? (count / total) * 100 : 0,
            };
        });
    }, [consumers]);

    const getBarColor = (range: string) => {
        switch (range) {
            case '0.0-0.2':
                return '#10b981'; // emerald
            case '0.2-0.4':
                return '#22c55e'; // green
            case '0.4-0.6':
                return '#fbbf24'; // amber
            case '0.6-0.8':
                return '#f97316'; // orange
            case '0.8-1.0':
                return '#ef4444'; // red
            default:
                return '#6b7280';
        }
    };

    const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; payload: ScoreDistribution }>; label?: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white shadow-lg rounded-xl p-4 border border-dark-100">
                    <p className="font-bold text-dark-900 mb-1">Score: {label}</p>
                    <p className="text-dark-600">
                        <span className="font-semibold">{payload[0].value}</span> consumers
                    </p>
                    <p className="text-sm text-dark-400">
                        {payload[0].payload.percentage.toFixed(1)}% of total
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-dark-900 text-lg">Score Distribution</h3>
                    <p className="text-sm text-dark-500">Anomaly scores by range</p>
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={distribution}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis
                            dataKey="range"
                            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                            axisLine={{ stroke: '#e2e8f0' }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            axisLine={{ stroke: '#e2e8f0' }}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                            dataKey="count" 
                            radius={[8, 8, 0, 0]}
                            maxBarSize={60}
                        >
                            {distribution.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getBarColor(entry.range)}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-dark-100 flex-wrap">
                {[
                    { color: 'bg-emerald-500', label: 'Normal' },
                    { color: 'bg-amber-500', label: 'Watch' },
                    { color: 'bg-red-500', label: 'High Risk' },
                ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-xs text-dark-500 font-medium">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnomalyDistributionChart;
