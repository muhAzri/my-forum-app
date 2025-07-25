type Constructor<T = Record<string, unknown>> = new (..._args: unknown[]) => T;
type Factory<T> = (..._args: unknown[]) => T;
type ServiceDefinition<T> = Constructor<T> | Factory<T> | T;

export interface IContainer {
  register<T>(_key: string, _definition: ServiceDefinition<T>, _options?: RegisterOptions): void;
  resolve<T>(_key: string): T;
  registerSingleton<T>(_key: string, _definition: ServiceDefinition<T>): void;
  registerTransient<T>(_key: string, _definition: ServiceDefinition<T>): void;
}

export interface RegisterOptions {
  singleton?: boolean;
  transient?: boolean;
}

export class Container implements IContainer {
  private services = new Map<string, ServiceRegistration>();

  private singletonInstances = new Map<string, unknown>();

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

    if (registration.options.singleton && this.singletonInstances.has(key)) {
      return this.singletonInstances.get(key) as T;
    }

    const instance = this.createInstance<T>(registration.definition as ServiceDefinition<T>);

    if (registration.options.singleton) {
      this.singletonInstances.set(key, instance);
    }

    return instance;
  }

  private createInstance<T>(definition: ServiceDefinition<T>): T {
    if (typeof definition === 'object' && definition !== null && !Container.isConstructor(definition)) {
      return definition as T;
    }

    if (Container.isConstructor(definition)) {
      return new (definition as Constructor<T>)();
    }

    if (typeof definition === 'function') {
      return (definition as Factory<T>)();
    }

    throw new Error('Invalid service definition');
  }

  private static isConstructor(definition: unknown): boolean {
    return typeof definition === 'function' && definition.prototype && definition.prototype.constructor === definition;
  }

  getRegisteredServices(): string[] {
    return Array.from(this.services.keys());
  }

  clear(): void {
    this.services.clear();
    this.singletonInstances.clear();
  }
}

interface ServiceRegistration {
  definition: ServiceDefinition<unknown>;
  options: {
    singleton: boolean;
    transient: boolean;
  };
}

export const container = new Container();
