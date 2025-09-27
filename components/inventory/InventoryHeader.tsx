import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';

interface InventoryHeaderProps {
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  displayName?: string;
  bio?: string;
  plantCount?: number;
}

export default function InventoryHeader({ displayName, bio, plantCount }: InventoryHeaderProps) {
  const gardenTitle = displayName ? `${displayName}'s Garden` : 'Your Garden';
  const subtitle = typeof plantCount === 'number'
    ? `${plantCount} ${plantCount === 1 ? 'plant cataloged' : 'plants cataloged'}`
    : undefined;

  return (
    <SafeAreaView edges={['top']}>
      <View style={styles.headerContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{gardenTitle}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {bio ? (
            <Text style={styles.bio} numberOfLines={2}>
              {bio}
            </Text>
          ) : null}
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
    color: colors.text.light,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: colors.text.light,
    opacity: 0.85,
  },
  bio: {
    marginTop: 8,
    fontSize: 14,
    color: colors.text.light,
    opacity: 0.75,
    textAlign: 'center',
  },
});
