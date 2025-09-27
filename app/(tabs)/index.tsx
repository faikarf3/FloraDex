<<<<<<< HEAD
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthWrapper from '@/components/AuthWrapper';
=======
import {
  FilterButtons,
  InventoryHeader,
  InventoryStats,
  InventoryStatsType,
  Plant,
  TreeGrid,
} from '@/components/inventory';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserPlants } from '@/hooks/useUserPlants';
import { useUserProfile } from '@/hooks/useUserProfile';
import { colors } from '@/constants/colors';
import { removeUserPlant, updateUserPlant } from '@/services/user';

export default function InventoryScreen() {
  const { user } = useAuth();
  const userId = user?.uid;
  const {
    plants: rawPlants,
    loading: plantsLoading,
    error: plantsError,
  } = useUserPlants(userId);
  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useUserProfile(userId);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [isPlantModalVisible, setIsPlantModalVisible] = useState(false);
  const [editPlantName, setEditPlantName] = useState('');
  const [plantModalLoading, setPlantModalLoading] = useState(false);

  useEffect(() => {
    if (plantsError) {
      Alert.alert('Inventory Error', plantsError.message);
    }
  }, [plantsError]);

  useEffect(() => {
    if (profileError) {
      Alert.alert('Profile Error', profileError.message);
    }
  }, [profileError]);

  useEffect(() => {
    if (!selectedPlantId) {
      return;
    }

    const target = rawPlants.find((plant) => plant.id === selectedPlantId);
    if (target) {
      setEditPlantName(target.plantRef ?? '');
    }
  }, [rawPlants, selectedPlantId]);

  const plants: Plant[] = useMemo(() => {
    return rawPlants.map((plant) => {
      const scientificName = plant.plantRef || 'Unknown species';
      return {
        id: plant.id,
        scientificName,
        commonName: scientificName,
        confidence: 1,
        dateAdded: plant.createdAt ? plant.createdAt.toISOString() : new Date().toISOString(),
      };
    });
  }, [rawPlants]);

  const stats: InventoryStatsType = useMemo(() => {
    const totalPlants = plants.length;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentAdditions = plants.filter((plant) => {
      const addedDate = new Date(plant.dateAdded);
      return addedDate >= weekAgo;
    }).length;

    const speciesCounts = plants.reduce<Record<string, number>>((acc, plant) => {
      const key = plant.scientificName || 'Unknown';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    const topSpecies = Object.entries(speciesCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return {
      totalPlants,
      recentAdditions,
      topSpecies,
    };
  }, [plants]);

  const selectedPlant = useMemo(() => {
    if (!selectedPlantId) {
      return null;
    }
    return rawPlants.find((plant) => plant.id === selectedPlantId) ?? null;
  }, [rawPlants, selectedPlantId]);

  const handleClosePlantModal = () => {
    setIsPlantModalVisible(false);
    setSelectedPlantId(null);
    setEditPlantName('');
    setPlantModalLoading(false);
  };

  const handlePlantPress = (plant: Plant) => {
    setSelectedPlantId(plant.id);
    setEditPlantName(plant.scientificName);
    setIsPlantModalVisible(true);
  };

  const handleUpdateSelectedPlant = async () => {
    if (!userId || !selectedPlantId) {
      return;
    }

    const trimmedName = editPlantName.trim();
    if (!trimmedName) {
      Alert.alert('Validation error', 'Please provide a plant name.');
      return;
    }

    try {
      setPlantModalLoading(true);
      await updateUserPlant(userId, selectedPlantId, trimmedName);
      handleClosePlantModal();
    } catch (error: any) {
      Alert.alert('Update failed', error?.message || 'Unable to update this plant right now.');
    } finally {
      setPlantModalLoading(false);
    }
  };

  const removeSelectedPlant = async () => {
    if (!userId || !selectedPlantId) {
      return;
    }

    try {
      setPlantModalLoading(true);
      await removeUserPlant(userId, selectedPlantId);
      handleClosePlantModal();
    } catch (error: any) {
      Alert.alert('Removal failed', error?.message || 'Unable to remove this plant right now.');
    } finally {
      setPlantModalLoading(false);
    }
  };

  const confirmRemoveSelectedPlant = () => {
    const name = editPlantName || selectedPlant?.plantRef || 'this plant';
    Alert.alert(
      'Remove plant',
      `Are you sure you want to remove ${name} from your inventory?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            void removeSelectedPlant();
          },
        },
      ]
    );
  };

  const isLoading = plantsLoading || profileLoading;
>>>>>>> 09a7ceb (WIP: saving changes before switching)

export default function HomeScreen() {
  return (
<<<<<<< HEAD
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}
=======
    <SafeAreaView style={styles.container}>
      <InventoryHeader
        displayName={profile?.displayName}
        bio={profile?.bio}
        plantCount={profile?.plantCount}
      />

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fefae0" />
            <Text style={styles.loadingText}>Loading your collection...</Text>
          </View>
        ) : (
          <>
            <InventoryStats stats={stats} />
            <FilterButtons />
            <TreeGrid
              plants={plants}
              onTreePress={handlePlantPress}
            />
          </>
        )}
      </View>

      <Modal
        visible={isPlantModalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleClosePlantModal}
      >
        <View style={styles.plantModalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.plantModalContentWrapper}
          >
            <View style={styles.plantModalContent}>
              <Text style={styles.plantModalTitle}>Manage Plant</Text>
              <Text style={styles.plantModalSubtitle}>
                {selectedPlant?.createdAt
                  ? `Added on ${selectedPlant.createdAt.toLocaleDateString()}`
                  : 'Recently added'}
              </Text>

              <Text style={styles.plantModalLabel}>Plant name</Text>
              <TextInput
                style={styles.plantModalInput}
                value={editPlantName}
                onChangeText={setEditPlantName}
                autoCapitalize="words"
                placeholder="Enter a plant name"
              />

              <View style={styles.plantModalActions}>
                <TouchableOpacity
                  style={[styles.plantModalButton, styles.plantModalSecondaryButton]}
                  onPress={handleClosePlantModal}
                  disabled={plantModalLoading}
                >
                  <Text style={styles.plantModalSecondaryText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.plantModalButton, styles.plantModalDangerButton]}
                  onPress={confirmRemoveSelectedPlant}
                  disabled={plantModalLoading}
                >
                  <Text style={styles.plantModalDangerText}>Remove</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.plantModalButton, styles.plantModalPrimaryButton, plantModalLoading && styles.plantModalButtonDisabled]}
                  onPress={handleUpdateSelectedPlant}
                  disabled={plantModalLoading}
                >
                  {plantModalLoading ? (
                    <ActivityIndicator size="small" color={colors.text.light} />
                  ) : (
                    <Text style={styles.plantModalPrimaryText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#819067',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#fefae0',
    fontSize: 16,
    fontWeight: '600',
  },
  plantModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  plantModalContentWrapper: {
    width: '100%',
  },
  plantModalContent: {
    backgroundColor: colors.cards,
    borderRadius: 16,
    padding: 24,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  plantModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  plantModalSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  plantModalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  plantModalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.cards,
  },
  plantModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  plantModalButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  plantModalPrimaryButton: {
    backgroundColor: colors.buttons,
  },
  plantModalSecondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  plantModalDangerButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.error,
  },
  plantModalButtonDisabled: {
    opacity: 0.6,
  },
  plantModalPrimaryText: {
    color: colors.text.light,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  plantModalSecondaryText: {
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  plantModalDangerText: {
    color: colors.error,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});
>>>>>>> 09a7ceb (WIP: saving changes before switching)
