import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus, Plus } from 'lucide-react';
import { formatDate, formatOdds } from '@/utils/formatting';

interface Prediction {
  id: string;
  match: {
    homeTeam: string;
    awayTeam: string;
    startTime: string;
  };
  predictedOutcome: string;
  confidence: number;
  adminNote?: string;
  odds: number;
}

interface PredictionsPageProps {
  predictions: Prediction[];
  onAddToSlip: (prediction: Prediction) => void;
}

const PredictionsPage: React.FC<PredictionsPageProps> = ({ predictions, onAddToSlip }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'bg-green-500';
    if (confidence >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 70) return <TrendingUp size={16} className="text-green-600" />;
    if (confidence >= 40) return <Minus size={16} className="text-amber-600" />;
    return <TrendingDown size={16} className="text-red-600" />;
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">AI Predictions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {predictions.map((prediction) => (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            {/* Match Info */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {prediction.match.homeTeam} vs {prediction.match.awayTeam}
                </h3>
                <p className="text-sm text-gray-500">{formatDate(prediction.match.startTime)}</p>
              </div>
              <Trophy size={20} className="text-amber-500" />
            </div>

            {/* Predicted Outcome */}
            <div className="mb-3">
              <p className="text-sm text-gray-600">Predicted Outcome</p>
              <p className="text-lg font-bold text-gray-900">{prediction.predictedOutcome}</p>
            </div>

            {/* Confidence Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Confidence</span>
                <div className="flex items-center gap-1">
                  {getConfidenceIcon(prediction.confidence)}
                  <span className="text-sm font-medium">{prediction.confidence}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${getConfidenceColor(prediction.confidence)} h-2 rounded-full transition-all`}
                  style={{ width: `${prediction.confidence}%` }}
                />
              </div>
            </div>

            {/* Admin Note */}
            {prediction.adminNote && (
              <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">{prediction.adminNote}</p>
              </div>
            )}

            {/* Odds and Add to Slip */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xl font-bold text-green-700">{formatOdds(prediction.odds)}</span>
              <button
                onClick={() => onAddToSlip(prediction)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus size={16} />
                Add to Slip
              </button>
            </div>
          </motion.div>
        ))}

        {!predictions.length && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No predictions available yet
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionsPage;
