// src/main.ts
import {
  Application,
  Container,
  TilingSprite,
  Assets,
  Texture,
  Graphics,
  Text,
  TextStyle,
  Sprite,
} from "pixi.js";
import { SpinWheel } from "./spinwheel/SpinWheel";

(async () => {
  const app = new Application();
  await app.init({ resizeTo: window });
  globalThis.__PIXI_APP__ = app;
  document.body.appendChild(app.canvas);
  app.canvas.style.position = "absolute";
  app.renderer.background.color = 0x000c19;

  const baseTex = (await Assets.load("/images/spotlight2.png")) as Texture;
  const bg = new TilingSprite({
    texture: baseTex,
    width: app.screen.width,
    height: app.screen.height,
  });
  bg.tileScale.set(2.6, 1.8);

  const stage = new Container();
  app.stage = stage;
  stage.addChild(bg);

  //  3) Instantiate the SpinWheel
  const wheelRadius = 250;
  const wheelSegments = 12;
  const wheelColors = ["#D9C6B2", "#B22234"];
  // const wheelLabels = ["0","10","50",100", "200", "300", "400", "500", "600", "700", "800", "900", "1000", "1100", "1200"];
  // function generateWheelLabels(segments) {
  //   return Array.from({ length: segments }, () => {
  //     const randomNumber = Math.floor(Math.random() * 5000) + 1;
  //     return Math.floor(randomNumber / 100) * 100;
  //   });
  // }

  function generateWheelLabels(segments: number): string[] {
    const step = 100;
    const max = 5000;
    const possibleLabels = Array.from(
      { length: max / step + 1 },
      (_, i) => i * step
    );

    if (segments > possibleLabels.length) {
      throw new Error(
        `Too many segments! Max unique labels = ${possibleLabels.length}`
      );
    }

    // Fisher-Yates shuffle
    for (let i = possibleLabels.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [possibleLabels[i], possibleLabels[j]] = [
        possibleLabels[j],
        possibleLabels[i],
      ];
    }

    return possibleLabels.slice(0, segments).map(String);
  }
  await Assets.load("/images/pointer.png");
  const texture = Assets.get("/images/pointer.png") as Texture;

  const pointer = new Sprite(texture);
  pointer.scale.set(0.45); 
  pointer.anchor.set(0.5, 0.1); 
  pointer.x = app.renderer.width / 2 + 8;
  pointer.y = app.renderer.height / 2 - 220; // Position above the wheel

  const spinWheel = new SpinWheel({
    radius: wheelRadius,
    segments: wheelSegments,
    colors: wheelColors,
    strokeWidth: 1,
    strokeColor: 0x000000,
    // labels: wheelLabels,
    labels: generateWheelLabels(wheelSegments),
  });

  spinWheel.x = app.renderer.width / 2;
  spinWheel.y = app.renderer.height / 2;
  stage.addChild(spinWheel);
  stage.addChild(pointer);

  //  Pixi-based “Spin” button
 
  const spinButton = new Container();
  spinButton.interactive = true;
  // spinButton.buttonMode = true;

// button bg
  const btnWidth = 160;
  const btnHeight = 48;
  const btnRadius = 8;
  const btnBg = new Graphics();
  btnBg.fill(0xDB0F27); 
  btnBg.roundRect(
    -btnWidth / 2,
    -btnHeight / 2,
    btnWidth,
    btnHeight,
    btnRadius
  );
  btnBg.fill();
  spinButton.addChild(btnBg);

  const style = new TextStyle({
    fontFamily: "Arial",
    fontSize: 24,
    fill: "#ffffff",
    fontWeight: "bold",
  });
  const btnText = new Text({text:"SPIN", style});
  btnText.anchor.set(0.5);
  spinButton.addChild(btnText);

  //  5c) Position the button below the wheel
  const paddingBelowWheel = 50;
  spinButton.x = app.renderer.width / 2;
  spinButton.y = spinWheel.y + wheelRadius + paddingBelowWheel;
  stage.addChild(spinButton);

  //  5d) Hook up the “pointerdown” event on the Pixi button
  spinButton.on("pointerdown", () => {
    // Disable further clicks during spinning:
    spinButton.interactive = false;
    btnBg.tint = 0x777777; // darken to show “disabled” state (optional)

    spinWheel.spin(3000, 8, () => {
      // Compute winning index after spin ends
      const finalRot = spinWheel.rotation % (Math.PI * 2);
      const normalizedAngle = (Math.PI * 2 - finalRot) % (Math.PI * 2);
      const winningIndex = Math.floor(
        normalizedAngle / ((Math.PI * 2) / spinWheel.segments)
        
      );
      // console.log(spinWheel.segments/2);
      console.log(
        `Winning index: ${winningIndex}, final rotation: ${finalRot}, normalized angle: ${normalizedAngle}`
      );

      // Create a popup container
      const popup = new Container();
      popup.zIndex = 10;

      // Dark background overlay
      const overlay = new Graphics();
      overlay.rect(0, 0, app.screen.width, app.screen.height);
      overlay.fill(0x000000, 0.6); // semi-transparent black
      overlay.fill();
      popup.addChild(overlay);

      // Message box
      const box = new Graphics();
      const boxWidth = 500;
      const boxHeight = 300;
      box
        .stroke({ color: 0xff0500, width: 6 }) // stroke: orange, 6px
        .fill(0xfffb00) // fill: light yellow
        .roundRect(
          (app.screen.width - boxWidth) / 2,
          (app.screen.height - boxHeight) / 2,
          boxWidth,
          boxHeight,
          20
        )
        .fill() // commit the fill
        .stroke(); // commit the stroke

      popup.addChild(box);

      // Winning message
      const winText = new Text(
        `Congratulations! \n\nYou Won: ${
          spinWheel.labels[winningIndex] ?? `Segment #${winningIndex + 1}`
        } Coin 🎉`,
        new TextStyle({
          fontFamily: "Arial",
          fontSize: 32,
          fill: "#000000",
          align: "center",
          wordWrap: true,
          wordWrapWidth: 360,
        })
      );
      winText.anchor.set(0.5);
      winText.x = app.screen.width / 2;
      winText.y = app.screen.height / 2;
      popup.addChild(winText);

      // Add to stage
      stage.addChild(popup);

      // Close popup on click
      popup.interactive = true;
      popup.on("pointerdown", () => {
        stage.removeChild(popup);
      });

      // Re-enable the button
      spinButton.interactive = true;
      btnBg.tint = 0xffffff;
    });
  });

  //  6) Optional: Reposition everything on resize
  window.addEventListener("resize", () => {
    const newW = window.innerWidth;
    const newH = window.innerHeight;
    app.renderer.resize(newW, newH);

    // Move wheel to center
    spinWheel.x = newW / 2;
    spinWheel.y = newH / 2;

    // Move button to remain below the wheel
    spinButton.x = newW / 2;
    spinButton.y = spinWheel.y + wheelRadius + paddingBelowWheel;

    // Resize / reposition background
    bg.width = newW;
    bg.height = newH;
  });
})();
