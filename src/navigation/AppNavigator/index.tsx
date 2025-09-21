// AppNavigator.tsx (no NavigationContainer here)
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";

// Define all routes
type RootStackParamList = {
    Home: undefined;
    Details: undefined;
};

type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;
type DetailProps = NativeStackScreenProps<RootStackParamList, "Details">;

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen({ navigation }: HomeProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>🏠 Welcome to Home Screen</Text>
            <Button title="Go to Details" onPress={() => navigation.navigate("Details")} />
        </View>
    );
}

function DetailScreen({ navigation }: DetailProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>📄 Details Screen</Text>
            <Button title="Back to Home" onPress={() => navigation.navigate("Home")} />
        </View>
    );
}

/**
 * IMPORTANT: do NOT wrap this in <NavigationContainer>.
 * The app root (App.tsx) already renders NavigationContainer.
 */
export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Details" component={DetailScreen} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
    title: { fontSize: 22, fontWeight: "600", marginBottom: 12 },
});
