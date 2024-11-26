import Config from 'react-native-config';

interface Environment {
  API_BASE_URL: string;
  IS_DEVELOPMENT: boolean;
}

const env: Environment = {
  API_BASE_URL: Config.API_BASE_URL || 'https://fakestoreapi.com',
  IS_DEVELOPMENT: __DEV__,
};

export default env;