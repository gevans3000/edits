class GameLoop {
    constructor(config) {
        this.game = new Phaser.Game(config);
        this.cursors = null;
        this.player = null;
        this.enemy = null;
        this.score = null;
        this.metamask = new MetaMask();
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('enemy', 'assets/enemy.png');
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player = new Player(this);
        this.enemy = new Enemy(this);
        this.score = new Score(this);
        this.metamask.connect();
    }

    update() {
        this.player.handleMovement(this.cursors);
        this.enemy.handleEnemyMovement();
    }
}
