// public/script.js

// DOM Elements
const registerButton = document.getElementById('registerButton');
const loginButton = document.getElementById('loginButton');
const connectWalletButton = document.getElementById('connectWallet');
const balanceDisplay = document.getElementById('balance');
const sendForm = document.getElementById('sendForm');
const walletFeatures = document.getElementById('walletFeatures');

// Register User
registerButton.addEventListener('click', async () => {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const result = await response.json();
        if (response.ok) {
            Swal.fire('Success', result.message, 'success');
        } else {
            Swal.fire('Error', result.error, 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'Registration failed', 'error');
    }
});

// Login User
loginButton.addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('token', result.token);
            walletFeatures.classList.remove('d-none');
            Swal.fire('Success', 'Logged in successfully', 'success');
        } else {
            Swal.fire('Error', result.error, 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'Login failed', 'error');
    }
});

// Connect Wallet
connectWalletButton.addEventListener('click', async () => {
    if (window.ethereum) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            Swal.fire('Connected', `Wallet connected: ${address}`, 'success');
            getBalance(signer);
        } catch (error) {
            Swal.fire('Error', 'Failed to connect wallet', 'error');
        }
    } else {
        Swal.fire('Error', 'MetaMask is not installed', 'error');
    }
});

// Get Balance
async function getBalance(signer) {
    try {
        const balance = await signer.getBalance();
        const balanceInEth = ethers.utils.formatEther(balance);
        balanceDisplay.textContent = `${balanceInEth} ETH`;
    } catch (error) {
        Swal.fire('Error', 'Failed to fetch balance', 'error');
    }
}

// Send ETH
sendForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const recipient = document.getElementById('recipient').value;
    const amount = document.getElementById('amount').value;
    const token = localStorage.getItem('token');

    if (!token) {
        Swal.fire('Error', 'You must be logged in to send ETH', 'error');
        return;
    }

    try {
        const response = await fetch('/api/wallet/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ recipient, amount })
        });

        const result = await response.json();
        if (response.ok) {
            Swal.fire('Success', `Transaction Hash: ${result.transactionHash}`, 'success');
            sendForm.reset();
            getBalance();
        } else {
            Swal.fire('Error', result.error, 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'Transaction failed', 'error');
    }
});
