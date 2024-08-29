# Simple Wallet DApp

- A simple decentralized application (DApp) that allows users to connect their Ethereum wallet using MetaMask, view their account balance, and send ETH to other addresses. 
- This application uses HTML, CSS, and JavaScript with Bootstrap for the frontend and the MetaMask API for blockchain interactions.

## Features

- **Connect Wallet**: Connect to your Ethereum wallet using MetaMask.
- **View Balance**: Display the current ETH balance of the connected account.
- **Send Funds**: Send ETH to another address with a simple form.
- **User-friendly Interface**: Built with Bootstrap for a clean and responsive design.
- **Error Handling**: Alerts and messages are provided using SweetAlert2.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Libraries**: Bootstrap 5, SweetAlert2, ethers.js
- **Wallet Integration**: MetaMask API

## Project structure
```bash
wallet-dapp-node/
├── models/
│   └── User.js
├── routes/
│   ├── auth.js
│   └── wallet.js
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── .env
├── app.js
└── package.json
```
