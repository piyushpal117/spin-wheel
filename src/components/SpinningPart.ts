import { Graphics, Text, TextStyle, Container } from "pixi.js";

export class SpinningPart extends Container {
  constructor(
    radius: number,
    startAngle: number,
    endAngle: number,
    color: number,
    label: string,
    textStyle: TextStyle
  ) {
    super();

    const graphics = new Graphics()
      .fill({ color })
      .moveTo(0, 0)
      .arc(0, 0, radius, startAngle, endAngle)
      .lineTo(0, 0)
      .fill();
    
    this.addChild(graphics);

    if (label) {
      const midAngle = (startAngle + endAngle) / 2;
      const text = new Text({ text: label, style: textStyle });
      text.anchor.set(0.5);
      const labelRadius = radius * 0.6;
      text.position.set(Math.cos(midAngle) * labelRadius, Math.sin(midAngle) * labelRadius);
      text.rotation = midAngle + Math.PI / 2;
      this.addChild(text);
    }
  }
}