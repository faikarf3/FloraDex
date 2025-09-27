import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ImageCaptureOptionsProps {
  onTakePhoto: () => void;
  onPickFromGallery: () => void;
  disabled?: boolean;
}

export const ImageCaptureOptions: React.FC<ImageCaptureOptionsProps> = ({
  onTakePhoto,
  onPickFromGallery,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.optionButton, disabled && styles.disabledButton]}
        onPress={onTakePhoto}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="camera" size={32} color={colors.text.light} />
        </View>
        <Text style={[styles.optionText, disabled && styles.disabledText]}>
          Take Photo
        </Text>
        <Text style={[styles.optionSubtext, disabled && styles.disabledText]}>
          Use your camera to capture a plant
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionButton, disabled && styles.disabledButton]}
        onPress={onPickFromGallery}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="images" size={32} color={colors.text.light} />
        </View>
        <Text style={[styles.optionText, disabled && styles.disabledText]}>
          Choose from Gallery
        </Text>
        <Text style={[styles.optionSubtext, disabled && styles.disabledText]}>
          Select an existing photo
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 16,
  },
  optionButton: {
    backgroundColor: colors.cards,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.buttons,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  optionSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  disabledText: {
    opacity: 0.6,
  },
});
