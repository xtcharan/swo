// TypeScript type definitions for DBC Event Management App

export interface UserData {
  email: string;
  isCollegeStudent: boolean;
  userType: 'dbc-student' | 'other-college-student' | 'external';
  firstName: string;
  lastName: string;
  department: string;
  semester: string;
  year: string;
  collegeOrg: string;
  phone: string;
  password: string;
  otpCode: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  registrations: number;
  category: string;
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  status: 'confirmed' | 'waiting' | 'cancelled';
  bookedAt: string;
}

export interface User {
  id: string;
  email: string;
  role: 'student' | 'admin' | 'external';
  firstName: string;
  lastName: string;
  department?: string;
  semester?: string;
  phone?: string;
}

export type ScreenType =
  | 'welcome'
  | 'signin'
  | 'signup-email'
  | 'signup-coll-form'
  | 'signup-ext-form'
  | 'email-verification'
  | 'password-setup'
  | 'dashboard'
  | 'student-dashboard'
  | 'admin-dashboard'
  | 'events'
  | 'bookings';

export type UserRole = 'student' | 'admin' | 'external' | null;

export interface AuthError {
  message: string;
  code?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Component Props Interfaces
export interface BaseScreenProps {
  navigation?: any;
}

export interface FormData {
  [key: string]: any;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  autoCapitalize?: 'none' | 'words' | 'sentences';
  multiline?: boolean;
  numberOfLines?: number;
}

export interface CardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  icon?: string;
  variant?: 'default' | 'elevated' | 'flat';
  onPress?: () => void;
}

export interface HeaderProps {
  title: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export interface EventCardProps {
  event: Event;
  onPress?: () => void;
  showRegisterButton?: boolean;
  isRegistered?: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: AuthError;
  message?: string;
}

// Navigation Types
export interface NavigationProps {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  userRole: UserRole;
  setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
}

// Style Types (if using styled-components)
export interface StyleProps {
  variant?: string;
  size?: string;
  color?: string;
  disabled?: boolean;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  danger: string;
  success: string;
  warning: string;
  info: string;
  light: string;
  dark: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
}

export interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    fontWeight: {
      light: string;
      normal: string;
      medium: string;
      bold: string;
    };
  };
}
