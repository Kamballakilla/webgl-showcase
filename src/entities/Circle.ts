import { Vector2 } from "@/math/Vector2";

/**
 * Конфигурация для создания круга
 */
export interface CircleConfig {
  radius: number; // Радиус круга
  position: Vector2; // Начальная позиция
  velocity: Vector2; // Начальная скорость
  mass?: number; // Масса (опционально)
  color?: [number, number, number]; // Цвет в RGB (опционально)
  isStatic?: boolean; // Статичный ли объект (опционально)
}

/**
 * Type Guard: проверяет, является ли объект CircleJSON
 */
function isCircleJSON(data: unknown): data is CircleConfig {
  // Проверяем, что data - объект
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  // Проверяем обязательные поля
  if (typeof obj.radius !== "number" || obj.radius <= 0) {
    return false;
  }

  if (typeof obj.position !== "object" || obj.position === null) {
    return false;
  }

  const pos = obj.position as Record<string, unknown>;
  if (typeof pos.x !== "number" || typeof pos.y !== "number") {
    return false;
  }

  if (typeof obj.velocity !== "object" || obj.velocity === null) {
    return false;
  }

  const vel = obj.velocity as Record<string, unknown>;
  if (typeof vel.x !== "number" || typeof vel.y !== "number") {
    return false;
  }

  // Проверяем опциональные поля
  if (obj.mass !== undefined && typeof obj.mass !== "number") {
    return false;
  }

  if (obj.color !== undefined) {
    if (!Array.isArray(obj.color) || obj.color.length !== 3) {
      return false;
    }
    for (const c of obj.color) {
      if (typeof c !== "number" || c < 0 || c > 1) {
        return false;
      }
    }
  }

  if (obj.isStatic !== undefined && typeof obj.isStatic !== "boolean") {
    return false;
  }

  return true;
}

/**
 * Класс Circle - основной физический объект в симуляции
 * Представляет собой круг с физическими свойствами
 */
export class Circle {
  public radius: number;
  public position: Vector2;
  public velocity: Vector2;
  public mass: number;
  public color: [number, number, number];
  public isStatic: boolean;

  constructor(config: CircleConfig) {
    this.radius = config.radius;
    this.position = config.position.clone();
    this.velocity = config.velocity.clone();

    // Масса по умолчанию пропорциональна площади круга
    this.mass = config.mass || this.radius * this.radius * Math.PI * 0.1;

    // Цвет по умолчанию - синий
    this.color = config.color || [0.2, 0.6, 1.0];

    // Статичный по умолчанию = false (движется)
    this.isStatic = config.isStatic || false;
  }

  /**
   * Обновляет позицию круга на основе его скорости
   * @param deltaTime - время в секундах с прошлого кадра
   */
  update(deltaTime: number): void {
    if (this.isStatic) {
      return;
    }
    this.position = this.position.add(this.velocity.multiply(deltaTime));
  }

  /**
   * Возвращает границы круга (для проверки столкновений)
   */
  getBounds() {
    return {
      left: this.position.x - this.radius,
      right: this.position.x + this.radius,
      top: this.position.y - this.radius,
      bottom: this.position.y + this.radius,
    };
  }

  /**
   * Применяет силу к кругу (изменяет скорость)
   * @param force - вектор силы
   * @param deltaTime - время в секундах
   */
  applyForce(force: Vector2, deltaTime: number): void {
    if (this.isStatic) {
      return;
    }
    // F = ma => a = F/m, v = v + a*dt
    const acceleration = force.divide(this.mass);
    this.velocity = this.velocity.add(acceleration.multiply(deltaTime));
  }

  /**
   * Проверяет столкновение с другим кругом
   * @param other - другой круг
   * @returns true если круги пересекаются
   */
  collidesWith(other: Circle): boolean {
    const distance = this.position.distanceTo(other.position);
    const radiusSum = this.radius + other.radius;
    return distance < radiusSum;
  }

  /**
   * Сериализация для сохранения состояния
   */
  toJSON() {
    return {
      radius: this.radius,
      position: { x: this.position.x, y: this.position.y },
      velocity: { x: this.velocity.x, y: this.velocity.y },
      mass: this.mass,
      color: this.color,
      isStatic: this.isStatic,
    };
  }

  /**
   * Десериализация из сохраненного состояния
   */
  static fromJSON(data: unknown): Circle {
    // Проверяем данные
    if (!isCircleJSON(data)) {
      throw new Error("Invalid circle data");
    }

    // Теперь TypeScript знает, что data - это CircleJSON
    const circle = new Circle({
      radius: data.radius,
      position: new Vector2(data.position.x, data.position.y),
      velocity: new Vector2(data.velocity.x, data.velocity.y),
      mass: data.mass,
      color: data.color || [0.2, 0.6, 1.0],
      isStatic: data.isStatic || false,
    });

    return circle;
  }

  /**
   * Создает случайный круг с случайными параметрами
   */
  static random(bounds: { width: number; height: number }): Circle {
    const radius = Math.random() * 30 + 10; // 10-40
    const x = Math.random() * (bounds.width - 100) + 50;
    const y = Math.random() * (bounds.height - 100) + 50;
    const vx = (Math.random() - 0.5) * 200;
    const vy = (Math.random() - 0.5) * 200;

    const color: [number, number, number] = [
      Math.random() * 0.6 + 0.4,
      Math.random() * 0.6 + 0.4,
      Math.random() * 0.6 + 0.4,
    ];

    return new Circle({
      radius,
      position: new Vector2(x, y),
      velocity: new Vector2(vx, vy),
      color,
    });
  }
}
















