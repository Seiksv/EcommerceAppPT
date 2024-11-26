import React, { useState, useEffect } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigation";
import { productService } from "../services/api";
import { Card, Title, Paragraph, Button } from "react-native-paper";

type ProductDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "ProductDetail"
>;

interface ProductDetailProps {
  route: ProductDetailScreenRouteProp;
}

interface ProductDetail {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export const ProductDetailScreen: React.FC<ProductDetailProps> = ({
  route,
}) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const productId = route.params.productId;
        const productData = await productService.getProductById(productId);
        setProduct(productData);
      } catch (error) {
        console.error("Failed to fetch product details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [route.params.productId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!product) {
    return <Text>Product not found</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: product.image }} style={styles.cardImage} />
        <Card.Content>
          <Title>{product.title}</Title>
          <Text style={styles.price}>${product.price}</Text>
          <Text style={styles.subtitle}>DESCRIPTION</Text>
          <Paragraph>{product.description}</Paragraph>
          <Text style={styles.subtitle}>CATEGORY</Text>
          <Paragraph>{product.category}</Paragraph>
          <Text style={styles.subtitle}>RATING</Text>
          <Paragraph>
            {product.rating.rate} ({product.rating.count} reviews)
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => {}}>
            Add to Cart
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardImage: {
    height: 300,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  price: {
    fontSize: 24,
    color: "green",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textTransform: "uppercase",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  details: {
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
  },
  rating: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
