import { Assets, Texture, Container, Graphics, Text, TextStyle, Sprite } from "pixi.js";
import { AppManager } from "./core/core";
import { SpinWheel, WheelSection } from "./components/SpinWheel";
import config from "../config.json";


console.log("Starting Spin Wheel App...");

(async () => {
  const manager = new AppManager();
  await manager.init();
  console.log('managerinit initialised');
  

  const { app, stage } = manager;
  const center = { x: app.renderer.width / 2, y: app.renderer.height / 2 };

  const border = await Assets.load("/images/pointer.png") as Texture;
  const Pointer = new Sprite(border);
  Pointer.anchor.set(0.5);
  Pointer.scale.set(0.45);

  const sections: WheelSection[] = config.segments;
  const wheel = new SpinWheel(250, sections, new TextStyle({ fontSize: 26, fill: 0xffffff }));
  wheel.position.set(0, 0);

  const container = new Container();
  container.zIndex = 1;
  container.position.set(center.x, center.y);4
  
  container.addChild(wheel);
  container.addChild(Pointer);

  // Optional: pointer image
  const pointerTex = await Assets.load("/images/pointer.png") as Texture;
  const pointer = new Graphics()
    .poly([
      -10, 0,
       10, 0,
       0, -50
    ])
    .fill(0x58151D);
  pointer.position.set(0, -260);
  pointer.angle=180;
  // container.addChild(pointer);

  const button = new Container();
  button.interactive = true;
  button.cursor = "pointer";

  const bg = new Graphics()
  .circle(0, 0, 35)
  .fill(0xdb0f27)
  .stroke({color:0x290a53, width: 4})
  
  .setStrokeStyle({ color: 0x290a53, width: 6 });

  const label = new Text({
    text: "SPIN",
    style: new TextStyle({
      fontFamily: "Arial",
      fontSize: 19,
      fill: "#ffffff",
      fontWeight: "bold"
    })
  });
  label.anchor.set(0.5);

  button.addChild(bg, label);
  button.position.set(0, 0);
  container.addChild(button);
  stage.addChild(container);

  button.on("pointerdown", () => {
    button.interactive = false;
    bg.tint = 0x777777;

    const index = Math.floor(Math.random() * sections.length);
    wheel.spin(index, () => {
      const result = sections[index];
      showPopup(result.label);
      button.interactive = true;
      bg.tint = 0xffffff;
    });
  });

  function showPopup(prize: string) {
    const popup = new Container();
    popup.zIndex = 10;

    const overlay = new Graphics()
    .rect(0, 0, app.screen.width, app.screen.height)
    .fill({ color: 0x000000, alpha: 0.6 })

    const box = new Graphics()
    .roundRect((app.screen.width - 500) / 2, (app.screen.height - 300) / 2, 500, 300, 20)
    .fill(0xfffb00)
    .setStrokeStyle({ color: 0xff0500, width: 6 })

    const text = new Text({
      text: `🎉 Congratulations!\nYou won: ${prize} coins`,
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 30,
        fill: 0x111111,
        align: "center",
        fontWeight: "bold",
        wordWrap: true,
        wordWrapWidth: 460
      })
    });
    text.anchor.set(0.5);
    text.position.set(center.x, center.y);

    popup.addChild(overlay, box, text);
    popup.interactive = true;
    popup.on("pointerdown", () => {
      stage.removeChild(popup);
    });

    stage.addChild(popup);
  }

  manager.resize(() => {
    container.position.set(window.innerWidth / 2, window.innerHeight / 2);
  });
})();