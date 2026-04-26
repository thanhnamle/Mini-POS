import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 12,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          elevation: 0,
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 4,
        },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'DASHBOARD',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "grid" : "grid-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: 'SALES',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "megaphone" : "megaphone-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'ORDERS',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "receipt" : "receipt-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'STOCK',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "archive" : "archive-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'SETTINGS',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "settings" : "settings-outline"} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 18) }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName: any = 'compass-outline';
        if (route.name === 'index') iconName = isFocused ? 'grid' : 'grid-outline';
        else if (route.name === 'sales') iconName = isFocused ? 'megaphone' : 'megaphone-outline';
        else if (route.name === 'orders') iconName = isFocused ? 'receipt' : 'receipt-outline';
        else if (route.name === 'products') iconName = isFocused ? 'archive' : 'archive-outline';
        else if (route.name === 'settings') iconName = isFocused ? 'settings' : 'settings-outline';

        // ONLY RENDER THESE 5 TABS
        const allowedTabs = ['index', 'sales', 'orders', 'products', 'settings'];
        if (!allowedTabs.includes(route.name)) return null;

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.bottomTab}
          >
            <Ionicons
              name={iconName}
              size={22}
              color={isFocused ? '#111111' : '#737373'}
            />
            <Text style={[styles.bottomTabText, isFocused && styles.bottomTabTextActive]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}


const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E6E6E6',
    paddingTop: 14,
    paddingHorizontal: 8,
  },
  bottomTab: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minWidth: 80,
  },
  bottomTabText: {
    color: '#737373',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  bottomTabTextActive: {
    color: '#111111',
  },
});