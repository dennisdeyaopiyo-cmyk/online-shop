import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  ExternalLink, 
  Globe, 
  Compass, 
  TrendingUp, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface SearchGroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WebSource {
  title: string;
  uri: string;
}

export const SearchGroundingModal: React.FC<SearchGroundingModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [sources, setSources] = useState<WebSource[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const sampleQueries = [
    'Trending marathon & road running shoes in Kenya for 2025',
    'How do Chelsea boots compare to Oxford brogues for Nairobi office wear?',
    'Best durable hiking boots for Mount Kenya & Aberdare trails',
    'Tips on caring for leather footwear in hot and dusty weather'
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setResultText(null);
    setSources([]);

    try {
      const response = await fetch('/api/gemini/search-grounding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        let message = data.error || 'Failed to search footwear trends';
        try {
          const parsed = JSON.parse(message);
          if (parsed?.error?.message) {
            message = parsed.error.message;
          }
        } catch {
          // not json string
        }
        if (message.toLowerCase().includes('quota') || message.includes('429')) {
          message = 'The AI Grounding service is currently busy or rate-limited. Please try again shortly.';
        }
        throw new Error(message);
      }

      const data = await response.json();
      setResultText(data.text);
      setSources(data.sources || []);
    } catch (err: any) {
      console.error('Search grounding error:', err);
      setError(err.message || 'An error occurred while fetching search-grounded footwear data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-xs border border-emerald-200">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">AI Footwear Intelligence</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Google Search Grounding
                </span>
              </div>
              <p className="text-xs text-slate-500">Live shoe trends, sizing advice & real-time market facts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="p-5 border-b border-slate-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about shoe trends, fits, releases or Kenyan styles..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-all shadow-xs shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Ask AI</span>
                </>
              )}
            </button>
          </form>

          {/* Prompt Suggestions */}
          {!resultText && !loading && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                Popular Questions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {sampleQueries.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(sample);
                      handleSearch(sample);
                    }}
                    className="text-xs text-left bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {loading && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 animate-pulse">
                <Globe className="w-6 h-6 animate-spin" />
              </div>
              <p className="text-sm font-medium text-slate-800">Grounding query with Google Search live data...</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Synthesizing current market trends, shoe reviews, and sizing details using Gemini 2.5 Flash.
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
              <div>
                <p className="font-semibold">Search Grounding Failed</p>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {resultText && !loading && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Live Grounded Answer
                </span>
                <span className="text-xs text-slate-400">Powered by gemini-2.5-flash</span>
              </div>

              {/* Formatted Markdown/Text response */}
              <div className="prose prose-sm prose-slate max-w-none text-slate-800 leading-relaxed whitespace-pre-line text-sm bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                {resultText}
              </div>

              {/* Grounding Web Sources & Links */}
              {sources.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    Verified Google Search Citations ({sources.length}):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-2 p-2.5 rounded-lg border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40 transition-all text-left"
                      >
                        <Globe className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-800 group-hover:text-emerald-700 truncate">
                            {src.title}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {src.uri.replace(/^https?:\/\/(www\.)?/, '')}
                          </p>
                        </div>
                        <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-emerald-600 shrink-0 mt-1" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Results verified with real-time Google Search data</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
