import { WasmLoader } from './wasmLoader';
import { WebGLCompute } from './webglCompute';

document.addEventListener('DOMContentLoaded', async () => {
  // Set up the canvas
  const canvas = document.getElementById('glCanvas') as HTMLCanvasElement;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Initialize WebGL for GPU computation
  const gpuCompute = new WebGLCompute('glCanvas');
  
  // Initialize WebAssembly for CPU computation
  const wasmLoader = new WasmLoader();
  await wasmLoader.init();
  
  // Example: Compute factorial using WASM (CPU)
  const computeFactorialBtn = document.getElementById('computeFactorial');
  const factorialResult = document.getElementById('factorialResult');
  
  computeFactorialBtn?.addEventListener('click', () => {
    const input = parseInt((document.getElementById('factorialInput') as HTMLInputElement).value);
    try {
      const startTime = performance.now();
      const result = wasmLoader.computeFactorial(input);
      const endTime = performance.now();
      
      factorialResult!.textContent = `Factorial of ${input} = ${result} (computed in ${(endTime - startTime).toFixed(2)}ms)`;
    } catch (error) {
      factorialResult!.textContent = `Error: ${error}`;
    }
  });
  
  // Example: Run GPU computation using WebGL
  let time = 0;
  const animate = () => {
    time += 0.01;
    gpuCompute.compute(time);
    requestAnimationFrame(animate);
  };
  
  animate();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
});
