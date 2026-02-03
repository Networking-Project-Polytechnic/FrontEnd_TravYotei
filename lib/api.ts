// lib/api.ts
import axios from 'axios';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  AGENCY = 'AGENCY'
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
}

export type Agency = {
  id: string; // UUID from backend
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password?: string;
  role: Role;
  status: Status;
  profileImageUrl: string;
  phoneNumber: number;
  address: string;
  licenseNumber: string;
  bio: string;
  displayName?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  yearsOperating?: number;
  fleetSize?: number;
  routes?: any[];
  features?: string[];
  serviceHours?: string;
  website?: string;
  hasOnSiteService?: boolean;
  hasOnlineAppointments?: boolean;
  type?: string;
  logo?: string;
  busPhotos?: string[];
};

// Données pour 19 agences (sans les agences françaises)
const mockAgencies: Agency[] = [
  {
    id: '1',
    firstName: 'Parklane',
    lastName: 'Travels',
    userName: 'parklanetravels',
    email: 'contact@parklanetravels.cm',
    role: Role.AGENCY,
    status: Status.ACTIVE,
    profileImageUrl: '/images/agencies/logos/parklane-travels.png',
    phoneNumber: 237683574765,
    address: 'Yaoundé, Cameroun',
    licenseNumber: 'L-2024-001',
    bio: "Reliable transport service open 24/7. One of the most accessible agencies in Yaoundé."
  },
  {
    id: '00000000-0000-0000-0000-000000000000',
    firstName: 'TravYotei',
    lastName: 'Official',
    userName: 'travyotei-official',
    email: 'contact@travyotei.com',
    role: Role.AGENCY,
    status: Status.ACTIVE,
    profileImageUrl: '/images/agencies/logos/parklane-travels.png',
    phoneNumber: 237000000000,
    displayName: 'TravYotei Official',
    description: "Welcome to TravYotei! This is a demo agency to showcase our platform capabilities.",
    address: 'Bastis, Yaoundé',
    rating: 5.0,
    reviewCount: 999,
    yearsOperating: 1,
    fleetSize: 100,
    routes: [
      { name: 'Yaoundé → Douala', standardPrice: 5000, vipPrice: 8000, premiumPrice: 12000, duration: '3h 30m', frequency: 'Every hour' },
      { name: 'Douala → Kribi', standardPrice: 4000, vipPrice: 7000, premiumPrice: 10000, duration: '2h', frequency: '4 times/day' },
    ],
    features: ['Service VIP', 'WiFi haute vitesse', 'Climatisation', 'Bagages inclus', 'Sécurité maximale'],
    serviceHours: '24h/24',
    website: 'https://travyotei.com',
    hasOnSiteService: true,
    hasOnlineAppointments: true,
    type: 'Transportation service',
    logo: '/images/agencies/logos/parklane-travels.png',
    busPhotos: ['/images/agencies/buses/bus1.jpg'],
    licenseNumber: 'OFFICIAL-001',
    bio: "Welcome to TravYotei! This is a demo agency to showcase our platform capabilities."
  },
  {
    id: '2',
    firstName: 'Cerises',
    lastName: 'Express',
    userName: 'cerisesexpressvip',
    email: 'contact@cerisesexpress.cm',
    role: Role.AGENCY,
    status: Status.ACTIVE,
    profileImageUrl: '/images/agencies/logos/cerises-express-vip.png',
    phoneNumber: 237655319301,
    address: 'Yaoundé, Cameroon',
    licenseNumber: 'L-2024-002',
    bio: "VIP transport service with modern equipment and superior comfort. Closes at 10 PM."
  }
];

// Fonction pour simuler un délai réseau
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export async function getAgencies(): Promise<Agency[]> {
  try {
    console.log('📡 [API] Fetching real agencies from backend...');
    const response = await api_auth.get('/agencies');
    const backendAgencies = response.data;

    if (Array.isArray(backendAgencies) && backendAgencies.length > 0) {
      console.log(`✅ [API] Successfully fetched ${backendAgencies.length} agencies from backend`);

      return backendAgencies.map((agency: any, index: number) => ({
        id: agency.id || String(index + 1),
        firstName: agency.firstName || 'Agency',
        lastName: agency.lastName || '',
        userName: agency.userName || agency.username || 'unknown',
        email: agency.email || '',
        role: (agency.role as Role) || Role.AGENCY,
        status: (agency.status as Status) || Status.ACTIVE,
        profileImageUrl: agency.profileImageUrl || agency.logo || `/images/agencies/logos/default.png`,
        phoneNumber: Number(agency.phoneNumber || 0),
        address: agency.address || 'Location information not available',
        licenseNumber: agency.licenseNumber || '',
        bio: agency.bio || agency.description || "Active travel agency providing quality services."
      }));
    }

    console.warn('⚠️ [API] Backend returned empty or invalid agency list, falling back to mock data');
    return mockAgencies;
  } catch (error) {
    console.error('❌ [API] Failed to fetch agencies from backend, using mock data:', error);
    return mockAgencies;
  }
}

