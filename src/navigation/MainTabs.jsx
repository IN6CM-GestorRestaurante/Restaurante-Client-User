import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { COLORS } from "../shared/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";

// Screen imports
import MenusScreen from "../features/menus/screens/MenusScreen";
import TablesScreen from "../features/tables/screens/TablesScreen";
import OrdersScreen from "../features/orders/screens/OrdersScreen";
import BillsScreen from "../features/bills/screens/BillsScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stacks for nested navigation
const MenusStack = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="MenusList"
            component={MenusScreen}
            options={{ title: "Menús" }}
        />
    </Stack.Navigator>
);

const MainTabs = () => {
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
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 4,
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === "Menus") iconName = "menu-book";
                    else if (route.name === "Mesas") iconName = "table-restaurant";
                    else if (route.name === "Ordenes") iconName = "event-note"; // A better icon for orders
                    else if (route.name === "Facturas") iconName = "receipt-long";
                    else if (route.name === "Profile") iconName = "person";

                    return <MaterialIcons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name="Menus"
                component={MenusStack}
                options={{ title: "Menús" }}
            />
            <Tab.Screen
                name="Mesas"
                component={TablesScreen}
                options={{ title: "Mesas", headerShown: true }}
            />
            <Tab.Screen
                name="Ordenes"
                component={OrdersScreen}
                options={{ title: "Órdenes", headerShown: true }}
            />
            <Tab.Screen
                name="Facturas"
                component={BillsScreen}
                options={{ title: "Facturas", headerShown: true }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: "Perfil", headerShown: true }}
            />
        </Tab.Navigator>
    );
};

export default MainTabs;
