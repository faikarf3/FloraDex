import { Plant } from '@/components/inventory/types';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface TreeCardProps {
  plant: Plant;
  onPress?: (plant: Plant) => void;
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

export default function TreeCard({ plant, onPress }: TreeCardProps) {
  return (
    <TouchableOpacity 
      style={styles.treeItem} 
      onPress={() => onPress?.(plant)}
      activeOpacity={0.7}
    >
      <Text style={styles.treeEmoji}>{getTreeEmoji(plant.scientificName)}</Text>
      <Text style={styles.treeName} numberOfLines={2}>
        {plant.commonName || plant.scientificName.split(' ')[0]}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  treeItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 8,
    backgroundColor: '#fefae0',
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
});
