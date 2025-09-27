import { StyleSheet, Text, View } from 'react-native';
import { InventoryStats as Stats } from './types';

interface InventoryStatsProps {
  stats: Stats;
}

export default function InventoryStats({ stats }: InventoryStatsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{stats.totalPlants}</Text>
        <Text style={styles.statLabel}>Total Collected</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{stats.recentAdditions}</Text>
        <Text style={styles.statLabel}>Today</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{stats.topSpecies.length}</Text>
        <Text style={styles.statLabel}>Species</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fefae0',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#fefae0',
    textAlign: 'center',
  },
});
