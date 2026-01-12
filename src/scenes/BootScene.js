export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    create() {
        console.log('BootScene: Generating textures...');
        
        // Create textures using add.graphics (visible but we'll hide it)
        const createTex = (key, color, strokeColor = null) => {
            let g = this.add.graphics();
            g.fillStyle(color);
            g.fillRect(0, 0, 32, 32);
            if (strokeColor !== null) {
                g.lineStyle(2, strokeColor);
                g.strokeRect(1, 1, 30, 30);
            }
            g.generateTexture(key, 32, 32);
            g.destroy();
        };

        try {
            createTex('player', 0x3498db, 0xffffff);  // Blue with white border
            createTex('enemy', 0xe74c3c, 0x000000);   // Red with black border
            createTex('npc', 0x2ecc71, 0xffffff);     // Green with white border
            createTex('grass_tile', 0x27ae60, 0x2ecc71); // Dark green with light green border
            createTex('wall_tile', 0x7f8c8d);
            
            console.log('BootScene: Textures created successfully');
            console.log('Available textures:', Object.keys(this.textures.list));
        } catch (error) {
            console.error('BootScene: Error creating textures:', error);
        }

        // Small delay to ensure textures are fully registered
        this.time.delayedCall(50, () => {
            console.log('BootScene: Starting WorldScene...');
            this.scene.start('WorldScene');
        });
    }
}


