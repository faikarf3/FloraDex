import {
  FilterButtons,
  InventoryHeader,
  InventoryStats,
  InventoryStatsType,
  Plant,
  TreeGrid
} from '@/components/inventory';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for demonstration - replace with actual data fetching
const mockPlants: Plant[] = [
  {
    id: '1',
    scientificName: 'Quercus alba',
    commonName: 'White Oak',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    confidence: 0.95,
    dateAdded: '2024-01-15T10:30:00Z',
    location: { latitude: 37.7749, longitude: -122.4194 },
    notes: 'Found in the park near the main entrance',
    tags: ['tree', 'native']
  },
  {
    id: '2',
    scientificName: 'Pinus strobus',
    commonName: 'Eastern White Pine',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    confidence: 0.87,
    dateAdded: '2024-01-14T14:20:00Z',
    location: { latitude: 37.7849, longitude: -122.4094 },
    notes: 'Large specimen with distinctive bark',
    tags: ['tree', 'conifer']
  },
  {
    id: '3',
    scientificName: 'Acer saccharum',
    commonName: 'Sugar Maple',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
    confidence: 0.92,
    dateAdded: '2024-01-13T09:15:00Z',
    location: { latitude: 37.7649, longitude: -122.4294 },
    tags: ['tree', 'deciduous']
  },
  {
    id: '4',
    scientificName: 'Betula papyrifera',
    commonName: 'Paper Birch',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
    confidence: 0.88,
    dateAdded: '2024-01-12T16:45:00Z',
    location: { latitude: 37.7549, longitude: -122.4394 },
    tags: ['tree', 'deciduous']
  },
  {
    id: '5',
    scientificName: 'Populus tremuloides',
    commonName: 'Quaking Aspen',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
    confidence: 0.85,
    dateAdded: '2024-01-11T11:30:00Z',
    location: { latitude: 37.7449, longitude: -122.4494 },
    tags: ['tree', 'deciduous']
  },
  {
    id: '6',
    scientificName: 'Salix babylonica',
    commonName: 'Weeping Willow',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
    confidence: 0.90,
    dateAdded: '2024-01-10T08:20:00Z',
    location: { latitude: 37.7349, longitude: -122.4594 },
    tags: ['tree', 'deciduous']
  }
];

const mockStats: InventoryStatsType = {
  totalPlants: 6,
  recentAdditions: 2,
  topSpecies: [
    { name: 'Quercus alba', count: 1 },
    { name: 'Pinus strobus', count: 1 },
    { name: 'Acer saccharum', count: 1 },
    { name: 'Betula papyrifera', count: 1 },
    { name: 'Populus tremuloides', count: 1 },
    { name: 'Salix babylonica', count: 1 }
  ]
};

export default function InventoryScreen() {
  const { user, logout } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [stats, setStats] = useState<InventoryStatsType>(mockStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setPlants(mockPlants);
      setLoading(false);
    }, 1000);
  }, []);

  const handlePlantPress = (plant: Plant) => {
    Alert.alert(
      plant.commonName || plant.scientificName,
      `Confidence: ${Math.round(plant.confidence * 100)}%\nAdded: ${new Date(plant.dateAdded).toLocaleDateString()}`
    );
  };

  const handleSearchPress = () => {
    Alert.alert('Search', 'Search functionality coming soon!');
  };

  const handleSpeciesFilter = () => {
    Alert.alert('Species Filter', 'Filter by tree species coming soon!');
  };

  const handleSortFilter = () => {
    Alert.alert('Sort Filter', 'Sort by date, name, or type coming soon!');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Logout failed');
    }
  };

  // Note: Authentication is now handled at the root level in AuthWrapper
  // This component will only render when user is authenticated

  return (
    <SafeAreaView style={styles.container}>
      <InventoryHeader 
        onSearchPress={handleSearchPress}
        onFilterPress={handleLogout}
      />
      
      <View style={styles.content}>
        <InventoryStats stats={stats} />
        <FilterButtons 
          onSpeciesFilter={handleSpeciesFilter}
          onSortFilter={handleSortFilter}
        />
        <TreeGrid 
          plants={plants} 
          onTreePress={handlePlantPress}
          emptyMessage="No trees in your forest yet"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#2D5016',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
