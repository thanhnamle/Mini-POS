import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ShopLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 70 + insets.bottom,
          backgroundColor: '#FFFFFF',
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: '#E6E6E6',
          paddingBottom: insets.bottom,
        },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: 'SHOP',
          tabBarIcon: ({ color }) => <Ionicons name="compass-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'ORDERS',
          tabBarIcon: ({ color }) => <Ionicons name="bag-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="checkout"
        options={{
          title: 'CHECKOUT',
          tabBarIcon: ({ color }) => <Ionicons name="cart-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'PROFILE',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} />,
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
        if (route.name === 'explore') iconName = isFocused ? 'compass' : 'compass-outline';
        else if (route.name === 'orders'  ) iconName = isFocused ? 'bag' : 'bag-outline';
        else if (route.name === 'checkout') iconName = isFocused ? 'cart' : 'cart-outline';
        else if (route.name === 'settings') iconName = isFocused ? 'person' : 'person-outline';

        // ONLY RENDER THESE 4 TABS
        const allowedTabs = ['explore', 'orders', 'checkout', 'settings'];
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

