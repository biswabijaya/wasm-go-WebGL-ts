export class WebGLCompute {
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  
  constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.gl = canvas.getContext('webgl');
    
    if (!this.gl) {
      throw new Error('WebGL not supported');
    }
    
    this.initShaders();
  }
  
  private initShaders(): void {
    const gl = this.gl!;
    
    // Simple vertex shader that just passes through positions
    const vertexShaderSource = `
      attribute vec4 aVertexPosition;
      void main() {
        gl_Position = aVertexPosition;
      }
    `;
    
    // Fragment shader that performs a simple computation
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 uResolution;
      uniform float uTime;
      
      // Example GPU computation - a simple mandelbrot set
      void main() {
        vec2 position = gl_FragCoord.xy / uResolution.xy;
        position = position * 4.0 - vec2(2.0);
        
        vec2 z = vec2(0.0);
        vec2 c = position;
        
        float iteration = 0.0;
        float maxIterations = 100.0;
        
        for(float i = 0.0; i < 100.0; i++) {
          if(length(z) > 2.0) break;
          
          // z = z² + c
          z = vec2(
            z.x * z.x - z.y * z.y,
            2.0 * z.x * z.y
          ) + c;
          
          iteration = i;
        }
        
        float color = iteration / maxIterations;
        gl_FragColor = vec4(color, color * 0.5, color * 0.3, 1.0);
      }
    `;
    
    // Create and compile shaders
    const vertexShader = this.compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    
    // Create and link program
    this.program = gl.createProgram();
    gl.attachShader(this.program!, vertexShader);
    gl.attachShader(this.program!, fragmentShader);
    gl.linkProgram(this.program!);
    
    if (!gl.getProgramParameter(this.program!, gl.LINK_STATUS)) {
      throw new Error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(this.program!));
    }
  }
  
  private compileShader(source: string, type: number): WebGLShader {
    const gl = this.gl!;
    const shader = gl.createShader(type)!;
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      throw new Error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    }
    
    return shader;
  }
  
  // Run the GPU computation
  compute(time: number): void {
    const gl = this.gl!;
    
    // Set up viewport
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Use our shader program
    gl.useProgram(this.program);
    
    // Set up the position attribute
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    // Define a square that covers the entire canvas
    const positions = [
      -1.0, -1.0,
       1.0, -1.0,
       1.0,  1.0,
      -1.0,  1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    // Get position attribute location
    const positionAttributeLocation = gl.getAttribLocation(this.program!, 'aVertexPosition');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Set up uniform values
    const resolutionUniformLocation = gl.getUniformLocation(this.program!, 'uResolution');
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    
    const timeUniformLocation = gl.getUniformLocation(this.program!, 'uTime');
    gl.uniform1f(timeUniformLocation, time);
    
    // Create an index buffer
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    
    // Define indices for the square
    const indices = [
      0, 1, 2,
      0, 2, 3,
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    // Draw the square
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }
}
