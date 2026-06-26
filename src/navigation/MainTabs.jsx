import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { COLORS } from "../shared/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";

// Screen imports
import FieldsScreen from "../features/fields/screens/FieldsScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";
import FieldDetailScreen from "../features/fields/screens/FIeldDetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stacks for nested navigation
const FieldsStack = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="FieldsList"
            component={FieldsScreen}
            options={{ title: "Menus" }}
        />
        <Stack.Screen
            name="FieldDetail"
            component={FieldDetailScreen}
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
                    else if (route.name === "Ordenes") iconName = "order-bool";
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
                name="Profile"
                component={ProfileScreen}
                options={{ title: "Perfil", headerShown: true }}
            />
        </Tab.Navigator>
    );
};

export default MainTabs;