export async function getAgencyById(id: string): Promise<Agency | null> {
  try {
    console.log(`📡 [API] Fetching agency ID: ${id} from backend...`);

    // First try to find it in the current list if we already fetched it
    // (Optional optimization: if we have a state manager, but here we just fetch)

    try {
      const response = await api_auth.get(`/agencies/${id}`);
      if (response.data) {
        const agency = response.data;
        return {
          id: agency.id || id,
          firstName: agency.firstName || 'Agency',
          lastName: agency.lastName || '',
          userName: agency.userName || agency.username || 'unknown',
          email: agency.email || '',
          role: (agency.role as Role) || Role.AGENCY,
          status: (agency.status as Status) || Status.ACTIVE,
          profileImageUrl: agency.profileImageUrl || agency.logo || `/images/agencies/logos/default.png`,
          phoneNumber: Number(agency.phoneNumber || 0),
          address: agency.address || 'Location information not available',
          licenseNumber: agency.licenseNumber || '',
          bio: agency.bio || agency.description || "Active travel agency providing quality services."
        };
      }
    } catch (e) {
      console.warn(`⚠️ [API] Could not fetch agency ${id} individually, searching in local mock data`);
    }

    const agency = mockAgencies.find(agency => agency.id === id || agency.userName === id);

    if (agency) {
      return agency;
    }

    console.warn(`⚠️ Agency ID ${id} non trouvée`);
    return mockAgencies[0];
  } catch (error) {
    console.error(`❌ [API] Error identifying agency ${id}:`, error);
    return mockAgencies[0];
  }
}

