import { FlatList, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import TreeCard from './TreeCard';
import { Plant } from './types';

interface TreeGridProps {
  plants: Plant[];
  onTreePress?: (plant: Plant) => void;
  emptyMessage?: string;
}

export default function TreeGrid({ plants, onTreePress, emptyMessage = 'Go Add Some Plants!' }: TreeGridProps) {
  if (plants.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
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
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.light,
    textAlign: 'center',
    fontFamily: 'BitcountSingleInk_400Regular',
    lineHeight: 30,
  },
});
