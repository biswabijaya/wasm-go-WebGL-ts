# WebAssembly + WebGL Integration Example

This project demonstrates how to integrate WebAssembly (WASM) for CPU-intensive tasks with WebGL for GPU-accelerated computations, using TypeScript for the frontend and Go for the backend WebAssembly module.

## Project Repository

[https://github.com/biswabijaya/wasm-go-WebGL-ts](https://github.com/biswabijaya/wasm-go-WebGL-ts)

## Overview

This example shows:
1. **CPU Computation**: Using Go compiled to WebAssembly for factorial calculations
2. **GPU Computation**: Using WebGL to render a Mandelbrot set with fragment shaders
3. **TypeScript Integration**: Connecting both technologies with TypeScript

## Project Structure

```
.
├── src/
│   ├── main.ts              # Main TypeScript entry point
│   ├── wasmLoader.ts        # WebAssembly loader
│   └── webglCompute.ts      # WebGL GPU computation
├── wasm.go                  # Go code for WebAssembly
├── index.html               # HTML interface
├── wasm_exec.js             # Go WebAssembly runtime
├── tsconfig.json            # TypeScript configuration
├── webpack.config.js        # Webpack configuration
├── main.wasm                # Compiled WebAssembly module
└── README.md                # This file
```

## Prerequisites

- Go 1.15+ (for WebAssembly compilation)
- Node.js and npm (for TypeScript)
- A modern web browser with WebGL support

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/biswabijaya/wasm-go-WebGL-ts.git
cd wasm-go-WebGL-ts
```

2. **Set up Go for WebAssembly**

```bash
# Copy the WebAssembly support file | If Mac
cp "/usr/local/go/lib/wasm/wasm_exec.js"

# Build the Go WebAssembly module
GOOS=js GOARCH=wasm go build -o main.wasm wasm.go
```

3. **Set up TypeScript**

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build
```

4. **Serve the application**

```bash
# Install a simple HTTP server
npm install --global http-server

# Serve the application
http-server .
```

5. **Open in browser**

Open `http://localhost:8080` in your web browser.

## Features

### CPU Computation (WebAssembly)

- Computes factorials of numbers using Go compiled to WebAssembly
- Demonstrates how to expose Go functions to JavaScript
- Shows performance metrics for CPU-based calculations

### GPU Computation (WebGL)

- Renders a Mandelbrot set using fragment shaders
- Demonstrates parallel computation on the GPU
- Shows how to set up WebGL context and shaders in TypeScript

## Performance Comparison

The example allows you to compare:
- CPU-based computation (WebAssembly) - good for sequential tasks
- GPU-based computation (WebGL) - excellent for parallel tasks

## Browser Support

This example requires:
- WebAssembly support (all modern browsers)
- WebGL support (all modern browsers)

## Further Reading

- [WebAssembly Official Site](https://webassembly.org/)
- [WebGL 2.0 Specification](https://www.khronos.org/registry/webgl/specs/latest/2.0/)
- [Go WebAssembly Wiki](https://github.com/golang/go/wiki/WebAssembly)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
