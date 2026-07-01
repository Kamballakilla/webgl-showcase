import { Engine } from "@/core/Engine";
import { Circle } from "@/entities/Circle";
import { Vector2 } from "@/math/Vector2";
import { UIController } from "./ui/UIController";
import './styles.css';

const engine = new Engine();

new UIController(engine);

const circle = new Circle({
  radius: 50,
  position: new Vector2(400, 300),
  velocity: new Vector2(100, 50),
  color: [0.2, 0.8, 0.3],
});
engine.addCircle(circle);

engine.addCircle(
  Circle.random({ width: window.innerWidth, height: window.innerHeight }),
);
engine.addCircle(
  Circle.random({ width: window.innerWidth, height: window.innerHeight }),
);

engine.start();
