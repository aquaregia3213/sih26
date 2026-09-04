import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { soundSynth } from '../../utils/audioSynth';
import { vanikaStorage } from '../../utils/storage';
import { CognitiveDataPoint } from '../../types';

export const CognitiveTrendCharts: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7day' | '30day'>('7day');
  const [activeMetric, setActiveMetric] = useState<'cognitive' | 'activity'>('cognitive');
  const [historyData, setHistoryData] = useState<CognitiveDataPoint[]>([]);

  useEffect(() => {
    try {
      const history = vanikaStorage.getCognitiveHistory();
      setHistoryData(Array.isArray(history) ? history : []);
    } catch (err) {
      console.warn('[CognitiveTrendCharts] Notice loading history:', err);
      setHistoryData([]);
    }
  }, []);

  const safeHistory = Array.isArray(historyData) ? historyData : [];
  const data = timeframe === '7day' ? safeHistory.slice(-7) : safeHistory;


  return (
    <div className="bg-[#FDFBF7] border-2 border-[#315C4C]/20 rounded-3xl p-6 sm:p-7 shadow-sm text-[#24332E]">
      {/* Chart Top Header & Timeframe Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-[#315C4C]/15 gap-3">
        <div>
          <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#24483C]">
            Cognitive & Wellness Trends
          </h3>
          <p className="text-xs sm:text-sm text-[#4A5B55]">
            Composite indices derived from game responses, reaction cadence & emotion logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Metric Selector */}
          <div className="flex items-center gap-1 bg-[#EDE5D2] p-1 rounded-xl">
            <button
              onClick={() => {
                soundSynth.playSoftClick();
                setActiveMetric('cognitive');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMetric === 'cognitive'
                  ? 'bg-[#315C4C] text-white shadow-xs'
                  : 'text-[#4A5B55] hover:bg-[#F8F4EA]'
              }`}
            >
              Scores
            </button>
            <button
              onClick={() => {
                soundSynth.playSoftClick();
                setActiveMetric('activity');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMetric === 'activity'
                  ? 'bg-[#315C4C] text-white shadow-xs'
                  : 'text-[#4A5B55] hover:bg-[#F8F4EA]'
              }`}
            >
              Minutes Active
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 bg-[#EDE5D2] p-1 rounded-xl">
            <button
              onClick={() => {
                soundSynth.playSoftClick();
                setTimeframe('7day');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeframe === '7day'
                  ? 'bg-[#D9A441] text-[#24483C] shadow-xs'
                  : 'text-[#4A5B55] hover:bg-[#F8F4EA]'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => {
                soundSynth.playSoftClick();
                setTimeframe('30day');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeframe === '30day'
                  ? 'bg-[#D9A441] text-[#24483C] shadow-xs'
                  : 'text-[#4A5B55] hover:bg-[#F8F4EA]'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-72 sm:h-80">
        {activeMetric === 'cognitive' ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE5D2" />
              <XAxis dataKey="dayName" stroke="#4A5B55" fontSize={12} tickLine={false} />
              <YAxis domain={[50, 100]} stroke="#4A5B55" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FDFBF7',
                  borderColor: '#315C4C',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="memoryScore"
                name="Memory Score"
                stroke="#C87552"
                strokeWidth={3}
                dot={{ r: 4, fill: '#C87552' }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="attentionScore"
                name="Attention Score"
                stroke="#315C4C"
                strokeWidth={3}
                dot={{ r: 4, fill: '#315C4C' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE5D2" />
              <XAxis dataKey="dayName" stroke="#4A5B55" fontSize={12} tickLine={false} />
              <YAxis stroke="#4A5B55" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FDFBF7',
                  borderColor: '#315C4C',
                  borderRadius: '12px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="minutesActive" name="Active Engagement (Mins)" fill="#7EA9A5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Chart Footnote Explanation */}
      <div className="mt-4 pt-3 border-t border-[#315C4C]/10 flex items-center justify-between text-xs text-[#4A5B55] flex-wrap gap-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C87552]" />
          Memory Baseline: Steady with positive upturn today (82)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#315C4C]" />
          Attention Index: 76 (Above monthly average)
        </span>
      </div>
    </div>
  );
};
