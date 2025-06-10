import { Container, Graphics, Text, TextStyle, Ticker } from "pixi.js";
import { WheelSection } from "./WheelSection";
import { WHEEL_RESULTS } from "../constant/constant";

interface SpinWheelOptions {
  radius: number;
  sections: WheelSection[];
  strokeWidth?: number;
  strokeColor?: number;
  textStyle?: TextStyle;
}


export class SpinWheel extends Container {
  public radius: number;
  public sections: WheelSection[];
  public strokeWidth: number;
  public strokeColor?: number;
  public textStyle: TextStyle;

  constructor({
    radius,
    sections,
    strokeWidth = 2,
    strokeColor,
    textStyle = new TextStyle({
      fontFamily: "Arial",
      fontSize: 26,
      fill: 0x111111,
      align: "center",
      wordWrap: true,
      wordWrapWidth: radius * 0.5,
    }),
  }: SpinWheelOptions) {
    super();

    this.radius = radius;
    this.sections = sections;
    this.strokeWidth = strokeWidth;
    this.strokeColor = strokeColor;
    this.textStyle = textStyle;

    this.pivot.set(0, 0);
    this._drawWheel();
  }

  private _drawWheel(): void {
    this.removeChildren();

    const angleStep = (Math.PI * 2) / this.sections.length;

    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];
      const startAngle = i * angleStep;
      const endAngle = (i + 1) * angleStep;
      const midAngle = startAngle + angleStep / 2;

      const g = new Graphics();
      if (this.strokeWidth > 0) {
        g.stroke({
          width: this.strokeWidth,
          color: this.strokeColor ?? 0x000000,
          alpha: 1,
        });
      }
      g.fill({ color: section.color, alpha: 1 });

      g.moveTo(0, 0);
      g.arc(0, 0, this.radius, startAngle, endAngle);
      g.lineTo(0, 0);
      g.fill();
      this.addChild(g);

      if (section.label) {
        const text = new Text({
          text: section.label,
          style: this.textStyle,
        });
        text.anchor.set(0.5);
        const labelRadius = this.radius * 0.6;
        text.x = Math.cos(midAngle) * labelRadius;
        text.y = Math.sin(midAngle) * labelRadius;
        text.rotation = midAngle + Math.PI / 2;
        this.addChild(text);
      }
    }

    this.x = this.radius;
    this.y = this.radius;
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



  // Uncomment if you want to allow redrawing dynamically
  // public regenerate(sections: WheelSection[]): void {
  //   this.sections = sections;
  //   this._drawWheel();
  // }
}
