import { colors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AddPlantsHeaderProps {
  title?: string;
  subtitle?: string;
}

export const AddPlantsHeader: React.FC<AddPlantsHeaderProps> = ({
  title = "Add Plants",
  subtitle = "Identify plants by taking a photo or choosing from your gallery"
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.light,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.light,
    opacity: 0.9,
    lineHeight: 22,
    textAlign: 'center',
  },
});
