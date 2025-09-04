import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { ButtonProps } from '../../types';
import { theme, formStyles } from '../../styles/theme';

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  size = 'medium',
}) => {
  const getButtonStyle = () => {
    let baseStyle = { ...formStyles.button };

    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = theme.colors.primary;
        break;
      case 'secondary':
      case 'outline':
        baseStyle = { ...baseStyle, ...formStyles.buttonSecondary };
        break;
      case 'danger':
        baseStyle.backgroundColor = theme.colors.danger;
        break;
      default:
        break;
    }

    switch (size) {
      case 'small':
        baseStyle.padding = theme.spacing.sm;
        break;
      case 'large':
        baseStyle.padding = theme.spacing.lg;
        break;
      default: // medium
        baseStyle.padding = theme.spacing.md;
        break;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={getButtonStyle()}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text style={formStyles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
