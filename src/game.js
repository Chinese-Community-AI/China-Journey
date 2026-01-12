import BootScene from './scenes/BootScene.js';
import WorldScene from './scenes/WorldScene.js';
import BattleScene from './scenes/BattleScene.js';
import UIScene from './scenes/UIScene.js';
import EndingScene from './scenes/EndingScene.js';

// Verify Phaser is loaded
if (typeof Phaser === 'undefined') {
    console.error('Phaser library not loaded!');
    document.body.innerHTML = '<div style="color: white; text-align: center; padding: 50px;">Error: Phaser library failed to load. Please check your internet connection.</div>';
} else {
    console.log('Phaser version:', Phaser.VERSION);
    
    const config = {
        type: Phaser.AUTO,
        parent: 'game-container',
        width: 800,
        height: 600,
        backgroundColor: '#000000',
        pixelArt: false, // Disable pixelArt for smoother rendering
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        scene: [BootScene, WorldScene, BattleScene, UIScene, EndingScene]
    };

    try {
        const game = new Phaser.Game(config);
        console.log('Phaser game initialized successfully');
    } catch (error) {
        console.error('Error initializing Phaser game:', error);
        document.body.innerHTML = '<div style="color: white; text-align: center; padding: 50px;">Error initializing game: ' + error.message + '</div>';
    }
}
