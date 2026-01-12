export default class UIScene extends Phaser.Scene {
  constructor() {
    super("UIScene");
  }

  create() {
    // Simple HUD
    this.add.rectangle(400, 580, 800, 40, 0x000, 0.5);
    this.statusText = this.add.text(
      10,
      570,
      "China Journey MVP - Arrows to move | Talk to Elder",
      { fontSize: "16px", fill: "#fff" }
    );

    // Map Name
    this.add
      .rectangle(700, 30, 180, 40, 0x000, 0.5)
      .setStrokeStyle(1, 0xffffff);
    this.mapNameText = this.add
      .text(700, 30, "桃源村 (Peach Blossom Village)", {
        fontSize: "18px",
        fill: "#f1c40f",
      })
      .setOrigin(0.5);

    // Player Info Box
    this.add
      .rectangle(100, 50, 180, 80, 0x000, 0.5)
      .setStrokeStyle(1, 0xffffff);
    this.add.text(20, 20, "Swordman", { fontSize: "16px", fill: "#fff" });
    this.add.text(20, 45, "LV: 10", { fontSize: "14px", fill: "#fff" });
    this.add.text(20, 65, "HP: 150/150", { fontSize: "14px", fill: "#2ecc71" });

    // Dialog box (hidden by default)
    this.dialogBox = this.add.container(400, 300).setVisible(false);
    let bg = this.add
      .rectangle(0, 0, 600, 120, 0x2c3e50, 0.9)
      .setStrokeStyle(3, 0xbdc3c7);
    this.dialogText = this.add
      .text(0, 0, "", {
        fontSize: "20px",
        fill: "#fff",
        align: "center",
        wordWrap: { width: 550 },
      })
      .setOrigin(0.5);
    this.dialogBox.add([bg, this.dialogText]);

    // Listen for events from WorldScene
    const worldScene = this.scene.get("WorldScene");
    worldScene.events.on("npcMessage", (msg) => {
      this.showDialog(msg);
    });
  }

  showDialog(text) {
    this.dialogText.setText(text);
    this.dialogBox.setVisible(true);

    // Hide after 5 seconds
    this.time.delayedCall(5000, () => {
      this.dialogBox.setVisible(false);
    });
  }
}
