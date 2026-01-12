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
      "Press SPACE to interact | Arrows to move",
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
    this.playerInfoBg = this.add
      .rectangle(100, 50, 200, 100, 0x000, 0.7)
      .setStrokeStyle(1, 0xffffff);
    this.playerNameText = this.add.text(20, 20, "Swordman", {
      fontSize: "16px",
      fill: "#fff",
    });
    this.levelText = this.add.text(20, 45, "LV: 1", {
      fontSize: "14px",
      fill: "#f1c40f",
    });
    this.hpText = this.add.text(20, 65, "HP: 150/150", {
      fontSize: "14px",
      fill: "#2ecc71",
    });

    // XP Bar
    this.xpBarBg = this.add
      .rectangle(100, 90, 180, 8, 0x333333)
      .setStrokeStyle(1, 0x666666);
    this.xpBar = this.add.rectangle(10, 90, 0, 6, 0x3498db);
    this.xpText = this.add
      .text(100, 90, "XP: 0/100", { fontSize: "12px", fill: "#3498db" })
      .setOrigin(0.5);

    // Quest Info Box
    this.questInfoBg = this.add
      .rectangle(400, 50, 300, 100, 0x000, 0.7)
      .setStrokeStyle(1, 0xffffff)
      .setVisible(false);
    this.questTitleText = this.add
      .text(400, 25, "", { fontSize: "16px", fill: "#f1c40f" })
      .setOrigin(0.5)
      .setVisible(false);
    this.questDescText = this.add
      .text(400, 50, "", {
        fontSize: "14px",
        fill: "#fff",
        wordWrap: { width: 280 },
      })
      .setOrigin(0.5)
      .setVisible(false);
    this.questHintText = this.add
      .text(400, 80, "", { fontSize: "12px", fill: "#95a5a6" })
      .setOrigin(0.5)
      .setVisible(false);

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

    worldScene.events.on("questStarted", (quest) => {
      this.showQuest(quest);
    });

    worldScene.events.on("questCompleted", (data) => {
      this.hideQuest();
      this.updatePlayerInfo(worldScene.questSystem);
      if (data.levelUp) {
        this.showLevelUp(data.newLevel);
      }
    });

    worldScene.events.on("autoPathfinding", (npcName) => {
      this.statusText.setText(`Auto-moving to ${npcName}...`);
    });

    // Update player info periodically
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        const ws = this.scene.get("WorldScene");
        if (ws && ws.questSystem) {
          this.updatePlayerInfo(ws.questSystem);
        }
      },
      loop: true,
    });
  }

  updatePlayerInfo(questSystem) {
    this.levelText.setText(`LV: ${questSystem.playerLevel}`);

    const xpProgress = questSystem.getXPProgress();
    if (questSystem.playerLevel < 10) {
      this.xpText.setText(`XP: ${xpProgress.current}/${xpProgress.needed}`);
      this.xpBar.width = (xpProgress.percent / 100) * 180;
      this.xpBar.x = 10 + this.xpBar.width / 2;
    } else {
      this.xpText.setText("MAX LEVEL");
      this.xpBar.width = 180;
      this.xpBar.x = 100;
    }
  }

  showQuest(quest) {
    this.questInfoBg.setVisible(true);
    this.questTitleText.setVisible(true);
    this.questDescText.setVisible(true);
    this.questHintText.setVisible(true);

    this.questTitleText.setText(`Quest: ${quest.name}`);
    this.questDescText.setText(quest.description);

    if (quest.id === "first_battle") {
      this.questHintText.setText("Press SPACE to start battle!");
    } else {
      this.questHintText.setText("Auto-moving to NPC...");
    }
  }

  hideQuest() {
    this.questInfoBg.setVisible(false);
    this.questTitleText.setVisible(false);
    this.questDescText.setVisible(false);
    this.questHintText.setVisible(false);
  }

  showLevelUp(level) {
    const levelUpText = this.add
      .text(400, 200, `LEVEL UP! Level ${level}`, {
        fontSize: "32px",
        fill: "#f1c40f",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: levelUpText,
      alpha: 0,
      y: 150,
      duration: 2000,
      onComplete: () => levelUpText.destroy(),
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
