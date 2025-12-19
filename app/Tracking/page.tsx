// app/tracking/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, 
  Package, 
  MapPin, 
  Clock, 
  Bus, 
  RefreshCw,
  Navigation,
  Shield,
  CheckCircle,
  AlertCircle,
  Users,
  Phone,
  Mail,
  ChevronRight,
  Plus,
  Minus,
  Play,
  Pause
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Import your API functions
import { getTrackingByCode, getTrackingHistory } from '@/lib/api';

// Mock data for when API is unavailable
const mockPackageData = [
  {
    id: 'PKG-001',
    trackingCode: 'TRV-ABC123',
    status: 'IN_TRANSIT',
    busId: '11111111-1111-1111-1111-111111111111',
    startRoute: 'Douala, Cameroon',
    endRoute: 'Yaoundé, Cameroon',
    sender: { name: 'Jean Ndongo', phone: '+237 655 123 456' },
    receiver: { name: 'Marie Tchoumi', phone: '+237 677 987 654' },
    estimatedArrival: 'Dec 15, 2023 • 14:30',
    currentLocation: 'Near Nkongsamba',
    lastUpdate: 'Just now',
    distance: { traveled: '185 km', remaining: '45 km', total: '230 km' },
    coordinates: {
      start: [4.0511, 9.7679], // Douala
      end: [3.8480, 11.5021], // Yaoundé
      current: [4.6257, 9.9350] // Near Nkongsamba
    }
  },
  {
    id: 'PKG-002',
    trackingCode: 'TRV-DEF456',
    status: 'DELIVERED',
    busId: '22222222-2222-2222-2222-222222222222',
    startRoute: 'Bamenda, Cameroon',
    endRoute: 'Buea, Cameroon',
    sender: { name: 'Paul Fokou', phone: '+237 690 112 233' },
    receiver: { name: 'Chantal Ngo', phone: '+237 699 445 566' },
    estimatedArrival: 'Arrived Dec 12, 2023',
    currentLocation: 'Delivered to recipient',
    lastUpdate: '2 days ago',
    distance: { traveled: '120 km', remaining: '0 km', total: '120 km' },
    coordinates: {
      start: [5.9631, 10.1591], // Bamenda
      end: [4.1534, 9.2423], // Buea
      current: [4.1534, 9.2423] // Buea
    }
  },
  {
    id: 'PKG-003',
    trackingCode: 'TRV-GHI789',
    status: 'PENDING',
    busId: '33333333-3333-3333-3333-333333333333',
    startRoute: 'Yaoundé, Cameroon',
    endRoute: 'Kribi, Cameroon',
    sender: { name: 'Samuel Mbappe', phone: '+237 691 334 455' },
    receiver: { name: 'Lucie Ndi', phone: '+237 678 998 877' },
    estimatedArrival: 'Dec 20, 2023 • 10:00',
    currentLocation: 'Awaiting departure',
    lastUpdate: 'Yesterday',
    distance: { traveled: '0 km', remaining: '180 km', total: '180 km' },
    coordinates: {
      start: [3.8480, 11.5021], // Yaoundé
      end: [2.9375, 9.9100], // Kribi
      current: [3.8480, 11.5021] // Yaoundé
    }
  }
];

// Dynamically import the map component to avoid SSR issues
const DynamicMap = dynamic(() => import('../../components/DynamicMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  )
});

// Create a ref type for the map controls
interface MapControlsRef {
  zoomIn: () => void;
  zoomOut: () => void;
  centerOnPackage: () => void;
  updatePackagePosition: (position: [number, number]) => void;
}

