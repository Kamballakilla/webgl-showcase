export class Vector2 {
    constructor(public x: number, public y: number) {}

    // Сложение векторов
    add(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    // Вычитание векторов
    subtract(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    // Умножение на скаляр
    multiply(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    // Деление на скаляр
    divide(scalar: number): Vector2 {
        if (scalar === 0) {throw new Error("Division by zero")};
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    // Длина вектора (модуль)
    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Квадрат длины (быстрее, чем length())
    lengthSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    // Нормализация (приведение к единичной длине)
    normalize(): Vector2 {
        const len = this.length();
        if (len === 0) {return new Vector2(0, 0)};
        return new Vector2(this.x / len, this.y / len);
    }

    // Скалярное произведение
    dot(v: Vector2): number {
        return this.x * v.x + this.y * v.y;
    }

    // Векторное произведение (2D псевдо-вектор)
    cross(v: Vector2): number {
        return this.x * v.y - this.y * v.x;
    }

    // Расстояние до другого вектора
    distanceTo(v: Vector2): number {
        return this.subtract(v).length();
    }

    // Квадрат расстояния (быстрее)
    distanceToSquared(v: Vector2): number {
        return this.subtract(v).lengthSquared();
    }

    // Угол вектора в радианах
    angle(): number {
        return Math.atan2(this.y, this.x);
    }

    // Поворот вектора на угол (в радианах)
    rotate(angle: number): Vector2 {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    // Линейная интерполяция между двумя векторами
    lerp(v: Vector2, t: number): Vector2 {
        return new Vector2(
            this.x + (v.x - this.x) * t,
            this.y + (v.y - this.y) * t
        );
    }

    // Проверка на равенство
    equals(v: Vector2, epsilon: number = 0.0001): boolean {
        return Math.abs(this.x - v.x) < epsilon && Math.abs(this.y - v.y) < epsilon;
    }

    // Клонирование вектора
    clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    // Преобразование в строку (для отладки)
    toString(): string {
        return `Vector2(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
    }

    // Преобразование в массив
    toArray(): [number, number] {
        return [this.x, this.y];
    }

    // Статические методы

    // Нулевой вектор
    static zero(): Vector2 {
        return new Vector2(0, 0);
    }

    // Вектор (1, 0)
    static right(): Vector2 {
        return new Vector2(1, 0);
    }

    // Вектор (0, 1)
    static up(): Vector2 {
        return new Vector2(0, 1);
    }

    // Создание вектора из угла
    static fromAngle(angle: number): Vector2 {
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }

    // Случайный вектор единичной длины
    static random(): Vector2 {
        const angle = Math.random() * Math.PI * 2;
        return Vector2.fromAngle(angle);
    }

    // Скалярное произведение двух векторов (статическая версия)
    static dot(a: Vector2, b: Vector2): number {
        return a.x * b.x + a.y * b.y;
    }

    // Расстояние между двумя векторами (статическая версия)
    static distance(a: Vector2, b: Vector2): number {
        return a.distanceTo(b);
    }
}