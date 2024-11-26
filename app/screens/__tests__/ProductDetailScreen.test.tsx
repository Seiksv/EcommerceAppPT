import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { ProductDetailScreen } from "../ProductDetailScreen";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigation";
import { productService } from "../../services/api";

jest.mock("../../services/api");

type ProductDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "ProductDetail"
>;

const mockRoute: ProductDetailScreenRouteProp = {
  key: "ProductDetail",
  name: "ProductDetail",
  params: { productId: 1 },
};

describe("ProductDetailScreen", () => {
  const mockProduct = {
    id: 1,
    title: "Test Product",
    price: 100,
    description: "This is a test product",
    category: "Test Category",
    image: "https://via.placeholder.com/150",
    rating: {
      rate: 4.5,
      count: 10,
    },
  };

  beforeEach(() => {
    (productService.getProductById as jest.Mock).mockResolvedValue(mockProduct);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", async () => {
    const { getByText, getByTestId } = render(
      <ProductDetailScreen route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText("Test Product")).toBeTruthy();
      expect(getByText("$100")).toBeTruthy();
      expect(getByText("This is a test product")).toBeTruthy();
      expect(getByText("CATEGORY")).toBeTruthy();
      expect(getByText("Test Category")).toBeTruthy();
      expect(getByText("RATING")).toBeTruthy();
      expect(getByText("4.5 (10 reviews)")).toBeTruthy();
      expect(getByTestId("product-image")).toBeTruthy();
    });
  });

  it("shows loading indicator while fetching product details", () => {
    const { getByTestId } = render(<ProductDetailScreen route={mockRoute} />);
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("shows error message if product details fail to load", async () => {
    (productService.getProductById as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch product details")
    );

    const { getByText } = render(<ProductDetailScreen route={mockRoute} />);

    await waitFor(() => {
      expect(getByText("Failed to load product details.")).toBeTruthy();
    });
  });
});
