//added updated constructor and consts
import { Container, Graphics, Text, TextStyle, Ticker } from "pixi.js";
import { WHEEL_RESULTS } from "../constant/constant";
import { Tween, Easing, update as tweenUpdate } from "@tweenjs/tween.js";

export class WheelSection {
  constructor(public label: string, public color: number) {}
}

interface SpinWheelOptions {
  radius: number;
  sections: WheelSection[];
  strokeWidth?: number;
  strokeColor?: number;
  textStyle?: TextStyle;
}

const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_STROKE_COLOR = 0x000000;
const DEFAULT_TEXT_STYLE = (radius: number) =>
  new TextStyle({
    fontFamily: "Arial",
    fontSize: 26,
    fill: 0x111111,
    align: "center",
    wordWrap: true,
    wordWrapWidth: radius * 0.5,
  });

export class SpinWheel extends Container {
  private radius: number;
  private sections: WheelSection[];
  private strokeWidth: number;
  private strokeColor: number;
  private textStyle: TextStyle;
  private activeTween?: Tween;

  constructor({
    radius,
    sections,
    strokeWidth = DEFAULT_STROKE_WIDTH,
    strokeColor = DEFAULT_STROKE_COLOR,
    textStyle = DEFAULT_TEXT_STYLE(radius),
  }: SpinWheelOptions) {
    super();
    this.radius = radius;
    this.sections = sections;
    this.strokeWidth = strokeWidth;
    this.strokeColor = strokeColor;
    this.textStyle = textStyle;

    this._drawWheel();
    this.position.set(radius, radius);

    // Hook into Pixi's ticker for smooth tween updates
    Ticker.shared.add(() => tweenUpdate());
  }

  private _drawWheel(): void {
    this.removeChildren();
    const angleStep = (Math.PI * 2) / this.sections.length;

    this.sections.forEach((section, i) => {
      const startAngle = i * angleStep;
      const endAngle = startAngle + angleStep;
      const midAngle = startAngle + angleStep / 2;

      const slice = new Graphics()
        .stroke({ width: this.strokeWidth, color: this.strokeColor })
        .fill({ color: section.color })
        .moveTo(0, 0)
        .arc(0, 0, this.radius, startAngle, endAngle)
        .lineTo(0, 0)
        .fill();
      this.addChild(slice);

      if (section.label) {
        const text = new Text({ text: section.label, style: this.textStyle });
        text.anchor.set(0.5);
        const labelRadius = this.radius * 0.6;
        text.position.set(
          Math.cos(midAngle) * labelRadius,
          Math.sin(midAngle) * labelRadius
        );
        text.rotation = midAngle + Math.PI / 2;
        this.addChild(text);
      }
    });
  }

  
  public spin(onComplete: () => void = () => {}): void {
  const resultIndex = WHEEL_RESULTS.result[0].index;
  const totalSections = this.sections.length;
  const anglePerSection = (Math.PI * 2) / totalSections;

  // Random duration  and rotation between 3 and 5
  const durationMs = Math.random() * 2000 + 3000;
  const rotationTurns = Math.floor(Math.random() * 3) + 3;

  const targetRotation = (Math.PI * 3 / 2) - (resultIndex+0.5 )* anglePerSection;
  const finalRotation = rotationTurns * Math.PI * 2 + targetRotation;

  const startTime = performance.now();
  const initialRotation = this.rotation;

  const ticker = Ticker.shared;
  const tickCallback = (): void => {
    const now = performance.now();
    const elapsed = now - startTime;

    if (elapsed >= durationMs) {
      this.rotation = initialRotation + finalRotation;
      ticker.remove(tickCallback);
      onComplete();
    } else {
      const t = elapsed / durationMs;
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      this.rotation = initialRotation + finalRotation * eased;
    }
  };

  ticker.add(tickCallback);
  ticker.start();
}

}
