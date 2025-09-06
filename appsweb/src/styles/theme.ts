// Theme configuration based on AppsMobile theme
export const theme = {
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
};

// CSS custom properties for easy Tailwind integration
export const generateCssVariables = () => `
  :root {
    --color-primary: ${theme.colors.primary};
    --color-secondary: ${theme.colors.secondary};
    --color-danger: ${theme.colors.danger};
    --color-success: ${theme.colors.success};
    --color-warning: ${theme.colors.warning};
    --color-info: ${theme.colors.info};
    --color-light: ${theme.colors.light};
    --color-dark: ${theme.colors.dark};
    --color-background: ${theme.colors.background};
    --color-surface: ${theme.colors.surface};
    --color-text-primary: ${theme.colors.text.primary};
    --color-text-secondary: ${theme.colors.text.secondary};
    --color-text-disabled: ${theme.colors.text.disabled};
    --spacing-xs: ${theme.spacing.xs}px;
    --spacing-sm: ${theme.spacing.sm}px;
    --spacing-md: ${theme.spacing.md}px;
    --spacing-lg: ${theme.spacing.lg}px;
    --spacing-xl: ${theme.spacing.xl}px;
    --border-radius-sm: ${theme.borderRadius.sm}px;
    --border-radius-md: ${theme.borderRadius.md}px;
    --border-radius-lg: ${theme.borderRadius.lg}px;
    --border-radius-xl: ${theme.borderRadius.xl}px;
    --font-size-xs: ${theme.fontSize.xs}px;
    --font-size-sm: ${theme.fontSize.sm}px;
    --font-size-md: ${theme.fontSize.md}px;
    --font-size-lg: ${theme.fontSize.lg}px;
    --font-size-xl: ${theme.fontSize.xl}px;
  }
`;

export default theme;
