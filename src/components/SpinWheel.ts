import { Container, TextStyle, Ticker } from "pixi.js";
import { SpinningPart } from "./SpinningPart";

export interface WheelSection {
  label: string;
}

export class SpinWheel extends Container {
  private spinContainer: Container;
  private rotator = { rotation: 0 };
  private targetRotation: number = 0;
  private isSpinning: boolean = false;
  private spinTicker: Ticker | null = null;

  constructor(radius: number, sections: WheelSection[], textStyle: TextStyle) {
    super();
    this.spinContainer = new Container();
    this.addChild(this.spinContainer);

    const angleStep = (Math.PI * 2) / sections.length;
    const defaultColors = [0xd9c6b2, 0xb22234];

    sections.forEach((section, i) => {
      const color = defaultColors[i % 2];
      const startAngle = i * angleStep;
      const endAngle = startAngle + angleStep;
      const part = new SpinningPart(radius, startAngle, endAngle, color, section.label, textStyle);
      this.spinContainer.addChild(part);
    });
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  private easeOutBounce(t: number): number {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }

  spin(toIndex: number, onComplete: () => void): void {
    if (this.isSpinning) return;
    
    console.log("spin", toIndex);
    this.isSpinning = true;

    const totalSections = this.spinContainer.children.length;
    const anglePerSection = (Math.PI * 2) / totalSections;
    
    // Calculate the target angle for the specific section
    const targetAngle = (Math.PI * 3 / 2) - (toIndex + 0.5) * anglePerSection;
    
    // Start from current position and add rotations to reach target
    const currentRotation = this.rotator.rotation;
    const additionalRotations = 8 * Math.PI; // 4 full rotations
    
    // Find the target angle that's closest to current + additional rotations
    const currentNormalized = currentRotation % (Math.PI * 2);
    let finalTargetAngle = targetAngle;
    
    // Ensure we always rotate forward to the target
    if (finalTargetAngle < currentNormalized) {
      finalTargetAngle += Math.PI * 2;
    }
    
    this.targetRotation = currentRotation + additionalRotations + (finalTargetAngle - currentNormalized);

    this.spinTicker = new Ticker();
    const startTime = performance.now();
    const totalDuration = 5000; // 5 seconds total
    const startRotation = this.rotator.rotation;
    const totalRotation = this.targetRotation - startRotation;

    this.spinTicker.add(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      
      let animationProgress: number;
      let currentRotation: number;
      
      if (progress < 0.8) {
        // Main spin phase (0-80% of time) - smooth acceleration and deceleration
        const mainProgress = progress / 0.8;
        animationProgress = this.easeInOutCubic(mainProgress);
        currentRotation = startRotation + (totalRotation * animationProgress);
      } else {
        // Wobble phase (80-100% of time) - bounce at the end
        const wobbleProgress = (progress - 0.8) / 0.2;
        const bounceProgress = this.easeOutBounce(wobbleProgress);
        
        // Add small wobble motion on top of the final position
        const wobbleAmount = 0.05 * (1 - wobbleProgress);
        const wobble = Math.sin(elapsed * 0.02) * wobbleAmount;
        
        currentRotation = startRotation + totalRotation + wobble;
      }

      this.rotator.rotation = currentRotation;
      this.spinContainer.rotation = currentRotation;

      if (progress >= 1) {
        // Ensure final position is exact
        this.rotator.rotation = this.targetRotation;
        this.spinContainer.rotation = this.targetRotation;
        
        this.spinTicker?.destroy();
        this.spinTicker = null;
        this.isSpinning = false;
        console.log("Spin completed with wobble!");
        onComplete();
      }
    });

    this.spinTicker.start();
  }

  resetRotation(): void {
    if (this.spinTicker) {
      this.spinTicker.destroy();
      this.spinTicker = null;
    }
    this.rotator.rotation = 0;
    this.spinContainer.rotation = 0;
    this.isSpinning = false;
  }
}
