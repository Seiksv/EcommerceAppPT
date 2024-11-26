import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./store/AuthContext";
import { AppNavigation } from "./navigation/AppNavigation";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { startPerformanceMonitoring } from "./services/performanceMiddleware";

const App: React.FC = () => {
  React.useEffect(() => {
    const { measureRenderTime } = startPerformanceMonitoring();
    const stopMeasuring = measureRenderTime("App");

    return () => {
      stopMeasuring();
    };
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <AppNavigation />
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App;
