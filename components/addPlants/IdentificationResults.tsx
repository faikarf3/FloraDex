import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IdentificationResult {
  label: string;
  score: number;
  scientificName: string;
  commonNames?: string[];
  family?: string;
  genus?: string;
}
                  
interface IdentificationResultsProps {
  results: IdentificationResult[];
  onAddToInventory: (result: IdentificationResult) => void;
  onTryAgain: () => void;
}

export const IdentificationResults: React.FC<IdentificationResultsProps> = ({
  results,
  onAddToInventory,
  onTryAgain,
}) => {
  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return colors.success;
    if (score >= 0.6) return colors.warning;
    return colors.error;
  };

  const getConfidenceText = (score: number) => {
    if (score >= 0.8) return 'High Confidence';
    if (score >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Identification Results</Text>
        <Text style={styles.subtitle}>
          {results.length} potential matches found
        </Text>
      </View>

      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {results.map((result, index) => (
          <View key={index} style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.resultInfo}>
                <Text style={styles.plantName} numberOfLines={2}>
                  {result.label}
                </Text>
                {result.commonNames && result.commonNames.length > 0 && (
                  <Text style={styles.commonName} numberOfLines={1}>
                    {result.commonNames[0]}
                  </Text>
                )}
                {result.family && (
                  <Text style={styles.taxonomy} numberOfLines={1}>
                    Family: {result.family}
                  </Text>
                )}
                <View style={styles.confidenceContainer}>
                  <View 
                    style={[
                      styles.confidenceBar, 
                      { backgroundColor: getConfidenceColor(result.score) }
                    ]} 
                  />
                  <Text style={[styles.confidenceText, { color: getConfidenceColor(result.score) }]}>
                    {Math.round(result.score * 100)}% - {getConfidenceText(result.score)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => onAddToInventory(result)}
                activeOpacity={0.8}
              >
                <Ionicons name="add-circle" size={24} color={colors.buttons} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.tryAgainButton}
        onPress={onTryAgain}
        activeOpacity={0.8}
      >
        <Ionicons name="refresh" size={20} color={colors.text.light} />
        <Text style={styles.tryAgainText}>Try Another Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.light,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.light,
    opacity: 0.8,
  },
  resultsContainer: {
    flex: 1,
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: colors.cards,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  resultInfo: {
    flex: 1,
    marginRight: 12,
  },
  plantName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
    lineHeight: 24,
  },
  commonName: {
    fontSize: 14,
    color: colors.text.primary,
    opacity: 0.8,
    marginBottom: 2,
    fontStyle: 'italic',
  },
  taxonomy: {
    fontSize: 12,
    color: colors.text.primary,
    opacity: 0.6,
    marginBottom: 8,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    padding: 8,
  },
  tryAgainButton: {
    backgroundColor: colors.buttons,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tryAgainText: {
    color: colors.text.light,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
