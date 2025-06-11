import { Assets, Texture, Container, Graphics, Text } from "pixi.js";
import { AppManager } from "./core/core";
import { SpinWheel } from "./spinwheel/SpinWheel";
// import { WheelFactory } from "./factories/WheelFactory";
// import { UIFactory } from "./factories/UIFactory";
import { WHEEL_RESULTS } from "./constant/constant";
import { wheelParts } from "./factories/wheelParts";

(async () => {
  const manager = new AppManager();
  await manager.init();

  const { app, stage } = manager;
  const center = { x: app.renderer.width / 2, y: app.renderer.height / 2 };

  const sections = wheelParts.createWheelSections(["#D9C6B2", "#B22234"], 12);
  const wheel = new SpinWheel({ radius: 250, sections });
  wheel.position.set(0, 0);

  const container = new Container();
  container.zIndex = 1;
  container.position.set(center.x, center.y);
  container.addChild(wheel);

  const pointerTex = await Assets.load("/images/pointer.png") as Texture;
  container.addChild(wheelParts.createPointer(pointerTex, 0, 0));

  const congratTex = await Assets.load("/images/main-frame.png") as Texture;
  const congrat = wheelParts.createCongratulation(congratTex, center.x, center.y);

  const button = wheelParts.createSpinButton(() => {
    wheel.spin(() => {
      const result = sections[WHEEL_RESULTS.result[0].index];
      const popup = new Container(); popup.zIndex = 10;

      const overlay = new Graphics()
        .rect(0, 0, app.screen.width, app.screen.height)
        .fill({ color: 0x000000, alpha: 0.6 }).fill();

      const box = new Graphics()
        .stroke({ color: 0xff0500, width: 6 })
        .fill(0xfffb00)
        .roundRect((app.screen.width - 500) / 2, (app.screen.height - 300) / 2, 500, 300, 20)
        .fill().stroke();

      const msg = new Text({
        text: `Congratulations!\nYou Won:  ${result.label} SC Coins 🎉`,
        style: {
          fontFamily: "Arial",
          fontSize: 32,
          fill: 0x111111,
          align: "center",
          fontWeight: "bold",
          wordWrap: true,
          wordWrapWidth: 360,
        },
      });
      msg.anchor.set(0.5);
      msg.position.set(center.x, center.y);

      wheelParts.spinSound.stop();
      wheelParts.WinSound.play();
      popup.addChild(overlay, congrat, box, msg);

      popup.interactive = true;
      popup.on("pointerdown", () => {
        stage.removeChild(popup);
        wheel.angle = 0;
      });

      stage.addChild(popup);
      button.interactive = true;
      (button.children[0] as Graphics).tint = 0xffffff;
    });
  });

  button.position.set(0, 0);
  container.addChild(button);
  stage.addChild(container);

  manager.resize(() => {
    container.position.set(window.innerWidth / 2, window.innerHeight / 2);
  });
})();
