import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, AlertTriangle, Eye } from 'lucide-react';
import { Consumer } from '../App';

interface AnomalyTableProps {
  consumers: Consumer[];
  onConsumerClick: (consumerId: string) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  onPageChange?: (page: number) => void;
  currentPage: number;
}

const AnomalyTable = ({
  consumers,
  onConsumerClick,
  pagination,
  onPageChange,
  currentPage,
}: AnomalyTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'High Risk':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
            <AlertTriangle className="w-3 h-3" />
            High Risk
          </span>
        );
      case 'Suspicious':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">Suspicious</span>;
      case 'Review Needed':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Review Needed</span>;
      default:
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">Normal</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-red-600';
    if (score >= 0.75) return 'text-amber-600';
    if (score >= 0.5) return 'text-blue-600';
    return 'text-emerald-600';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 0.9) return 'bg-red-500';
    if (score >= 0.75) return 'bg-amber-500';
    if (score >= 0.5) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-bold text-slate-900">Flagged Consumers</h3>
        {pagination && (
          <p className="text-sm text-slate-500 mt-1">
            Showing {consumers.length} of {pagination.total.toLocaleString()} consumers
          </p>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Consumer ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Region</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Avg. Usage</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Anomaly Score</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {consumers.map((consumer, index) => (
              <motion.tr
                key={consumer.consumer_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => onConsumerClick(consumer.consumer_id)}
              >
                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-900">{consumer.consumer_id}</span>
                </td>
                <td className="px-6 py-4 text-slate-600">{consumer.region}</td>
                <td className="px-6 py-4">
                  <span className="font-mono text-slate-700">{consumer.avg_consumption.toFixed(3)}</span>
                  <span className="text-slate-400 text-xs ml-1">kWh</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getScoreBarColor(consumer.anomaly_score)} rounded-full`}
                        style={{ width: `${consumer.anomaly_score * 100}%` }}
                      />
                    </div>
                    <span className={`text-sm font-semibold ${getScoreColor(consumer.anomaly_score)}`}>
                      {consumer.anomaly_score.toFixed(3)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(consumer.status)}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onConsumerClick(consumer.consumer_id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <div className="text-sm text-slate-600">
            Page <span className="font-semibold">{currentPage}</span> of{' '}
            <span className="font-semibold">{pagination.total_pages}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            {/* Page numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                let pageNum;
                if (pagination.total_pages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pagination.total_pages - 2) {
                  pageNum = pagination.total_pages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange?.(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= pagination.total_pages}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnomalyTable;
