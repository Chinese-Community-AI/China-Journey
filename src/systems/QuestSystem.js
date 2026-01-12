export default class QuestSystem {
    constructor(scene) {
        this.scene = scene;
        this.quests = [];
        this.completedQuests = [];
        this.currentQuest = null;
        this.playerLevel = 1;
        this.playerXP = 0;
        this.xpToNextLevel = [0, 100, 200, 350, 500, 700, 900, 1200, 1500, 2000]; // XP needed for each level
        
        this.initQuests();
    }

    initQuests() {
        // Quest 1: Welcome Quest
        this.quests.push({
            id: 'welcome',
            name: 'Welcome to Peach Blossom Village',
            description: 'Talk to Village Elder to learn about the village',
            npcId: 'elder',
            xpReward: 200,
            goldReward: 10,
            completed: false
        });

        // Quest 2: First Battle
        this.quests.push({
            id: 'first_battle',
            name: 'First Battle Training',
            description: 'Defeat a Wild Boar to prove your strength',
            npcId: 'elder',
            xpReward: 300,
            goldReward: 20,
            completed: false,
            requires: ['welcome']
        });

        // Quest 3: Visit Merchant
        this.quests.push({
            id: 'visit_merchant',
            name: 'Visit the Merchant',
            description: 'Talk to the Merchant to learn about items',
            npcId: 'merchant',
            xpReward: 250,
            goldReward: 15,
            completed: false,
            requires: ['first_battle']
        });

        // Quest 4: Help Villager
        this.quests.push({
            id: 'help_villager',
            name: 'Help the Villager',
            description: 'Talk to the Villager and help with their problem',
            npcId: 'villager',
            xpReward: 350,
            goldReward: 25,
            completed: false,
            requires: ['visit_merchant']
        });

        // Quest 5: Final Training
        this.quests.push({
            id: 'final_training',
            name: 'Final Training',
            description: 'Return to Elder for final guidance',
            npcId: 'elder',
            xpReward: 900,
            goldReward: 50,
            completed: false,
            requires: ['help_villager']
        });
    }

    getAvailableQuests() {
        return this.quests.filter(quest => {
            if (quest.completed) return false;
            if (!quest.requires) return true;
            return quest.requires.every(reqId => 
                this.completedQuests.includes(reqId)
            );
        });
    }

    startQuest(questId) {
        const quest = this.quests.find(q => q.id === questId);
        if (quest && !quest.completed) {
            this.currentQuest = quest;
            return quest;
        }
        return null;
    }

    completeQuest(questId) {
        const quest = this.quests.find(q => q.id === questId);
        if (quest && !quest.completed) {
            quest.completed = true;
            this.completedQuests.push(questId);
            this.currentQuest = null;
            
            // Add XP and level up
            this.addXP(quest.xpReward);
            
            return {
                quest: quest,
                levelUp: this.checkLevelUp()
            };
        }
        return null;
    }

    addXP(amount) {
        this.playerXP += amount;
        return this.checkLevelUp();
    }

    checkLevelUp() {
        let leveledUp = false;
        while (this.playerLevel < 10 && 
               this.playerXP >= this.xpToNextLevel[this.playerLevel]) {
            this.playerLevel++;
            leveledUp = true;
        }
        return leveledUp;
    }

    getXPProgress() {
        if (this.playerLevel >= 10) {
            return { current: 0, needed: 0, percent: 100 };
        }
        const current = this.playerXP - (this.xpToNextLevel[this.playerLevel - 1] || 0);
        const needed = this.xpToNextLevel[this.playerLevel] - (this.xpToNextLevel[this.playerLevel - 1] || 0);
        return {
            current: current,
            needed: needed,
            percent: Math.floor((current / needed) * 100)
        };
    }
}
