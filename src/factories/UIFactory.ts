// src/factories/UIFactory.ts
import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { Howl } from "howler";

let music = false;
export class UIFactory {
  static createPointer(
    texture: Texture,
    centerX: number,
    centerY: number
  ): Sprite {
    const pointer = new Sprite(texture);
    pointer.scale.set(0.45);
    pointer.anchor.set(0.5, 0.1);
    pointer.x = centerX ;
    pointer.y = centerY - 225;
    return pointer;
  }

static createCongratulation(
  texture: Texture,
  centerX: number,
  centerY: number,
): Sprite {
  const congratulation = new Sprite(texture);
  congratulation.scale.set(1.2);
  congratulation.anchor.set(0.5, 0.1);
  congratulation.x = centerX ;
  congratulation.y = centerY -380 ;
  return congratulation;
  
}
  static WinSound = new Howl({
      src: ["/audio/you-win.mp3"],
      volume: 0.5,
    });  

  static createSpinButton(onClick: () => void): Container {
    const spinButton = new Container();
    spinButton.interactive = true;
    spinButton.cursor = "pointer";

    const sound = new Howl({
      src: ["/audio/spin-wheel-sound.mp3"],
      volume: 0.5,
    });

    

    const btnBg = new Graphics();
    btnBg.fill(0xdb0f27);
    btnBg.circle(0, 0, 35);
    btnBg.fill();
    btnBg.stroke({ color: 0x290a53, width: 6 });
    spinButton.addChild(btnBg);

    const textStyle = new TextStyle({
      fontFamily: "Arial",
      fontSize: 19,
      fill: "#ffffff",
      fontWeight: "bold",
    });
    const btnText = new Text({ text: "SPIN", style: textStyle });
    btnText.anchor.set(0.5);
    spinButton.addChild(btnText);

    spinButton.on("pointerdown", () => {
      spinButton.interactive = false;
      // btnText.tint = 0x777777;
      sound.play();
      btnBg.tint = 0x777777;
      onClick();
    });

    return spinButton;
  }
}
