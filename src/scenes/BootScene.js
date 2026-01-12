export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    create() {
        console.log('BootScene: Generating enhanced pixel art textures...');
        
        this.createGrassTile();
        this.createPlayerSprite();
        this.createEnemySprite();
        this.createNPCSprites();
        
        console.log('BootScene: Textures created successfully');
        console.log('Available textures:', Object.keys(this.textures.list));

        // Small delay to ensure textures are fully registered
        this.time.delayedCall(50, () => {
            console.log('BootScene: Starting WorldScene...');
            this.scene.start('WorldScene');
        });
    }

    createGrassTile() {
        let g = this.add.graphics();
        const size = 32;
        
        // Base grass color with variation
        g.fillStyle(0x7cb342); // Light green
        g.fillRect(0, 0, size, size);
        
        // Add texture pattern
        g.fillStyle(0x689f38); // Darker green
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if ((i + j) % 2 === 0) {
                    g.fillRect(i * 8, j * 8, 8, 8);
                }
            }
        }
        
        // Add small grass details
        g.fillStyle(0x558b2f);
        g.fillRect(8, 12, 2, 4);
        g.fillRect(20, 8, 2, 4);
        g.fillRect(12, 24, 2, 4);
        g.fillRect(24, 20, 2, 4);
        
        // Border
        g.lineStyle(1, 0x558b2f);
        g.strokeRect(0, 0, size, size);
        
        g.generateTexture('grass_tile', size, size);
        g.destroy();
    }

    createPlayerSprite() {
        let g = this.add.graphics();
        const size = 32;
        
        // Body (blue tunic)
        g.fillStyle(0x2196f3); // Blue
        g.fillRect(8, 12, 16, 20);
        
        // Head
        g.fillStyle(0xffdbac); // Skin tone
        g.fillRect(10, 4, 12, 12);
        
        // Hair
        g.fillStyle(0x4a3428); // Brown hair
        g.fillRect(10, 4, 12, 6);
        
        // Eyes
        g.fillStyle(0x000000);
        g.fillRect(12, 8, 2, 2);
        g.fillRect(18, 8, 2, 2);
        
        // Sword (simple)
        g.fillStyle(0xc0c0c0); // Silver
        g.fillRect(22, 10, 2, 12);
        g.fillStyle(0x8b4513); // Brown handle
        g.fillRect(22, 22, 2, 4);
        
        // Legs
        g.fillStyle(0x424242); // Dark gray pants
        g.fillRect(10, 28, 6, 4);
        g.fillRect(16, 28, 6, 4);
        
        // Border
        g.lineStyle(1, 0x1565c0);
        g.strokeRect(0, 0, size, size);
        
        g.generateTexture('player', size, size);
        g.destroy();
    }

    createEnemySprite() {
        let g = this.add.graphics();
        const size = 32;
        
        // Wild Boar body
        g.fillStyle(0x8d6e63); // Brown
        g.fillRect(6, 14, 20, 16);
        
        // Head
        g.fillStyle(0x6d4c41); // Darker brown
        g.fillRect(4, 8, 16, 12);
        
        // Snout
        g.fillStyle(0x5d4037);
        g.fillRect(2, 12, 8, 6);
        
        // Eyes
        g.fillStyle(0xff0000); // Red eyes
        g.fillRect(8, 12, 2, 2);
        g.fillRect(14, 12, 2, 2);
        
        // Tusks
        g.fillStyle(0xffffff);
        g.fillRect(2, 14, 2, 4);
        g.fillRect(4, 14, 2, 4);
        
        // Legs
        g.fillStyle(0x5d4037);
        g.fillRect(8, 28, 4, 4);
        g.fillRect(20, 28, 4, 4);
        
        // Tail
        g.fillStyle(0x6d4c41);
        g.fillRect(24, 16, 4, 2);
        
        // Border
        g.lineStyle(1, 0x5d4037);
        g.strokeRect(0, 0, size, size);
        
        g.generateTexture('enemy', size, size);
        g.destroy();
    }

    createNPCSprites() {
        // Elder NPC
        let g = this.add.graphics();
        const size = 32;
        
        // Body (green robe)
        g.fillStyle(0x4caf50); // Green
        g.fillRect(8, 12, 16, 20);
        
        // Head
        g.fillStyle(0xffdbac);
        g.fillRect(10, 4, 12, 12);
        
        // White beard
        g.fillStyle(0xffffff);
        g.fillRect(10, 14, 12, 8);
        
        // Eyes
        g.fillStyle(0x000000);
        g.fillRect(12, 8, 2, 2);
        g.fillRect(18, 8, 2, 2);
        
        // Staff
        g.fillStyle(0x8b4513); // Brown
        g.fillRect(24, 6, 2, 20);
        g.fillStyle(0xffd700); // Gold top
        g.fillRect(23, 6, 4, 4);
        
        // Border
        g.lineStyle(1, 0x388e3c);
        g.strokeRect(0, 0, size, size);
        
        g.generateTexture('npc_elder', size, size);
        g.destroy();

        // Merchant NPC
        g = this.add.graphics();
        
        // Body (purple robe)
        g.fillStyle(0x9c27b0); // Purple
        g.fillRect(8, 12, 16, 20);
        
        // Head
        g.fillStyle(0xffdbac);
        g.fillRect(10, 4, 12, 12);
        
        // Hat (merchant cap)
        g.fillStyle(0xff9800); // Orange
        g.fillRect(8, 2, 16, 6);
        
        // Eyes
        g.fillStyle(0x000000);
        g.fillRect(12, 8, 2, 2);
        g.fillRect(18, 8, 2, 2);
        
        // Coin bag
        g.fillStyle(0xffd700);
        g.fillRect(2, 18, 8, 10);
        
        // Border
        g.lineStyle(1, 0x7b1fa2);
        g.strokeRect(0, 0, size, size);
        
        g.generateTexture('npc_merchant', size, size);
        g.destroy();

        // Villager NPC
        g = this.add.graphics();
        
        // Body (brown clothes)
        g.fillStyle(0x795548); // Brown
        g.fillRect(8, 12, 16, 20);
        
        // Head
        g.fillStyle(0xffdbac);
        g.fillRect(10, 4, 12, 12);
        
        // Hair
        g.fillStyle(0x3e2723); // Dark brown
        g.fillRect(10, 4, 12, 8);
        
        // Eyes
        g.fillStyle(0x000000);
        g.fillRect(12, 10, 2, 2);
        g.fillRect(18, 10, 2, 2);
        
        // Simple tool
        g.fillStyle(0x424242);
        g.fillRect(22, 14, 2, 8);
        
        // Border
        g.lineStyle(1, 0x5d4037);
        g.strokeRect(0, 0, size, size);
        
        g.generateTexture('npc_villager', size, size);
        g.destroy();

        // Generic NPC (fallback)
        g = this.add.graphics();
        g.fillStyle(0x2ecc71);
        g.fillRect(0, 0, size, size);
        g.lineStyle(2, 0xffffff);
        g.strokeRect(0, 0, size, size);
        g.generateTexture('npc', size, size);
        g.destroy();
    }
}


