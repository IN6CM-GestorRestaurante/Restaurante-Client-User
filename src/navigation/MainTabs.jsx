// src/navigation/MainTabs.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { COLORS, SPACING, FONT_SIZE } from "../shared/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";

// Screen imports
import BranchesScreen from "../features/branches/screens/BranchesScreen";
import BranchDetailScreen from "../features/branches/screens/BranchDetailScreen";
import MenuDetailScreen from "../features/menus/screens/MenuDetailScreen";
import TablesScreen from "../features/tables/screens/TablesScreen";
import OrdersScreen from "../features/orders/screens/OrdersScreen";
import BillsScreen from "../features/bills/screens/BillsScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";
import CreateReservationScreen from "../features/reservations/screens/CreateReservationScreen";
import MyReservationsScreen from "../features/reservations/screens/MyReservationsScreen";
import ReviewsScreen from "../features/reviews/screens/ReviewsScreen";
import BillDetailScreen from "../features/bills/screens/BillDetailScreen";
import OrderDetailScreen from "../features/orders/screens/OrderDetailScreen";
import CreateOrderScreen from "../features/orders/screens/CreateOrderScreen";

const Drawer = createDrawerNavigator();
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
        <Stack.Screen
            name="MenuDetail"
            component={MenuDetailScreen}
            options={{ headerShown: true, title: "Detalle del Platillo" }}
        />
        <Stack.Screen
            name="Reviews"
            component={ReviewsScreen}
            options={{ headerShown: true, title: "Reseñas" }}
        />
        {/* Mesas is now accessible from BranchDetail */}
        <Stack.Screen name="Mesas" component={TablesStack} options={{ headerShown: false }} />
    </Stack.Navigator>
);

const TablesStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TablesList" component={TablesScreen} />
        <Stack.Screen name="CreateReservation" component={CreateReservationScreen} />
        <Stack.Screen
            name="MyReservations"
            component={MyReservationsScreen}
            options={{ headerShown: false }}
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
            component={CreateOrderScreen}
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
    return (
        <Drawer.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                drawerType: "front",
                drawerActiveTintColor: COLORS.primary,
                drawerInactiveTintColor: COLORS.secondary,
                overlayColor: "rgba(0,0,0,0.5)",
                drawerStyle: {
                    backgroundColor: COLORS.surface,
                    width: 280,
                },
                drawerIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === "Restaurantes") iconName = "storefront";
                    else if (route.name === "Ordenes") iconName = "event-note";
                    else if (route.name === "Facturas") iconName = "receipt-long";
                    else if (route.name === "MisReservacionesDrawer") iconName = "event-available";
                    else if (route.name === "Perfil") iconName = "person";

                    return <MaterialIcons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Drawer.Screen
                name="Restaurantes"
                component={BranchesStack}
                options={{ title: "Restaurantes" }}
            />
            <Drawer.Screen
                name="MisReservacionesDrawer"
                component={MyReservationsScreen}
                options={{ title: "Mis Reservaciones" }}
            />
            <Drawer.Screen
                name="Ordenes"
                component={OrdersStack}
                options={{ title: "Órdenes" }}
            />
            <Drawer.Screen
                name="Facturas"
                component={BillsStack}
                options={{ title: "Facturas" }}
            />
            <Drawer.Screen
                name="Perfil"
                component={ProfileScreen}
                options={{ title: "Perfil", headerShown: true }}
            />
        </Drawer.Navigator>
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
