import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { userService } from "../services/api";
import { useAuth } from "../store/AuthContext";
import { Card, Title, Paragraph, Button, Avatar } from "react-native-paper";

interface UserProfile {
  id: number;
  email: string;
  username: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
  };
}

export const ProfileScreen: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await userService.getCurrentUser();
        setUserProfile(profile);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUserProfile();
  }, []);

  if (!userProfile) {
    return <Text>Loading profile...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <Avatar.Image
          size={100}
          source={{ uri: "https://via.placeholder.com/150" }}
          style={styles.profileImage}
        />
      </View>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{`${userProfile.name.firstname} ${userProfile.name.lastname}`}</Title>
          <Paragraph style={styles.subtitle}>EMAIL</Paragraph>
          <Paragraph>{userProfile.email}</Paragraph>
          <Paragraph style={styles.subtitle}>USERNAME</Paragraph>
          <Paragraph>{userProfile.username}</Paragraph>
          <Paragraph style={styles.subtitle}>ADDRESS</Paragraph>
          <Paragraph>{`${userProfile.address.street}, ${userProfile.address.city}`}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={logout}>
            Logout
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textTransform: "uppercase",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileDetails: {
    width: "100%",
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
