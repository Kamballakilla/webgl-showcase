import { Circle } from "@/entities/Circle";
/**
 * Основной движок симуляции.
 * Управляет WebGL‑контекстом, геометрией, циклом обновления/отрисовки и массивом кругов.
 */
export class Engine {
  private readonly canvas: HTMLCanvasElement;
  private readonly gl: WebGL2RenderingContext;
  /** Шейдерная программа (собирается один раз) */
  private program: WebGLProgram | null = null;
  /** Общий буфер геометрии круга (центр + 32 сегмента) */
  private vertexBuffer: WebGLBuffer | null = null;

  /** Массив всех кругов в симуляции */
  private circles: Circle[] = [];

  /** Время предыдущего кадра (мс) для вычисления deltaTime */
  private lastTime: number = 0;

  public constructor() {
    this.canvas = document.createElement("canvas");
    // Центрируем canvas и задаём фон, чтобы он выделялся
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "50%";
    this.canvas.style.left = "50%";
    this.canvas.style.transform = "translate(-50%, -50%)";
    this.canvas.style.backgroundColor = "#1a1a2e"; // тёмный фон игровой области
    this.canvas.style.border = "2px solid #4a4a6a"; // рамка
    this.canvas.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";

    const gl = this.canvas.getContext("webgl2");

    if (!gl) {
      throw new Error("WebGL2 is not supported in this browser.");
    }

    this.gl = gl;
    this.initShaders();
    this.initBuffers();
  }

  /** Компилирует шейдеры и линкует программу */
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

  /** Создаёт общий vertexBuffer с геометрией круга */
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

  /** Вспомогательный метод компиляции шейдера */
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

  /** Добавляет круг в симуляцию */
  public addCircle(circle: Circle): void {
    this.circles.push(circle);
  }

  /** Удаляет все круги */
  public clearCircles(): void {
    this.circles = [];
  }

  /** Запускает симуляцию: добавляет canvas в DOM и стартует игровой цикл */
  public start(): void {
    document.body.appendChild(this.canvas);
    this.resize();
    this.lastTime = performance.now();
    requestAnimationFrame(this.gameLoop);
  }

  /** Главный цикл: вычисляет deltaTime, обновляет физику, перерисовывает */
  private gameLoop = (now: number): void => {
    const deltaTime = (now - this.lastTime) / 1000;
    this.lastTime = now;
    this.update(deltaTime);
    this.clear();
    this.draw();
    requestAnimationFrame(this.gameLoop);
  };

  /** Обновляет позиции всех кругов */
  private update(deltaTime: number): void {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Обновляем позиции и границы
    for (const circle of this.circles) {
      circle.update(deltaTime);
      circle.constrainToBounds(w, h);
    }

    // Обрабатываем столкновения между кругами
    for (let i = 0; i < this.circles.length; i++) {
      for (let j = i + 1; j < this.circles.length; j++) {
        const a = this.circles[i];
        const b = this.circles[j];
        if (a.collidesWith(b)) {
          a.resolveCollision(b);
        }
      }
    }
  }

  /** Очищает canvas заданным цветом */
  private clear(): void {
    this.gl.clearColor(0.1, 0.1, 0.15, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  /** Отрисовывает все круги */
  private draw(): void {
    for (const circle of this.circles) {
      circle.draw(this.gl, this.program!, this.vertexBuffer!);
    }
  }

  /** Подгоняет размер canvas под окно браузера */
  private resize(): void {
    // Занимаем 80% ширины и высоты окна (площадь 64% > 50%)
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.8;
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }
}
