import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { InputProps } from '../../types';
import { formStyles } from '../../styles/theme';

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
}) => {
  return (
    <View>
      {label && (
        <Text style={formStyles.inputLabel}>{label}</Text>
      )}

      <TextInput
        style={formStyles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
      />

      {error && (
        <Text style={formStyles.inputError}>{error}</Text>
      )}
    </View>
  );
};

export default Input;
