import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { SearchScreen } from "../SearchScreen";
import { productService } from "../../services/api";
import { NavigationContainer } from "@react-navigation/native";

jest.mock("../../services/api");

describe("SearchScreen", () => {
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
    (productService.searchProducts as jest.Mock).mockResolvedValue(
      mockProducts
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <SearchScreen />
      </NavigationContainer>
    );

    expect(getByPlaceholderText("Search products...")).toBeTruthy();
    expect(getByText("Search")).toBeTruthy();
  });

  it("shows search results when search is performed", async () => {
    const { getByPlaceholderText, getByText, getAllByTestId } = render(
      <NavigationContainer>
        <SearchScreen />
      </NavigationContainer>
    );

    fireEvent.changeText(getByPlaceholderText("Search products..."), "Test");
    fireEvent.press(getByText("Search"));

    await waitFor(() => {
      expect(getByText("Test Product 1")).toBeTruthy();
      expect(getByText("$100")).toBeTruthy();
      expect(getByText("Test Product 2")).toBeTruthy();
      expect(getByText("$200")).toBeTruthy();
      expect(getAllByTestId("product-card").length).toBe(2);
    });
  });

  it("shows loading indicator while searching", () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <NavigationContainer>
        <SearchScreen />
      </NavigationContainer>
    );

    fireEvent.changeText(getByPlaceholderText("Search products..."), "Test");
    fireEvent.press(getByText("Search"));

    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("shows error message if search fails", async () => {
    (productService.searchProducts as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch products")
    );

    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <SearchScreen />
      </NavigationContainer>
    );

    fireEvent.changeText(getByPlaceholderText("Search products..."), "Test");
    fireEvent.press(getByText("Search"));

    await waitFor(() => {
      expect(getByText("Failed to load products.")).toBeTruthy();
    });
  });
});
