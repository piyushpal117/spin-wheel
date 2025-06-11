// we dont need 2 files for same task

import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { Howl } from "howler";
import { WheelSection } from "../spinwheel/SpinWheel";
import { WHEEL_CONFIG } from "../constant/constant";

export class wheelParts {
  static createWheelSections(colors: string[], segments: number): WheelSection[] {
    const config = WHEEL_CONFIG.wheelConfiguration;
    if (!Array.isArray(config) || !config.length) {
      console.warn("No wheel data available, using fallback.");
      return this.fallbackSections(segments, colors);
    }
    return config.slice(0, segments).map((item, i) => {
      const color = parseInt(colors[i % colors.length].replace("#", "0x"));
      return new WheelSection(String(item.sc), color);
    });
  }

  private static fallbackSections(segments: number, colors: string[]): WheelSection[] {
    const labels = ['10', '100', '200', '500', '1000', '1200', '1300', '1400'];
    return Array.from({ length: segments }, (_, i) => {
      const color = parseInt(colors[i % colors.length].replace("#", "0x"));
      return new WheelSection(labels[i % labels.length], color);
    });
  }

  static WinSound = new Howl({ src: ["/audio/you-win.mp3"], volume: 0.5 });
  static spinSound = new Howl({ src: ["/audio/spin-wheel-sound.mp3"], volume: 0.5 });

  static createPointer(texture: Texture, x: number, y: number): Sprite {
    const pointer = new Sprite(texture);
    pointer.anchor.set(0.5, 0.1);
    pointer.scale.set(0.45);
    pointer.position.set(x, y - 225);
    return pointer;
  }

  static createCongratulation(texture: Texture, x: number, y: number): Sprite {
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5, 0.1);
    sprite.scale.set(1.2);
    sprite.position.set(x, y - 380);
    sprite.zIndex = 10;
    return sprite;
  }

  static createSpinButton(onClick: () => void): Container {
    const btn = new Container();
    btn.interactive = true;
    btn.cursor = "pointer";

    const bg = new Graphics()
      .fill(0xdb0f27)
      .circle(0, 0, 35)
      .fill()
      .stroke({ color: 0x290a53, width: 6 });

    const text = new Text({
      text: "SPIN",
      style: new TextStyle({ fontFamily: "Arial", fontSize: 19, fill: "#fff", fontWeight: "bold" }),
    });
    text.anchor.set(0.5);

    btn.addChild(bg, text);

    btn.on("pointerdown", () => {
      btn.interactive = false;
      bg.tint = 0x777777;
      this.spinSound.play();
      onClick();
    });

    return btn;
  }
}
