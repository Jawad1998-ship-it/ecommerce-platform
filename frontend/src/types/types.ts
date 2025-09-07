import { NextRouter } from "next/router";

export interface ThemeState {
  theme: string;
}

export interface AxiosContextReturn {
  post: (url: string, data?: object) => Promise;
  loading: boolean;
}

export interface ProductImageUploaderProps {
  isEditingForm: boolean;
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

export interface Attribute {
  name: string;
  type: "text" | "number" | "select";
  required: boolean;
  options?: string[];
}

export interface Category {
  _id: string;
  name: string;
  attributes: Attribute[];
}

export interface AddProductFormProps {
  theme: string;
  router: NextRouter;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrls: string[];
  description?: string;
  brand?: string;
  category?: string;
  features?: string[];
  attributes?: {
    [key: string]: string | string[];
  };
  isInStock?: boolean;
  originalPrice?: number;
  cloudinaryPublicIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  searchInfo: {
    query: string;
    category: string;
    resultsCount: number;
  };
}

export interface ProductDetailsSectionProps {
  product: Product;
  totalRatings: number;
  ratingDistribution: number[];
  isTryOnOpen: boolean;
  setIsTryOnOpen: (isOpen: boolean) => void;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface InitialStateTypes {
  isSidebarCollapsed: boolean;
  currentUser: object;
  cartItems: {
    [key: string]: CartItem;
  };
  loading: boolean;
}

export interface Attribute {
  name: string;
  type: "text" | "number" | "select";
  required: boolean;
  options?: string[];
}

export interface CategoryFormData {
  name: string;
  description: string;
  requiresApproval: boolean;
  allowedUsers: string[];
  attributes: Attribute[];
}

export interface CategoryFormProps {
  theme: string;
}

export interface CustomInputFieldProps {
  name: string;
  label: string;
  type?: string;
  as?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}
