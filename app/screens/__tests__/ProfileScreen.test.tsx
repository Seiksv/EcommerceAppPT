import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { ProfileScreen } from "../ProfileScreen";
import { userService } from "../../services/api";
import { useAuth } from "../../store/AuthContext";

jest.mock("../../services/api");
jest.mock("../../store/AuthContext");

describe("ProfileScreen", () => {
  const mockUserProfile = {
    id: 1,
    email: "test@example.com",
    username: "testuser",
    name: {
      firstname: "Test",
      lastname: "User",
    },
    address: {
      city: "Test City",
      street: "Test Street",
    },
    avatar: "https://via.placeholder.com/150",
  };

  beforeEach(() => {
    (userService.getCurrentUser as jest.Mock).mockResolvedValue(
      mockUserProfile
    );
    (useAuth as jest.Mock).mockReturnValue({
      logout: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", async () => {
    const { getByText, getByTestId } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText("Test User")).toBeTruthy();
      expect(getByText("EMAIL")).toBeTruthy();
      expect(getByText("test@example.com")).toBeTruthy();
      expect(getByText("USERNAME")).toBeTruthy();
      expect(getByText("testuser")).toBeTruthy();
      expect(getByText("ADDRESS")).toBeTruthy();
      expect(getByText("Test Street, Test City")).toBeTruthy();
      expect(getByTestId("profile-avatar")).toBeTruthy();
    });
  });

  it("shows loading indicator while fetching profile", () => {
    const { getByText } = render(<ProfileScreen />);
    expect(getByText("Loading profile...")).toBeTruthy();
  });

  it("shows error message if profile fails to load", async () => {
    (userService.getCurrentUser as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch profile")
    );

    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText("Failed to load profile.")).toBeTruthy();
    });
  });
});
