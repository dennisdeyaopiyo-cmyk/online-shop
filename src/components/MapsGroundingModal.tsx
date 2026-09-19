import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Sparkles, 
  ExternalLink, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Truck,
  LocateFixed
} from 'lucide-react';

interface MapsGroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MapSource {
  title: string;
  uri: string;
}

export const MapsGroundingModal: React.FC<MapsGroundingModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [mapsSources, setMapsSources] = useState<MapSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [selectedTown, setSelectedTown] = useState('Nairobi CBD');

  if (!isOpen) return null;

  const quickHubQueries = [
    {
      title: 'Nairobi CBD Courier Hubs',
      prompt: 'Find major courier parcel offices (G4S Kenya, Fargo Courier, Wells Fargo) and footwear fitting spots in Nairobi CBD',
      location: { latitude: -1.286389, longitude: 36.817223 }
    },
    {
      title: 'Westlands Pickup Points',
      prompt: 'Locate shoe boutiques, parcel delivery depots, and Safaricom M-Pesa centers in Westlands, Nairobi',
      location: { latitude: -1.2673, longitude: 36.8072 }
    },
    {
      title: 'Mombasa Parcel Centers',
      prompt: 'Find courier collection stations and footwear shops along Moi Avenue and Digo Road in Mombasa',
      location: { latitude: -4.0435, longitude: 39.6682 }
    },
    {
      title: 'Kisumu City Drop-Offs',
      prompt: 'Locate courier parcel pickup stations (Easy Coach, G4S, Wells Fargo) in Kisumu City Center',
      location: { latitude: -0.0917, longitude: 34.7680 }
    },
    {
      title: 'Nakuru Town Depot',
      prompt: 'Find parcel courier delivery offices and shoe retail shops in Nakuru Town Center',
      location: { latitude: -0.3031, longitude: 36.0800 }
    }
  ];

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
        setLocatingUser(false);
        setPrompt('Find nearest footwear shops, shoe repair craftsmen, and parcel courier depots near my current location');
      },
      (err) => {
        console.warn('Geolocation failed:', err.message);
        setLocatingUser(false);
        // Fallback default: Nairobi
        setUserLocation({ latitude: -1.286389, longitude: 36.817223 });
      },
      { timeout: 8000 }
    );
  };

  const handleSearch = async (searchPrompt: string, locationOverride?: { latitude: number; longitude: number }) => {
    if (!searchPrompt.trim()) return;
    setLoading(true);
    setError(null);
    setResultText(null);
    setMapsSources([]);

    const loc = locationOverride || userLocation || { latitude: -1.286389, longitude: 36.817223 };

    try {
      const response = await fetch('/api/gemini/maps-grounding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: searchPrompt,
          location: loc
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        let message = data.error || 'Failed to locate delivery points';
        try {
          const parsed = JSON.parse(message);
          if (parsed?.error?.message) {
            message = parsed.error.message;
          }
        } catch {
          // not JSON
        }
        if (message.toLowerCase().includes('quota') || message.includes('429')) {
          message = 'The Maps service is temporarily rate-limited. Please try again shortly.';
        }
        throw new Error(message);
      }

      const data = await response.json();
      setResultText(data.text);
      setMapsSources(data.mapsSources || []);
    } catch (err: any) {
      console.error('Maps grounding error:', err);
      setError(err.message || 'An error occurred while finding locations on Google Maps.');
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
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">Delivery Hub & Store Locator</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Google Maps Grounding
                </span>
              </div>
              <p className="text-xs text-slate-500">Live parcel stations, Safaricom M-Pesa agents & shoe boutiques across Kenya</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Controls */}
        <div className="p-5 border-b border-slate-100 bg-white space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(prompt);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. G4S courier pickup stations near Westlands or Nairobi CBD..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
              />
            </div>
            <button
              type="button"
              onClick={detectLocation}
              disabled={locatingUser}
              title="Use current GPS location"
              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center gap-1.5 text-xs font-semibold border border-slate-200 transition-colors shrink-0"
            >
              {locatingUser ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              ) : (
                <LocateFixed className={`w-4 h-4 ${userLocation ? 'text-emerald-600' : 'text-slate-500'}`} />
              )}
              <span className="hidden sm:inline">GPS</span>
            </button>
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-all shadow-xs shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  <span>Find on Maps</span>
                </>
              )}
            </button>
          </form>

          {/* Preset Location Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap shrink-0 flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              Popular Hubs:
            </span>
            {quickHubQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(item.prompt);
                  setSelectedTown(item.title);
                  handleSearch(item.prompt, item.location);
                }}
                className="text-xs whitespace-nowrap bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors shrink-0"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {loading && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 animate-pulse">
                <MapPin className="w-6 h-6 animate-bounce" />
              </div>
              <p className="text-sm font-medium text-slate-800">Querying Google Maps live location data...</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Grounding physical addresses, parcel depots, and coordinates using Gemini 2.5 Flash and Google Maps.
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
              <div>
                <p className="font-semibold">Maps Grounding Error</p>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {resultText && !loading && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Live Location & Logistics Overview
                </span>
                <span className="text-xs text-slate-400">gemini-2.5-flash with googleMaps</span>
              </div>

              {/* Formatted Markdown text response */}
              <div className="prose prose-sm prose-slate max-w-none text-slate-800 leading-relaxed whitespace-pre-line text-sm bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                {resultText}
              </div>

              {/* Direct Clickable Google Maps Place Links */}
              {mapsSources.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Google Maps Locations ({mapsSources.length}):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {mapsSources.map((map, idx) => (
                      <a
                        key={idx}
                        href={map.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 transition-all text-left shadow-xs"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 line-clamp-1">
                            {map.title}
                          </p>
                          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                            <span>Open in Google Maps</span>
                            <ExternalLink className="w-3 h-3" />
                          </p>
                        </div>
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
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            Reliable courier collection points across Kenya
          </span>
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
