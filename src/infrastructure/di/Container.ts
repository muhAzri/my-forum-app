type Constructor<T = {}> = new (...args: any[]) => T;
type Factory<T> = (...args: any[]) => T;
type ServiceDefinition<T> = Constructor<T> | Factory<T> | T;

export interface IContainer {
  register<T>(key: string, definition: ServiceDefinition<T>, options?: RegisterOptions): void;
  resolve<T>(key: string): T;
  registerSingleton<T>(key: string, definition: ServiceDefinition<T>): void;
  registerTransient<T>(key: string, definition: ServiceDefinition<T>): void;
}

export interface RegisterOptions {
  singleton?: boolean;
  transient?: boolean;
}

export class Container implements IContainer {
  private services = new Map<string, ServiceRegistration>();
  private singletonInstances = new Map<string, any>();

  register<T>(key: string, definition: ServiceDefinition<T>, options: RegisterOptions = {}): void {
    this.services.set(key, {
      definition,
      options: {
        singleton: options.singleton ?? false,
        transient: options.transient ?? false,
      },
    });
  }

  registerSingleton<T>(key: string, definition: ServiceDefinition<T>): void {
    this.register(key, definition, { singleton: true });
  }

  registerTransient<T>(key: string, definition: ServiceDefinition<T>): void {
    this.register(key, definition, { transient: true });
  }

  resolve<T>(key: string): T {
    const registration = this.services.get(key);
    
    if (!registration) {
      throw new Error(`Service '${key}' not registered`);
    }

    // Return singleton instance if exists
    if (registration.options.singleton && this.singletonInstances.has(key)) {
      return this.singletonInstances.get(key);
    }

    const instance = this.createInstance<T>(registration.definition);

    // Store singleton instance
    if (registration.options.singleton) {
      this.singletonInstances.set(key, instance);
    }

    return instance;
  }

  private createInstance<T>(definition: ServiceDefinition<T>): T {
    // If it's already an instance
    if (typeof definition === 'object' && definition !== null && !this.isConstructor(definition)) {
      return definition as T;
    }

    // If it's a constructor
    if (this.isConstructor(definition)) {
      return new (definition as Constructor<T>)();
    }

    // If it's a factory function
    if (typeof definition === 'function') {
      return (definition as Factory<T>)();
    }

    throw new Error('Invalid service definition');
  }

  private isConstructor(definition: any): boolean {
    return typeof definition === 'function' && definition.prototype && definition.prototype.constructor === definition;
  }

  // Method to get all registered services (useful for debugging)
  getRegisteredServices(): string[] {
    return Array.from(this.services.keys());
  }

  // Method to clear all services (useful for testing)
  clear(): void {
    this.services.clear();
    this.singletonInstances.clear();
  }
}

interface ServiceRegistration {
  definition: ServiceDefinition<any>;
  options: {
    singleton: boolean;
    transient: boolean;
  };
}

// Global container instance
export const container = new Container();