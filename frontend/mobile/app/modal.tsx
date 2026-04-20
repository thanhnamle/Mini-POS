import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const highlights = [
  'Inventory control that feels calm, not cluttered.',
  'Checkout flows built for premium in-store service.',
  'Reporting that helps buyers and managers act faster.',
];

export default function ModalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.overlay}>
      <StatusBar style="dark" />
      <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()} />

      <SafeAreaView
        edges={['bottom']}
        style={[
          styles.sheetWrap,
          {
            paddingBottom: Math.max(insets.bottom, 18),
          },
        ]}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <Text style={styles.brand}>ATELIER</Text>
            <Pressable
              accessibilityLabel="Close modal"
              onPress={() => router.back()}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={20} color="#111111" />
            </Pressable>
          </View>

          <Text style={styles.title}>Designed for quiet, premium retail.</Text>
          <Text style={styles.description}>
            Atelier POS keeps the front-of-house experience elegant while your team stays fast,
            informed, and fully in control behind the scenes.
          </Text>

          <View style={styles.list}>
            {highlights.map((item) => (
              <View key={item} style={styles.listItem}>
                <View style={styles.listIcon}>
                  <Ionicons name="checkmark" size={14} color="#111111" />
                </View>
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/(auth)/login')}
            style={({ pressed }) => [styles.primaryAction, pressed && styles.primaryActionPressed]}
          >
            <Text style={styles.primaryActionText}>CONTINUE TO LOGIN</Text>
          </Pressable>

          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.secondaryAction}>
            <Text style={styles.secondaryActionText}>Back to welcome</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(17, 17, 17, 0.16)',
  },
  sheetWrap: {
    paddingHorizontal: 16,
  },
  sheet: {
    borderRadius: 28,
    backgroundColor: '#F8F6F2',
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 24,
    shadowColor: '#111111',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -6 },
    elevation: 20,
  },
  handle: {
    alignSelf: 'center',
    width: 54,
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(17,17,17,0.16)',
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  brand: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.8,
    color: '#111111',
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ECE8E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#111111',
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '900',
    letterSpacing: -1.2,
    marginBottom: 12,
  },
  description: {
    color: '#5A5857',
    fontSize: 16,
    lineHeight: 28,
    marginBottom: 24,
  },
  list: {
    marginBottom: 28,
    rowGap: 14,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E9E5DE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  listText: {
    flex: 1,
    color: '#111111',
    fontSize: 15,
    lineHeight: 24,
  },
  primaryAction: {
    height: 52,
    borderRadius: 999,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryActionPressed: {
    opacity: 0.92,
  },
  primaryActionText: {
    color: '#F8F6F2',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  secondaryAction: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
  },
  secondaryActionText: {
    color: '#5A5857',
    fontSize: 15,
    fontWeight: '600',
  },
});
