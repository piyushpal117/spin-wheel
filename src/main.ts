import { Assets, Texture, Container, Graphics, Text, TextStyle } from "pixi.js";
import { AppManager } from "./core/core";
import { SpinWheel } from "./spinwheel/SpinWheel";
import { WheelFactory } from "./factories/WheelFactory";
import { UIFactory } from "./factories/UIFactory";
import { WHEEL_RESULTS } from "./constant/constant";

(async () => {
  const manager = new AppManager();
  await manager.init();

  const stage = manager.stage;
  const app = manager.app;

  const wheelRadius = 250; //size of wheel
  // const wheelStrokeWidth = 10; //width of wheel stroke
  const wheelSegments = 12; //number of segments in the wheel
  const wheelColors = ["#D9C6B2", "#B22234"];

  //new spinwheel container

  const sections = WheelFactory.createSections(wheelColors, wheelSegments);
  const spinWheel = new SpinWheel({ radius: wheelRadius, sections });

  const spinWheelBox = new Container();
  spinWheelBox.zIndex = 1;
  spinWheelBox.x = app.renderer.width / 2;
  spinWheelBox.y = app.renderer.height / 2;

  spinWheel.x = 0;
  spinWheel.y = 0;
  spinWheelBox.addChild(spinWheel);

  await Assets.load("/images/pointer.png");
  const pointerTex = Assets.get("/images/pointer.png") as Texture;
  // Place pointer at the top of the wheel (relative to spinWheelBox center)
  const pointer = UIFactory.createPointer(pointerTex, 0, 0);
  spinWheelBox.addChild(pointer);

  await Assets.load("/images/main-frame.png");
  const congratulationTex = Assets.get("/images/main-frame.png") as Texture;
  const congratulation = UIFactory.createCongratulation(
    congratulationTex,
    app.renderer.width / 2,
    app.renderer.height / 2
  );
  congratulation.zIndex = 10;

  // await Assets.load("/images/pointer.png");
  // const pointerTex = Assets.get("/images/pointer.png") as Texture;
  // const pointer = UIFactory.createPointer(
  //   pointerTex,
  //   app.renderer.width / 2,
  //   app.renderer.height / 2
  // );
  // stage.addChild(pointer);

  // await Assets.load("/images/main-frame.png");
  // const congratulationTex = Assets.get("/images/main-frame.png") as Texture;
  // const congratulation = UIFactory.createCongratulation(
  //   congratulationTex,
  //   app.renderer.width / 2,
  //   app.renderer.height / 2
  // );
  // congratulation.zIndex = 10;

  const spinButton = UIFactory.createSpinButton(() => {
    spinWheel.spin(() => {
      const resultIndex = WHEEL_RESULTS.result[0].index;
      const result = sections[resultIndex];

      const popup = new Container();
      popup.zIndex = 10;

      const overlay = new Graphics();
      overlay.rect(0, 0, app.screen.width, app.screen.height);
      overlay.fill({ color: 0x000000, alpha: 0.6 }).fill();
      UIFactory.WinSound.play();
      popup.addChild(overlay);
      popup.addChild(congratulation);

      const box = new Graphics();
      box
        .stroke({ color: 0xff0500, width: 6 })
        .fill(0xfffb00)
        .roundRect(
          (app.screen.width - 500) / 2,
          (app.screen.height - 300) / 2,
          500,
          300,
          20
        )
        .fill()
        .stroke();
      popup.addChild(box);

      const message = new Text({
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
      message.anchor.set(0.5);
      message.x = app.screen.width / 2;
      message.y = app.screen.height / 2;

      popup.addChild(message);
      popup.interactive = true;
      popup.interactive = true;
      popup.on("pointerdown", () => {
        // stage.removeChild(spinWheelBox);
        stage.removeChild(popup);
        spinWheel.angle = 0; // Reset the wheel angle
        // Optionally remove canvas from DOM:
        // const canvas = app.canvas as HTMLCanvasElement;
        
        // if (canvas?.parentNode) canvas.parentNode.removeChild(canvas);
        // stage.addChild(spinWheelBox)
      },
    );

      stage.addChild(popup);

      spinButton.interactive = true;

      (spinButton.children[0] as Graphics).tint = 0xffffff;
    });
  });

spinButton.x = 0;
  spinButton.y = 0;
  spinWheelBox.addChild(spinButton);

  stage.addChild(spinWheelBox);

  manager.resize(() => {
    // spinWheel.x = window.innerWidth / 2;
    // spinWheel.y = window.innerHeight / 2;

    // spinButton.x = window.innerWidth / 2;
    // spinButton.y = window.innerHeight / 2;

    // pointer.x = window.innerWidth / 2 + 8;
    // pointer.y = window.innerHeight / 2 - 220;
    spinWheelBox.x = window.innerWidth / 2;
    spinWheelBox.y = window.innerHeight / 2;
  });
})();
