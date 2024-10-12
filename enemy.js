class Enemy {
    constructor(game) {
        this.game = game;
        this.enemies = this.game.physics.add.group();
        this.spawnEnemies();
    }

    spawnEnemies() {
        for (let i = 0; i < 5; i++) {
            let enemy = this.enemies.create(400 + i * 100, 500, 'enemy');
            enemy.setCollideWorldBounds(true);
            enemy.setVelocityX(100);
        }
    }

    handleEnemyMovement() {
        this.enemies.children.iterate(function (enemy) {
            if (enemy.x >= 800) {
                enemy.setVelocityX(-100);
            } else if (enemy.x <= 0) {
                enemy.setVelocityX(100);
            }
        });
    }
}
