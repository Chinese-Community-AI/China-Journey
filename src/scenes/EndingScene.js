export default class EndingScene extends Phaser.Scene {
    constructor() {
        super('EndingScene');
    }

    create(data) {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x000000);
        
        // Title
        this.add.text(400, 150, 'Congratulations!', {
            fontSize: '48px',
            fill: '#f1c40f',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Message
        this.add.text(400, 250, 'You have reached Level 10!', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        this.add.text(400, 320, 'You have completed the beginner quests', {
            fontSize: '24px',
            fill: '#bdc3c7'
        }).setOrigin(0.5);

        this.add.text(400, 360, 'in Peach Blossom Village (桃源村)', {
            fontSize: '24px',
            fill: '#bdc3c7'
        }).setOrigin(0.5);

        // Stats
        const statsY = 420;
        this.add.text(400, statsY, `Quests Completed: ${data.questsCompleted || 0}`, {
            fontSize: '20px',
            fill: '#2ecc71'
        }).setOrigin(0.5);

        this.add.text(400, statsY + 30, 'In the full version, you would now unlock', {
            fontSize: '18px',
            fill: '#95a5a6'
        }).setOrigin(0.5);

        this.add.text(400, statsY + 55, 'new maps and continue your journey!', {
            fontSize: '18px',
            fill: '#95a5a6'
        }).setOrigin(0.5);

        // Restart button
        const restartBtn = this.add.text(400, 550, 'Play Again', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#27ae60',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        restartBtn.on('pointerover', () => {
            restartBtn.setStyle({ fill: '#f1c40f' });
        });

        restartBtn.on('pointerout', () => {
            restartBtn.setStyle({ fill: '#fff' });
        });

        restartBtn.on('pointerdown', () => {
            this.scene.start('WorldScene');
        });

        // Auto restart after 10 seconds
        this.time.delayedCall(10000, () => {
            this.scene.start('WorldScene');
        });
    }
}
