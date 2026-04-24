import { Link, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-8 justify-center">
      <StatusBar style="light" />
      
      <View className="items-center mb-10">
        <View className="w-20 h-20 bg-slate-50 rounded-[30px] items-center justify-center mb-6">
          <Ionicons name="information-circle-outline" size={40} color="#111111" />
        </View>
        <Text className="text-3xl font-[900] text-slate-900 tracking-tight mb-4 text-center">
          Atelier Suite Info
        </Text>
        <Text className="text-[15px] leading-[22px] text-slate-500 font-medium text-center px-4">
          Welcome to the next generation of retail management. This suite is designed for precision, speed, and elegance.
        </Text>
      </View>

      <View className="space-y-4">
        <Pressable 
          onPress={() => router.back()}
          className="h-16 bg-black rounded-3xl items-center justify-center"
        >
          <Text className="text-white font-bold">Got it</Text>
        </Pressable>

        <Link href="/" asChild>
          <Pressable className="h-16 items-center justify-center">
            <Text className="text-slate-400 font-bold">Back to Home</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
