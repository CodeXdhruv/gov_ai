import { useMemo } from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Area,
    ComposedChart,
    Scatter,
} from 'recharts';

interface TimeseriesPoint {
    timestamp: string;
    consumption: number;
    is_anomalous?: boolean;
    anomaly_reason?: string | null;
}

interface ConsumptionTrendChartProps {
    timeseries: TimeseriesPoint[];
    avgConsumption: number;
}

const ConsumptionTrendChart = ({ timeseries, avgConsumption }: ConsumptionTrendChartProps) => {
    const { chartData, anomalyData } = useMemo(() => {
        const threshold = avgConsumption * 2;
        const lowThreshold = avgConsumption * 0.1;

        const chartData = timeseries.map((point, index) => {
            const date = point.timestamp ? new Date(point.timestamp) : null;
            // Use the backend-provided is_anomalous if available, otherwise calculate
            const isAnomaly = point.is_anomalous ?? (
                point.consumption > threshold || point.consumption < lowThreshold
            );
            
            return {
                index,
                time: date?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) || `Point ${index}`,
                date: date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || '',
                consumption: point.consumption,
                isAnomaly,
                anomalyReason: point.anomaly_reason || null,
                // For scatter plot - only show anomalous points
                anomalyPoint: isAnomaly ? point.consumption : null,
            };
        });

        // Separate anomaly data for scatter plot
        const anomalyData = chartData.filter(d => d.isAnomaly);

        return { chartData, anomalyData };
    }, [timeseries, avgConsumption]);

    const CustomTooltip = ({ active, payload }: {
        active?: boolean;
        payload?: Array<{ payload: { 
            date: string; 
            time: string; 
            consumption: number; 
            isAnomaly: boolean;
            anomalyReason: string | null;
        } }>
    }) => {
        if (active && payload && payload.length) {
            const point = payload[0].payload;
            return (
                <div className={`shadow-lg rounded-lg p-3 border ${
                    point.isAnomaly 
                        ? 'bg-red-50 border-red-300' 
                        : 'bg-white border-slate-200'
                }`}>
                    <p className="text-sm text-slate-500">{point.date} {point.time}</p>
                    <p className={`font-semibold ${point.isAnomaly ? 'text-red-700' : 'text-navy-900'}`}>
                        {point.consumption.toFixed(4)} kWh
                    </p>
                    {point.isAnomaly && (
                        <div className="mt-1 pt-1 border-t border-red-200">
                            <p className="text-sm text-red-600 font-medium">
                                ⚠️ Anomalous Reading
                            </p>
                            {point.anomalyReason && (
                                <p className="text-xs text-red-500 mt-1">
                                    {point.anomalyReason}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    // Custom dot component to highlight anomalies
    const CustomDot = (props: { cx: number; cy: number; payload: { isAnomaly: boolean } }) => {
        const { cx, cy, payload } = props;
        if (!payload.isAnomaly) return null;
        
        return (
            <circle
                cx={cx}
                cy={cy}
                r={6}
                fill="#dc2626"
                stroke="#fff"
                strokeWidth={2}
            />
        );
    };

    return (
        <div className="bg-slate-50 rounded-xl p-4">
            {/* Anomaly Count Badge */}
            {anomalyData.length > 0 && (
                <div className="mb-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                        {anomalyData.length} anomalous readings highlighted
                    </span>
                </div>
            )}
            
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            axisLine={{ stroke: '#e2e8f0' }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            axisLine={{ stroke: '#e2e8f0' }}
                            tickFormatter={(value) => value.toFixed(2)}
                        />
                        <Tooltip content={<CustomTooltip />} />

                        {/* Average line */}
                        <ReferenceLine
                            y={avgConsumption}
                            stroke="#10b981"
                            strokeDasharray="5 5"
                            label={{
                                value: 'Avg',
                                position: 'right',
                                fill: '#10b981',
                                fontSize: 10,
                            }}
                        />

                        {/* High threshold line */}
                        <ReferenceLine
                            y={avgConsumption * 2}
                            stroke="#dc2626"
                            strokeDasharray="3 3"
                            label={{
                                value: 'High',
                                position: 'right',
                                fill: '#dc2626',
                                fontSize: 10,
                            }}
                        />

                        {/* Low threshold line */}
                        <ReferenceLine
                            y={avgConsumption * 0.1}
                            stroke="#f59e0b"
                            strokeDasharray="3 3"
                            label={{
                                value: 'Low',
                                position: 'right',
                                fill: '#f59e0b',
                                fontSize: 10,
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="consumption"
                            stroke="#1e3a5f"
                            strokeWidth={2}
                            fill="url(#consumptionGradient)"
                            dot={<CustomDot cx={0} cy={0} payload={{ isAnomaly: false }} />}
                            activeDot={{
                                r: 6,
                                stroke: '#1e3a5f',
                                strokeWidth: 2,
                                fill: '#fff',
                            }}
                        />

                        {/* Scatter plot for anomaly points - red dots */}
                        <Scatter
                            dataKey="anomalyPoint"
                            fill="#dc2626"
                            shape="circle"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-200 flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-navy-900" />
                    <span className="text-xs text-slate-600">Consumption</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-xs text-slate-600">Anomaly</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-green-500" style={{ borderStyle: 'dashed' }} />
                    <span className="text-xs text-slate-600">Average</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-red-500" style={{ borderStyle: 'dashed' }} />
                    <span className="text-xs text-slate-600">High Threshold</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-amber-500" style={{ borderStyle: 'dashed' }} />
                    <span className="text-xs text-slate-600">Low Threshold</span>
                </div>
            </div>
        </div>
    );
};

export default ConsumptionTrendChart;