export default function TrackingPage() {
  const [trackingCode, setTrackingCode] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulationActive, setSimulationActive] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [trackingHistory, setTrackingHistory] = useState<any[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mapControlsRef = useRef<MapControlsRef>(null);
  const currentIndexRef = useRef(0);

  // Initialize with mock data
  useEffect(() => {
    setPackages(mockPackageData);
    setSelectedPackage(mockPackageData[0]);
    
    // Generate route for initial package
    if (mockPackageData[0]) {
      const points = generateRoutePoints(
        mockPackageData[0].coordinates.start, 
        mockPackageData[0].coordinates.end
      );
      setRoutePoints(points);
      setCurrentPosition(mockPackageData[0].coordinates.current);
      calculateProgress(mockPackageData[0].coordinates.current, points);
      
      // Add initial tracking history
      setTrackingHistory([
        {
          location: mockPackageData[0].startRoute,
          timestamp: 'Dec 14, 2023 • 08:00',
          status: 'PENDING'
        },
        {
          location: 'Departed from station',
          timestamp: 'Dec 14, 2023 • 08:30',
          status: 'IN_TRANSIT'
        },
        {
          location: mockPackageData[0].currentLocation,
          timestamp: 'Just now',
          status: 'IN_TRANSIT'
        }
      ]);
    }
  }, []);

  // Update map when current position changes
  useEffect(() => {
    if (currentPosition && mapControlsRef.current) {
      mapControlsRef.current.updatePackagePosition(currentPosition);
    }
  }, [currentPosition]);

  // Toggle simulation when simulationActive changes
  useEffect(() => {
    if (simulationActive && selectedPackage && routePoints.length > 0) {
      startSimulation();
    } else {
      stopSimulation();
    }
    
    return () => {
      stopSimulation();
    };
  }, [simulationActive, selectedPackage]);

  const connectWebSocket = () => {
    // For development, use a mock WebSocket connection
    // In production, connect to your Spring Boot WebSocket endpoint
    const wsUrl = 'ws://localhost:8080/ws';
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setWsConnected(true);
        startSimulation();
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Update package location based on WebSocket data
        if (data.bus_id === selectedPackage?.busId) {
          const newPosition: [number, number] = [data.latitude, data.longitude];
          setCurrentPosition(newPosition);
          updatePackageLocation(data);
          
          // Add to tracking history
          addTrackingHistory({
            location: data.location || 'Unknown location',
            timestamp: new Date().toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            status: data.status || 'IN_TRANSIT'
          });
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsConnected(false);
        // Fallback to simulated updates
        if (!simulationActive) {
          setSimulationActive(true);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setWsConnected(false);
      };
    } catch (err) {
      console.log('Using simulated WebSocket');
      if (!simulationActive) {
        setSimulationActive(true);
      }
    }
  };

  const startSimulation = () => {
    if (selectedPackage && routePoints.length > 0) {
      stopSimulation(); // Clear any existing interval
      
      // Find the closest point to current position to start from
      if (currentPosition) {
        const distances = routePoints.map(point => 
          Math.sqrt(
            Math.pow(point[0] - currentPosition[0], 2) + 
            Math.pow(point[1] - currentPosition[1], 2)
          )
        );
        currentIndexRef.current = distances.indexOf(Math.min(...distances));
      } else {
        currentIndexRef.current = 0;
      }
      
      console.log(`Starting simulation from point ${currentIndexRef.current} of ${routePoints.length}`);
      
      simulationIntervalRef.current = setInterval(() => {
        if (currentIndexRef.current < routePoints.length) {
          const newPosition = routePoints[currentIndexRef.current];
          
          console.log(`Moving to point ${currentIndexRef.current}:`, newPosition);
          
          setCurrentPosition(newPosition);
          calculateProgress(newPosition, routePoints);
          
          updatePackageLocation({
            latitude: newPosition[0],
            longitude: newPosition[1],
            location: getLocationName(newPosition, selectedPackage),
            status: 'IN_TRANSIT'
          });
          
          // Add to tracking history every 5 points
          if (currentIndexRef.current % 5 === 0) {
            addTrackingHistory({
              location: getLocationName(newPosition, selectedPackage),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'IN_TRANSIT'
            });
          }
          
          currentIndexRef.current++;
        } else {
          // Package delivered
          console.log('Package delivered!');
          stopSimulation();
          updatePackageStatus('DELIVERED');
          setProgressPercentage(100);
          addTrackingHistory({
            location: selectedPackage.endRoute,
            timestamp: 'Arrived',
            status: 'DELIVERED'
          });
        }
      }, 1000); // Move every second
    }
  };

  const stopSimulation = () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
      console.log('Simulation stopped');
    }
  };

  const generateRoutePoints = (start: [number, number], end: [number, number]) => {
    const points: [number, number][] = [];
    const steps = 50; // More points for smoother movement
    
    // Add some curve to the route
    const controlPoint: [number, number] = [
      (start[0] + end[0]) / 2 + 0.1,
      (start[1] + end[1]) / 2 + 0.1
    ];
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Quadratic Bezier curve for more realistic route
      const lat = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * controlPoint[0] + t * t * end[0];
      const lng = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * controlPoint[1] + t * t * end[1];
      points.push([lat, lng]);
    }
    
    console.log(`Generated ${points.length} route points`);
    return points;
  };

  const calculateProgress = (position: [number, number], points: [number, number][]) => {
    if (points.length === 0) return;
    
    // Find closest point index
    let closestIndex = 0;
    let minDistance = Infinity;
    
    points.forEach((point, index) => {
      const distance = Math.sqrt(
        Math.pow(point[0] - position[0], 2) + 
        Math.pow(point[1] - position[1], 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    
    const progress = (closestIndex / points.length) * 100;
    setProgressPercentage(Math.round(progress));
    
    // Update distance traveled
    if (selectedPackage) {
      const totalDistance = parseInt(selectedPackage.distance.total);
      const traveled = Math.round((progress / 100) * totalDistance);
      const remaining = totalDistance - traveled;
      
      setSelectedPackage((prev: any) => ({
        ...prev,
        distance: {
          ...prev.distance,
          traveled: `${traveled} km`,
          remaining: `${remaining} km`
        }
      }));
    }
  };

  const getLocationName = (position: [number, number], pkg: any) => {
    const locations = [
      { name: pkg.startRoute, coords: pkg.coordinates.start },
      { name: 'Mid-way point', coords: [4.2, 10.2] },
      { name: pkg.endRoute, coords: pkg.coordinates.end }
    ];
    
    // Find closest location
    let closest = locations[0];
    let minDistance = Infinity;
    
    locations.forEach(loc => {
      const distance = Math.sqrt(
        Math.pow(position[0] - loc.coords[0], 2) + 
        Math.pow(position[1] - loc.coords[1], 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closest = loc;
      }
    });
    
    return closest.name;
  };

  const updatePackageLocation = (data: any) => {
    setSelectedPackage((prev: any) => ({
      ...prev,
      currentLocation: data.location || 'En route',
      lastUpdate: 'Just now',
      coordinates: {
        ...prev.coordinates,
        current: [data.latitude, data.longitude]
      },
      status: data.status || prev.status
    }));
  };

  const updatePackageStatus = (status: string) => {
    setSelectedPackage((prev: any) => ({
      ...prev,
      status,
      currentLocation: status === 'DELIVERED' ? 'Delivered to recipient' : 'En route'
    }));
  };

  const addTrackingHistory = (event: any) => {
    setTrackingHistory(prev => [event, ...prev.slice(0, 9)]); // Keep last 10 events
  };

  const handleTrackPackage = async () => {
    if (!trackingCode.trim()) {
      setError('Please enter a tracking code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try to fetch from your Spring Boot API
      const data = await getTrackingByCode(trackingCode);
      
      if (data) {
        // Transform API response to match our format
        const packageData = {
          id: `PKG-${Math.random().toString(36).substr(2, 9)}`,
          trackingCode: trackingCode,
          status: data.status || 'IN_TRANSIT',
          busId: data.bus_id,
          startRoute: data.start?.name || 'Unknown',
          endRoute: data.end?.name || 'Unknown',
          sender: { name: 'Sender Name', phone: 'Unknown' },
          receiver: { name: 'Receiver Name', phone: 'Unknown' },
          estimatedArrival: 'Calculating...',
          currentLocation: 'En route',
          lastUpdate: 'Just now',
          distance: { traveled: '0 km', remaining: '0 km', total: '230 km' },
          coordinates: {
            start: data.start ? [data.start.lat, data.start.lon] : [4.0511, 9.7679],
            end: data.end ? [data.end.lat, data.end.lon] : [3.8480, 11.5021],
            current: data.start ? [data.start.lat, data.start.lon] : [4.0511, 9.7679]
          }
        };
        
        setSelectedPackage(packageData);
        setProgressPercentage(0);
        
        // Generate route for new package
        const points = generateRoutePoints(packageData.coordinates.start, packageData.coordinates.end);
        setRoutePoints(points);
        setCurrentPosition(packageData.coordinates.current);
        
        // Reset tracking history
        setTrackingHistory([
          {
            location: packageData.startRoute,
            timestamp: new Date().toLocaleDateString(),
            status: 'PENDING'
          }
        ]);
        
        // Start simulation
        setTimeout(() => {
          setSimulationActive(true);
        }, 500);
      } else {
        // Fallback to mock data
        const foundPackage = packages.find(p => p.trackingCode === trackingCode);
        if (foundPackage) {
          handleSelectPackage(foundPackage);
        } else {
          setError('Tracking code not found');
        }
      }
    } catch (err) {
      console.error('Error fetching tracking:', err);
      // Fallback to mock data
      const foundPackage = packages.find(p => p.trackingCode === trackingCode);
      if (foundPackage) {
        handleSelectPackage(foundPackage);
      } else {
        setError('Error connecting to tracking service');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPackage = (pkg: any) => {
    setSelectedPackage(pkg);
    setProgressPercentage(0);
    
    // Generate route for selected package
    const points = generateRoutePoints(pkg.coordinates.start, pkg.coordinates.end);
    setRoutePoints(points);
    setCurrentPosition(pkg.coordinates.current);
    calculateProgress(pkg.coordinates.current, points);
    
    // Reset tracking history for new package
    setTrackingHistory([
      {
        location: pkg.startRoute,
        timestamp: 'Today • 08:00',
        status: 'PENDING'
      },
      {
        location: 'Departed from station',
        timestamp: 'Today • 08:30',
        status: 'IN_TRANSIT'
      },
      {
        location: pkg.currentLocation,
        timestamp: 'Just now',
        status: pkg.status
      }
    ]);
    
    // Stop and restart simulation if it was active
    if (simulationActive) {
      setSimulationActive(false);
      setTimeout(() => {
        setSimulationActive(true);
      }, 100);
    }
  };

  const handleToggleTracking = () => {
    if (simulationActive) {
      setSimulationActive(false);
    } else {
      if (!selectedPackage) {
        setError('Please select a package first');
        return;
      }
      setSimulationActive(true);
    }
  };

  // Map control functions
  const handleZoomIn = () => {
    if (mapControlsRef.current) {
      mapControlsRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapControlsRef.current) {
      mapControlsRef.current.zoomOut();
    }
  };

  const handleCenterOnPackage = () => {
    if (mapControlsRef.current && currentPosition) {
      mapControlsRef.current.centerOnPackage();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT': return 'bg-cyan-100 text-cyan-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle className="h-5 w-5" />;
      case 'IN_TRANSIT': return <Bus className="h-5 w-5" />;
      case 'PENDING': return <Clock className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Package Tracking</h1>
            <p className="text-xl text-cyan-100">
              Real-time tracking for your packages across Cameroon
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tracking Info */}
          <div className="lg:col-span-1">
            {/* Search Box */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h2 className="ml-4 text-2xl font-bold text-gray-900">Track Your Package</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Tracking Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                      placeholder="e.g., TRV-ABC123"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleTrackPackage}
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-r-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50"
                    >
                      {loading ? 'Tracking...' : 'Track'}
                    </button>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>

                {/* Connection Status */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${wsConnected ? 'bg-green-500' : simulationActive ? 'bg-cyan-500' : 'bg-gray-400'}`}></div>
                      <span className="text-sm font-medium">
                        {wsConnected ? 'Live Tracking' : simulationActive ? 'Simulated Tracking' : 'Tracking Offline'}
                      </span>
                    </div>
                    <button
                      onClick={handleToggleTracking}
                      disabled={!selectedPackage}
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                        simulationActive
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      } ${!selectedPackage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {simulationActive ? (
                        <>
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </>
                      )}
                    </button>
                  </div>
                  {simulationActive && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full transition-all duration-300" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Selected Package Details */}
            {selectedPackage && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center">
                      {getStatusIcon(selectedPackage.status)}
                      <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPackage.status)}`}>
                        {selectedPackage.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mt-2">
                      {selectedPackage.trackingCode}
                    </h3>
                    <p className="text-gray-600">Package ID: {selectedPackage.id}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedPackage.distance.traveled}
                    </div>
                    <div className="text-sm text-gray-600">traveled</div>
                  </div>
                </div>

                {/* Route Info */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-600">From</p>
                      <p className="font-medium">{selectedPackage.startRoute}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center relative z-10">
                        <Package className="h-4 w-4 text-cyan-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-600">Current Location</p>
                        <p className="font-medium">{selectedPackage.currentLocation}</p>
                        <p className="text-sm text-gray-500">Updated {selectedPackage.lastUpdate}</p>
                      </div>
                    </div>

                    <div className="flex items-start mt-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center relative z-10">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-600">To</p>
                        <p className="font-medium">{selectedPackage.endRoute}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Distance Progress */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Journey Progress</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-600">{selectedPackage.distance.traveled} traveled</span>
                    <span className="text-gray-600">{selectedPackage.distance.remaining} to go</span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Users className="h-4 w-4 text-gray-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Sender</p>
                        <p className="text-gray-600">{selectedPackage.sender.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Users className="h-4 w-4 text-gray-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Receiver</p>
                        <p className="text-gray-600">{selectedPackage.receiver.name}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estimated Arrival */}
                <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-cyan-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Estimated Arrival</p>
                      <p className="font-medium text-gray-900">{selectedPackage.estimatedArrival}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Packages */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Packages</h3>
              <div className="space-y-3">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => handleSelectPackage(pkg)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedPackage?.id === pkg.id
                        ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{pkg.trackingCode}</p>
                        <p className="text-sm text-gray-600">
                          {pkg.startRoute} → {pkg.endRoute}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(pkg.status)}`}>
                          {pkg.status}
                        </span>
                        <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Live Tracking Map</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Start</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">End</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 relative">
                      <img 
                        src="/package3.png" 
                        alt="Package" 
                        className="w-8 h-8 object-contain animate-pulse"
                      />
                    </div>
                    <span className="text-sm">Package</span>
                  </div>
                </div>
              </div>

              {/* Map Container - Using DynamicMap */}
              <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
                {selectedPackage ? (
                  <DynamicMap
                    selectedPackage={selectedPackage}
                    currentPosition={currentPosition}
                    routePoints={routePoints}
                    center={currentPosition || selectedPackage.coordinates.start}
                    ref={mapControlsRef}
                    simulationActive={simulationActive}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Select a package to view tracking map</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Map Controls */}
              <div className="mt-6 flex justify-between items-center">
                <div className="flex space-x-3">
                  <button
                    onClick={handleZoomIn}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Zoom In
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Zoom Out
                  </button>
                  {currentPosition && (
                    <button
                      onClick={handleCenterOnPackage}
                      className="px-4 py-2 border border-cyan-500 text-cyan-600 rounded-lg hover:bg-cyan-50 flex items-center"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Center on Package
                    </button>
                  )}
                </div>
                
                <div className="text-sm text-gray-600">
                  {wsConnected ? (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Live Tracking Active
                    </div>
                  ) : simulationActive ? (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2 animate-pulse"></div>
                      Simulated Tracking Active • {progressPercentage}%
                    </div>
                  ) : (
                    'Tracking Inactive'
                  )}
                </div>
              </div>

              {/* Tracking History */}
              {selectedPackage && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Tracking History</h3>
                    <button
                      onClick={() => setTrackingHistory([])}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear History
                    </button>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {trackingHistory.length > 0 ? (
                      trackingHistory.map((event, index) => (
                        <div key={index} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                            <Clock className="h-4 w-4 text-cyan-600" />
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="font-medium truncate">{event.location}</p>
                            <p className="text-sm text-gray-600">{event.timestamp}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(event.status)} flex-shrink-0`}>
                            {event.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <RefreshCw className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>No tracking history yet</p>
                        <p className="text-sm mt-1">Start tracking to see updates here</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}