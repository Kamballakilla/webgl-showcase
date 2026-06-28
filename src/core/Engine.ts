export class Engine {
  private readonly canvas: HTMLCanvasElement;
  private readonly gl: WebGL2RenderingContext;

  public constructor() {
    this.canvas = document.createElement("canvas");

    const gl = this.canvas.getContext("webgl2");

    if (!gl) {
      throw new Error("WebGL2 is not supported in this browser.");
    }

    this.gl = gl;
  }

  public start(): void {
    document.body.appendChild(this.canvas);

    this.resize();
    this.clear();
  }

  private resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private clear(): void {
    // Устанавливает цвет, которым будет очищен экран (RGBA)
    // Значения от 0.0 до 1.0:
    // R = красный, G = зелёный, B = синий, A = прозрачность (альфа)
    this.gl.clearColor(0.1, 0.1, 0.15, 1.0);
    // Очищает цветовой буфер кадра, заполняя его цветом, заданным выше
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
