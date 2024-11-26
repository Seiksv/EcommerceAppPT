import { authService, productService, userService } from "./api";

class Container {
    private services: { [key: string]: any } = {};
  
    register(name: string, service: any) {
      this.services[name] = service;
    }
  
    get<T>(name: string): T {
      const service = this.services[name];
      if (!service) {
        throw new Error(`Service ${name} not found`);
      }
      return service;
    }
  }
  
  const container = new Container();
  
  container.register('authService', authService);
  container.register('productService', productService);
  container.register('userService', userService);
  
  export default container;