class MetaMask {
    constructor() {
        this.connected = false;
    }

    async connect() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.connected = true;
                console.log('MetaMask connected');
            } catch (error) {
                console.error('Connection error:', error);
            }
        } else {
            console.error('MetaMask not detected');
        }
    }

    async saveScore(score) {
        if (this.connected) {
            console.log('Score saved:', score);
        }
    }

    async fetchLifetimeScore() {
        if (this.connected) {
            return 1000;
        }
        return 0;
    }
}
