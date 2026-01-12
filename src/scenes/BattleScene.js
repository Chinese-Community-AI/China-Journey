export default class BattleScene extends Phaser.Scene {
    constructor() {
        super('BattleScene');
    }

    create() {
        // Ensure textures exist
        if (!this.textures.exists('player')) {
            this.createFallbackTexture('player', 0x3498db);
        }
        if (!this.textures.exists('enemy')) {
            this.createFallbackTexture('enemy', 0xe74c3c);
        }
        
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x2c3e50).setAlpha(0.9);
        this.add.text(400, 30, 'BATTLE - CHINA JOURNEY', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        // Player Unit
        this.player = {
            sprite: this.add.sprite(200, 300, 'player').setScale(2.5),
            hp: 150,
            maxHp: 150,
            mp: 50,
            maxMp: 50,
            name: 'Swordman'
        };

        // Enemy Unit
        this.enemy = {
            sprite: this.add.sprite(600, 300, 'enemy').setScale(2.5),
            hp: 100,
            maxHp: 100,
            name: 'Wild Boar'
        };

        // UI Panel for Battle
        this.battlePanel = this.add.rectangle(400, 520, 780, 140, 0x000, 0.7).setStrokeStyle(2, 0xffffff);
        
        this.hpText = this.add.text(50, 480, `[Swordman] HP: ${this.player.hp}/${this.player.maxHp}`, { fontSize: '18px', fill: '#2ecc71' });
        this.mpText = this.add.text(50, 505, `            MP: ${this.player.mp}/${this.player.maxMp}`, { fontSize: '18px', fill: '#3498db' });
        
        this.enemyHpText = this.add.text(550, 480, `[Wild Boar] HP: ${this.enemy.hp}/${this.enemy.maxHp}`, { fontSize: '18px', fill: '#e74c3c' });

        this.messageText = this.add.text(400, 580, 'What will you do?', { fontSize: '20px', fill: '#f1c40f' }).setOrigin(0.5);

        // Menu Buttons
        this.createMenu();
        
        this.isPlayerTurn = true;
    }

    createMenu() {
        this.menuItems = [];
        const labels = ['Attack', 'Skill', 'Items', 'Run'];
        labels.forEach((label, index) => {
            let x = 100 + (index * 180);
            let btn = this.add.text(x, 540, label, { 
                fontSize: '22px', 
                fill: '#fff', 
                backgroundColor: '#34495e',
                padding: { x: 10, y: 5 }
            })
            .setInteractive({ useHandCursor: true })
            .setOrigin(0.5);

            btn.on('pointerover', () => btn.setStyle({ fill: '#f1c40f' }));
            btn.on('pointerout', () => btn.setStyle({ fill: '#fff' }));
            btn.on('pointerdown', () => this.onMenuSelect(label.toLowerCase()));
            
            this.menuItems.push(btn);
        });
    }

    onMenuSelect(action) {
        if (!this.isPlayerTurn) return;

        switch(action) {
            case 'attack':
                this.playerAttack();
                break;
            case 'skill':
                this.playerSkill();
                break;
            case 'items':
                this.messageText.setText("No items in inventory!");
                break;
            case 'run':
                this.tryEscape();
                break;
        }
    }

    setMenuVisible(visible) {
        this.menuItems.forEach(item => item.setVisible(visible));
    }

    playerAttack() {
        this.setMenuVisible(false);
        let damage = Phaser.Math.Between(15, 25);
        this.enemy.hp -= damage;
        this.updateHP();

        this.messageText.setText(`You used Basic Attack for ${damage} damage!`);
        
        this.tweens.add({
            targets: this.player.sprite,
            x: 550,
            duration: 200,
            yoyo: true,
            onComplete: () => {
                if (this.enemy.hp <= 0) {
                    this.victory();
                } else {
                    this.isPlayerTurn = false;
                    this.time.delayedCall(1000, () => this.enemyTurn());
                }
            }
        });
    }

    playerSkill() {
        if (this.player.mp < 15) {
            this.messageText.setText("Not enough MP (Needs 15)!");
            return;
        }

        this.setMenuVisible(false);
        this.player.mp -= 15;
        let damage = Phaser.Math.Between(40, 60);
        this.enemy.hp -= damage;
        this.updateHP();

        this.messageText.setText(`You used 'Heng Sao Qian Jun'! (Damage: ${damage})`);
        
        this.cameras.main.shake(200, 0.01);
        
        this.tweens.add({
            targets: this.player.sprite,
            x: 550,
            scaleX: 4,
            scaleY: 4,
            duration: 300,
            yoyo: true,
            onComplete: () => {
                this.player.sprite.setScale(2.5);
                if (this.enemy.hp <= 0) {
                    this.victory();
                } else {
                    this.isPlayerTurn = false;
                    this.time.delayedCall(1000, () => this.enemyTurn());
                }
            }
        });
    }

    enemyTurn() {
        this.messageText.setText(`Wild Boar is charging...`);
        
        this.tweens.add({
            targets: this.enemy.sprite,
            x: 250,
            duration: 200,
            yoyo: true,
            onComplete: () => {
                let damage = Phaser.Math.Between(12, 18);
                this.player.hp -= damage;
                this.updateHP();
                this.messageText.setText(`Wild Boar dealt ${damage} damage!`);

                if (this.player.hp <= 0) {
                    this.defeat();
                } else {
                    this.time.delayedCall(1200, () => {
                        this.isPlayerTurn = true;
                        this.messageText.setText('What will you do?');
                        this.setMenuVisible(true);
                    });
                }
            }
        });
    }

    tryEscape() {
        if (Phaser.Math.Between(1, 100) > 40) {
            this.messageText.setText('Escaped successfully!');
            this.time.delayedCall(1000, () => this.endBattle());
        } else {
            this.messageText.setText('Failed to escape!');
            this.isPlayerTurn = false;
            this.time.delayedCall(1000, () => this.enemyTurn());
        }
    }

    updateHP() {
        this.hpText.setText(`[Swordman] HP: ${Math.max(0, this.player.hp)}/${this.player.maxHp}`);
        this.mpText.setText(`            MP: ${Math.max(0, this.player.mp)}/${this.player.maxMp}`);
        this.enemyHpText.setText(`[Wild Boar] HP: ${Math.max(0, this.enemy.hp)}/${this.enemy.maxHp}`);
    }

    victory() {
        this.messageText.setText('Victory! You gained 50 XP and 20 Gold.');
        this.time.delayedCall(2000, () => this.endBattle());
    }

    defeat() {
        this.messageText.setText('Defeat... Returning to Peach Blossom Village.');
        this.time.delayedCall(2000, () => {
            window.location.reload();
        });
    }

    endBattle() {
        this.scene.stop('BattleScene');
        this.scene.resume('WorldScene');
    }

    createFallbackTexture(key, color) {
        let g = this.add.graphics();
        g.fillStyle(color);
        g.fillRect(0, 0, 32, 32);
        g.lineStyle(2, 0x000000);
        g.strokeRect(0, 0, 32, 32);
        g.generateTexture(key, 32, 32);
        g.destroy();
    }
}
