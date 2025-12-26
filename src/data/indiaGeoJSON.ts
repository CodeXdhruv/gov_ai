// India States GeoJSON - Simplified boundaries for choropleth map
// Source: Natural Earth / OpenDataIndia simplified for web use

export interface StateFeature {
  type: 'Feature';
  properties: {
    name: string;
    code: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface IndiaGeoJSON {
  type: 'FeatureCollection';
  features: StateFeature[];
}

// Simplified India state boundaries (approximate centroids for label positioning)
export const INDIA_STATE_CENTERS: Record<string, [number, number]> = {
  'UP': [27.5, 80.5],      // Uttar Pradesh
  'MH': [19.7, 75.7],      // Maharashtra
  'DL': [28.7, 77.1],      // Delhi
  'KA': [15.3, 75.7],      // Karnataka
  'GJ': [22.3, 71.2],      // Gujarat
  'TN': [11.1, 78.7],      // Tamil Nadu
  'WB': [22.9, 87.8],      // West Bengal
  'RJ': [27.0, 74.2],      // Rajasthan
  'MP': [23.5, 77.5],      // Madhya Pradesh
  'AP': [15.9, 79.7],      // Andhra Pradesh
  'TS': [17.4, 78.5],      // Telangana
  'KL': [10.9, 76.3],      // Kerala
  'BR': [25.8, 85.3],      // Bihar
  'HR': [29.1, 76.1],      // Haryana
  'PB': [31.1, 75.3],      // Punjab
  'OR': [20.9, 84.8],      // Odisha
  'AS': [26.2, 92.9],      // Assam
  'JH': [23.6, 85.3],      // Jharkhand
  'UK': [30.1, 79.3],      // Uttarakhand
  'HP': [31.1, 77.2],      // Himachal Pradesh
  'CG': [21.3, 82.0],      // Chhattisgarh
  'JK': [34.1, 74.8],      // Jammu & Kashmir
  'GO': [15.3, 74.0],      // Goa
};

// India map bounds
export const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [6.5, 68.0],   // Southwest
  [37.5, 97.5]   // Northeast
];

export const INDIA_CENTER: [number, number] = [22.5, 82.0];

// Simplified GeoJSON for India states (approximate polygons)
// Using simplified boundaries to keep file size small
export const indiaStatesGeoJSON: IndiaGeoJSON = {
  type: 'FeatureCollection',
  features: [
    // Uttar Pradesh
    {
      type: 'Feature',
      properties: { name: 'Uttar Pradesh', code: 'UP' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[77.0, 24.0], [84.5, 24.0], [84.5, 30.5], [77.0, 30.5], [77.0, 24.0]]]
      }
    },
    // Maharashtra  
    {
      type: 'Feature',
      properties: { name: 'Maharashtra', code: 'MH' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[72.5, 15.5], [80.5, 15.5], [80.5, 22.0], [72.5, 22.0], [72.5, 15.5]]]
      }
    },
    // Delhi (NCT)
    {
      type: 'Feature',
      properties: { name: 'Delhi', code: 'DL' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[76.8, 28.4], [77.4, 28.4], [77.4, 28.9], [76.8, 28.9], [76.8, 28.4]]]
      }
    },
    // Karnataka
    {
      type: 'Feature',
      properties: { name: 'Karnataka', code: 'KA' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[74.0, 11.5], [78.5, 11.5], [78.5, 18.5], [74.0, 18.5], [74.0, 11.5]]]
      }
    },
    // Gujarat
    {
      type: 'Feature',
      properties: { name: 'Gujarat', code: 'GJ' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[68.0, 20.0], [74.5, 20.0], [74.5, 24.5], [68.0, 24.5], [68.0, 20.0]]]
      }
    },
    // Tamil Nadu
    {
      type: 'Feature',
      properties: { name: 'Tamil Nadu', code: 'TN' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[76.0, 8.0], [80.5, 8.0], [80.5, 13.5], [76.0, 13.5], [76.0, 8.0]]]
      }
    },
    // West Bengal
    {
      type: 'Feature',
      properties: { name: 'West Bengal', code: 'WB' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[85.5, 21.5], [89.0, 21.5], [89.0, 27.5], [85.5, 27.5], [85.5, 21.5]]]
      }
    },
    // Rajasthan
    {
      type: 'Feature',
      properties: { name: 'Rajasthan', code: 'RJ' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[69.5, 23.0], [78.0, 23.0], [78.0, 30.5], [69.5, 30.5], [69.5, 23.0]]]
      }
    },
    // Madhya Pradesh
    {
      type: 'Feature',
      properties: { name: 'Madhya Pradesh', code: 'MP' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[74.0, 21.0], [82.5, 21.0], [82.5, 26.5], [74.0, 26.5], [74.0, 21.0]]]
      }
    },
    // Andhra Pradesh
    {
      type: 'Feature',
      properties: { name: 'Andhra Pradesh', code: 'AP' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[77.0, 13.0], [84.5, 13.0], [84.5, 19.5], [77.0, 19.5], [77.0, 13.0]]]
      }
    },
    // Telangana
    {
      type: 'Feature',
      properties: { name: 'Telangana', code: 'TS' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[77.0, 15.5], [81.5, 15.5], [81.5, 19.5], [77.0, 19.5], [77.0, 15.5]]]
      }
    },
    // Kerala
    {
      type: 'Feature',
      properties: { name: 'Kerala', code: 'KL' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[74.5, 8.0], [77.5, 8.0], [77.5, 13.0], [74.5, 13.0], [74.5, 8.0]]]
      }
    },
    // Bihar
    {
      type: 'Feature',
      properties: { name: 'Bihar', code: 'BR' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[83.0, 24.0], [88.5, 24.0], [88.5, 27.5], [83.0, 27.5], [83.0, 24.0]]]
      }
    },
    // Haryana
    {
      type: 'Feature',
      properties: { name: 'Haryana', code: 'HR' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[74.5, 27.5], [77.5, 27.5], [77.5, 30.5], [74.5, 30.5], [74.5, 27.5]]]
      }
    },
    // Punjab
    {
      type: 'Feature',
      properties: { name: 'Punjab', code: 'PB' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[73.5, 29.5], [76.5, 29.5], [76.5, 32.5], [73.5, 32.5], [73.5, 29.5]]]
      }
    },
    // Odisha
    {
      type: 'Feature',
      properties: { name: 'Odisha', code: 'OR' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[81.0, 18.0], [87.5, 18.0], [87.5, 22.5], [81.0, 22.5], [81.0, 18.0]]]
      }
    },
    // Assam
    {
      type: 'Feature',
      properties: { name: 'Assam', code: 'AS' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[89.5, 24.0], [96.0, 24.0], [96.0, 28.0], [89.5, 28.0], [89.5, 24.0]]]
      }
    },
    // Jharkhand
    {
      type: 'Feature',
      properties: { name: 'Jharkhand', code: 'JH' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[83.0, 21.5], [87.5, 21.5], [87.5, 25.5], [83.0, 25.5], [83.0, 21.5]]]
      }
    },
    // Chhattisgarh
    {
      type: 'Feature',
      properties: { name: 'Chhattisgarh', code: 'CG' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[80.0, 18.0], [84.5, 18.0], [84.5, 24.0], [80.0, 24.0], [80.0, 18.0]]]
      }
    }
  ]
};

export default indiaStatesGeoJSON;
