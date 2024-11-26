import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { ProductsScreen } from "../ProductsScreen";
import { productService } from "../../services/api";
import { NavigationContainer } from "@react-navigation/native";

jest.mock("../../services/api");

describe("ProductsScreen", () => {
  const mockProducts = [
    {
      id: 1,
      title: "Test Product 1",
      price: 100,
      description: "This is a test product 1",
      category: "Test Category 1",
      image: "https://via.placeholder.com/150",
      rating: {
        rate: 4.5,
        count: 10,
      },
    },
    {
      id: 2,
      title: "Test Product 2",
      price: 200,
      description: "This is a test product 2",
      category: "Test Category 2",
      image: "https://via.placeholder.com/150",
      rating: {
        rate: 4.0,
        count: 20,
      },
    },
  ];

  beforeEach(() => {
    (productService.getProducts as jest.Mock).mockResolvedValue(mockProducts);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", async () => {
    const mockNavigation: any = { navigate: jest.fn() };
    const mockRoute: any = { params: {} };

    const { getByText, getAllByTestId } = render(
      <NavigationContainer>
        <ProductsScreen navigation={mockNavigation} route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText("Test Product 1")).toBeTruthy();
      expect(getByText("$100")).toBeTruthy();
      expect(getByText("Test Product 2")).toBeTruthy();
      expect(getByText("$200")).toBeTruthy();
      expect(getAllByTestId("product-card").length).toBe(2);
    });
  });

  it("shows loading indicator while fetching products", () => {
    const mockNavigation: any = { navigate: jest.fn() };
    const mockRoute: any = { params: {} };

    const { getByTestId } = render(
      <NavigationContainer>
        <ProductsScreen navigation={mockNavigation} route={mockRoute} />
      </NavigationContainer>
    );

    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("navigates to product detail screen on product press", async () => {
    const mockNavigation: any = { navigate: jest.fn() };
    const mockRoute: any = { params: {} };

    const mockNavigate = jest.fn();
    const { getByText } = render(
      <NavigationContainer>
        <ProductsScreen navigation={mockNavigation} route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      fireEvent.press(getByText("Test Product 1"));
      expect(mockNavigate).toHaveBeenCalledWith("ProductDetail", {
        productId: 1,
      });
    });
  });
});
