document.addEventListener('DOMContentLoaded', () => {
    // Redirect to login if not logged in
    if (localStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    const connectButton = document.getElementById('connectButton');
    const walletAddress = document.getElementById('walletAddress');
    const balance = document.getElementById('balance');
    const sendForm = document.getElementById('sendForm');
    const transactionStatus = document.getElementById('transactionStatus');

    let userAccount = null;

    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please install MetaMask!',
        });
        return;
    }

    // Connect to MetaMask
    connectButton.addEventListener('click', async () => {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            walletAddress.textContent = `Connected: ${shortenAddress(userAccount)}`;
            getBalance();
        } catch (error) {
            console.error('Connection Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Connection Failed',
                text: 'Unable to connect to MetaMask. Please try again.',
            });
        }
    });

    // Shorten Ethereum address
    function shortenAddress(address) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    // Get account balance
    async function getBalance() {
        if (!userAccount) {
            Swal.fire({
                icon: 'error',
                title: 'No Account',
                text: 'Please connect your wallet first.',
            });
            return;
        }
        try {
            const balanceInWei = await ethereum.request({
                method: 'eth_getBalance',
                params: [userAccount, 'latest']
            });
            const balanceInEth = parseFloat(ethers.utils.formatEther(balanceInWei)).toFixed(4);
            balance.textContent = `${balanceInEth} ETH`;
        } catch (error) {
            console.error('Balance Fetch Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to retrieve balance.',
            });
        }
    }

    // Send funds
    sendForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const recipient = document.getElementById('recipient').value;
        const amount = document.getElementById('amount').value;

        try {
            const transactionParameters = {
                to: recipient,
                value: ethers.utils.parseEther(amount)._hex,
            };

            const txHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });

            transactionStatus.textContent = `Transaction sent: ${txHash}`;
            transactionStatus.style.color = 'green';
            getBalance(); // Update balance after sending
        } catch (error) {
            console.error('Transaction Error:', error);
            transactionStatus.textContent = 'Transaction failed!';
            transactionStatus.style.color = 'red';
            Swal.fire({
                icon: 'error',
                title: 'Transaction Failed',
                text: 'Unable to send funds. Please check the recipient address and try again.',
            });
        }
    });
});
