import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { useMimo } from '../context/MimoContext';
import { colors } from '../config/theme';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';

const categories = [
  'Todos',
  'Alimentos',
  'Brinquedos',
  'Higiene',
  'Acessórios',
];

function normalizeCategory(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

export default function ShopScreen({ navigation }) {
  const {
    products,
    coins,
    loadingProducts,
    apiMessage,
    loadProducts,
    purchaseProduct,
  } = useMimo();

  const [category, setCategory] = useState('Todos');

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    if (category === 'Todos') {
      return products;
    }

    const selectedCategory = normalizeCategory(category);

    return products.filter(
      (product) =>
        normalizeCategory(product.category) ===
        selectedCategory
    );
  }, [products, category]);

  const buy = (product) => {
    const purchased = purchaseProduct(product);

    if (purchased) {
      Alert.alert(
        'Compra realizada!',
        `${product.name} foi para o seu inventário.`
      );
    } else {
      Alert.alert(
        'Quase lá!',
        'Você ainda precisa de mais moedas para comprar esse item.'
      );
    }
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loadingProducts}
            onRefresh={loadProducts}
            tintColor={colors.green}
          />
        }
        ListHeaderComponent={
          <>
            <Header
              title="Lojinha do Mimo"
              subtitle="Pequenas compras, grandes alegrias"
              onMenu={() => navigation.openDrawer()}
              right={
                <View style={styles.coins}>
                  <Text>🪙 {coins}</Text>
                </View>
              }
            />

            <View style={styles.notice}>
              <Text style={styles.noticeText}>
                {apiMessage ||
                  'Escolha um mimo para o seu bichinho.'}
              </Text>
            </View>

            <Text style={styles.label}>
              FILTRAR POR CATEGORIA
            </Text>

            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={category}
                onValueChange={(value) =>
                  setCategory(String(value))
                }
                style={styles.picker}
              >
                {categories.map((item) => (
                  <Picker.Item
                    key={item}
                    label={item}
                    value={item}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.count}>
              {filteredProducts.length}{' '}
              {filteredProducts.length === 1
                ? 'produto encontrado'
                : 'produtos encontrados'}
            </Text>
          </>
        }
        ListEmptyComponent={
          <EmptyState
            title="Nada por aqui"
            message="Essa categoria ainda está esperando novidades."
          />
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPurchase={buy}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },

  content: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 58 : 34,
    paddingBottom: 30,
  },

  coins: {
    backgroundColor: colors.yellow,
    borderRadius: 14,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },

  notice: {
    backgroundColor: colors.mint,
    borderRadius: 14,
    padding: 11,
    marginBottom: 16,
  },

  noticeText: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: '700',
  },

  label: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  pickerWrap: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    borderRadius: 14,
    marginTop: 6,
    overflow: 'hidden',
  },

  picker: {
    color: colors.ink,
    height: 48,
  },

  count: {
    color: colors.muted,
    fontWeight: '700',
    fontSize: 12,
    marginVertical: 15,
  },
});
