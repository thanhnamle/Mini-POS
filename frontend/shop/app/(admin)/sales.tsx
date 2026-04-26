import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Plus, ArrowRight, Package, TrendingUp } from 'lucide-react-native';

export default function SalesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* --- HEADER --- */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable className="w-10 h-10 items-center justify-center">
          <Ionicons name="menu-outline" size={26} color="#000000" />
        </Pressable>
        
        <Text style={styles.brandText}>ATELIER MANAGER</Text>
        
        <Pressable className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden items-center justify-center">
          <Image 
            source={{ uri: 'https://i.pravatar.cc/100?img=32' }} 
            style={{ width: '100%', height: '100%' }}
          />
        </Pressable>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* --- TITLE SECTION --- */}
        <View className="px-6 pt-6 mb-6">
          <Text className="text-[32px] font-[900] text-slate-900 tracking-[-1px] mb-2">
            Sales & Promotions
          </Text>
          <Text className="text-[16px] font-medium text-slate-500 leading-6">
            Manage campaigns and monitor performance.
          </Text>
        </View>

        {/* --- CREATE BUTTON --- */}
        <View className="px-6 mb-8">
          <Pressable className="bg-black h-14 rounded-full flex-row items-center justify-center">
            <Plus color="white" size={20} strokeWidth={3} />
            <Text className="text-white font-bold ml-2 text-base">Create New Campaign</Text>
          </Pressable>
        </View>

        {/* --- STATS CARDS --- */}
        <View className="px-6 space-y-4 flex-col gap-4">
          {/* Sales Uplift Card */}
          <View className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
            <View className="flex-row justify-between items-start mb-2">
              <View>
                <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Sales Uplift
                </Text>
                <Text className="text-[32px] font-[900] text-slate-900">
                  +24.8%
                </Text>
              </View>
              <TrendingUp color="black" size={20} />
            </View>
            
            {/* Simple Bar Chart */}
            <View className="flex-row items-end justify-between h-24 pt-4">
              {[40, 60, 50, 70, 80].map((h, i) => (
                <View 
                  key={i} 
                  style={{ height: `${h}%` }} 
                  className={`w-[16%] rounded-sm ${i === 4 ? 'bg-black' : 'bg-slate-100'}`}
                />
              ))}
            </View>
          </View>

          {/* Active Code Card */}
          <View className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
            <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Active Code
            </Text>
            <Text className="text-[28px] font-[900] text-slate-900 mb-4">
              SUMMER24
            </Text>
            
            <Text className="text-[12px] font-bold text-slate-400 mb-1">
              Redemptions
            </Text>
            <Text className="text-[32px] font-[900] text-slate-900">
              1,402
            </Text>
          </View>
        </View>

        {/* --- ACTIVE CAMPAIGNS --- */}
        <View className="px-6 mt-10">
          <Text className="text-[22px] font-[900] text-slate-900 mb-6">
            Active Campaigns
          </Text>

          {/* Campaign 1 */}
          <CampaignCard 
            badge="-20% OFF" 
            title="End of Season Clearance"
            subtitle="Ends in 4 days • All apparel items"
            productsCount={420}
          />

          {/* Campaign 2 */}
          <CampaignCard 
            badge="BOGO" 
            title="Buy One Get One Accessories"
            subtitle="Ongoing • Select accessories"
            productsCount={85}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function CampaignCard({ badge, title, subtitle, productsCount }: { badge: string, title: string, subtitle: string, productsCount: number }) {
  return (
    <Pressable className="bg-white rounded-[24px] p-6 mb-4 border border-slate-100 shadow-sm">
      <View className="flex-row justify-between items-start mb-3">
        <View className="bg-black px-3 py-1.5 rounded-full">
          <Text className="text-white text-[10px] font-black">{badge}</Text>
        </View>
        <ArrowRight color="#94a3b8" size={20} />
      </View>
      
      <Text className="text-xl font-[900] text-slate-900 mb-1">
        {title}
      </Text>
      <Text className="text-sm font-bold text-slate-400 mb-5">
        {subtitle}
      </Text>
      
      <View className="h-[1px] bg-slate-50 mb-4" />
      
      <View className="flex-row items-center">
        <Package size={16} color="#94a3b8" />
        <Text className="text-xs font-bold text-slate-400 ml-2">
          {productsCount} products affected
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 15,
    backgroundColor: '#FAFAFA',
  },
  brandText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#000000',
  },
});