// Axios instance for authentication API
const api_auth = axios.create({
  baseURL: 'https://travyotei-backend-for-user-agency-auth-1.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add JWT token to all requests
api_auth.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');

    //For debugging
    console.log('🔐 Request to:', config.url, 'Token exists:', !!token);

    // If token exists, add it to Authorization header
    if (token) {
      // Verify token format
      if (!token.startsWith('eyJ')) {
        console.error('❌ Invalid token format - should start with "eyJ"');
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle token expiration
api_auth.interceptors.response.use(
  (response) => {
    // Optional success logging
    if (response.config.url?.includes('/profile')) {
      console.log('✅ Profile fetched successfully');
    }
    return response;
  },
  (error) => {

    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    // Handle 401 Unauthorized (token expired/invalid)
    if (error.response?.status === 401) {
      // Clear all auth-related storage
      localStorage.removeItem('token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_role');

      // Redirect to login page if in browser
      if (typeof window !== 'undefined') {
        window.location.href = '/client-join?session=expired';
      }
    }

    // Handle 404 for profile (user not found)
    if (error.response?.status === 404 && error.config?.url?.includes('/profile')) {
      console.error('❌ User profile not found in database');
      // Don't clear auth - token is valid but user doesn't exist in DB
      throw new Error('USER_NOT_FOUND');
    }

    return Promise.reject(error);
  }
);

// Helper function to extract and store auth data
const handleAuthResponse = (response: any) => {
  console.log('📡 [api.ts] handleAuthResponse: Received response data:', response.data);
  const { token, role } = response.data;

  if (token) {
    console.log('💾 [api.ts] handleAuthResponse: Storing token');
    localStorage.setItem('token', token);
    localStorage.setItem('auth_token', token);
  } else {
    console.warn('⚠️ [api.ts] handleAuthResponse: NO TOKEN found in response');
  }

  if (role) {
    console.log('💾 [api.ts] handleAuthResponse: Storing user role:', role);
    localStorage.setItem('user_role', role);
  } else {
    console.warn('⚠️ [api.ts] handleAuthResponse: NO ROLE found in response');
  }

  return response.data;
};

// Login
export const login = async (userName: string, password: string) => {
  try {
    const response = await api_auth.post('/auth/login', {
      userName,
      password,
    });

    // Store token and role
    return handleAuthResponse(response);
  } catch (error: any) {
    // Provide detailed error info
    if (error.response) {
      console.error('Login error details:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    }
    throw error;
  }
};

// Client signup
export const signup_client = async (userData: {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber: number;
  address: string;
}) => {
  try {
    console.log('Sending signup data:', JSON.stringify(userData, null, 2));
    console.log('Phone number type:', typeof userData.phoneNumber);

    const response = await api_auth.post('/auth/client/register', userData);

    // Store token and role from response
    return handleAuthResponse(response);
  } catch (error: any) {
    console.error('❌ [API] Signup (Client) error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    throw error;
  }
};

// Agency register (FIXED: should be /auth/agency/register, not /auth/admin/register)
export const signup_agency = async (userData: {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber: number;
  address: string;
  licenseNumber: string;
}) => {
  try {
    const response = await api_auth.post('/auth/agency/register', userData);

    // Store token and role from response
    return handleAuthResponse(response);
  } catch (error) {
    throw error;
  }
};

// Admin register (if you need this separately)
export const signup_admin = async (userData: {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber: number;
  address: string;
}) => {
  try {
    const response = await api_auth.post('/auth/admin/register', userData);

    // Store token and role from response
    return handleAuthResponse(response);
  } catch (error) {
    throw error;
  }
};

// Get user profile (requires JWT token)
export const fetchUserProfile = async () => {
  try {
    console.log('📡 [api.ts] fetchUserProfile: Fetching profile from /profile...');
    const response = await api_auth.get('/profile');
    const userData = response.data;
    console.log('✅ [api.ts] fetchUserProfile: Profile received:', userData);

    // Check for common data structure variations
    if (userData.user && !userData.role && userData.user.role) {
      console.log('📦 [api.ts] fetchUserProfile: Found role nested in .user property');
      userData.role = userData.user.role;
    }

    return userData;
  } catch (error: any) {
    console.error('❌ [api.ts] fetchUserProfile: Error fetching profile:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 404) {
      throw new Error('PROFILE_ENDPOINT_NOT_FOUND');
    } else if (error.response?.status === 401) {
      throw new Error('SESSION_EXPPIRED');
    }

    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userData: Partial<{
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  profileImageUrl: string;
}>) => {
  try {
    const response = await api_auth.put('/auth/profile', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update profile image specifically
export const updateProfileImage = async (imageUrl: string) => {
  try {
    // UPDATED: Using correct endpoint and body format from backend
    // Endpoint: PUT /user/profile/image-url
    // Body: { "newImageUrl": "..." }
    const response = await api_auth.put('/user/profile/image-url', {
      newImageUrl: imageUrl // Changed from profileImageUrl to match DTO
    });
    console.log('✅ Profile image updated in backend:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Update profile image error:', error);
    // Log detailed error for debugging
    if (error.response) {
      console.error('Backend error status:', error.response.status);
      console.error('Backend error data:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
};

// Update user bio specifically
export const updateUserBio = async (bio: string) => {
  try {
    // Endpoint: PUT /user/profile/bio
    // Body: The raw string as required by the backend @RequestBody String newBio
    const response = await api_auth.put('/user/profile/bio', bio, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
    console.log('✅ User bio updated in backend:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Update bio error:', error);
    if (error.response) {
      console.error('Backend error status:', error.response.status);
      console.error('Backend error data:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
};

// Validate token (optional - if you have this endpoint)
export const validateToken = async () => {
  try {
    const response = await api_auth.get('/auth/validate');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout (optional - if you have logout endpoint)
export const logout = async () => {
  try {
    // If backend has logout endpoint
    await api_auth.post('/auth/logout'); // Still to create this endpoint
  } catch (error) {
    // Even if backend logout fails, we clear frontend storage
    console.warn('Backend logout failed, clearing frontend storage');
  } finally {
    // Always clear frontend storage
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_role');
  }
};

// Check authentication status
// export const checkAuth = async () => {
//   const token = localStorage.getItem('auth_token');

//   if (!token) {
//     return { isAuthenticated: false, user: null };
//   }

//   try {
//     // Try to fetch profile to validate token
//     const userProfile = await fetchUserProfile();
//     return { isAuthenticated: true, user: userProfile };
//   } catch (error) {
//     // If profile endpoint not ready, check if we have stored user data
//     if (error instanceof Error && error.message === 'PROFILE_ENDPOINT_NOT_FOUND') {
//       const storedUser = localStorage.getItem('user_data');
//       if (storedUser) {
//         return { isAuthenticated: true, user: JSON.parse(storedUser) };
//       }
//     }

//     // Token might be invalid
//     localStorage.removeItem('auth_token');
//     localStorage.removeItem('token');
//     return { isAuthenticated: false, user: null };
//   }
// };

// Export the axios instance for direct use if needed
export { api_auth };


//Api to get all agencies
// uncomment when we want to switch to real API
// const API_URL = 'http://localhost:8181/api/v1/agencies';
// export const getAgencies = async () => {
//   try {
//     const response = await axios.get(API_URL);
//     return response.data;
//   }
//   catch (error) {
//     throw error;
//   }
// }

// export const getAgencyById = async (id: string) => {
//   try {
//     const response = await axios.get(`${API_URL}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching agency:', error);
//     return null;
//   }
// };

// API functions for tracking
const TRACKING_API = 'http://localhost:8080/api/tracking';

export const getTrackingByCode = async (code: string) => {
  try {
    const response = await fetch(`${TRACKING_API}/code/${code}`);
    if (!response.ok) throw new Error('Tracking code not found');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tracking:', error);
    return null;
  }
};

export const getTrackingHistory = async (busId: string) => {
  try {
    const response = await fetch(`${TRACKING_API}/${busId}`);
    if (!response.ok) throw new Error('History not found');
    return await response.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
};

export const updateTracking = async (data: any) => {
  try {
    const response = await fetch(`${TRACKING_API}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating tracking:', error);
    return null;
  }
};

// Creation of packages
export const create_package = async (packageData: {}) => { }
// API Base URL
const API_BASE_URL = "https://backend-planning-travyotei-12.onrender.com"

// --- TypeScript Interfaces (Matching Swagger DTOs) ---

export interface BusAmenity {
  amenityId: string
  amenityName: string
  description?: string
  agencyId: string
}

export interface BusCanTransport {
  transportId: string
  itemName: string
  description?: string
  agencyId: string
}

export interface BusReview {
  reviewId: string
  busId: string
  customerName: string
  rating: number
  comment: string
  createdAt: string
}

export interface BusImage {
  imageId: string
  busId: string
  imageUrl: string
  isPrimary: boolean
  description?: string
  publicId?: string
  s3BucketName?: string
  s3Key?: string
  fileName?: string
  contentType?: string
  fileSize?: number
  uploadedAt?: string
}

export interface BusType {
  busTypeId: string
  busTypeName: string
  agencyId: string
}

export interface BusMake {
  busMakeId: string
  makeName: string
  agencyId: string
}

export interface BusModel {
  busModelId: string
  modelName: string
  agencyId: string
}

export interface FuelType {
  fuelTypeId: string
  fuelTypeName: string
  agencyId: string
}

export interface Manufacturer {
  manufacturerId: string
  manufacturerName: string
  agencyId: string
}

export interface TransmissionType {
  transmissionTypeId: string
  typeName: string
  agencyId: string
}

export interface Location {
  locationid: string
  locationname: string
  agencyid: string
}

export interface Route {
  routeid: string
  startlocationid: string
  endlocationid: string
  agencyid: string
  stopPoints?: string[]
}

export interface RoutePrice {
  priceId: string
  routeId: string
  busId: string
  priceAmount: number
  currency: string
  agencyid: string
}

export interface Driver {
  driverId: string
  fullName: string
  phone: string
  licenseNumber: string
  description?: string
  agencyid: string
}

export interface Schedule {
  scheduleid: string
  date: string
  arrivaltime: string
  departuretime: string
  routeid: string
  busid: string
  agencyid: string
  priceid: string
  driverid: string
}

export interface Bus {
  busId: string
  registrationNumber: string
  registrationExpiryDate?: string
  totalSeats: number
  mileageKm: number
  busMakeId: string
  busModelId: string
  manufacturerId: string
  fuelTypeId: string
  transmissionTypeId: string
  busTypeId: string
  luggageCapacityKg: number
  tankCapacityLiters: number
  agencyId: string
  amenities?: BusAmenity[]
  canTransport?: BusCanTransport[]
  reviews?: BusReview[]
  images?: BusImage[]
}

// --- Real API Endpoints ---

export interface DriverImage {
  imageId: string
  driverId: string
  imageUrl: string
  isPrimary: boolean
  description?: string
  publicId?: string
  s3BucketName?: string
  s3Key?: string
  fileName?: string
  contentType?: string
  fileSize?: number
  uploadedAt?: string
}

export interface Assignment {
  assignmentId: string
  scheduleId: string
  driverId: string
  agencyId: string
  assignmentDate: string
}

export interface ScheduleDetails extends Schedule {
  bus: Bus
  route: Route
  price: RoutePrice
  driver: Driver
  busImages: BusImage[]
  busReviews: BusReview[]
  driverImages: DriverImage[]
  stopPoints: string[]
  startLocation: Location
  endLocation: Location
  busTypeName: string
  busMakeName: string
  busModelName: string
}


/**
 * Fetch all data for an agency in one go (more efficient)
 */
export async function getAgencyOverview(agencyId: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/agencies/${agencyId}/overview`)
  if (!response.ok) throw new Error("Failed to fetch agency overview")
  return response.json()
}

export async function getBuses(): Promise<Bus[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/buses`)
  if (!response.ok) throw new Error("Failed to fetch buses")
  return response.json()
}

export async function getBusById(id: string): Promise<Bus> {
  const response = await fetch(`${API_BASE_URL}/api/v1/buses/${id}`)
  if (!response.ok) throw new Error(`Failed to fetch bus with id ${id}`)
  return response.json()
}

export async function createBus(bus: Partial<Bus>, images?: File[]): Promise<Bus> {
  const response = await fetch(`${API_BASE_URL}/api/v1/buses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bus),
  })
  if (!response.ok) {
    const errorText = await response.text()
    console.error("[API] Failed to create bus:", response.status, errorText)
    throw new Error(`Failed to create bus: ${response.statusText} (${response.status})`)
  }
  return response.json()
}

export async function updateBus(id: string, bus: Partial<Bus>, images?: File[]): Promise<Bus> {
  const response = await fetch(`${API_BASE_URL}/api/v1/buses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bus),
  })
  if (!response.ok) {
    const errorText = await response.text()
    console.error("[API] Failed to update bus:", response.status, errorText)
    throw new Error(`Failed to update bus: ${response.statusText} (${response.status})`)
  }
  return response.json()
}

export async function deleteBus(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/buses/${id}`, {
    method: "DELETE",
  })
  return response.ok
}

// --- Locations ---
export async function getLocations(): Promise<Location[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/locations`)
  if (!response.ok) return []
  return response.json()
}

export async function createLocation(location: Partial<Location>): Promise<Location> {
  const response = await fetch(`${API_BASE_URL}/api/v1/locations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(location),
  })
  if (!response.ok) throw new Error("Failed to create location")
  return response.json()
}

export async function updateLocation(id: string, location: Partial<Location>): Promise<Location> {
  const response = await fetch(`${API_BASE_URL}/api/v1/locations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(location),
  })
  if (!response.ok) throw new Error("Failed to update location")
  return response.json()
}

export async function deleteLocation(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/locations/${id}`, { method: "DELETE" })
  return response.ok
}

// --- Routes ---
export async function getRoutes(): Promise<Route[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/routes`)
  if (!response.ok) return []
  return response.json()
}

export async function createRoute(route: Partial<Route>): Promise<Route> {
  const response = await fetch(`${API_BASE_URL}/api/v1/routes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(route),
  })
  if (!response.ok) {
    const errorData = await response.text().catch(() => "No error details")
    throw new Error(`Failed to create route: ${response.status} ${response.statusText} - ${errorData}`)
  }
  return response.json()
}

export async function updateRoute(id: string, route: Partial<Route>): Promise<Route> {
  const response = await fetch(`${API_BASE_URL}/api/v1/routes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(route),
  })
  if (!response.ok) {
    const errorData = await response.text().catch(() => "No error details")
    throw new Error(`Failed to update route: ${response.status} ${response.statusText} - ${errorData}`)
  }
  return response.json()
}

export async function deleteRoute(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/routes/${id}`, { method: "DELETE" })
  return response.ok
}

// --- Drivers ---
export async function getDrivers(): Promise<Driver[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/drivers`)
  if (!response.ok) return []
  return response.json()
}

export async function createDriver(driver: Partial<Driver>, photo?: File): Promise<Driver> {
  const response = await fetch(`${API_BASE_URL}/api/v1/drivers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(driver),
  })
  if (!response.ok) throw new Error("Failed to create driver")
  return response.json()
}

export async function updateDriver(id: string, driver: Partial<Driver>, photo?: File): Promise<Driver> {
  const response = await fetch(`${API_BASE_URL}/api/v1/drivers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(driver),
  })
  if (!response.ok) throw new Error("Failed to update driver")
  return response.json()
}

export async function deleteDriver(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/drivers/${id}`, { method: "DELETE" })
  return response.ok
}

// --- Schedules (Trips) ---
export async function getSchedules(): Promise<Schedule[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/schedules`)
  if (!response.ok) return []
  return response.json()
}

export async function createSchedule(schedule: Partial<Schedule>): Promise<Schedule> {
  const response = await fetch(`${API_BASE_URL}/api/v1/schedules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schedule),
  })
  if (!response.ok) throw new Error("Failed to create schedule")
  return response.json()
}

export async function updateSchedule(id: string, schedule: Partial<Schedule>): Promise<Schedule> {
  const response = await fetch(`${API_BASE_URL}/api/v1/schedules/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schedule),
  })
  if (!response.ok) throw new Error("Failed to update schedule")
  return response.json()
}

export async function deleteSchedule(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/schedules/${id}`, { method: "DELETE" })
  return response.ok
}

// --- Route Prices (Fares) ---
export async function getRoutePrices(): Promise<RoutePrice[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/route-prices`)
  if (!response.ok) return []
  return response.json()
}

export async function createRoutePrice(price: Partial<RoutePrice>): Promise<RoutePrice> {
  const response = await fetch(`${API_BASE_URL}/api/v1/route-prices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(price),
  })
  if (!response.ok) throw new Error("Failed to create fare")
  return response.json()
}

export async function updateRoutePrice(id: string, price: Partial<RoutePrice>): Promise<RoutePrice> {
  const response = await fetch(`${API_BASE_URL}/api/v1/route-prices/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(price),
  })
  if (!response.ok) throw new Error("Failed to update fare")
  return response.json()
}

export async function deleteRoutePrice(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/route-prices/${id}`, { method: "DELETE" })
  return response.ok
}

// --- Lookup Helpers ---

export async function getBusMakes(): Promise<BusMake[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-makes`)
  if (!response.ok) return []
  return response.json()
}

export async function createBusMake(make: Partial<BusMake>): Promise<BusMake> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-makes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(make),
  })
  if (!response.ok) throw new Error("Failed to create bus make")
  return response.json()
}

export async function updateBusMake(id: string, make: Partial<BusMake>): Promise<BusMake> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-makes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(make),
  })
  if (!response.ok) throw new Error("Failed to update bus make")
  return response.json()
}

export async function deleteBusMake(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-makes/${id}`, { method: "DELETE" })
  return response.ok
}

export async function getBusModels(): Promise<BusModel[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-models`)
  if (!response.ok) return []
  return response.json()
}

export async function createBusModel(model: Partial<BusModel>): Promise<BusModel> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-models`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(model),
  })
  if (!response.ok) throw new Error("Failed to create bus model")
  return response.json()
}

export async function updateBusModel(id: string, model: Partial<BusModel>): Promise<BusModel> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-models/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(model),
  })
  if (!response.ok) throw new Error("Failed to update bus model")
  return response.json()
}

export async function deleteBusModel(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-models/${id}`, { method: "DELETE" })
  return response.ok
}

export async function getManufacturers(): Promise<Manufacturer[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-manufacturers`)
  if (!response.ok) return []
  return response.json()
}

export async function createManufacturer(man: Partial<Manufacturer>): Promise<Manufacturer> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-manufacturers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(man),
  })
  if (!response.ok) throw new Error("Failed to create manufacturer")
  return response.json()
}

