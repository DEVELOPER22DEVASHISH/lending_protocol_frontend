# 💸 Lending Protocol Frontend

A modern React-based frontend for a **decentralized lending protocol**, supporting multi-wallet connections via **RainbowKit**.

Interact with smart contracts like `LendingPool`, `CollateralManager`, `LToken`, and `DebtToken` on the **Polygon Amoy testnet**.

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/DEVELOPER22DEVASHISH/lending_protocol_frontend.git
cd lending_protocol_frontend

2️⃣ Install Dependencies
    npm install

3️⃣ Configure Environment Variables
    Copy .env.example to .env:
    cp .env.example .env

Then fill in the contract addresses inside .env.
Refer to the .env.example or your own deployment output.

VITE_LENDING_POOL_ADDRESS = 0xBBbD25711460Af780A38EBc278BAA1df6d33fca3
VITE_DAI_ADDRESS = 0xD7b22F1e8705dA9019eb571B17eBCeeC8Df4f933
VITE_DEBTTOKEN_DAI_ADDRESS = 0x896cD573F421f01aabA9762C99699B1A2e19911f
VITE_LTOKEN_DAI_ADDRESS = 0x6a8Ec7D66e3dF31bff1260d143535c3aaEd794cB
VITE_USDC_ADDRESS = 0x3434891fD32583E9BD2fA82A6f02aFa791d2710D
VITE_LTOKEN_USDC_ADDRESS = 0x4E6f61A57444b1EDe74E87316d4721F35f414208
VITE_DEBTTOKEN_USDC_ADDRESS = 0x5Ac6a22c619C9215fd7CAAC883Dd8801f07d4BD5
VITE_USDT_ADDRESS = 0x0295EaA0A2477C5a073279f21CD1E4D843b89512
VITE_LTOKEN_USDT_ADDRESS = 0x4935FAB2f0A7d83acDcd3f455607C45ddC739383
VITE_DEBTTOKEN_USDT_ADDRESS = 0xaE6B6D63CC099EAc77D5FA63cd9567c98Ff4De39
VITE_COLLATERAL_MANAGER_ADDRESS = 0x6899d1a6f9F18dfFe9E623Ad46b47620143a3dBb

4️⃣ Run the Development Server
    npm run dev

🦊 Wallet Setup & Actions
✅ Connect Wallet
Click Connect Wallet

Choose a wallet (MetaMask, Rainbow, Coinbase, etc.)

Approve the connection

🌐 Switch to Polygon Amoy Testnet
If prompted, allow the switch. Otherwise, add manually:

🌐 Polygon Amoy Testnet Configuration
To connect your wallet to the Polygon Amoy testnet, use the following settings:

Network Name: Polygon Amoy
New RPC URL: https://rpc-amoy.polygon.technology/
Chain ID: 80002
Currency Symbol: POL
Block Explorer URL: https://amoy.polygonscan.com/

💰 Get Test Tokens
Get testnet POL from the Polygon Amoy Faucet

Get test DAI, USDC, USDT from your backend or a token faucet (if available)

🪙 Import Tokens into Wallet
Steps (MetaMask Example):

Click Assets → Import Tokens

Paste the token address from your .env (e.g., VITE_DAI_ADDRESS)

Confirm and add the token to view your balance

🧑‍💻 Usage

| Action       | Description                                          |
| ------------ | ---------------------------------------------------- |
| 🏦 Deposit   | Choose an asset, enter amount, click Deposit         |
| 💸 Withdraw  | Choose an asset, enter amount, click Withdraw        |
| 📈 Borrow    | Choose an asset, enter amount, click Borrow          |
| 💼 Repay     | Choose an asset, enter amount, click Repay           |
| 📊 Dashboard | View your supplied/borrowed balances & health factor |


🛠 Troubleshooting


| Issue              | Solution                                                |
| ------------------ | ------------------------------------------------------- |
| Balances show 0.00 | Ensure you've transacted and are on the correct network |
| Buttons don’t work | Connect wallet and ensure test tokens exist             |
| Transactions fail  | Check wallet balance and network settings               |
| `.env` not working | Confirm all contract addresses are set properly         |


📋 Checklist
✅ Can clone and install the repo with npm install
✅ Can configure .env with contract addresses
✅ Can connect wallet via RainbowKit & switch to Amoy
✅ Can deposit, withdraw, borrow, and repay assets
✅ Can view balances & health factor updates
✅ Can import tokens into wallet and view balances

🙏 Thank You
Thank you for reviewing this DeFi lending protocol project!
Your time and attention are greatly appreciated.

If you have any questions, feedback, or would like to discuss the design further, please feel free to reach out.

Happy building and exploring DeFi! 🚀

Devashish Biswas
Blockchain Developer