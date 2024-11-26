import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { productService } from "../services/api";
import { MainTabParamList } from "../navigation/AppNavigation";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Card, Title, Paragraph } from "react-native-paper";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 20;

export type ProductsScreenProps = BottomTabScreenProps<
  MainTabParamList,
  "Products"
>;

export const ProductsScreen: React.FC<ProductsScreenProps> = ({
  navigation,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
  }

  const fetchProducts = async (loadMore = false) => {
    if (loading || loadingMore) return;

    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const newProducts = await productService.getProducts(page);
      setProducts((prev) => [...prev, ...newProducts]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }

    if (loadMore) {
      setLoadingMore(false);
    } else {
      setLoading(false);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ProductDetail", { productId: item.id })
      }
    >
      <Card style={styles.card}>
        <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />
        <Card.Content>
          <Title>{truncateText(item.title, 20)}</Title>
          <Paragraph>${item.price}</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  return (
    <FlatList
      data={products}
      renderItem={renderProductItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      onEndReached={() => fetchProducts(true)}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListFooterComponentStyle={styles.footer}
    />
  );
};

const styles = StyleSheet.create({
  productItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    color: "green",
  },
  card: {
    width: CARD_WIDTH,
    margin: 10,
  },
  cardImage: {
    height: 150,
  },
  footer: {
    paddingVertical: 20,
  },
});
