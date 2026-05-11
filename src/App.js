import React, { useState, useEffect, useRef } from 'react';
import API_BASE from './config';
import {
  Search,
  ChevronRight,
  Mail,
  Lock,
  X,
  Target,
  User,
  Home,
  Settings,
  Users,
  MapPin,
  Banknote,
  Info,
  ChevronDown,
  Check,
  Cloud,
  Droplet,
  ShieldAlert,
  TreePine,
  Trash2,
  Flame,
  Waves,
  VolumeX,
  Car,
  Map as MapIcon,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Share2,
  Camera,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { renderToString } from 'react-dom/server';
import AreaIntelligence from './components/AreaIntelligence';
import ActionEngine from './components/ActionEngine';
import NinjaTaskforce from './components/NinjaTaskforce';
import OmniSearch from './components/OmniSearch';
import CivicAssistant from './components/CivicAssistant';
import UserProfile from './components/UserProfile';

const PRIMARY_FILTERS = ['Trees', 'Toilets', 'Health', 'Air', 'Water'];
const SECONDARY_FILTERS = ['Safety', 'Deforestation', 'Garbage', 'Stubble Burning', 'Lake Polluted', 'Noise Pollution', 'Illegal Parking', 'Encroachment'];

const ISSUE_CONFIG = {
  'Air': { icon: Cloud, color: '#64748b' },
  'Water': { icon: Droplet, color: '#3b82f6' },
  'Safety': { icon: ShieldAlert, color: '#ef4444' },
  'Deforestation': { icon: TreePine, color: '#10b981' },
  'Garbage': { icon: Trash2, color: '#d97706' },
  'Stubble Burning': { icon: Flame, color: '#f97316' },
  'Lake Polluted': { icon: Waves, color: '#14b8a6' },
  'Noise Pollution': { icon: VolumeX, color: '#a855f7' },
  'Illegal Parking': { icon: Car, color: '#52525b' },
  'Encroachment': { icon: MapIcon, color: '#be123c' },
  // DB Categories mapping
  'Public Infra': { icon: MapPin, color: '#64748b' },
  'Mock Issues': { icon: AlertCircle, color: '#f59e0b' },
  'Climate': { icon: Cloud, color: '#10b981' },
  'Trees': { icon: TreePine, color: '#10b981' },
  'Toilets': { icon: Sparkles, color: '#3b82f6' },
  'Health': { icon: ShieldAlert, color: '#ef4444' },
  'Incidents': { icon: AlertTriangle, color: '#ef4444' }
};

const THREAT_LEVELS = ['High', 'Critical', 'Moderate', 'Low'];

const generateMockIssues = () => {
  const categories = [...PRIMARY_FILTERS, ...SECONDARY_FILTERS];
  const issues = [];
  let id = 1;
  categories.forEach((cat) => {
    for (let i = 0; i < 5; i++) {
      issues.push({
        id: id,
        type: cat,
        lat: 12.9105 + (Math.random() - 0.5) * 0.025,
        lng: 77.5852 + (Math.random() - 0.5) * 0.035,
        heading: `${cat} Incident Reported`,
        description: `This is a verified report regarding ${cat.toLowerCase()} in the local vicinity. Immediate attention required to mitigate further impact.`,
        date: `Oct ${Math.floor(Math.random() * 30) + 1}, 2026`,
        threatLevel: THREAT_LEVELS[Math.floor(Math.random() * THREAT_LEVELS.length)],
        img: `https://picsum.photos/seed/${id}/400/300`,
      });
      id++;
    }
  });

  // Inject exact coordinates for Leaderboard Map Fly-To functionality
  const leaderboardCoords = [
    { lat: 12.9719, lng: 77.6412 }, // Indiranagar
    { lat: 12.9279, lng: 77.6271 }, // Koramangala
    { lat: 12.9250, lng: 77.5938 }, // Jayanagar 4th T
    { lat: 12.9081, lng: 77.6476 }, // HSR
    { lat: 12.9698, lng: 77.7499 }, // Whitefield
    { lat: 12.9779, lng: 77.5952 }, // Cubbon
    { lat: 12.9507, lng: 77.5848 }, // Lalbagh
    { lat: 13.0068, lng: 77.5816 }, // Sadashivanagar
    { lat: 13.0033, lng: 77.5714 }, // Malleswaram
  ];

  leaderboardCoords.forEach((coord) => {
    // Inject 3 random issues per leaderboard region
    for (let i = 0; i < 3; i++) {
      const randomCat = categories[Math.floor(Math.random() * categories.length)];
      issues.push({
        id: id++,
        type: randomCat,
        // Add tiny jitter so they don't exactly overlap
        lat: coord.lat + (Math.random() - 0.5) * 0.002,
        lng: coord.lng + (Math.random() - 0.5) * 0.002,
        heading: `Leaderboard Sector: ${randomCat} Issue`,
        description: `This incident was flagged in a top-performing sector. Immediate verification required.`,
        date: `Oct ${Math.floor(Math.random() * 30) + 1}, 2026`,
        threatLevel: THREAT_LEVELS[Math.floor(Math.random() * THREAT_LEVELS.length)],
        img: `https://picsum.photos/seed/${id}/400/300`,
      });
    }
  });

  return issues;
};

const ISSUES = generateMockIssues();

// --- ENTERPRISE GEOSPATIAL DATA (JP NAGAR 2ND PHASE) ---
const NINJAS = [
  { id: 1, name: 'Arjun', lat: 12.9105, lng: 77.5852, img: 'https://i.pravatar.cc/100?u=a1', ward: 'JP Nagar' },
  { id: 2, name: 'Priya', lat: 12.911, lng: 77.5865, img: 'https://i.pravatar.cc/100?u=a2', ward: 'JP Nagar' },
  { id: 3, name: 'Rohan', lat: 12.9095, lng: 77.584, img: 'https://i.pravatar.cc/100?u=a3', ward: 'Jayanagar' },
  { id: 4, name: 'Ananya', lat: 12.912, lng: 77.587, img: 'https://i.pravatar.cc/100?u=a4', ward: 'Jayanagar' },
  { id: 5, name: 'Vikram', lat: 12.9102, lng: 77.588, img: 'https://i.pravatar.cc/100?u=a5', ward: 'JP Nagar' },
  { id: 6, name: 'Sanya', lat: 12.9085, lng: 77.5855, img: 'https://i.pravatar.cc/100?u=a6', ward: 'JP Nagar' },
  { id: 7, name: 'Rahul', lat: 12.9065, lng: 77.5821, img: 'https://i.pravatar.cc/100?u=a7', ward: 'JP Nagar' },
  { id: 8, name: 'Sneha', lat: 12.9072, lng: 77.5891, img: 'https://i.pravatar.cc/100?u=a8', ward: 'Jayanagar' },
  { id: 9, name: 'Amit', lat: 12.9145, lng: 77.5810, img: 'https://i.pravatar.cc/100?u=a9', ward: 'JP Nagar' },
  { id: 10, name: 'Pooja', lat: 12.9130, lng: 77.5844, img: 'https://i.pravatar.cc/100?u=a10', ward: 'JP Nagar' },
  { id: 11, name: 'Karan', lat: 12.9055, lng: 77.5866, img: 'https://i.pravatar.cc/100?u=a11', ward: 'Jayanagar' },
  { id: 12, name: 'Neha', lat: 12.9115, lng: 77.5822, img: 'https://i.pravatar.cc/100?u=a12', ward: 'JP Nagar' },
  { id: 13, name: 'Rohit', lat: 12.9088, lng: 77.5888, img: 'https://i.pravatar.cc/100?u=a13', ward: 'JP Nagar' },
  { id: 14, name: 'Kavita', lat: 12.9122, lng: 77.5895, img: 'https://i.pravatar.cc/100?u=a14', ward: 'Jayanagar' },
  { id: 15, name: 'Suresh', lat: 12.9099, lng: 77.5815, img: 'https://i.pravatar.cc/100?u=a15', ward: 'JP Nagar' },
  { id: 16, name: 'Meera', lat: 12.9140, lng: 77.5870, img: 'https://i.pravatar.cc/100?u=a16', ward: 'JP Nagar' },
  { id: 17, name: 'Anil', lat: 12.9060, lng: 77.5830, img: 'https://i.pravatar.cc/100?u=a17', ward: 'Jayanagar' },
  { id: 18, name: 'Sunita', lat: 12.9078, lng: 77.5850, img: 'https://i.pravatar.cc/100?u=a18', ward: 'JP Nagar' },
  { id: 19, name: 'Deepak', lat: 12.9135, lng: 77.5825, img: 'https://i.pravatar.cc/100?u=a19', ward: 'JP Nagar' },
  { id: 20, name: 'Ritu', lat: 12.9108, lng: 77.5890, img: 'https://i.pravatar.cc/100?u=a20', ward: 'Jayanagar' },
  { id: 21, name: 'Manoj', lat: 12.9052, lng: 77.5875, img: 'https://i.pravatar.cc/100?u=a21', ward: 'JP Nagar' },
  { id: 22, name: 'Swati', lat: 12.9082, lng: 77.5812, img: 'https://i.pravatar.cc/100?u=a22', ward: 'JP Nagar' },
  { id: 23, name: 'Rajesh', lat: 12.9125, lng: 77.5860, img: 'https://i.pravatar.cc/100?u=a23', ward: 'Jayanagar' },
  { id: 24, name: 'Nidhi', lat: 12.9148, lng: 77.5840, img: 'https://i.pravatar.cc/100?u=a24', ward: 'JP Nagar' },
  { id: 25, name: 'Sanjay', lat: 12.9068, lng: 77.5880, img: 'https://i.pravatar.cc/100?u=a25', ward: 'JP Nagar' },
  { id: 26, name: 'Divya', lat: 12.9092, lng: 77.5835, img: 'https://i.pravatar.cc/100?u=a26', ward: 'Jayanagar' },

  // Leaderboard Ninjas
  { id: 101, name: 'Arvind', lat: 12.9719, lng: 77.6412, img: 'https://i.pravatar.cc/100?u=a101', ward: 'Indiranagar' },
  { id: 102, name: 'Siddharth', lat: 12.9279, lng: 77.6271, img: 'https://i.pravatar.cc/100?u=a102', ward: 'Koramangala' },
  { id: 103, name: 'Naveen', lat: 12.9250, lng: 77.5938, img: 'https://i.pravatar.cc/100?u=a103', ward: 'Jayanagar' },
  { id: 104, name: 'Maya', lat: 12.9081, lng: 77.6476, img: 'https://i.pravatar.cc/100?u=a104', ward: 'HSR Layout' },
  { id: 105, name: 'Vikram', lat: 12.9698, lng: 77.7499, img: 'https://i.pravatar.cc/100?u=a105', ward: 'Whitefield' },
  { id: 106, name: 'Ananya', lat: 12.9779, lng: 77.5952, img: 'https://i.pravatar.cc/100?u=a106', ward: 'Cubbon' },
  { id: 107, name: 'Kiran', lat: 12.9507, lng: 77.5848, img: 'https://i.pravatar.cc/100?u=a107', ward: 'Lalbagh' },
  { id: 108, name: 'Rohan', lat: 13.0068, lng: 77.5816, img: 'https://i.pravatar.cc/100?u=a108', ward: 'Sadashivanagar' },
  { id: 109, name: 'Priya', lat: 13.0033, lng: 77.5714, img: 'https://i.pravatar.cc/100?u=a109', ward: 'Malleswaram' },
].map((ninja, index) => ({
  ...ninja,
  xp: Math.floor((Math.sin(index) * 0.5 + 0.5) * 2000) + 500,
  specialty: ['Air Quality', 'Waste Management', 'Safety', 'Water Conservation', 'Greenery'][index % 5]
}));

export default function App() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});
  const issueMarkersRef = useRef({});
  const markerClusterGroupRef = useRef(null);

  // Auth & State Management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [activeNinjas, setActiveNinjas] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isLoadingIssue, setIsLoadingIssue] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [activeAreaIssues, setActiveAreaIssues] = useState([]);
  const [resolvedIssueIds, setResolvedIssueIds] = useState([]);
  const [pendingQuery, setPendingQuery] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (query.length > 2) {
      setIsSearching(true);
      setShowSearchDropdown(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
          const data = await res.json();
          setSearchResults(data || []);
        } catch (err) {
          console.error("Geocoding failed", err);
        } finally {
          setIsSearching(false);
        }
      }, 500);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  const handleSelectLocation = (result) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    setSearchQuery(result.display_name);
    setShowSearchDropdown(false);

    if (mapInstance.current) {
      // MapLibre flyTo syntax: center is [lng, lat] not [lat, lng]
      mapInstance.current.flyTo({
        center: [lon, lat],
        zoom: 16,
        duration: 1500
      });
    }
  };

  const handleVerifyIssue = (category = null) => {
    const unresolvedIssues = activeAreaIssues.filter(issue => !resolvedIssueIds.includes(issue.id));
    let targetIssue = null;

    if (category) {
      targetIssue = unresolvedIssues.find(issue => issue.type === category);
    }

    if (!targetIssue && unresolvedIssues.length > 0) {
      targetIssue = unresolvedIssues[0];
    }

    if (targetIssue) {
      setSelectedIssue(targetIssue);
      setActiveTab('problem');
    }
  };

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const spring = { type: 'spring', stiffness: 500, damping: 30 };

  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      console.log('🌍 [SamaajData Telemetry] Initializing MapLibre Engine...');

      const rect = mapRef.current.getBoundingClientRect();
      console.log(`📏 [SamaajData Telemetry] Map Container Dimensions: ${rect.width}px x ${rect.height}px`);

      if (rect.width === 0 || rect.height === 0) {
        console.error('🚨 [SamaajData Telemetry] FATAL: Map container has 0 width or height! The map will not render.');
      }

      mapInstance.current = new maplibregl.Map({
        container: mapRef.current,
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center: [77.5852, 12.9105],
        zoom: 15,
        pitch: 0,
        maxZoom: 20 // 1% Google-Tier: Capped at crisp street level
      });

      // --- TEXTURE GENERATOR ENGINE ---
      const generateTextures = (map) => {
        const size = 64; // High-DPI texture size
        const center = size / 2;
        const radius = 28;

        Object.entries(ISSUE_CONFIG).forEach(([category, config]) => {
          const Icon = config.icon;
          // Extract the raw SVG string from the Lucide component
          const svgString = renderToString(<Icon size={32} color="#ffffff" strokeWidth={2.5} xmlns="http://www.w3.org/2000/svg" />);

          const img = new Image();
          const svgBase64 = btoa(unescape(encodeURIComponent(svgString)));
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            // Outer white ring
            ctx.beginPath();
            ctx.arc(center, center, radius, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            // Inner category color
            ctx.beginPath();
            ctx.arc(center, center, radius - 3, 0, Math.PI * 2);
            ctx.fillStyle = config.color;
            ctx.fill();

            // Draw SVG icon in center
            ctx.drawImage(img, center - 16, center - 16, 32, 32);

            // Inject High-DPI Texture into WebGL
            if (!map.hasImage(`icon-${category}`)) {
              map.addImage(`icon-${category}`, ctx.getImageData(0, 0, size, size));
            }
          };
          img.src = `data:image/svg+xml;base64,${svgBase64}`;
        });

        // Add a fallback default texture
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = size; fallbackCanvas.height = size;
        const ctx = fallbackCanvas.getContext('2d');
        ctx.beginPath(); ctx.arc(center, center, radius, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill();
        ctx.beginPath(); ctx.arc(center, center, radius - 3, 0, Math.PI * 2); ctx.fillStyle = '#a855f7'; ctx.fill();
        if (!map.hasImage('icon-default')) map.addImage('icon-default', ctx.getImageData(0, 0, size, size));
      };

      // Catch WebGL context or styling errors
      mapInstance.current.on('error', (e) => {
        console.error('🚨 [SamaajData Telemetry] MAP ENGINE ERROR:', e.error || e);
      });

      // Silently inject default icons for any unregistered categories to prevent console spam
      mapInstance.current.on('styleimagemissing', (e) => {
        const id = e.id;
        const defaultImg = mapInstance.current.getImage('icon-default');
        if (defaultImg) {
          mapInstance.current.addImage(id, defaultImg.data);
        }
      });

      mapInstance.current.on('load', () => {
        console.log('✅ [SamaajData Telemetry] Base map style loaded successfully. Injecting vector tiles...');

        // Generate and inject textures immediately
        generateTextures(mapInstance.current);

        // Add In-Memory Supercluster Vector Source
        mapInstance.current.addSource('samaaj_points', {
          type: 'vector',
          tiles: [`${API_BASE}/api/tiles/{z}/{x}/{y}?category=${activeFilters.length > 0 ? encodeURIComponent(activeFilters.join(',')) : 'all'}&v=${Date.now()}`],
          minzoom: 0,
          maxzoom: 20 // 1% Google-Tier: Match map max zoom
        });

        // Layer 1: Premium Shadow for Clusters
        mapInstance.current.addLayer({
          id: 'clusters-shadow',
          type: 'circle',
          source: 'samaaj_points',
          'source-layer': 'samaaj_points',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': '#000000',
            'circle-radius': 24,
            'circle-blur': 0.8,
            'circle-opacity': 0.6,
            'circle-translate': [0, 6] // Offset for true drop-shadow
          }
        });

        // Layer 2: Premium Dark Clusters (Matches original DOM styling)
        mapInstance.current.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'samaaj_points',
          'source-layer': 'samaaj_points',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': '#121212', // Deep dark backdrop
            'circle-radius': 22,
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#3f3f46', // zinc-700
            'circle-opacity': 0.95
          }
        });

        // Layer 3: Cluster Text
        mapInstance.current.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'samaaj_points',
          'source-layer': 'samaaj_points',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 14,
            'text-allow-overlap': true, // Forces numbers to NEVER be pushed off-center by MapLibre collision engine
            'text-ignore-placement': true // Locks text to exact circle center
          },
          paint: {
            'text-color': '#ffffff'
          }
        });

        // Layer 4: High-Fidelity Unclustered Icons (using injected WebGL textures)
        mapInstance.current.addLayer({
          id: 'unclustered-point',
          type: 'symbol',
          source: 'samaaj_points',
          'source-layer': 'samaaj_points',
          filter: ['!', ['has', 'point_count']],
          layout: {
            'icon-image': [
              'coalesce',
              ['concat', 'icon-', ['get', 'category']],
              'icon-default'
            ],
            'icon-size': 0.5,
            'icon-allow-overlap': true,
            'icon-pitch-alignment': 'map'
          }
        });

        // --- SPIDERFY (BRANCH OUT) ENGINE ---
        mapInstance.current.addSource('spider-legs', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        mapInstance.current.addSource('spider-points', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });

        mapInstance.current.addLayer({
          id: 'spider-legs-layer',
          type: 'line',
          source: 'spider-legs',
          paint: {
            'line-color': '#ffffff',
            'line-width': 2,
            'line-opacity': 0.4
          }
        });

        mapInstance.current.addLayer({
          id: 'spider-points-layer',
          type: 'symbol',
          source: 'spider-points',
          layout: {
            'icon-image': [
              'coalesce',
              ['concat', 'icon-', ['get', 'category']],
              'icon-default'
            ],
            'icon-size': 0.5,
            'icon-allow-overlap': true,
            'icon-pitch-alignment': 'map'
          }
        });

        // Setup interactions
        mapInstance.current.on('click', 'unclustered-point', async (e) => {
          const props = e.features[0].properties;
          const targetId = props.dp_id || props.id;

          // GOOGLE TIER: Optimistic UI - open the panel immediately with a loading state
          // User sees instant response (0ms), data fills in after the fast PK lookup (~5ms)
          setIsLoadingIssue(true);
          setSelectedIssue(null);
          setActiveTab('problem');

          try {
            // NEW: Fast /api/point/:id endpoint - direct PK lookup, sub-5ms vs 4s sequential scan
            const response = await fetch(`${API_BASE}/api/point/${targetId}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            setSelectedIssue(data);
          } catch (err) {
            console.error('[SamaajData] Failed to fetch point details:', err);
            setToastMessage('Could not load point data. Try again.');
            setTimeout(() => setToastMessage(null), 3000);
            setActiveTab('home');
          } finally {
            setIsLoadingIssue(false);
          }
        });

        const mapClickHandler = async (e) => {
          const features = mapInstance.current.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          });
          if (features.length > 0) {
            const clusterId = features[0].properties.cluster_id;
            const centerCoords = features[0].geometry.coordinates;
            const currentZoom = mapInstance.current.getZoom();

            try {
              // Google 1% Tier: Fetch the exact zoom level needed to break this cluster
              // To avoid stale closures we can read from the global state, but in a React hook
              // Without rebuilding the listeners, we need to extract from the source URL
              const source = mapInstance.current.getSource('samaaj_points');
              let activeCat = 'all';
              if (source && source.tiles && source.tiles[0]) {
                const url = new URL(source.tiles[0]);
                activeCat = url.searchParams.get('category') || 'all';
              }

              const expRes = await fetch(`${API_BASE}/api/tiles/cluster/${clusterId}/expansionZoom?category=${encodeURIComponent(activeCat)}`);
              if (!expRes.ok) {
                // If cache mismatch or cluster lost, fallback to natural zoom
                mapInstance.current.easeTo({ center: centerCoords, zoom: Math.min(currentZoom + 2, 20), duration: 500 });
                return;
              }
              const expData = await expRes.json();
              const expansionZoom = expData.expansionZoom;

              // If the cluster breaks apart at a reasonable zoom, AND we aren't already there
              if (expansionZoom <= 20 && currentZoom < expansionZoom) {
                // Cinematic Zoom
                mapInstance.current.easeTo({
                  center: centerCoords,
                  zoom: expansionZoom + 0.5, // Slightly past the breakpoint
                  duration: 800
                });
              } else {
                // We are at max zoom OR the points are literally stacked on the exact same coordinate.
                // Deploy the Vogel Spiral Spiderfy!
                const res = await fetch(`${API_BASE}/api/tiles/cluster/${clusterId}/leaves?category=${encodeURIComponent(activeCat)}`);
                const allLeaves = await res.json();

                // Visually cap at 30 to prevent UI chaos (Google style)
                const maxLeaves = Math.min(allLeaves.length, 30);
                const leaves = allLeaves.slice(0, maxLeaves);

                const legs = [];
                const points = [];

                // Use MapLibre's screen-pixel projection so circles don't distort into ellipses at different latitudes
                const centerPx = mapInstance.current.project(centerCoords);

                leaves.forEach((leaf, i) => {
                  let legLength, angle;

                  if (leaves.length <= 8) {
                    // Golden Circle for small clusters
                    angle = (i / leaves.length) * Math.PI * 2;
                    legLength = 45; // Fixed pixel radius
                  } else {
                    // Mathematically Perfect Vogel Spiral for dense clusters
                    const goldenAngle = 137.5 * (Math.PI / 180);
                    angle = i * goldenAngle;
                    // Sqrt scaling ensures perfectly uniform point density
                    legLength = 30 + Math.sqrt(i + 1) * 12;
                  }

                  const targetPx = {
                    x: centerPx.x + Math.cos(angle) * legLength,
                    y: centerPx.y + Math.sin(angle) * legLength
                  };

                  // Cast pixel back to geographic coordinate
                  const targetLngLat = mapInstance.current.unproject(targetPx);
                  const targetCoords = [targetLngLat.lng, targetLngLat.lat];

                  legs.push({
                    type: 'Feature',
                    geometry: { type: 'LineString', coordinates: [centerCoords, targetCoords] }
                  });

                  points.push({
                    type: 'Feature',
                    properties: leaf.properties,
                    geometry: { type: 'Point', coordinates: targetCoords }
                  });
                });

                mapInstance.current.getSource('spider-legs').setData({ type: 'FeatureCollection', features: legs });
                mapInstance.current.getSource('spider-points').setData({ type: 'FeatureCollection', features: points });
              }
            } catch (err) {
              console.error('Failed to process cluster click:', err);
            }
          }
        };

        // Cluster Click: Spiderfy or Zoom
        mapInstance.current.on('click', 'clusters', mapClickHandler);

        // Dynamic Clearing: If user zooms, pan, or clicks away, instantly clear the Spiderfy web
        mapInstance.current.on('zoomstart', () => {
          if (mapInstance.current.getSource('spider-legs')) {
            mapInstance.current.getSource('spider-legs').setData({ type: 'FeatureCollection', features: [] });
            mapInstance.current.getSource('spider-points').setData({ type: 'FeatureCollection', features: [] });
          }
        });

        // Click outside clears spiderfy ring
        mapInstance.current.on('click', (e) => {
          const features = mapInstance.current.queryRenderedFeatures(e.point, { layers: ['clusters', 'spider-points-layer', 'unclustered-point'] });
          if (features.length === 0) {
            if (mapInstance.current.getSource('spider-legs')) {
              mapInstance.current.getSource('spider-legs').setData({ type: 'FeatureCollection', features: [] });
              mapInstance.current.getSource('spider-points').setData({ type: 'FeatureCollection', features: [] });
            }
          }
        });

        // Click handler for Spiderfy Points
        mapInstance.current.on('click', 'spider-points-layer', async (e) => {
          const props = e.features[0].properties;
          const targetId = props.dp_id || props.id;

          // GOOGLE TIER: Optimistic UI - open panel instantly, fill data when ready
          setIsLoadingIssue(true);
          setSelectedIssue(null);
          setActiveTab('problem');

          try {
            const response = await fetch(`${API_BASE}/api/point/${targetId}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            setSelectedIssue(data);
          } catch (err) {
            console.error('[SamaajData] Failed to fetch spiderfy point:', err);
            setActiveTab('home');
          } finally {
            setIsLoadingIssue(false);
          }
        });

        const pointerEnters = () => { mapInstance.current.getCanvas().style.cursor = 'pointer'; };
        const pointerLeaves = () => { mapInstance.current.getCanvas().style.cursor = ''; };

        mapInstance.current.on('mouseenter', 'unclustered-point', pointerEnters);
        mapInstance.current.on('mouseleave', 'unclustered-point', pointerLeaves);
        mapInstance.current.on('mouseenter', 'clusters', pointerEnters);
        mapInstance.current.on('mouseleave', 'clusters', pointerLeaves);
        mapInstance.current.on('mouseenter', 'spider-points-layer', pointerEnters);
        mapInstance.current.on('mouseleave', 'spider-points-layer', pointerLeaves);
      });

      const updateContext = () => {
        const bounds = mapInstance.current.getBounds();

        // Update Ninjas
        const visibleNinjas = NINJAS.filter((n) =>
          n.lng >= bounds.getWest() && n.lng <= bounds.getEast() &&
          n.lat >= bounds.getSouth() && n.lat <= bounds.getNorth()
        );
        setActiveNinjas(visibleNinjas);

        // Vector tiles handle area issues heavily on their own. We'll poll visible features
        if (mapInstance.current.getSource('samaaj_points')) {
          const features = mapInstance.current.queryRenderedFeatures({ layers: ['unclustered-point'] });

          // Re-hydrate the mock issue structure for area intelligence module
          const visibleIssues = features.map(f => {
            return {
              id: f.properties.id,
              category: f.properties.category,
              subcategory: f.properties.subcategory,
              latitude: f.geometry.coordinates[1],
              longitude: f.geometry.coordinates[0]
            };
          });

          // Distinct issues only based on ID
          const distinct = [];
          const map = new Map();
          for (const item of visibleIssues) {
            if (!map.has(item.id)) { map.set(item.id, true); distinct.push(item); }
          }
          setActiveAreaIssues(distinct);
        }
      };

      mapInstance.current.on('moveend', updateContext);
      setTimeout(updateContext, 500);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Surgical Sync of Civic Issues to Map Pins
  useEffect(() => {
    if (!mapInstance.current || !mapInstance.current.isStyleLoaded()) return;

    const source = mapInstance.current.getSource('samaaj_points');
    if (source) {
      const currentStyle = mapInstance.current.getStyle();
      const newStyle = JSON.parse(JSON.stringify(currentStyle));
      
      const filtersParam = activeFilters.length > 0 ? activeFilters.join(',') : 'all';
      const newTilesUrl = `${API_BASE}/api/tiles/{z}/{x}/{y}?category=${encodeURIComponent(filtersParam)}&v=${Date.now()}`;
      
      if (newStyle.sources && newStyle.sources.samaaj_points) {
        newStyle.sources.samaaj_points.tiles = [newTilesUrl];
        mapInstance.current.setStyle(newStyle, { diff: true });
      }
    }

  }, [activeFilters, selectedIssue, resolvedIssueIds]);

  const handleAvatarToggle = (id) => {
    if (!isLoggedIn) {
      setToastMessage("Login to see the actions of avatars");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const panToRegion = (lat, lng) => {
    if (mapInstance.current) {
      // MapLibre flyTo syntax: center is [lng, lat] (longitude first)
      mapInstance.current.flyTo({
        center: [lng, lat],
        zoom: 16,
        duration: 1500
      });
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0A0A0A] overflow-hidden font-sans antialiased select-none text-white">
      {/* --- TOP BAR --- */}
      <nav className="h-[72px] px-6 flex items-center justify-between border-b border-zinc-800 bg-[#0A0A0A] z-[2000]">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black tracking-tighter text-white">SamaajData</h1>
        </div>

        <div className="flex-1 max-w-2xl mx-12">
          <div className="relative flex flex-col z-[3000]">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-zinc-400" />
              <input
                value={searchQuery}
                onChange={handleSearchInput}
                onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true) }}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                placeholder="Search by names, contact or location"
                className="w-full h-10 bg-zinc-900 border border-zinc-800 rounded-lg pl-11 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 focus:bg-zinc-800 transition-colors"
              />
              {isSearching && (
                <div className="absolute right-4 w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              )}
            </div>

            <AnimatePresence>
              {showSearchDropdown && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#121212] border border-zinc-800 rounded-lg shadow-2xl overflow-hidden py-1 max-h-64 overflow-y-auto [&::-webkit-scrollbar]:hidden"
                >
                  {searchResults.map((res, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectLocation(res)}
                      className="px-4 py-2.5 hover:bg-zinc-800/50 cursor-pointer flex flex-col gap-0.5 border-b border-zinc-800/50 last:border-0 transition-colors"
                    >
                      <span className="text-[13px] font-medium text-zinc-200 truncate">{res.display_name.split(',')[0]}</span>
                      <span className="text-[11px] text-zinc-500 truncate">{res.display_name.split(',').slice(1).join(',')}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center justify-end gap-3">
            <div className="flex flex-col items-end hidden sm:flex pr-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none">Active Ninjas</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-medium leading-none">In current viewport</span>
            </div>
            <div className="flex -space-x-3">
              <AnimatePresence mode="popLayout">
                {activeNinjas.slice(0, 4).map((ninja) => (
                  <motion.div
                    key={ninja.id}
                    layout
                    whileHover={{ y: -8, scale: 1.1, zIndex: 100 }}
                    onClick={() => handleAvatarToggle(ninja.id)}
                    className="relative cursor-pointer group"
                  >
                    <img
                      src={ninja.img}
                      className={`w-10 h-10 rounded-full border-[3px] border-black ring-2 transition-all duration-300 ${selectedIds.includes(ninja.id)
                          ? 'ring-white scale-110 shadow-lg shadow-white/20'
                          : 'ring-zinc-800 group-hover:ring-zinc-500'
                        }`}
                    />
                    {selectedIds.includes(ninja.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-black flex items-center justify-center"
                      >
                        <Target
                          className="w-2 h-2 text-black"
                          strokeWidth={4}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
                {activeNinjas.length > 4 && (
                  <motion.div
                    key="extra-avatars"
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ y: -8, scale: 1.1, zIndex: 100 }}
                    className="relative z-[90] w-10 h-10 rounded-full border-[3px] border-black bg-zinc-800 flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition-colors"
                    onClick={() => handleAvatarToggle('extra')}
                  >
                    <span className="text-xs font-bold text-zinc-300">
                      +{activeNinjas.length - 4}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-zinc-800" />

          {isLoggedIn ? (
            <motion.button
              onClick={() => setActiveTab('profile')}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 pl-2 pr-4 py-1.5 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm hover:shadow-md"
            >
              <img
                src="https://i.pravatar.cc/150?u=admin_arjun"
                alt="Profile"
                className="w-7 h-7 rounded-full border border-zinc-700 object-cover"
              />
              <span className="text-xs font-bold text-zinc-300 tracking-wide">
                Arjun Kumar
              </span>
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setShowLogin(true)}
              className="px-9 py-2.5 bg-white text-black text-sm font-bold rounded-full flex items-center gap-2 hover:bg-zinc-200 transition-all"
            >
              Login <ChevronRight className="w-4 h-4" strokeWidth={3} />
            </motion.button>
          )}
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden">
        {/* --- THIN SIDEBAR (GLOBAL NAVIGATION) --- */}
        <aside className="relative w-[64px] border-r border-zinc-800 bg-[#0A0A0A] flex flex-col items-center py-6 gap-8 z-[2000] shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className={`p-2 rounded-lg transition-colors relative group ${activeTab === 'home' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Home className="w-5 h-5" />
            <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-xs font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[3000]">
              Dashboard
            </span>
          </button>
          <div className="flex flex-col gap-6 items-center">
            <button
              onClick={() => setActiveTab('area')}
              className={`p-2 rounded-lg transition-colors relative group ${activeTab === 'area' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <MapIcon className="w-5 h-5" />
              <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-xs font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[3000]">
                Explore Map
              </span>
            </button>
            <button
              onClick={() => setActiveTab('problem')}
              className={`p-2 rounded-lg transition-colors relative group ${activeTab === 'problem' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <AlertCircle className="w-5 h-5" />
              <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-xs font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[3000]">
                Reported Issues
              </span>
            </button>
            <button
              onClick={() => setActiveTab('people')}
              className={`p-2 rounded-lg transition-colors relative group ${activeTab === 'people' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Users className="w-5 h-5" />
              <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-xs font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[3000]">
                Community Taskforce
              </span>
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className={`p-2 rounded-lg transition-colors relative group ${activeTab === 'assistant' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'text-zinc-500 hover:text-emerald-400/80 hover:bg-emerald-500/5'}`}
            >
              <Sparkles className="w-5 h-5" />
              <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-xs font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[3000]">
                AI Assistant
              </span>
            </button>
            <div className="w-8 h-px bg-zinc-800 my-2" />
            <button
              onClick={() => setActiveTab('profile')}
              className={`p-2 rounded-lg transition-colors relative group ${activeTab === 'profile' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Settings className="w-5 h-5" />
              <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-xs font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[3000]">
                Settings & Profile
              </span>
            </button>
          </div>
        </aside>

        {/* --- LEFT COLUMN PANEL --- */}
        <section className="w-[380px] border-r border-zinc-800 bg-[#121212] flex flex-col z-[1000] shrink-0 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="tab-home"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="p-8 flex flex-col gap-6 h-full overflow-y-auto absolute inset-0"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-zinc-300" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-zinc-100 mb-2">Welcome to SamaajData</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                    Samaaj Data exists in service of citizens who choose to act. When a person decides to fix the potholes on their street, map a garbage dump, or understand flooding in their neighbourhood, they need more than intent, they need data, community, and solutions. Samaaj Data equips them with these essentials so that civic and climate action can begin anywhere, by anyone.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'area' && (
              <AreaIntelligence
                activeAreaIssues={activeAreaIssues}
                ISSUE_CONFIG={ISSUE_CONFIG}
                setActiveFilters={setActiveFilters}
                panToRegion={panToRegion}
                onVerifyIssue={handleVerifyIssue}
                resolvedIssueIds={resolvedIssueIds}
              />
            )}

            {activeTab === 'problem' && !selectedIssue && !isLoadingIssue && (
              <motion.div
                key="tab-problem-empty"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="p-8 flex flex-col items-center justify-center h-full text-center absolute inset-0"
              >
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
                  <AlertCircle className="w-6 h-6 text-zinc-600" />
                </div>
                <h2 className="text-lg font-medium text-zinc-300 mb-2">No Issue Selected</h2>
                <p className="text-sm text-zinc-500 leading-relaxed max-w-[240px]">
                  Select an active incident pin on the map to view detailed reports and initiate resolution protocols.
                </p>
              </motion.div>
            )}

            {/* GOOGLE TIER: Optimistic Skeleton Loader — appears the millisecond user clicks a marker */}
            {activeTab === 'problem' && isLoadingIssue && !selectedIssue && (
              <motion.div
                key="tab-problem-skeleton"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col h-full absolute inset-0 bg-[#121212] z-10 overflow-hidden"
              >
                {/* Skeleton Image */}
                <div className="w-full h-64 bg-zinc-900 shrink-0 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-[shimmer_1.5s_ease-in-out_infinite]" style={{ backgroundSize: '200% 100%' }} />
                  {/* Loading indicator overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin opacity-60" />
                  </div>
                </div>
                {/* Skeleton Content */}
                <div className="p-6 flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <div className="h-7 w-3/4 bg-zinc-800 rounded-lg animate-pulse" />
                    <div className="h-4 w-full bg-zinc-900 rounded-lg animate-pulse" />
                    <div className="h-4 w-2/3 bg-zinc-900 rounded-lg animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-zinc-900/60 border border-zinc-800 rounded-2xl animate-pulse" />
                    <div className="h-20 bg-zinc-900/60 border border-zinc-800 rounded-2xl animate-pulse" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="h-4 w-1/2 bg-zinc-900 rounded animate-pulse" />
                    <div className="h-16 bg-zinc-900/40 border border-emerald-900/20 rounded-2xl animate-pulse" />
                    <div className="h-16 bg-zinc-900/40 border border-indigo-900/20 rounded-2xl animate-pulse" />
                    <div className="h-16 bg-zinc-900/40 border border-amber-900/20 rounded-2xl animate-pulse" />
                  </div>
                </div>
                <style>{`
                  @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                  }
                `}</style>
              </motion.div>
            )}

            {activeTab === 'problem' && selectedIssue && (
              <ActionEngine
                selectedIssue={selectedIssue}
                closeCard={() => {
                  setSelectedIssue(null);
                  setActiveTab('home');
                }}
                ISSUE_CONFIG={ISSUE_CONFIG}
                onActionComplete={(id) => setResolvedIssueIds(prev => [...prev, id])}
              />
            )}

            {activeTab === 'people' && (
              <NinjaTaskforce
                isLoggedIn={isLoggedIn}
                setShowLogin={setShowLogin}
                activeNinjas={activeNinjas}
              />
            )}

            {activeTab === 'assistant' && (
              <CivicAssistant
                initialQuery={pendingQuery}
                panToRegion={panToRegion}
              />
            )}

            {activeTab === 'profile' && (
              <UserProfile />
            )}
          </AnimatePresence>
        </section>

        {/* --- MAP ENGINE --- */}
        <div className="flex-1 relative bg-[#0A0A0A] z-0" style={{ width: '100%', height: '100%' }}>
          <div ref={mapRef} className="absolute inset-0 z-0" style={{ width: '100%', height: '100%', display: 'block' }} />

          {/* Map Filters Overlay */}
          <div className="absolute top-6 left-6 z-[400] flex items-center gap-2">
            {PRIMARY_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${activeFilters.includes(filter)
                    ? 'bg-zinc-100 text-zinc-900 border-zinc-100 shadow-md'
                    : 'bg-black/80 backdrop-blur-md text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:bg-black'
                  }`}
              >
                {filter}
              </button>
            ))}

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${activeFilters.some(f => SECONDARY_FILTERS.includes(f)) || dropdownOpen
                    ? 'bg-zinc-800 text-zinc-100 border-zinc-600'
                    : 'bg-black/80 backdrop-blur-md text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:bg-black'
                  }`}
              >
                {activeFilters.filter(f => SECONDARY_FILTERS.includes(f)).length > 0
                  ? `More (${activeFilters.filter(f => SECONDARY_FILTERS.includes(f)).length})`
                  : 'More'}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 left-0 min-w-[200px] bg-[#121212] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden py-2 z-[500]"
                  >
                    {SECONDARY_FILTERS.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => toggleFilter(filter)}
                        className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center justify-between group transition-colors"
                      >
                        {filter}
                        {activeFilters.includes(filter) && (
                          <Check className="w-4 h-4 text-zinc-400" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence>
            {activeTab !== 'assistant' && (
              <OmniSearch
                onExpand={() => {
                  setPendingQuery('');
                  setActiveTab('assistant');
                }}
                onSend={(query) => {
                  setPendingQuery(query);
                  setActiveTab('assistant');
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 text-white px-6 py-3 rounded-full shadow-2xl z-[4000] flex items-center gap-3"
          >
            <Lock className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium">{toastMessage}</span>
            <button
              onClick={() => {
                setToastMessage(null);
                setShowLogin(true);
              }}
              className="ml-2 text-blue-400 font-bold text-sm hover:text-blue-300 uppercase tracking-widest"
            >
              Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ENTERPRISE LOGIN MODAL --- */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-[420px] bg-[#0c0c0c] border border-zinc-800 rounded-[32px] p-10 shadow-2xl relative"
            >
              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-8 right-8 text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center mb-8 text-center">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mb-5">
                  <div className="w-5 h-5 bg-zinc-100 rounded-sm" />
                </div>
                <h2 className="text-2xl font-medium mb-1">
                  Welcome Back
                </h2>
                <p className="text-zinc-400 text-sm">
                  Login to SamaajData
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsLoggedIn(true);
                  setShowLogin(false);
                }}
                className="space-y-4"
              >
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="text"
                    placeholder="Email address"
                    className="w-full h-14 bg-black border border-zinc-800 rounded-2xl pl-12 text-sm focus:border-zinc-500 outline-none"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full h-14 bg-black border border-zinc-800 rounded-2xl pl-12 text-sm focus:border-zinc-500 outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-14 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 active:scale-95 transition-transform"
                >
                  Login
                </button>
              </form>

              <div className="relative h-px bg-zinc-800 my-10 flex items-center justify-center">
                <span className="bg-[#0c0c0c] px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  or continue with
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  'M11.5 3c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5h4v-3h-4c-3 0-5.5-2.5-5.5-5.5s2.5-5.5 5.5-5.5h4v-3h-4z', // Apple Sim
                  'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z', // Chrome Sim
                  'M18.2 3H21l-6.1 7 7.2 9h-5.7l-4.5-5.9-5.1 5.9H4l6.5-7.5L3.6 3h5.8l4 5.3 4.8-5.3z', // X Sim
                ].map((path, i) => (
                  <button
                    key={i}
                    className="h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center hover:bg-zinc-800 transition-all"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-zinc-400">
                      <path d={path} />
                    </svg>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pop {
          from { transform: scale(0) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-pop { animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .custom-pin { pointer-events: none !important; }

        /* --- PREMIUM SCROLLBAR --- */
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #27272a; /* zinc-800 */
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #3f3f46; /* zinc-700 */
        }
      `}</style>
    </div>
  );
}
