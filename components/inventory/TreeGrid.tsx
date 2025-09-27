import { FlatList, StyleSheet, Text, View } from 'react-native';
import TreeCard from './TreeCard';
import { Plant } from './types';

interface TreeGridProps {
  plants: Plant[];
  onTreePress?: (plant: Plant) => void;
  emptyMessage?: string;
}

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
    <TreeCard plant={item} onPress={onTreePress} />
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
