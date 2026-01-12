export default class WorldScene extends Phaser.Scene {
    constructor() {
        super('WorldScene');
    }

    create() {
        console.log('WorldScene: Initializing...');
        console.log('Available textures:', Object.keys(this.textures.list));
        
        // Verify textures exist, create fallbacks if needed
        if (!this.textures.exists('grass_tile')) {
            console.warn('grass_tile missing, creating fallback');
            this.createFallbackTexture('grass_tile', 0x27ae60);
        }
        if (!this.textures.exists('player')) {
            console.warn('player missing, creating fallback');
            this.createFallbackTexture('player', 0x3498db);
        }
        if (!this.textures.exists('npc')) {
            console.warn('npc missing, creating fallback');
            this.createFallbackTexture('npc', 0x2ecc71);
        }
        
        // Create map that fits 800x600 canvas (25x19 tiles = 800x608)
        for (let y = 0; y < 19; y++) {
            for (let x = 0; x < 25; x++) {
                this.add.image(x * 32, y * 32, 'grass_tile').setOrigin(0);
            }
        }

        // Add player and scale up for visibility
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setScale(1.5);
        this.player.setCollideWorldBounds(true);
        console.log('Player created at:', this.player.x, this.player.y);

        // Add an NPC nearby
        this.npc = this.physics.add.staticSprite(300, 300, 'npc');
        this.npc.setScale(1.5);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.overlap(this.player, this.npc, this.onMeetNPC, null, this);

        this.isMoving = false;
        
        // Launch UI
        this.scene.launch('UIScene');
        
        console.log('WorldScene: Initialization complete');
    }

    createFallbackTexture(key, color) {
        let g = this.add.graphics();
        g.fillStyle(color);
        g.fillRect(0, 0, 32, 32);
        g.lineStyle(2, 0xffffff);
        g.strokeRect(0, 0, 32, 32);
        g.generateTexture(key, 32, 32);
        g.destroy();
    }

    update() {
        this.player.body.setVelocity(0);

        let moving = false;
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-160);
            moving = true;
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(160);
            moving = true;
        }

        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-160);
            moving = true;
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(160);
            moving = true;
        }

        // Random encounter logic
        if (moving && !this.isMoving) {
            this.isMoving = true;
        } else if (!moving && this.isMoving) {
            this.isMoving = false;
            this.checkEncounter();
        }
    }

    onMeetNPC(player, npc) {
        // Simple NPC interaction
        console.log("Welcome to Peach Blossom Village!");
        // We can trigger a dialog in UIScene
        this.events.emit('npcMessage', "Elder: Welcome to Peach Blossom Village (桃源村)! Beware of the wild boars in the grass. Use [A] to attack and [S] for skills in battle!");
    }

    checkEncounter() {
        // 10% chance of encounter when stopping
        if (Phaser.Math.Between(1, 100) <= 10) {
            console.log("Battle starts!");
            this.startBattle();
        }
    }

    startBattle() {
        // Pause world scene and start battle
        this.scene.pause();
        this.scene.launch('BattleScene');
    }
}
