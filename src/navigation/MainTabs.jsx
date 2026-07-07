// src/navigation/MainTabs.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { COLORS, SPACING, FONT_SIZE } from "../shared/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";

// Screen imports
import BranchesScreen from "../features/branches/screens/BranchesScreen";
import BranchDetailScreen from "../features/branches/screens/BranchDetailScreen";
import MenusScreen from "../features/menus/screens/MenusScreen";
import TablesScreen from "../features/tables/screens/TablesScreen";
import OrdersScreen from "../features/orders/screens/OrdersScreen";
import BillsScreen from "../features/bills/screens/BillsScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";
import CreateReservationScreen from "../features/reservations/screens/CreateReservationScreen";
import MyReservationsScreen from "../features/reservations/screens/MyReservationsScreen";
import ReviewsScreen from "../features/reviews/screens/ReviewsScreen";
import BillDetailScreen from "../features/bills/screens/BillDetailScreen";
import OrderDetailScreen from "../features/orders/screens/OrderDetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Placeholder screens
const PlaceholderScreen = ({ title }) => (
    <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderTitle}>{title}</Text>
    </View>
);

// Stacks for nested navigation
const BranchesStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BranchesList" component={BranchesScreen} />
        <Stack.Screen
            name="BranchDetail"
            component={BranchDetailScreen}
            options={{ headerShown: true, title: "Detalle" }}
        />
    </Stack.Navigator>
);

const MenusStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MenusList" component={MenusScreen} />
        <Stack.Screen
            name="MenuDetail"
            component={() => <PlaceholderScreen title="Detalle de Menú" />}
        />
        <Stack.Screen
            name="Reviews"
            component={ReviewsScreen}
            options={{ headerShown: true, title: "Reseñas" }}
        />
    </Stack.Navigator>
);

const TablesStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TablesList" component={TablesScreen} />
        <Stack.Screen name="CreateReservation" component={CreateReservationScreen} />
        <Stack.Screen
            name="MyReservations"
            component={MyReservationsScreen}
            options={{ headerShown: true, title: "Mis Reservaciones" }}
        />
    </Stack.Navigator>
);

const OrdersStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="OrdersList" component={OrdersScreen} />
        <Stack.Screen 
            name="OrderDetail" 
            component={OrderDetailScreen}
        />
        <Stack.Screen 
            name="CreateOrder" 
            component={() => <PlaceholderScreen title="Crear Orden" />}
        />
    </Stack.Navigator>
);

const BillsStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BillsList" component={BillsScreen} />
        <Stack.Screen 
            name="BillDetail" 
            component={BillDetailScreen}
        />
    </Stack.Navigator>
);

const MainTabs = () => {
    const insets = useSafeAreaInsets();
    
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.secondary,
                tabBarStyle: {
                    backgroundColor: COLORS.surface,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.border,
                    height: 60 + insets.bottom,
                    paddingBottom: 8 + insets.bottom,
                    paddingTop: 4,
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === "Restaurantes") iconName = "storefront";
                    else if (route.name === "Menus") iconName = "menu-book";
                    else if (route.name === "Mesas") iconName = "table-restaurant";
                    else if (route.name === "Ordenes") iconName = "event-note";
                    else if (route.name === "Facturas") iconName = "receipt-long";
                    else if (route.name === "Perfil") iconName = "person";

                    return <MaterialIcons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name="Restaurantes"
                component={BranchesStack}
                options={{ title: "Restaurantes" }}
            />
            <Tab.Screen
                name="Menus"
                component={MenusStack}
                options={{ title: "Menús" }}
            />
            <Tab.Screen
                name="Mesas"
                component={TablesStack}
                options={{ title: "Mesas" }}
            />
            <Tab.Screen
                name="Ordenes"
                component={OrdersStack}
                options={{ title: "Órdenes" }}
            />
            <Tab.Screen
                name="Facturas"
                component={BillsStack}
                options={{ title: "Facturas" }}
            />
            <Tab.Screen
                name="Perfil"
                component={ProfileScreen}
                options={{ title: "Perfil", headerShown: true }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    placeholderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
        padding: SPACING.xl,
    },
    placeholderTitle: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "bold",
        color: COLORS.primary,
        textAlign: "center",
    },
});

export default MainTabs;
