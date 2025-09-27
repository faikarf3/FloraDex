import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Plant } from './types';

interface TreeGridProps {
  plants: Plant[];
  onTreePress?: (plant: Plant) => void;
  emptyMessage?: string;
}

// Tree emoji representations for different species
const getTreeEmoji = (scientificName: string) => {
  const name = scientificName.toLowerCase();
  if (name.includes('rosa') || name.includes('rose')) return '🌹';
  if (name.includes('quercus') || name.includes('oak')) return '🌳';
  if (name.includes('taraxacum') || name.includes('dandelion')) return '🌼';
  if (name.includes('pinus') || name.includes('pine')) return '🌲';
  if (name.includes('acer') || name.includes('maple')) return '🍁';
  if (name.includes('betula') || name.includes('birch')) return '🌿';
  if (name.includes('populus') || name.includes('poplar')) return '🍃';
  if (name.includes('salix') || name.includes('willow')) return '🌿';
  return '🌱'; // default
};

export default function TreeGrid({ plants, onTreePress, emptyMessage = "No trees in your forest yet" }: TreeGridProps) {
  if (plants.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
        <Text style={styles.emptySubtext}>
          Start scanning trees to build your forest!
        </Text>
      </View>
    );
  }

  const renderTreeItem = ({ item }: { item: Plant }) => (
    <TouchableOpacity 
      style={styles.treeItem} 
      onPress={() => onTreePress?.(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.treeEmoji}>{getTreeEmoji(item.scientificName)}</Text>
      <Text style={styles.treeName} numberOfLines={2}>
        {item.commonName || item.scientificName.split(' ')[0]}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={plants}
      keyExtractor={(item) => item.id}
      renderItem={renderTreeItem}
      numColumns={3}
      contentContainerStyle={styles.gridContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  treeItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  treeEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  treeName: {
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
  },
});
