# Build instructions for the WebAssembly + WebGL example

# 1. Set up Go for WebAssembly
# Install Go if not already installed: https://golang.org/dl/

# Set up GOROOT and GOPATH environment variables
# export GOROOT=/path/to/go
# export GOPATH=$HOME/go
# export PATH=$PATH:$GOROOT/bin:$GOPATH/bin

# 2. Copy the WebAssembly support file
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" .

# 3. Build the Go WebAssembly module
GOOS=js GOARCH=wasm go build -o main.wasm wasm.go

# 4. Set up TypeScript
npm init -y
npm install --save-dev typescript webpack webpack-cli ts-loader

# 5. Create tsconfig.json
cat > tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "es2015",
    "module": "es2015",
    "moduleResolution": "node",
    "strict": true,
    "outDir": "./dist",
    "sourceMap": true
  },
  "include": ["src/**/*.ts"]
}
EOL

# 6. Create webpack.config.js
cat > webpack.config.js << EOL
const path = require('path');

module.exports = {
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development'
};
EOL

# 7. Create src directory structure
mkdir -p src
mv wasmLoader.ts webglCompute.ts main.ts src/

# 8. Build TypeScript
npm run build

# 9. Serve the application
# You can use any simple HTTP server, for example:
npm install --global http-server
http-server .