export async function updateManufacturer(id: string, man: Partial<Manufacturer>): Promise<Manufacturer> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-manufacturers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(man),
  })
  if (!response.ok) throw new Error("Failed to update manufacturer")
  return response.json()
}

export async function deleteManufacturer(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-manufacturers/${id}`, { method: "DELETE" })
  return response.ok
}

export async function getFuelTypes(): Promise<FuelType[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/fuel-types`)
  if (!response.ok) return []
  return response.json()
}

export async function createFuelType(type: Partial<FuelType>): Promise<FuelType> {
  const response = await fetch(`${API_BASE_URL}/api/v1/fuel-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(type),
  })
  if (!response.ok) throw new Error("Failed to create fuel type")
  return response.json()
}

export async function updateFuelType(id: string, type: Partial<FuelType>): Promise<FuelType> {
  const response = await fetch(`${API_BASE_URL}/api/v1/fuel-types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(type),
  })
  if (!response.ok) throw new Error("Failed to update fuel type")
  return response.json()
}

export async function deleteFuelType(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/fuel-types/${id}`, { method: "DELETE" })
  return response.ok
}

export async function getTransmissionTypes(): Promise<TransmissionType[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/transmission-types`)
  if (!response.ok) return []
  return response.json()
}

export async function createTransmissionType(type: Partial<TransmissionType>): Promise<TransmissionType> {
  const response = await fetch(`${API_BASE_URL}/api/v1/transmission-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(type),
  })
  if (!response.ok) throw new Error("Failed to create transmission type")
  return response.json()
}

export async function updateTransmissionType(id: string, type: Partial<TransmissionType>): Promise<TransmissionType> {
  const response = await fetch(`${API_BASE_URL}/api/v1/transmission-types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(type),
  })
  if (!response.ok) throw new Error("Failed to update transmission type")
  return response.json()
}

