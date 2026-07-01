import { Engine } from "@/core/Engine";
import { Circle } from "@/entities/Circle";
import { Vector2 } from "@/math/Vector2";

export class UIController {
  constructor(private engine: Engine) {
    this.bindEvents();
  }

  private bindEvents(): void {
    // Добавить случайный круг
    document.getElementById("addRandom")?.addEventListener("click", () => {
      const circle = Circle.random({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      this.engine.addCircle(circle);
    });

    // Очистить все
    document.getElementById("clearAll")?.addEventListener("click", () => {
      this.engine.clearCircles();
    });

    // Добавить круг с заданными параметрами
    document.getElementById("addCustom")?.addEventListener("click", () => {
      const radius =
        parseFloat(
          (document.getElementById("radius") as HTMLInputElement).value,
        ) || 20;
      const velX =
        parseFloat(
          (document.getElementById("velX") as HTMLInputElement).value,
        ) || 0;
      const velY =
        parseFloat(
          (document.getElementById("velY") as HTMLInputElement).value,
        ) || 0;

      // Случайная позиция внутри границ (с учётом радиуса)
      const maxX = window.innerWidth - radius * 2;
      const maxY = window.innerHeight - radius * 2;
      const x = radius + Math.random() * maxX;
      const y = radius + Math.random() * maxY;

      const circle = new Circle({
        radius,
        position: new Vector2(x, y),
        velocity: new Vector2(velX, velY),
        color: [
          Math.random() * 0.6 + 0.4,
          Math.random() * 0.6 + 0.4,
          Math.random() * 0.6 + 0.4,
        ],
      });
      this.engine.addCircle(circle);
    });

    // Сохранить состояние в localStorage
    document.getElementById("saveState")?.addEventListener("click", () => {
      const state = this.engine.getState();
      localStorage.setItem("circleSimState", JSON.stringify(state));
      alert("Состояние сохранено!");
    });

    // Загрузить состояние из localStorage
    document.getElementById("loadState")?.addEventListener("click", () => {
      const saved = localStorage.getItem("circleSimState");
      if (saved) {
        try {
          const state = JSON.parse(saved);
          this.engine.setState(state);
        } catch (e) {
          alert("Ошибка при загрузке состояния");
        }
      } else {
        alert("Нет сохранённого состояния");
      }
    });
  }
}
