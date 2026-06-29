import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MENU_DATA = [
  { id: '1', name: 'Hamburguesa Clásica', description: 'Carne de res, queso cheddar, lechuga y tomate.', price: 'Q8.50', category: 'Platos Fuertes', icon: 'hamburger', color: '#E65100' },
  { id: '2', name: 'Pizza Margarita', description: 'Salsa de tomate casera, mozzarella fresca y albahaca.', price: 'Q12.00', category: 'Platos Fuertes', icon: 'pizza', color: '#D84315' },
  { id: '3', name: 'Ensalada César', description: 'Lechuga romana, crotones, parmesano y aderezo.', price: 'Q6.50', category: 'Entradas', icon: 'leaf', color: '#2E7D32' },
  { id: '4', name: 'Limonada con Menta', description: 'Refrescante limonada natural con hojas de menta.', price: 'Q3.00', category: 'Bebidas', icon: 'cup-water', color: '#0277BD' },
  { id: '5', name: 'Pastel de Chocolate', description: 'Rebanada de pastel de chocolate oscuro con nueces.', price: 'Q4.50', category: 'Postres', icon: 'cake-variant', color: '#6D4C41' },
];

const CATEGORIES = ['Todos', 'Entradas', 'Platos Fuertes', 'Bebidas', 'Postres'];

const MenusScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [cartCount, setCartCount] = useState(3);

  const filteredMenu = selectedCategory === 'Todos'
    ? MENU_DATA
    : MENU_DATA.filter(item => item.category === selectedCategory);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menú</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <MaterialCommunityIcons name="cart-outline" size={26} color="#1A1A1A" />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {CATEGORIES.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryPill, selectedCategory === category && styles.categoryPillActive]}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
        {filteredMenu.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.8}>
            <View style={[styles.imagePlaceholder, { backgroundColor: item.color }]}>
              <MaterialCommunityIcons name={item.icon} size={32} color="#FFFFFF" />
            </View>

            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              </View>
              <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>

              <View style={styles.cardFooter}>
                <Text style={styles.itemPrice}>{item.price}</Text>
                <TouchableOpacity style={styles.addButtonMini} activeOpacity={0.6}>
                  <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF'
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A'
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  iconButton: {
    padding: 5,
    position: 'relative'
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#E65100',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold'
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  categoriesScroll: {
    paddingHorizontal: 24,
    gap: 12
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
    marginRight: 10
  },
  categoryPillActive: {
    backgroundColor: '#E65100'
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666'
  },
  categoryTextActive: {
    color: '#FFFFFF'
  },
  listContainer: {
    padding: 24
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  imagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A'
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#E65100'
  },
  itemDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20
  },
  addButtonMini: {
    backgroundColor: '#E65100',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default MenusScreen;