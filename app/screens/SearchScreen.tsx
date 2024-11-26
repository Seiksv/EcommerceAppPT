import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { productService } from "../services/api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigation";
import { useNavigation } from "@react-navigation/native";

type SearchScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "MainApp"
>["navigation"];

export const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const navigation = useNavigation<SearchScreenNavigationProp>();

  interface Product {
    id: number;
    title: string;
    price: number;
  }

  const handleSearch = async () => {
    if (searchQuery.trim().length === 0) return;

    try {
      const results = await productService.searchProducts(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const renderSearchItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.searchItem}
      onPress={() =>
        navigation.navigate("ProductDetail", { productId: item.id })
      }
    >
      <Text style={styles.searchTitle}>{item.title}</Text>
      <Text style={styles.searchPrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={searchResults}
        renderItem={renderSearchItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptySearchText}>
            {searchQuery ? "No results found" : "Start searching..."}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "blue",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  searchButtonText: {
    color: "white",
  },
  searchItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchTitle: {
    fontSize: 16,
  },
  searchPrice: {
    color: "green",
  },
  emptySearchText: {
    textAlign: "center",
    marginTop: 50,
    color: "gray",
  },
});
