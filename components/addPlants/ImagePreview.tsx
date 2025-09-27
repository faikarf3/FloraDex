import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ImagePreviewProps {
  imageUri: string;
  onRemove: () => void;
  onIdentify: () => void;
  loading?: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUri,
  onRemove,
  onIdentify,
  loading = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          <Ionicons name="close-circle" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={[styles.identifyButton, loading && styles.loadingButton]}
        onPress={onIdentify}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Ionicons 
          name="search" 
          size={20} 
          color={colors.text.light} 
          style={styles.buttonIcon}
        />
        <Text style={styles.identifyButtonText}>
          {loading ? 'Identifying...' : 'Identify Plant'}
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
  imageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.cards,
    padding: 4,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.cards,
    borderRadius: 12,
    padding: 4,
  },
  identifyButton: {
    backgroundColor: colors.buttons,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingButton: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 8,
  },
  identifyButtonText: {
    color: colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
});
