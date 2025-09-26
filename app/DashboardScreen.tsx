import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../constants/colors';
import { useRouter } from "expo-router";



export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Success', 'Logged out successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Logout failed');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Welcome to FloraDex!</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>User Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>User ID:</Text>
            <Text style={styles.infoValue}>{user?.uid}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email Verified:</Text>
            <Text style={styles.infoValue}>
              {user?.emailVerified ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Help & Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>FloraDex Features</Text>
          <Text style={styles.featureText}>
            🌱 Plant identification and care guides
          </Text>
          <Text style={styles.featureText}>
            📸 Photo recognition for plant species
          </Text>
          <Text style={styles.featureText}>
            📅 Plant care reminders and tracking
          </Text>
          <Text style={styles.featureText}>
            🌍 Community plant sharing
          </Text>
        </View>
        

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.navbar,
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
    shadowColor: colors.navbar,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.light,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.text.light,
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: colors.cards,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: colors.navbar,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.text.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 2,
    textAlign: 'right',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.navbar,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  featureText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 12,
    lineHeight: 24,
  },
  logoutButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: colors.error,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutButtonText: {
    color: colors.text.light,
    fontSize: 18,
    fontWeight: '700',
  },
});
