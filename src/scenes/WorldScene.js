import QuestSystem from '../systems/QuestSystem.js';

export default class WorldScene extends Phaser.Scene {
    constructor() {
        super('WorldScene');
    }

    create() {
        console.log('WorldScene: Initializing...');
        
        // Verify textures exist, create fallbacks if needed
        if (!this.textures.exists('grass_tile')) {
            this.createFallbackTexture('grass_tile', 0x27ae60);
        }
        if (!this.textures.exists('player')) {
            this.createFallbackTexture('player', 0x3498db);
        }
        if (!this.textures.exists('npc')) {
            this.createFallbackTexture('npc', 0x2ecc71);
        }
        
        // Create map
        for (let y = 0; y < 19; y++) {
            for (let x = 0; x < 25; x++) {
                this.add.image(x * 32, y * 32, 'grass_tile').setOrigin(0);
            }
        }

        // Initialize Quest System
        this.questSystem = new QuestSystem(this);

        // Add player
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setScale(1.5);
        this.player.setCollideWorldBounds(true);

        // Create NPCs
        this.npcs = {};
        this.createNPCs();
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Auto-pathfinding
        this.pathfinding = null;
        this.targetNPC = null;
        this.isAutoMoving = false;

        // Setup NPC interactions
        Object.values(this.npcs).forEach(npc => {
            this.physics.add.overlap(this.player, npc.sprite, () => this.onMeetNPC(npc), null, this);
        });

        this.isMoving = false;
        this.lastBattleQuest = null;
        
        // Launch UI
        this.scene.launch('UIScene');
        
        // Update quest markers
        this.updateQuestMarkers();
        
        // Start first quest automatically
        this.time.delayedCall(500, () => {
            this.startNextQuest();
        });
        
        console.log('WorldScene: Initialization complete');
    }

