export class Engine {
  private readonly canvas: HTMLCanvasElement;

  public constructor() {
    /* 
        □□□□□□□□□□□□□□□□□□□□□□□□
        □□□□□□□□□□□□□□□□□□□□□□□□
        □□□□□□□□□□□□□□□□□□□□□□□□
        □□□□□□□□□□□□□□□□□□□□□□□□
        □□□□□□□□□□□□□□□□□□□□□□□□
    */

    this.canvas = document.createElement("canvas");
  }

  public start(): void {
    document.body.appendChild(this.canvas);
  }
}
