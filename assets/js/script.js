document.addEventListener('DOMContentLoaded', () => {
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

    // Event listener for the connect button
    connectButton.addEventListener('click', async () => {
        try {
            // Request accounts from MetaMask
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];

            // Display the shortened address
            walletAddress.textContent = `Connected: ${shortenAddress(userAccount)}`;

            // Retrieve and display the account balance
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

    // Function to shorten Ethereum address
    function shortenAddress(address) {
        // Display the first 6 and last 4 characters of the address
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    // Function to retrieve account balance
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
            // Request the balance in wei
            const balanceInWei = await ethereum.request({
                method: 'eth_getBalance',
                params: [userAccount, 'latest']
            });

            // Convert wei to ether and display
            const balanceInEth = parseFloat(ethers.utils.formatEther(balanceInWei)).toFixed(4);
            balance.textContent = `${balanceInEth} ETH`;

        } catch (error) {
            console.error('Balance Retrieval Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to retrieve balance. Please check your connection.',
            });
        }
    }

    // Event listener for the send funds form
    sendForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const recipient = document.getElementById('recipient').value;
        const amount = document.getElementById('amount').value;

        try {
            // Set up transaction parameters
            const transactionParameters = {
                to: recipient,
                value: ethers.utils.parseEther(amount)._hex,
            };

            // Send the transaction
            const txHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });

            // Display transaction hash and update balance
            transactionStatus.textContent = `Transaction sent: ${txHash}`;
            transactionStatus.style.color = 'green';

            // Update balance after sending
            getBalance(); 
        } catch (error) {
            console.error('Transaction Error:', error);
            transactionStatus.textContent = 'Transaction failed!';
            transactionStatus.style.color = 'red';
            Swal.fire({
                icon: 'error',
                title: 'Transaction Failed',
                text: 'The transaction could not be completed. Please check the details and try again.',
            });
        }
    });
});
