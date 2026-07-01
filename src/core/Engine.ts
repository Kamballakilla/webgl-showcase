import { Circle } from "@/entities/Circle";
import { Vector2 } from "@/math/Vector2";

export class Engine {
  private readonly canvas: HTMLCanvasElement;
  private readonly gl: WebGL2RenderingContext;
  private testCircle: Circle | null = null;

  private program: WebGLProgram | null = null;
  private vertexBuffer: WebGLBuffer | null = null;

  public constructor() {
    this.canvas = document.createElement("canvas");

    const gl = this.canvas.getContext("webgl2");

    if (!gl) {
      throw new Error("WebGL2 is not supported in this browser.");
    }

    this.gl = gl;

    this.testCircle = new Circle({
      radius: 50,
      position: new Vector2(400, 300),
      velocity: new Vector2(0, 0),
      color: [0.2, 0.8, 0.3],
    });

    this.initShaders();
    this.initBuffers();
  }

  private initShaders(): void {
    // Вершинный шейдер
    const vertexShader = this.createShader(
      this.gl.VERTEX_SHADER,
      `
        attribute vec2 a_position;
        attribute vec3 a_color;
        uniform vec2 u_resolution;
        uniform vec2 u_translation;
        uniform float u_scale;
        varying vec3 v_color;

        void main() {
            vec2 position = (a_position * u_scale + u_translation) / u_resolution * 2.0 - 1.0;
            position.y = -position.y;
            gl_Position = vec4(position, 0.0, 1.0);
            v_color = a_color;
        }
      `,
    );

    // Фрагментный шейдер
    const fragmentShader = this.createShader(
      this.gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        varying vec3 v_color;

        void main() {
            gl_FragColor = vec4(v_color, 1.0);
        }
      `,
    );

    this.program = this.gl.createProgram();
    if (!this.program) {
      throw new Error("Failed to create program");
    }

    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      throw new Error("Program link failed");
    }
  }

  private createShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error("Failed to create shader");
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error(
        "Shader compile failed: " + this.gl.getShaderInfoLog(shader),
      );
    }
    return shader;
  }

  private initBuffers(): void {
    // Геометрия круга (32 сегмента)
    const segments = 32;
    const vertices: number[] = [];

    // Центр круга
    vertices.push(0, 0);

    // Точки на окружности
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      vertices.push(Math.cos(angle), Math.sin(angle));
    }

    this.vertexBuffer = this.gl.createBuffer();
    if (!this.vertexBuffer) {
      throw new Error("Failed to create buffer");
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.STATIC_DRAW,
    );
  }

  private drawCircle(circle: Circle): void {
    if (!this.program || !this.vertexBuffer) {
      return;
    }

    const segments = 32;
    const color = circle.color;

    // Создаем буфер цветов
    const colors: number[] = [];
    colors.push(color[0], color[1], color[2]); // Центр
    for (let i = 0; i <= segments; i++) {
      colors.push(color[0], color[1], color[2]);
    }

    const colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(colors),
      this.gl.DYNAMIC_DRAW,
    );

    this.gl.useProgram(this.program);

    // Позиция
    const positionLoc = this.gl.getAttribLocation(this.program, "a_position");
    this.gl.enableVertexAttribArray(positionLoc);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(positionLoc, 2, this.gl.FLOAT, false, 0, 0);

    // Цвет
    const colorLoc = this.gl.getAttribLocation(this.program, "a_color");
    this.gl.enableVertexAttribArray(colorLoc);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    this.gl.vertexAttribPointer(colorLoc, 3, this.gl.FLOAT, false, 0, 0);

    // Uniforms
    const resolutionLoc = this.gl.getUniformLocation(
      this.program,
      "u_resolution",
    );
    const translationLoc = this.gl.getUniformLocation(
      this.program,
      "u_translation",
    );
    const scaleLoc = this.gl.getUniformLocation(this.program, "u_scale");

    this.gl.uniform2f(resolutionLoc, this.canvas.width, this.canvas.height);
    this.gl.uniform2f(translationLoc, circle.position.x, circle.position.y);
    this.gl.uniform1f(scaleLoc, circle.radius);

    // Рисуем
    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, segments + 2);

    // Очищаем
    this.gl.deleteBuffer(colorBuffer);
  }

  public start(): void {
    document.body.appendChild(this.canvas);

    this.resize();
    this.clear();

    this.gameLoop();
  }

  private resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private clear(): void {
    this.gl.clearColor(0.1, 0.1, 0.15, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  private gameLoop(): void {
    this.clear();
    
    if (this.testCircle) {
      this.drawCircle(this.testCircle);
    }

    requestAnimationFrame(() => this.gameLoop());
  }
}
