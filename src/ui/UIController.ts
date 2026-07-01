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
      const radiusInput = document.getElementById("radius") as HTMLInputElement;
      const velXInput = document.getElementById("velX") as HTMLInputElement;
      const velYInput = document.getElementById("velY") as HTMLInputElement;

      const radius = parseFloat(radiusInput.value);
      const velX = parseFloat(velXInput.value);
      const velY = parseFloat(velYInput.value);

      if (isNaN(radius) || radius <= 0) {
        alert("Радиус должен быть положительным числом!");
        return;
      }

      const maxX = window.innerWidth - radius * 2;
      const maxY = window.innerHeight - radius * 2;
      if (maxX < 0 || maxY < 0) {
        alert("Слишком большой радиус для текущей области!");
        return;
      }

      const x = radius + Math.random() * maxX;
      const y = radius + Math.random() * maxY;

      const circle = new Circle({
        radius,
        position: new Vector2(x, y),
        velocity: new Vector2(isNaN(velX) ? 0 : velX, isNaN(velY) ? 0 : velY),
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
          alert(`Ошибка при загрузке состояния ${e}`);
        }
      } else {
        alert("Нет сохранённого состояния");
      }
    });
  }
}
