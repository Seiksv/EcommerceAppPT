import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { LoginScreen } from "../LoginScreen";
import { useAuth } from "../../store/AuthContext";

jest.mock("../../store/AuthContext");

describe("LoginScreen", () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    expect(getByText("EcommerceShop")).toBeTruthy();
    expect(getByPlaceholderText("Username")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
  });

  it("shows error message on invalid credentials", async () => {
    mockLogin.mockRejectedValueOnce({ response: { status: 401 } });

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Username"), "invalid_user");
    fireEvent.changeText(getByPlaceholderText("Password"), "invalid_pass");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(getByText("Invalid username or password")).toBeTruthy();
    });
  });

  it("calls login with correct credentials", async () => {
    mockLogin.mockResolvedValueOnce({});

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Username"), "valid_user");
    fireEvent.changeText(getByPlaceholderText("Password"), "valid_pass");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("valid_user", "valid_pass");
    });
  });

  it("shows loading indicator while logging in", async () => {
    const { getByText, getByPlaceholderText, queryByTestId } = render(
      <LoginScreen />
    );

    fireEvent.changeText(getByPlaceholderText("Username"), "valid_user");
    fireEvent.changeText(getByPlaceholderText("Password"), "valid_pass");
    fireEvent.press(getByText("Login"));

    expect(queryByTestId("loading-indicator")).toBeTruthy();

    await waitFor(() => {
      expect(queryByTestId("loading-indicator")).toBeNull();
    });
  });
});
