// Initialize the ethers library
const ethersProvider = new ethers.providers.InfuraProvider('homestead', 'b80413fa91ea43f2a74700555827bcb4');
const ethersSigner = ethers.Wallet.createRandom().connect(ethersProvider);

// Create wallet
function createWallet() {
  const wallet = ethers.Wallet.createRandom();
  const mnemonicsElement = document.getElementById('mnemonics');
  mnemonicsElement.innerHTML = `Your mnemonics are: <b>${wallet.mnemonic.phrase}</b>`;
}

// Login
function login() {
  const mnemonicsInput = document.getElementById('mnemonics-input');
  const wallet = ethers.Wallet.fromMnemonic(mnemonicsInput.value);
  ethersSigner.connect(ethersProvider);
  ethersSigner.connect(wallet.privateKey);
  const balanceElement = document.getElementById('balance-value');
  balanceElement.innerHTML = ethers.utils.formatEther(ethersSigner.getBalance());
  document.getElementById('balance').style.display = 'block';
}
