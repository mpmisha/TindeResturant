// Global type declarations

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Webpack Hot Module Replacement API
interface NodeModule {
  hot?: {
    accept(dependencies: string | string[], callback?: () => void): void;
    accept(dependency: string, callback?: () => void): void;
    accept(errHandler?: (err: Error) => void): void;
    decline(): void;
    decline(dependencies: string | string[]): void;
    dispose(callback: (data: any) => void): void;
    addDisposeHandler(callback: (data: any) => void): void;
    removeDisposeHandler(callback: (data: any) => void): void;
    check(autoApply?: boolean): Promise<string[] | null>;
    apply(options?: any): Promise<string[] | null>;
    status(): string;
    addStatusHandler(callback: (status: string) => void): void;
    removeStatusHandler(callback: (status: string) => void): void;
  };
}

// Extend global interfaces
declare global {
  interface Window {
    // Add any window extensions here if needed
  }

  // Declare the global module variable for Webpack HMR
  const module: NodeModule;
}

export {};
