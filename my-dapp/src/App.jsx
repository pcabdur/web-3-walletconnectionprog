import { useState } from "react";
import { ethers } from "ethers";

function App() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [chainId, setChainId] = useState("");

  const connectWallet = async () => {
  if (!window.ethereum) return alert("Install MetaMask bruh!");

  const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex

  try {
    // Try to switch to Sepolia
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
  } catch (switchError) {
    // If Sepolia not added yet, add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: SEPOLIA_CHAIN_ID,
              chainName: "Sepolia Testnet",
              nativeCurrency: {
                name: "Sepolia ETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://rpc.sepolia.org"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
      } catch (addError) {
        alert("Failed to add Sepolia network");
        return;
      }
    } else {
      console.error(switchError);
    }
  }

  // Now connect after chain is correct
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const address = accounts[0];
  setAccount(address);

  const provider = new ethers.BrowserProvider(window.ethereum);
  const bal = await provider.getBalance(address);
  const network = await provider.getNetwork();

  setBalance(ethers.formatEther(bal));
  setChainId(Number(network.chainId));
};

  return (
    <div style={{ padding: 60, fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
      <h1 style={{ fontSize: 48 }}>gm frennn</h1>
      
      {!account ? (
        <button 
          onClick={connectWallet}
          style={{ 
            padding: "20px 40px", 
            fontSize: 24, 
            cursor: "pointer",
            background: "#000", 
            color: "#fff", 
            border: "none",
            borderRadius: 12
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <div style={{ marginTop: 40, fontSize: 20 }}>
          <p>✅ Connected</p>
          <p>{account.slice(0,6)}...{account.slice(-4)}</p>
          <p>Balance: {Number(balance).toFixed(4)} ETH</p>
          <p>Chain ID: {chainId} {chainId === 11155111 ? "(Sepolia)" : "(Wrong network!)"}</p>
        </div>
      )}
    </div>
  );
}

export default App;