export async function deleteTransmissionType(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/transmission-types/${id}`, { method: "DELETE" })
  return response.ok
}

export async function getBusTypes(): Promise<BusType[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-types`)
  if (!response.ok) return []
  return response.json()
}

export async function createBusType(type: Partial<BusType>): Promise<BusType> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(type),
  })
  if (!response.ok) throw new Error("Failed to create bus type")
  return response.json()
}

export async function updateBusType(id: string, type: Partial<BusType>): Promise<BusType> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(type),
  })
  if (!response.ok) throw new Error("Failed to update bus type")
  return response.json()
}

export async function deleteBusType(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-types/${id}`, { method: "DELETE" })
  return response.ok
}

export async function getVehicleAmenities(): Promise<BusAmenity[]> {
  const response = await fetch(`${API_BASE_URL}/api/vehicle-amenities`)
  if (!response.ok) return []
  return response.json()
}

export async function createVehicleAmenity(amenity: Partial<BusAmenity>): Promise<BusAmenity> {
  const response = await fetch(`${API_BASE_URL}/api/vehicle-amenities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(amenity),
  })
  if (!response.ok) throw new Error("Failed to create amenity")
  return response.json()
}

export async function updateVehicleAmenity(id: string, amenity: Partial<BusAmenity>): Promise<BusAmenity> {
  const response = await fetch(`${API_BASE_URL}/api/vehicle-amenities/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(amenity),
  })
  if (!response.ok) throw new Error("Failed to update amenity")
  return response.json()
}

export async function deleteVehicleAmenity(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/vehicle-amenities/${id}`, { method: "DELETE" })
  return response.ok
}

