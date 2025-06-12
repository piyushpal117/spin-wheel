import { initGame } from "./main";

      const spinbutton = document.getElementById("spinbutton");
      spinbutton?.addEventListener("click", async () => {
        console.log("Button clicked, initializing game...");
        initGame();
      });
