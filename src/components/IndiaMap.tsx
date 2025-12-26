import { useMemo, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { indiaStatesGeoJSON, INDIA_CENTER, INDIA_BOUNDS } from '../data/indiaGeoJSON';
import type { StateFeature } from '../data/indiaGeoJSON';

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export interface StateData {
  stateCode: string;
  stateName?: string;
  anomalyRate: number;
  anomalyCount: number;
  consumerCount: number;
  avgScore?: number;
}

interface IndiaMapProps {
  stateData: StateData[];
  onStateClick?: (stateCode: string) => void;
  height?: string;
}

// Color scale based on anomaly rate
const getColor = (anomalyRate: number): string => {
  if (anomalyRate >= 0.15) return '#991B1B'; // Very high - dark red
  if (anomalyRate >= 0.10) return '#DC2626'; // High - red
  if (anomalyRate >= 0.07) return '#EA580C'; // Medium-high - orange
  if (anomalyRate >= 0.05) return '#F59E0B'; // Medium - amber
  if (anomalyRate >= 0.03) return '#FBBF24'; // Low-medium - yellow
  if (anomalyRate >= 0.01) return '#84CC16'; // Low - lime
  return '#22C55E'; // Very low - green
};

// Get opacity based on consumer count
const getOpacity = (consumerCount: number, maxConsumers: number): number => {
  const minOpacity = 0.5;
  const maxOpacity = 0.9;
  return minOpacity + (consumerCount / maxConsumers) * (maxOpacity - minOpacity);
};

const IndiaMap = ({ stateData, onStateClick, height = '400px' }: IndiaMapProps) => {
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  // Create a map of state code to data for quick lookup
  const stateDataMap = useMemo(() => {
    const map: Record<string, StateData> = {};
    stateData.forEach(data => {
      map[data.stateCode.toUpperCase()] = data;
    });
    return map;
  }, [stateData]);

  const maxConsumers = useMemo(() => {
    return Math.max(...stateData.map(d => d.consumerCount), 1);
  }, [stateData]);

  // Style function for each state
  const getStyle = (feature: StateFeature | undefined) => {
    if (!feature?.properties?.code) {
      return {
        fillColor: '#E5E7EB',
        weight: 1,
        opacity: 1,
        color: '#9CA3AF',
        fillOpacity: 0.3
      };
    }

    const data = stateDataMap[feature.properties.code.toUpperCase()];
    
    if (!data) {
      return {
        fillColor: '#E5E7EB',
        weight: 1,
        opacity: 1,
        color: '#6B7280',
        fillOpacity: 0.3
      };
    }

    return {
      fillColor: getColor(data.anomalyRate),
      weight: 2,
      opacity: 1,
      color: '#374151',
      fillOpacity: getOpacity(data.consumerCount, maxConsumers)
    };
  };

  // Event handlers for each feature
  const onEachFeature = (feature: StateFeature, layer: L.Layer) => {
    const data = stateDataMap[feature.properties.code?.toUpperCase()];
    
    // Add tooltip
    const tooltipContent = data
      ? `<div class="font-sans text-sm">
          <div class="font-bold text-gray-900">${feature.properties.name}</div>
          <div class="mt-1 space-y-0.5">
            <div>Consumers: <span class="font-semibold">${data.consumerCount.toLocaleString()}</span></div>
            <div>Anomalies: <span class="font-semibold text-red-600">${data.anomalyCount}</span></div>
            <div>Rate: <span class="font-semibold">${(data.anomalyRate * 100).toFixed(1)}%</span></div>
          </div>
        </div>`
      : `<div class="font-sans text-sm">
          <div class="font-bold text-gray-900">${feature.properties.name}</div>
          <div class="text-gray-500">No data available</div>
        </div>`;

    layer.bindTooltip(tooltipContent, {
      permanent: false,
      direction: 'auto',
      className: 'bg-white rounded-lg shadow-lg border-0 px-3 py-2'
    });

    // Add click handler
    layer.on({
      click: () => {
        if (onStateClick && data) {
          onStateClick(feature.properties.code);
        }
      },
      mouseover: (e) => {
        const target = e.target as L.Path;
        target.setStyle({
          weight: 3,
          color: '#1F2937',
          fillOpacity: 0.9
        });
        target.bringToFront();
      },
      mouseout: (e) => {
        if (geoJsonRef.current) {
          geoJsonRef.current.resetStyle(e.target as L.Path);
        }
      }
    });
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm" style={{ height }}>
      <MapContainer
        center={INDIA_CENTER}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        maxBounds={INDIA_BOUNDS}
        minZoom={3}
        maxZoom={8}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          ref={geoJsonRef as React.RefObject<L.GeoJSON>}
          data={indiaStatesGeoJSON as GeoJSON.FeatureCollection}
          style={(feature) => getStyle(feature as unknown as StateFeature)}
          onEachFeature={(feature, layer) => onEachFeature(feature as unknown as StateFeature, layer)}
        />
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur rounded-lg shadow-lg p-3 z-[1000]">
        <div className="text-xs font-semibold text-slate-700 mb-2">Anomaly Rate</div>
        <div className="space-y-1">
          {[
            { color: '#991B1B', label: '> 15% (Critical)' },
            { color: '#DC2626', label: '10-15% (High)' },
            { color: '#F59E0B', label: '5-10% (Medium)' },
            { color: '#84CC16', label: '1-5% (Low)' },
            { color: '#22C55E', label: '< 1% (Normal)' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div 
                className="w-4 h-3 rounded-sm" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur rounded-lg shadow-lg px-4 py-2 z-[1000]">
        <div className="text-sm font-bold text-slate-800">🇮🇳 India Theft Heatmap</div>
        <div className="text-xs text-slate-500">{stateData.length} states analyzed</div>
      </div>
    </div>
  );
};

export default IndiaMap;
