import { Performance } from 'react-native-performance';

export const startPerformanceMonitoring = () => {
  performance.mark('app_start');

  const measureRenderTime = (componentName: string) => {
    performance.mark(`${componentName}_render_start`);
    
    return () => {
      performance.mark(`${componentName}_render_end`);
      performance.measure(
        `${componentName}_render_time`,
        `${componentName}_render_start`,
        `${componentName}_render_end`
      );
    };
  };

  return {
    measureRenderTime,
  };
};