export async function getBusTransportables(): Promise<BusCanTransport[]> {
  const response = await fetch(`${API_BASE_URL}/api/bus-transportables`)
  if (!response.ok) return []
  return response.json()
}

export async function createBusTransportable(item: Partial<BusCanTransport>): Promise<BusCanTransport> {
  const response = await fetch(`${API_BASE_URL}/api/bus-transportables`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  })
  if (!response.ok) throw new Error("Failed to create transportable item")
  return response.json()
}

export async function updateBusTransportable(id: string, item: Partial<BusCanTransport>): Promise<BusCanTransport> {
  const response = await fetch(`${API_BASE_URL}/api/bus-transportables/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  })
  if (!response.ok) throw new Error("Failed to update transportable item")
  return response.json()
}

export async function deleteBusTransportable(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/bus-transportables/${id}`, { method: "DELETE" })
  return response.ok
}

// --- Agency Scoped Getters & Extra Endpoints ---

export async function getBusesByAgency(agencyId: string): Promise<Bus[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/buses/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getBusByRegistrationNumber(registrationNumber: string): Promise<Bus | null> {
  const response = await fetch(`${API_BASE_URL}/api/v1/buses/registration/${registrationNumber}`)
  if (!response.ok) return null
  return response.json()
}



export async function getDriversByAgency(agencyId: string): Promise<Driver[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/drivers/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getDriverByFullName(fullName: string): Promise<Driver | null> {
  const response = await fetch(`${API_BASE_URL}/api/v1/drivers/name/${fullName}`)
  if (!response.ok) return null
  return response.json()
}

export async function getDriverByLicenseNumber(licenseNumber: string): Promise<Driver | null> {
  const response = await fetch(`${API_BASE_URL}/api/v1/drivers/license/${licenseNumber}`)
  if (!response.ok) return null
  return response.json()
}

export async function getRoutesByAgency(agencyId: string): Promise<Route[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/routes/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getLocationsByAgency(agencyId: string): Promise<Location[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/locations/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getLocationByName(locationName: string): Promise<Location | null> {
  const response = await fetch(`${API_BASE_URL}/api/v1/locations/name/${locationName}`)
  if (!response.ok) return null
  return response.json()
}

export async function getSchedulesByAgency(agencyId: string): Promise<Schedule[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/schedules/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getSchedulesByDate(date: string): Promise<Schedule[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/schedules/date/${date}`)
  if (!response.ok) return []
  return response.json()
}

export async function getSchedulesByBus(busId: string): Promise<Schedule[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/schedules/bus/${busId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getSchedulesByRoute(routeId: string): Promise<Schedule[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/schedules/route/${routeId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getScheduleDetails(scheduleId: string): Promise<ScheduleDetails> {
  const response = await fetch(`${API_BASE_URL}/api/v1/schedules/${scheduleId}/details`)
  if (!response.ok) throw new Error("Failed to fetch schedule details")
  return response.json()
}

export async function getRoutePricesByAgency(agencyId: string): Promise<RoutePrice[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/route-prices/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getBusMakesByAgency(agencyId: string): Promise<BusMake[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-makes/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getBusModelsByAgency(agencyId: string): Promise<BusModel[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-models/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getManufacturersByAgency(agencyId: string): Promise<Manufacturer[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-manufacturers/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getFuelTypesByAgency(agencyId: string): Promise<FuelType[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/fuel-types/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getTransmissionTypesByAgency(agencyId: string): Promise<TransmissionType[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/transmission-types/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getBusTypesByAgency(agencyId: string): Promise<BusType[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-types/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getVehicleAmenitiesByAgency(agencyId: string): Promise<BusAmenity[]> {
  const response = await fetch(`${API_BASE_URL}/api/vehicle-amenities/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getTransportablesByAgency(agencyId: string): Promise<BusCanTransport[]> {
  const response = await fetch(`${API_BASE_URL}/api/bus-transportables/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

// --- Driver Images ---

export async function getDriverImages(driverId: string): Promise<DriverImage[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/driver-images/driver/${driverId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getPrimaryDriverImage(driverId: string): Promise<DriverImage | null> {
  const response = await fetch(`${API_BASE_URL}/api/v1/driver-images/driver/${driverId}/primary`)
  if (!response.ok) return null
  return response.json()
}

export async function createDriverImage(image: Partial<DriverImage>): Promise<DriverImage> {
  const response = await fetch(`${API_BASE_URL}/api/v1/driver-images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(image),
  })
  if (!response.ok) throw new Error("Failed to create driver image")
  return response.json()
}

// NOTE: Creating images usually involves FormData. This is a placeholder signature.
export async function deleteDriverImage(imageId: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/driver-images/${imageId}`, { method: "DELETE" })
  return response.ok
}

// --- Bus Images ---

export async function getBusImages(busId: string): Promise<BusImage[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-images/bus/${busId}`)
  if (!response.ok) return []
  return response.json()
}

export async function getPrimaryBusImage(busId: string): Promise<BusImage | null> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-images/bus/${busId}/primary`)
  if (!response.ok) return null
  return response.json()
}

export async function createBusImage(image: Partial<BusImage>): Promise<BusImage> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(image),
  })
  if (!response.ok) throw new Error("Failed to create bus image")
  return response.json()
}

export async function deleteBusImage(imageId: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/bus-images/${imageId}`, { method: "DELETE" })
  return response.ok
}

// --- Cloudinary Helper ---

interface CloudinaryResponse {
  public_id: string
  secure_url: string
  format: string
  width: number
  height: number
  bytes: number
  created_at: string
}

export async function uploadToCloudinary(file: File): Promise<CloudinaryResponse> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME1
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET1

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", uploadPreset || "")

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Cloudinary upload failed:", response.status, errorText)
    throw new Error(`Failed to upload image to Cloudinary: ${response.statusText}`)
  }

  return response.json()
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME1
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY1
  const apiSecret = process.env.CLOUDINARY_API_SECRET1
  const timestamp = Math.round(new Date().getTime() / 1000)

  // Signature sequence: public_id=xxx&timestamp=xxx<api_secret>
  const signatureStr = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`

  // browser-native SHA1
  const msgUint8 = new TextEncoder().encode(signatureStr)
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

  const formData = new FormData()
  formData.append("public_id", publicId)
  formData.append("api_key", (apiKey as string) || "")
  formData.append("timestamp", timestamp.toString())
  formData.append("signature", signature)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Cloudinary delete failed:", response.status, errorText)
    return false
  }

  return true
}

// --- Assignments ---

export async function getAssignments(): Promise<Assignment[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/assignments`)
  if (!response.ok) return []
  return response.json()
}

