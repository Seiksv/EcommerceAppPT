import env from '../config/env';

class LogService {
  static log(message: string, data?: any) {
    if (env.IS_DEVELOPMENT) {
      console.log(message, data);
    }
  }

  static error(message: string, error?: any) {
    console.error(message, error);
  }

  static warn(message: string, data?: any) {
    console.warn(message, data);
  }
}

export default LogService;