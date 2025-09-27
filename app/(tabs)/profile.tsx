import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPlants } from '@/hooks/useUserPlants';
import { useUserProfile } from '@/hooks/useUserProfile';
import { updateUserProfile } from '@/services/user';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const userId = user?.uid;
  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useUserProfile(userId);
  const {
    plants,
    loading: plantsLoading,
    error: plantsError,
  } = useUserPlants(userId);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (profileError) {
      Alert.alert('Profile Error', profileError.message);
    }
  }, [profileError]);

  useEffect(() => {
    if (plantsError) {
      Alert.alert('Inventory Error', plantsError.message);
    }
  }, [plantsError]);

  useEffect(() => {
    setEditUsername(profile?.username ?? '');
    setEditBio(profile?.bio ?? '');
  }, [profile]);

  const stats = useMemo(() => {
    const collected = profile?.plantCount ?? plants.length;
    const identified = plants.length;

    const createdAtDate = profile?.createdAt?.toDate?.();
    const now = new Date();
    const daysActive = createdAtDate
      ? Math.max(1, Math.ceil((now.getTime() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    const speciesCounts = plants.reduce<Record<string, number>>((acc, plant) => {
      const key = plant.scientificName || 'Unknown';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    const [favoritePlant] = Object.entries(speciesCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);

    return {
      plantsCollected: collected,
      plantsIdentified: identified,
      daysActive,
      favoritePlant,
    };
  }, [plants, profile]);

  const memberSince = useMemo(() => {
    const createdAtDate = profile?.createdAt?.toDate?.();
    return createdAtDate ? createdAtDate.toLocaleDateString() : undefined;
  }, [profile]);

  const avatarInitial = useMemo(() => {
    if (profile?.displayName) {
      return profile.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  }, [profile?.displayName, user?.email]);

  const profileName = profile?.displayName || profile?.username || user?.email?.split('@')[0] || 'User';
  const profileEmail = profile?.email || user?.email;

  const handleLogout = async () => {
    try {
      await logout();
      setIsEditVisible(false);
    } catch {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleEditProfile = () => {
    setIsEditVisible(true);
  };

  const handleCancelEdit = () => {
    setEditUsername(profile?.username ?? '');
    setEditBio(profile?.bio ?? '');
    setIsEditVisible(false);
  };

  const handleSaveProfile = async () => {
    if (!userId) {
      Alert.alert('Not signed in', 'Please sign in to update your profile.');
      return;
    }

    const trimmedUsername = editUsername.trim();
    if (!trimmedUsername) {
      Alert.alert('Validation error', 'Username cannot be empty.');
      return;
    }

    try {
      setSavingProfile(true);
      await updateUserProfile(userId, {
        username: trimmedUsername,
        displayName: profile?.displayName ?? trimmedUsername,
        bio: editBio,
      });
      setIsEditVisible(false);
    } catch (error: any) {
      Alert.alert('Update failed', error?.message || 'Unable to update profile right now.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'App settings feature coming soon!');
  };

  const handleHelp = () => {
    Alert.alert('Help & Support', 'Help and support feature coming soon!');
  };

  const isLoading = profileLoading || plantsLoading;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading && (
          <View style={styles.loadingBanner}>
            <ActivityIndicator size="small" color={colors.text.light} />
            <Text style={styles.loadingText}>Loading your profile...</Text>
          </View>
        )}

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {avatarInitial}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profileName}
            </Text>
            {profile?.username ? (
              <Text style={styles.profileUsername}>@{profile.username}</Text>
            ) : null}
            <Text style={styles.profileEmail}>{profileEmail}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.plantsCollected}</Text>
              <Text style={styles.statLabel}>Plants Collected</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.plantsIdentified}</Text>
              <Text style={styles.statLabel}>Plants Identified</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.daysActive}</Text>
              <Text style={styles.statLabel}>Days Active</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber} numberOfLines={1} adjustsFontSizeToFit>
                {stats.favoritePlant || '🌱'}
              </Text>
              <Text style={styles.statLabel}>Favorite Species</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionCard}>
            <TouchableOpacity style={styles.actionItem} onPress={handleSettings}>
              <Text style={styles.actionEmoji}>⚙️</Text>
              <Text style={styles.actionText}>Settings</Text>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={handleHelp}>
              <Text style={styles.actionEmoji}>❓</Text>
              <Text style={styles.actionText}>Help & Support</Text>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About You</Text>

          <View style={styles.infoCard}>
            <Text style={styles.appDescription}>
              {profile?.bio?.trim()
                ? profile.bio
                : 'Add a short bio to let others know more about your plant journey.'}
            </Text>
            <Text style={styles.version}>
              Username · {profile?.username || 'Not set'}
            </Text>
            {memberSince && (
              <Text style={styles.version}>Member since · {memberSince}</Text>
            )}
            <Text style={styles.version}>Plants cataloged · {profile?.plantCount ?? plants.length}</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={isEditVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContentWrapper}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <Text style={styles.modalDescription}>
                Update how your garden appears to others.
              </Text>

              <Text style={styles.modalLabel}>Username</Text>
              <TextInput
                style={styles.modalInput}
                value={editUsername}
                onChangeText={setEditUsername}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Enter a username"
              />

              <Text style={styles.modalLabel}>Bio</Text>
              <TextInput
                style={styles.modalTextArea}
                value={editBio}
                onChangeText={setEditBio}
                placeholder="Share a little about your plant journey"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalSecondaryButton]}
                  onPress={handleCancelEdit}
                  disabled={savingProfile}
                >
                  <Text style={styles.modalSecondaryText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalPrimaryButton, savingProfile && styles.modalButtonDisabled]}
                  onPress={handleSaveProfile}
                  disabled={savingProfile}
                >
                  {savingProfile ? (
                    <ActivityIndicator size="small" color={colors.text.light} />
                  ) : (
                    <Text style={styles.modalPrimaryText}>Save</Text>
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
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContentWrapper: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: colors.cards,
    borderRadius: 16,
    padding: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  modalDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.cards,
  },
  modalTextArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 120,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.cards,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  modalPrimaryButton: {
    backgroundColor: colors.buttons,
  },
  modalSecondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalPrimaryText: {
    color: colors.text.light,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  modalSecondaryText: {
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  loadingText: {
    color: colors.text.light,
    fontSize: 14,
    fontWeight: '600',
  },
  profileHeader: {
    backgroundColor: colors.cards,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.navbar,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.light,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 16,
    color: colors.text.muted,
  },
  editButton: {
    backgroundColor: colors.buttons,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: colors.text.light,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: colors.cards,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.navbar,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.muted,
    textAlign: 'center',
  },
  actionCard: {
    backgroundColor: colors.cards,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  actionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  actionArrow: {
    fontSize: 20,
    color: colors.text.muted,
  },
  infoCard: {
    backgroundColor: colors.cards,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  appDescription: {
    fontSize: 16,
    color: colors.text.muted,
    lineHeight: 22,
    marginBottom: 12,
  },
  version: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: colors.error,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoutButtonText: {
    color: colors.text.light,
    fontSize: 18,
    fontWeight: '600',
  },
});
