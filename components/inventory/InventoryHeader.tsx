import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface InventoryHeaderProps {
  onSearchPress?: () => void;
  onFilterPress?: () => void;
}

export default function InventoryHeader({ onSearchPress, onFilterPress }: InventoryHeaderProps) {
  return (
    <SafeAreaView edges={['top']}>
      <View style={styles.headerContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Your Garden</Text>
        </View>
        
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fefae0',
    textAlign: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
    color: '#333333',
  },
});
