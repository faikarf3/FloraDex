import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FilterButtonsProps {
  onSpeciesFilter?: () => void;
  onSortFilter?: () => void;
}

export default function FilterButtons({ onSpeciesFilter, onSortFilter }: FilterButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.filterButton} 
        onPress={onSpeciesFilter}
        activeOpacity={0.7}
      >
        <Text style={styles.filterButtonText}>All species</Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.filterButton} 
        onPress={onSortFilter}
        activeOpacity={0.7}
      >
        <Text style={styles.filterButtonText}>Recent</Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fefae0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 12,
    color: '#666666',
  },
});
