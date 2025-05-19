export interface ThemeState {
  theme: string;
}

export interface AxiosContextReturn {
  post: (url: string, data?: object) => Promise;
  loading: boolean;
}

export interface DecodedToken {
  userRole: string;
}

export interface RoleRoutes {
  [key: string]: string[];
}

export interface User {
  cartItems: [];
  email: string;
  f_name: string;
  id: string;
  isVerified: boolean;
  l_name: string;
  role: string;
}

export interface UserState {
  currentUser: User | null;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  brand: string;
  color: string;
  material: string;
  compatibleDevices: string;
  screenSize: string;
  dimensions: string;
  batteryLife: string;
  sensorType: string;
  batteryDescription: string;
  features: string[];
  rating: number;
}

export interface ProductDetailsSectionProps {
  product: Product;
  totalRatings: number;
  ratingDistribution: number[];
}

export interface InitialStateTypes {
  isSidebarCollapsed: boolean;
  currentUser: object;
  cartItems: { [productId: number]: number };
  loading: boolean;
}
