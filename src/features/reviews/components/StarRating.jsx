import React from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../../shared/constants/theme";

const StarRating = ({ value = 0, onChange, size = 24, readOnly = false }) => {
    return (
        <View style={{ flexDirection: "row", gap: 4 }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} disabled={readOnly} onPress={() => onChange?.(star)}>
                    <MaterialIcons
                        name={star <= value ? "star" : "star-border"}
                        size={size}
                        color={star <= value ? COLORS.warning : COLORS.border}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default StarRating;
