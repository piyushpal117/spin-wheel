import { Application, Container, TilingSprite, Assets, Texture } from "pixi.js";

export class AppManager {
  public app: Application;
  public stage: Container;
  public bg: TilingSprite;

  constructor() {
    this.app = new Application();
  }

  public async init(): Promise<void> {
    await this.app.init({ resizeTo: window });
    globalThis.__PIXI_APP__ = this.app;
    document.body.appendChild(this.app.canvas);
    this.app.canvas.style.position = "absolute";
    this.app.renderer.background.color = 0x000c19;

    const baseTex = (await Assets.load("/images/spotlight.png")) as Texture;
    this.bg = new TilingSprite({
      texture: baseTex,
      width: this.app.screen.width,
      height: this.app.screen.height,
    });
    this.bg.tileScale.set(2.6, 1.8);

    this.stage = new Container();
    this.app.stage = this.stage;
    this.stage.addChild(this.bg);
  }

  public resize(onResize: () => void) {
    window.addEventListener("resize", () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.app.renderer.resize(w, h);
      this.bg.width = w;
      this.bg.height = h;
      onResize();
    });
  }
}
