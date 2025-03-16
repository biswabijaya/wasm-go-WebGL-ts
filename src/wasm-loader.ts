// Define the interface for Go WASM functions
interface GoWasm {
  computeFactorial(n: number): number;
}

// Declare global to make TypeScript aware of our Go functions
declare global {
  interface Window {
    computeFactorial: (n: number) => number;
    Go: any;
  }
}

export class WasmLoader {
  private wasmInstance: GoWasm | null = null;
  
  constructor() {}
  
  async init(): Promise<void> {
    try {
      // Load Go WASM runtime
      const go = new window.Go(); // This requires the Go WASM runtime to be loaded
      
      // Fetch and instantiate the WASM module
      const result = await WebAssembly.instantiateStreaming(
        fetch("main.wasm"),
        go.importObject
      );
      
      // Start the WASM instance
      go.run(result.instance);
      
      console.log("WASM module loaded successfully");
    } catch (error) {
      console.error("Failed to load WASM module:", error);
    }
  }
  
  // Use the Go WASM function
  computeFactorial(n: number): number {
    if (!window.computeFactorial) {
      throw new Error("WASM module not loaded");
    }
    return window.computeFactorial(n);
  }
}
