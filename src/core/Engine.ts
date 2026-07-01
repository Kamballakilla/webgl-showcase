import { Circle } from "@/entities/Circle";
import { Vector2 } from "@/math/Vector2";

export class Engine {
  private readonly canvas: HTMLCanvasElement;
  private readonly gl: WebGL2RenderingContext;
  private testCircle: Circle | null = null;

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
      // eslint-disable-next-line no-console
      console.log(
        `Тестовый круг в позиции: ${this.testCircle.position.toString()}`,
      );
    }

    requestAnimationFrame(() => this.gameLoop());
  }
}
