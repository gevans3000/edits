class Score {
    constructor(game) {
        this.game = game;
        this.score = 0;
        this.scoreText = null;
        this.initScore();
    }

    initScore() {
        this.scoreText = this.game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
    }

    increaseScore(points) {
        this.score += points;
        this.scoreText.setText('Score: ' + this.score);
    }
}
