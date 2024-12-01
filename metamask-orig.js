document.addEventListener('DOMContentLoaded', () => {
    let userAddress = localStorage.getItem('userAddress');
    let playerScore = 0; // Assuming player.score exists and is updated in your game

    // MetaMask connection function
    async function connectMetaMask() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                localStorage.setItem('userAddress', account);
                userAddress = account;
                
                console.log("MetaMask connected. Wallet Address: ", userAddress); // Debug
                
                alert('Connected: ' + account);

                // Fetch the game data from the backend (lifetime score and hours)
                fetchGameData(userAddress);
            } catch (error) {
                console.error('MetaMask connection error:', error);
            }
        } else {
            alert('MetaMask is not installed.');
        }
    }

    // Fetch the lifetime score and hours since first login from the backend
    async function fetchGameData(walletAddress) {
        try {
            const response = await fetch('/code/game/2/save_score.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `wallet=${walletAddress}&action=fetch`
            });

            const data = await response.json();

            // Fetch and display lifetime score
            if (data.currentScore) {
                document.getElementById('lifetimeScore').textContent = `Lifetime Score: ${data.currentScore}`;
            } else {
                document.getElementById('lifetimeScore').textContent = 'Lifetime Score: Not Available';
            }

            // Fetch and display hours since first login
            if (data.firstLoginTimestamp) {
                const firstLoginTime = new Date(data.firstLoginTimestamp);
                const currentTime = new Date(); // Get current time

                // Calculate the difference in milliseconds
                const timeDifferenceMs = currentTime - firstLoginTime;

                // Convert milliseconds to hours and minutes
                const totalMinutes = Math.floor(timeDifferenceMs / (1000 * 60)); // Convert to minutes
                const hours = Math.floor(totalMinutes / 60); // Get full hours
                const minutes = totalMinutes % 60; // Get remaining minutes

                // Display formatted hours and minutes
                document.getElementById('hoursSinceFirstLogin').textContent = `Hours Since First Login: ${hours} hours ${minutes} minutes`;
            } else {
                document.getElementById('hoursSinceFirstLogin').textContent = 'No login data available';
            }

        } catch (error) {
            console.error('Error fetching game data:', error);
            document.getElementById('lifetimeScore').textContent = 'Error loading lifetime score';
            document.getElementById('hoursSinceFirstLogin').textContent = 'Error loading hours';
        }
    }

    // Save the current game session (score)
    async function saveGameSession() {
        // Ensure playerScore is updated from the game's score logic
        playerScore = player.score; // Replace this with the correct way to get the player's score in your game logic
        
        console.log("Saving game session. Wallet: ", userAddress, " Score: ", playerScore); // Debug
        
        if (userAddress && playerScore > 0) {
            try {
                const response = await fetch('/code/game/2/save_score.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `wallet=${userAddress}&score=${playerScore}&action=save`
                });

                const data = await response.json();
                if (data.message) {
                    alert('Game session saved: ' + data.message);
                }
            } catch (error) {
                console.error('Error saving game session:', error);
            }
        } else {
            alert('Please connect MetaMask and start the game to generate a score.');
        }
    }

    // Load the game session (score)
    async function loadGameSession() {
        if (userAddress) {
            try {
                const response = await fetch('/code/game/2/save_score.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `wallet=${userAddress}&action=fetch`
                });

                const data = await response.json();
                if (data.currentScore) {
                    playerScore = data.currentScore; // Update the player's score in the game
                    console.log('Loaded game session. Score = ', playerScore); // Debug
                    alert('Game session loaded: Score = ' + playerScore);
                } else {
                    alert('No session data found.');
                }
            } catch (error) {
                console.error('Error loading game session:', error);
            }
        } else {
            alert('Please connect MetaMask first.');
        }
    }

    // Attach event listeners for the buttons
    document.getElementById('connectWallet').addEventListener('click', connectMetaMask);
    document.getElementById('saveSession').addEventListener('click', saveGameSession);
    document.getElementById('loadSession').addEventListener('click', loadGameSession);
});
