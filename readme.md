# Web3 Wallet Connector — Full Line-by-Line Explanation (2025)

This is the cleanest wallet connection code you'll ever see.  
Every single line explained like you're 10 years old (but still looks pro on GitHub).

```jsx
import { useState } from "react";
→ Brings in React's useState hook — lets us store and update data (like wallet address, balance) and automatically refresh the screen when it changes.
jsximport { ethers } from "ethers";
→ Imports the ethers.js library — the #1 tool to talk to Ethereum blockchain from the browser.
jsxfunction App() {
→ Main component — everything inside this function is what shows on your webpage.
jsxconst [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [chainId, setChainId] = useState("");
→ Three "magic boxes" that remember data:

account → user's wallet address (e.g., 0x618b...6425)
balance → how much ETH they have
chainId → which network they're on (11155111 = Sepolia testnet)

jsxconst connectWallet = async () => {
→ The main function that runs when user clicks "Connect Wallet". async because we wait for MetaMask and blockchain.
jsxif (!window.ethereum) return alert("Install MetaMask bruh!");
→ Checks if MetaMask (or any wallet) is installed. If not → shows alert.
jsxconst SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex
→ Sepolia testnet ID in hexadecimal format (required by MetaMask).
jsxtry {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
→ Asks MetaMask to switch to Sepolia network automatically.
jsx} catch (switchError) {
      if (switchError.code === 4902) {
→ If user doesn't have Sepolia added yet → error code 4902 means "chain not found".
jsxtry {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: SEPOLIA_CHAIN_ID,
              chainName: "Sepolia Testnet",
              nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://rpc.sepolia.org"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            }],
          });
→ Automatically adds Sepolia network to user's MetaMask (no manual setup needed).
jsx} catch (addError) {
          alert("Failed to add Sepolia network");
          return;
        }
      }
    }
→ Handles errors gracefully — if adding fails, stops the process.
jsxconst accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
→ Pops up MetaMask → asks user to connect their wallet → returns list of accounts.
jsxconst address = accounts[0];
    setAccount(address);
→ Takes the first (main) account and saves it to show on screen.
jsxconst provider = new ethers.BrowserProvider(window.ethereum);
→ Creates a connection to the blockchain using the user's MetaMask.
jsxconst bal = await provider.getBalance(address);
    const network = await provider.getNetwork();
→ Gets user's ETH balance and current network info from the blockchain.
jsxsetBalance(ethers.formatEther(bal));
    setChainId(Number(network.chainId));
→ Converts balance from wei → normal ETH (e.g., 0.4045)
→ Saves chain ID as a number for display.
jsxreturn (
    <div style={{ padding: 60, textAlign: "center" }}>
      <h1>gm frennn</h1>
→ Basic page layout with centered text and padding.
jsx{!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected</p>
          <p>{account.slice(0,6)}...{account.slice(-4)}</p>
          <p>Balance: {Number(balance).toFixed(4)} ETH</p>
          <p>Chain ID: {chainId} {chainId === 11155111 ? "(Sepolia)" : "(Wrong network!)"}</p>
        </div>
      )}
→ Conditional rendering:

If not connected → show big "Connect Wallet" button
If connected → show address, balance, and network status

jsxexport default App;
→ Makes this component usable as the main app.
