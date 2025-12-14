import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnalysisResult } from '../App';
import UploadPanel from '../components/UploadPanel';
import AnalysisProgress from '../components/AnalysisProgress';
import DashboardSummary from '../components/DashboardSummary';
import AnomalyTable from '../components/AnomalyTable';
import AnomalyDistributionChart from '../components/Charts/AnomalyDistributionChart';
import ConsumerDetailModal from '../components/ConsumerDetailModal';
import RegionMap from '../components/RegionMap';
import { getResults, getZones, downloadReport, ZoneStats, getConsumerDetail, ConsumerDetail, AnalyzeResponse } from '../api/client';
import { Download, FileSpreadsheet, Filter, RefreshCw } from 'lucide-react';
import { saveAs } from 'file-saver';

interface DashboardProps {
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

const Dashboard = ({ analysisResult, setAnalysisResult, isAnalyzing, setIsAnalyzing }: DashboardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [consumers, setConsumers] = useState<AnalysisResult['consumers']>([]);
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; total_pages: number } | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [zones, setZones] = useState<ZoneStats[]>([]);
  const [selectedConsumer, setSelectedConsumer] = useState<ConsumerDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDownloading, setIsDownloading] = useState(false);

  // Simulate analysis progress
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 4) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  // Fetch results when analysis is complete
  useEffect(() => {
    if (analysisResult) {
      fetchResults(1);
      fetchZones();
    }
  }, [analysisResult]);

  const fetchResults = async (page: number) => {
    try {
      const response = await getResults(page, 10, statusFilter !== 'all' ? statusFilter : undefined);
      setConsumers(response.consumers);
      setPagination(response.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch results:', error);
    }
  };

  const fetchZones = async () => {
    try {
      const response = await getZones();
      setZones(response.zones || []);
    } catch (error) {
      console.error('Failed to fetch zones:', error);
    }
  };

  const handleAnalysisComplete = (result: AnalyzeResponse) => {
    // Convert AnalyzeResponse to AnalysisResult
    const analysisRes: AnalysisResult = {
      analysis_id: result.analysis_id,
      summary: result.summary,
      consumers: [], // Will be fetched separately
    };
    setAnalysisResult(analysisRes);
    setIsAnalyzing(false);
    setCurrentStep(0);
  };

  const handleConsumerClick = async (consumerId: string) => {
    try {
      const consumer = await getConsumerDetail(consumerId);
      setSelectedConsumer(consumer);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch consumer details:', error);
    }
  };

  const handleDownloadReport = async (format: 'pdf' | 'excel') => {
    setIsDownloading(true);
    try {
      const blob = await downloadReport(format);
      saveAs(blob, `analysis_report.${format === 'pdf' ? 'pdf' : 'xlsx'}`);
    } catch (error) {
      console.error('Failed to download report:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    fetchResults(1);
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setCurrentStep(0);
  };

  // Show upload panel if no analysis
  if (!analysisResult && !isAnalyzing) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Analysis Dashboard</h1>
            <p className="text-slate-600">Upload your smart meter data to start the analysis</p>
          </div>
          <UploadPanel
            onAnalysisComplete={handleAnalysisComplete}
            onAnalysisStart={() => setIsAnalyzing(true)}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>
    );
  }

  // Show progress
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <AnalysisProgress currentStep={currentStep} />
      </div>
    );
  }

  // Show results
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Analysis Results</h1>
            <p className="text-slate-600">
              Analysis completed • {analysisResult?.summary.total_consumers.toLocaleString()} consumers analyzed
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleNewAnalysis}
              className="inline-flex items-center gap-2 bg-white text-slate-700 font-medium px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              New Analysis
            </button>
            <button
              onClick={() => handleDownloadReport('pdf')}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              PDF Report
            </button>
            <button
              onClick={() => handleDownloadReport('excel')}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel Report
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {analysisResult && (
          <div className="mb-8">
            <DashboardSummary summary={analysisResult.summary} />
          </div>
        )}

        {/* Charts and Map Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <AnomalyDistributionChart consumers={consumers} />
          <RegionMap zones={zones} />
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-slate-600">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filter by Status:</span>
            </div>
            {['all', 'High Risk', 'Suspicious', 'Review Needed', 'Normal'].map((status) => (
              <button
                key={status}
                onClick={() => handleFilterChange(status)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status === 'all' ? 'All' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Consumers Table */}
        <AnomalyTable
          consumers={consumers}
          onConsumerClick={handleConsumerClick}
          pagination={pagination}
          onPageChange={(page) => fetchResults(page)}
          currentPage={currentPage}
        />

        {/* Consumer Detail Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <ConsumerDetailModal
              consumer={selectedConsumer}
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedConsumer(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
