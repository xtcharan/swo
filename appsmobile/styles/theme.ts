import { Dimensions, StatusBar } from 'react-native';
import { Theme } from '../types';

// Default theme for DBC Event Management App
export const theme: Theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    danger: '#dc3545',
    success: '#28a745',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    background: '#f8f9fa',
    surface: '#ffffff',
    text: {
      primary: '#333',
      secondary: '#6c757d',
      disabled: '#adb5bd',
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },

  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      bold: '700',
    },
  },
};

// Common dimensions
export const dimensions = {
  screenWidth: Dimensions.get('window').width,
  screenHeight: Dimensions.get('window').height,
  statusBarHeight: StatusBar.currentHeight || 24,
};

// Shadow styles
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
};

// Border styles
export const borders = {
  primary: {
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  secondary: {
    borderColor: theme.colors.secondary,
    borderWidth: 1,
  },
  light: {
    borderColor: theme.colors.light,
    borderWidth: 1,
  },
};

// Common layout styles
export const layout = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
};

// Form styles
export const formStyles = {
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    backgroundColor: '#f9f9f9',
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500' as const,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },
  inputError: {
    color: theme.colors.danger,
    fontSize: theme.typography.fontSize.xs,
    marginBottom: theme.spacing.sm,
    textAlign: 'center' as const,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    alignItems: 'center' as const,
  },
  buttonText: {
    color: '#fff',
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '700' as const,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.secondary,
  },
};

export default theme;
