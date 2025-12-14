import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Database, Cpu, BarChart3, Sparkles } from 'lucide-react';

interface AnalysisProgressProps {
  currentStep: number;
}

const AnalysisProgress = ({ currentStep = 0 }: AnalysisProgressProps) => {
  const steps = [
    { 
      id: 1, 
      name: 'Data Cleaning', 
      description: 'Validating and preprocessing data',
      icon: Database 
    },
    { 
      id: 2, 
      name: 'Feature Extraction', 
      description: 'Extracting consumption patterns',
      icon: Cpu 
    },
    { 
      id: 3, 
      name: 'ML Analysis', 
      description: 'Running anomaly detection models',
      icon: BarChart3 
    },
    { 
      id: 4, 
      name: 'Generating Results', 
      description: 'Preparing insights and reports',
      icon: Sparkles 
    },
  ];

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="card">
        <div className="text-center mb-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg"
          >
            <Loader2 className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-dark-900 mb-2">Analyzing Your Data</h2>
          <p className="text-dark-500">Our AI is processing your smart meter data</p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isPending = currentStep < step.id;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  isCurrent ? 'bg-primary-50 border-2 border-primary-200' : 'bg-dark-50'
                }`}
              >
                {/* Status Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isCompleted 
                    ? 'bg-emerald-500' 
                    : isCurrent 
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                      : 'bg-dark-200'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : isCurrent ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <step.icon className="w-6 h-6 text-white" />
                    </motion.div>
                  ) : (
                    <step.icon className="w-6 h-6 text-dark-400" />
                  )}
                </div>

                {/* Step Info */}
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    isCompleted 
                      ? 'text-emerald-700' 
                      : isCurrent 
                        ? 'text-primary-700'
                        : 'text-dark-400'
                  }`}>
                    {step.name}
                  </h3>
                  <p className={`text-sm ${
                    isPending ? 'text-dark-300' : 'text-dark-500'
                  }`}>
                    {step.description}
                  </p>
                </div>

                {/* Status Badge */}
                {isCompleted && (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
                    Complete
                  </span>
                )}
                {isCurrent && (
                  <span className="text-xs font-semibold text-primary-600 bg-primary-100 px-2.5 py-1 rounded-full">
                    In Progress
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-dark-500">Progress</span>
            <span className="font-semibold text-primary-600">{Math.min(currentStep * 25, 100)}%</span>
          </div>
          <div className="h-3 bg-dark-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(currentStep * 25, 100)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisProgress;