export async function getAssignmentsByAgency(agencyId: string): Promise<Assignment[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/assignments/agency/${agencyId}`)
  if (!response.ok) return []
  return response.json()
}

export async function createAssignment(assignment: Partial<Assignment>): Promise<Assignment> {
  const response = await fetch(`${API_BASE_URL}/api/v1/assignments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assignment),
  })
  if (!response.ok) throw new Error("Failed to create assignment")
  return response.json()
}

export async function updateAssignment(id: string, assignment: Partial<Assignment>): Promise<Assignment> {
  const response = await fetch(`${API_BASE_URL}/api/v1/assignments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assignment),
  })
  if (!response.ok) throw new Error("Failed to update assignment")
  return response.json()
}

export async function deleteAssignment(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/assignments/${id}`, { method: "DELETE" })
  return response.ok
}

// --- Bus Reviews ---

export async function getBusReviews(): Promise<BusReview[]> {
  const response = await fetch(`${API_BASE_URL}/api/bus-reviews`)
  if (!response.ok) return []
  return response.json()
}

export async function createBusReview(review: Partial<BusReview>): Promise<BusReview> {
  const response = await fetch(`${API_BASE_URL}/api/bus-reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  })
  if (!response.ok) throw new Error("Failed to create review")
  return response.json()
}

export async function deleteBusReview(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/bus-reviews/${id}`, { method: "DELETE" })
  return response.ok
}