    createNPCs() {
        // Elder (starting NPC)
        this.npcs.elder = {
            sprite: this.physics.add.staticSprite(200, 200, 'npc'),
            id: 'elder',
            name: 'Village Elder',
            x: 200,
            y: 200,
            dialogues: {
                welcome: "Welcome, young traveler! Welcome to Peach Blossom Village (桃源村). I am the Village Elder. Let me guide you on your journey.",
                first_battle: "Good! Now you need to prove your strength. Go and defeat a Wild Boar in battle. Press SPACE when you're ready to fight!",
                final_training: "Excellent progress! You've learned much. You are now ready to leave the village. Continue your journey, brave warrior!"
            }
        };
        this.npcs.elder.sprite.setScale(1.5);

        // Merchant
        this.npcs.merchant = {
            sprite: this.physics.add.staticSprite(600, 200, 'npc'),
            id: 'merchant',
            name: 'Merchant',
            x: 600,
            y: 200,
            dialogues: {
                visit_merchant: "Hello! I'm the village merchant. I sell potions and equipment. For now, just remember that items can help you in battle!"
            }
        };
        this.npcs.merchant.sprite.setScale(1.5);

        // Villager
        this.npcs.villager = {
            sprite: this.physics.add.staticSprite(400, 150, 'npc'),
            id: 'villager',
            name: 'Villager',
            x: 400,
            y: 150,
            dialogues: {
                help_villager: "Thank you for helping! The wild boars have been causing trouble. Your training will help protect our village!"
            }
        };
        this.npcs.villager.sprite.setScale(1.5);

        // Add quest markers above NPCs
        Object.values(this.npcs).forEach(npc => {
            const marker = this.add.text(npc.x, npc.y - 40, '!', {
                fontSize: '24px',
                fill: '#f1c40f',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            npc.marker = marker;
        });
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

    startNextQuest() {
        const availableQuests = this.questSystem.getAvailableQuests();
        if (availableQuests.length > 0) {
            const quest = availableQuests[0];
            this.questSystem.startQuest(quest.id);
            this.events.emit('questStarted', quest);
            
            // Auto-pathfind to NPC
            const npc = this.npcs[quest.npcId];
            if (npc) {
                this.autoPathfindTo(npc);
            }
        }
    }

    autoPathfindTo(npc) {
        this.targetNPC = npc;
        this.isAutoMoving = true;
        this.events.emit('autoPathfinding', npc.name);
    }

    update() {
        // Handle auto-pathfinding
        if (this.isAutoMoving && this.targetNPC) {
            const dx = this.targetNPC.x - this.player.x;
            const dy = this.targetNPC.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 30) {
                // Reached NPC
                this.isAutoMoving = false;
                this.player.body.setVelocity(0);
                this.onMeetNPC(this.targetNPC);
                this.targetNPC = null;
            } else {
                // Move towards NPC
                const speed = 180;
                this.player.body.setVelocityX((dx / distance) * speed);
                this.player.body.setVelocityY((dy / distance) * speed);
            }
            return;
        }

        // Manual movement
        this.player.body.setVelocity(0);

        let moving = false;
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-160);
            moving = true;
            this.isAutoMoving = false;
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(160);
            moving = true;
            this.isAutoMoving = false;
        }

        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-160);
            moving = true;
            this.isAutoMoving = false;
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(160);
            moving = true;
            this.isAutoMoving = false;
        }

        // Space to interact with nearby NPC or start battle
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            if (this.questSystem.currentQuest && this.questSystem.currentQuest.id === 'first_battle') {
                this.startBattle();
            } else {
                const nearbyNPC = this.findNearbyNPC();
                if (nearbyNPC) {
                    this.onMeetNPC(nearbyNPC);
                }
            }
        }

        // Random encounter (only when not on a quest)
        if (moving && !this.isMoving) {
            this.isMoving = true;
        } else if (!moving && this.isMoving) {
            this.isMoving = false;
            if (!this.isAutoMoving && !this.questSystem.currentQuest) {
                this.checkEncounter();
            }
        }
    }

    findNearbyNPC() {
        for (const npc of Object.values(this.npcs)) {
            const dx = npc.x - this.player.x;
            const dy = npc.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 50) {
                return npc;
            }
        }
        return null;
    }

    onMeetNPC(npc) {
        const currentQuest = this.questSystem.currentQuest;
        
        if (currentQuest && currentQuest.npcId === npc.id) {
            // Complete the quest
            const result = this.questSystem.completeQuest(currentQuest.id);
            
            if (result) {
                const dialogue = npc.dialogues[currentQuest.id] || `${npc.name}: Thank you!`;
                this.events.emit('npcMessage', dialogue);
                this.events.emit('questCompleted', {
                    quest: result.quest,
                    levelUp: result.levelUp,
                    newLevel: this.questSystem.playerLevel
                });

                // Update quest markers
                this.updateQuestMarkers();

                // Check if level 10 reached
                if (this.questSystem.playerLevel >= 10) {
                    this.time.delayedCall(2000, () => {
                        this.scene.pause();
                        this.scene.launch('EndingScene', {
                            questsCompleted: this.questSystem.completedQuests.length
                        });
                    });
                } else {
                    // Start next quest
                    this.time.delayedCall(2000, () => {
                        this.startNextQuest();
                    });
                }
            }
        } else {
            // Just show dialogue
            const dialogue = npc.dialogues.welcome || `${npc.name}: Hello!`;
            this.events.emit('npcMessage', dialogue);
        }
    }

    updateQuestMarkers() {
        const availableQuests = this.questSystem.getAvailableQuests();
        Object.values(this.npcs).forEach(npc => {
            const hasQuest = availableQuests.some(q => q.npcId === npc.id);
            if (npc.marker) {
                npc.marker.setVisible(hasQuest);
            }
        });
    }

    checkEncounter() {
        // Only allow random encounters when not on quest
        if (this.questSystem.currentQuest && this.questSystem.currentQuest.id === 'first_battle') {
            return;
        }
        
        if (Phaser.Math.Between(1, 100) <= 5) {
            this.startBattle();
        }
    }

    startBattle() {
        this.scene.pause();
        this.scene.launch('BattleScene', {
            questBattle: this.questSystem.currentQuest && this.questSystem.currentQuest.id === 'first_battle'
        });
    }

    onBattleComplete(victory) {
        if (victory && this.questSystem.currentQuest && this.questSystem.currentQuest.id === 'first_battle') {
            // Complete battle quest
            const result = this.questSystem.completeQuest('first_battle');
            if (result) {
                this.events.emit('questCompleted', {
                    quest: result.quest,
                    levelUp: result.levelUp,
                    newLevel: this.questSystem.playerLevel
                });
                this.updateQuestMarkers();
                
                if (this.questSystem.playerLevel >= 10) {
                    this.time.delayedCall(2000, () => {
                        this.scene.pause();
                        this.scene.launch('EndingScene', {
                            questsCompleted: this.questSystem.completedQuests.length
                        });
                    });
                } else {
                    this.time.delayedCall(2000, () => {
                        this.startNextQuest();
                    });
                }
            }
        }
    }
}
