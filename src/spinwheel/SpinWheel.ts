// src/spinwheel/SpinWheel.ts
import { Container, Graphics, Text, TextStyle, Ticker } from "pixi.js";

interface SpinWheelOptions {
  radius: number;
  segments: number;
  colors?: string[];         // Array of hex‐color numbers (e.g. 0xff0000)
  strokeWidth?: number;      // Outline thickness for each slice
  strokeColor?: number;      // Outline color (hex) for each slice
  labels?: string[];         // Optional text labels for each slice
  textStyle?: TextStyle;     // PIXI.TextStyle used when drawing labels
}

interface RegenerateOptions {
  segments?: number;
  colors?: string[];
  labels?: string[];
}

/**
 * SpinWheel extends PIXI.Container. It draws a circular wheel divided into `N` slices.
 * You can call `.spin(durationMs, rotationTurns, onComplete)` to animate a spin.
 */
export class SpinWheel extends Container {
  public radius: number;
  public segments: number;
  public colors: string[];
  public strokeWidth: number;
  public strokeColor?: number;
  public labels: string[];
  public textStyle: TextStyle;

  constructor({
    radius,
    segments,
    colors = [],
    strokeWidth = 2,
    strokeColor,
    labels = [],
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

    // Store all properties on `this`
    this.radius = radius;
    this.segments = segments;
    this.colors = colors;
    this.strokeWidth = strokeWidth;
    this.strokeColor = strokeColor;
    this.labels = labels;
    this.textStyle = textStyle;
     
    // ensure its centered 
    this.pivot.set(0, 0);

    // Draw immediately
    this._drawWheel();
  }

  
  private _drawWheel(): void {

    this.removeChildren();

    // Each slice spans this many radians:
    const angleStep = (Math.PI * 2) / this.segments;

    for (let i = 0; i < this.segments; i++) {
      const startAngle = i * angleStep;
      const endAngle = (i + 1) * angleStep;
      const midAngle = startAngle + angleStep / 2;

      const fillHex = this.colors[i % this.colors.length] ?? 0xffffff;

      //Draw the slice for this segment
      const g = new Graphics();
      if (this.strokeWidth > 0) {
        g.stroke({ width: this.strokeWidth, color: this.strokeColor ?? 0x000000, alpha: 1 });
      }
      g.fill({color:fillHex, alpha:1});

      // Move to center, draw arc, then back to center:
      g.moveTo(0, 0);
      g.arc(0, 0, this.radius, startAngle, endAngle);
      g.lineTo(0, 0);
      g.fill();

      this.addChild(g);

      if (this.labels[i]) {
        const text = new Text({
          text: this.labels[i],
          style: this.textStyle,
        });
        text.anchor.set(0.5);

        // Place label at 60% of radius
        const labelRadius = this.radius * 0.6;
        text.x = Math.cos(midAngle) * labelRadius;
        text.y = Math.sin(midAngle) * labelRadius;

        // Rotate the text so it’s upright
        text.rotation = midAngle + Math.PI / 2;

        this.addChild(text);
      }
    }

    this.x = this.radius;
    this.y = this.radius;
  }

  
  // public regenerate({ segments, colors, labels }: RegenerateOptions = {}): void {
  //   if (segments != null) {
  //     this.segments = segments;
  //   }
  //   if (colors) {
  //     this.colors = colors;
  //   }
  //   if (labels) {
  //     this.labels = labels;
  //   }
  //   this._drawWheel();
  // }

  /**
   * Spins the wheel by animating `this.rotation` over time.
   * Uses an ease‐out‐cubic by default. You can replace easing if desired.
   *
   * @param durationMs      - total spin duration in milliseconds
   * @param rotationTurns   - how many full revolutions (e.g. 3 = 3×360°)
   * @param onComplete      - callback once the spin finishes
   */
  public spin(
    durationMs: number = 3000,
    rotationTurns: number = 5,
    onComplete: () => void = () => {}
  ): void {
    // const totalRotation = rotationTurns * Math.PI * 2;
    const totalRotation = (rotationTurns * Math.PI * 2) +(Math.random() * (Math.random()*25)); // Add a random offset to the spin
    // console.log(` total rotation: ${totalRotation} radians`);
    

    const startTime = performance.now();
    const initialRotation = this.rotation;

    const ticker = Ticker.shared;

    const tickCallback = (): void => {
      const now = performance.now();
      const elapsed = now - startTime;

      if (elapsed >= durationMs) {
        // Final placement
        
        this.rotation = initialRotation + totalRotation;
        ticker.remove(tickCallback);
        onComplete();
      } else {
        // Normalized time [0…1]
        const t = elapsed / durationMs;
        // Ease‐out cubic: f(t) = 1 − (1 − t)^3
        const eased = 1 - Math.pow(1 - t, 3);
        this.rotation = initialRotation + totalRotation * eased;
      }
    };

    ticker.add(tickCallback);
    ticker.start();
  }
}
