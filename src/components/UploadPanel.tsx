import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, Settings, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { uploadFile, analyzeData, UploadResponse, AnalyzeResponse } from '../api/client';

interface UploadPanelProps {
  onAnalysisComplete: (result: AnalyzeResponse) => void;
  onAnalysisStart: () => void;
  isAnalyzing: boolean;
}

const UploadPanel = ({ onAnalysisComplete, onAnalysisStart, isAnalyzing }: UploadPanelProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Analysis settings
  const [contamination, setContamination] = useState(0.05);
  const [useAutoencoder, setUseAutoencoder] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      handleFileSelect(droppedFile);
    } else {
      setError('Please upload a CSV file');
    }
  }, []);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setIsUploading(true);

    try {
      const result = await uploadFile(selectedFile);
      setUploadResult(result);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    onAnalysisStart();
    setError(null);

    try {
      const result = await analyzeData({
        contamination,
        use_autoencoder: useAutoencoder,
      });
      onAnalysisComplete(result);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadResult(null);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
            <Upload className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Upload Smart Meter Data</h2>
            <p className="text-slate-500 mt-1">
              Upload a CSV file with electricity consumption data
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Upload Zone */}
        {!uploadResult ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer group
              ${isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <motion.div
              animate={{ scale: isDragging ? 1.05 : 1 }}
              className="flex flex-col items-center"
            >
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-colors ${
                isDragging 
                  ? 'bg-blue-100' 
                  : 'bg-slate-100 group-hover:bg-blue-100'
              }`}>
                {isUploading ? (
                  <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                ) : (
                  <Upload className={`w-10 h-10 ${isDragging ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`} />
                )}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {isDragging ? 'Drop file here' : 'Drag & drop your CSV file'}
              </h3>
              <p className="text-slate-500 mb-4">
                or <span className="text-blue-600 font-semibold">browse files</span>
              </p>
              <p className="text-sm text-slate-400">
                Supports: .csv files up to 50MB
              </p>
            </motion.div>
          </div>
        ) : (
          <>
            {/* File Preview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl mb-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-slate-900">{file?.name}</span>
                    </div>
                    <div className="flex gap-4 mt-1 text-sm text-slate-500">
                      <span><strong>{uploadResult.rows.toLocaleString()}</strong> rows</span>
                      <span><strong>{uploadResult.columns.length}</strong> columns</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={clearFile}
                  className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </motion.div>

            {/* Settings */}
            <div className="border border-slate-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-5">
                <Settings className="w-5 h-5 text-slate-500" />
                <h3 className="font-semibold text-slate-900">Analysis Settings</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Contamination */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Expected Anomaly Rate
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {(contamination * 100).toFixed(0)}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0.01"
                    max="0.2"
                    step="0.01"
                    value={contamination}
                    onChange={(e) => setContamination(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Percentage of consumers expected to have anomalies
                  </p>
                </div>

                {/* Autoencoder */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Model Selection
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setUseAutoencoder(false)}
                      className={`flex-1 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        !useAutoencoder
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      Isolation Forest
                    </button>
                    <button
                      onClick={() => setUseAutoencoder(true)}
                      className={`flex-1 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        useAutoencoder
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      + Autoencoder
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Analyze Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-5 rounded-xl text-lg shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-6 h-6 border-4 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                  Analyzing Data...
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  Run AI Analysis
                </>
              )}
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadPanel;
