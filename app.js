function init() {
const form = document.querySelector('form');
const chartContainer = document.querySelector('#chart');
const tokenDetailsContainer = document.querySelector('#token-details');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const tokenAddress = document.querySelector('#token-address').value;

  const web3 = new Web3('https://mainnet.infura.io/v3/b80413fa91ea43f2a74700555827bcb4');
  
  const TOKEN_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];


  const tokenContract = new web3.eth.Contract(TOKEN_ABI, tokenAddress);

  const [name, symbol, decimals, totalSupply] = await Promise.all([
    tokenContract.methods.name().call(),
    tokenContract.methods.symbol().call(),
    tokenContract.methods.decimals().call(),
    tokenContract.methods.totalSupply().call(),
  ]);

  const totalMarketCap = await calculateTotalMarketCap(web3, tokenContract, totalSupply);

  const sellTax = await getSellTax(web3, tokenContract);
  const buyTax = await getBuyTax(web3, tokenContract);
  const canMint = await canMintToken(web3, tokenContract);
  const canBurn = await canBurnToken(web3, tokenContract);

  const chartData = await getTokenPriceHistory(tokenAddress);

  const chartOptions = {
    chart: {
      height: 400,
      type: 'line',
    },
    series: [{
      name: `${symbol} Price`,
      data: chartData,
    }],
    xaxis: {
      type: 'datetime',
    },
  };

  const chart = new ApexCharts(chartContainer, chartOptions);

  chart.render();

  tokenDetailsContainer.innerHTML = `
    <h2>${name} (${symbol})</h2>
    <p>Total Supply: ${formatNumber(totalSupply, decimals)} ${symbol}</p>
    <p>Total Market Cap: ${formatNumber(totalMarketCap, decimals)} ${symbol}</p>
    <h3>Token Distribution:</h3>
    <ul>
      ${tokenHolders.map((holder) => `<li>${holder.address}: ${formatNumber(holder.balance, decimals)} ${symbol}</li>`).join('')}
    </ul>
    <h3>Token Functions:</h3>
    <ul>
      <li>Sell Tax: ${sellTax}%</li>
      <li>Buy Tax: ${buyTax}%</li>
           <li>Can Mint: ${canMint ? 'Yes' : 'No'}</li>
      <li>Can Burn: ${canBurn ? 'Yes' : 'No'}</li>
    </ul>
  `;
});

async function calculateTotalMarketCap(web3, tokenContract, totalSupply) {
  const ethPrice = await getEthPrice();

  const tokenPrice = await getTokenPrice(tokenContract.options.address);

  return tokenPrice * totalSupply / 10 ** 18 * ethPrice;
}

async function getSellTax(web3, tokenContract) {
  try {
    const sellTax = await tokenContract.methods.sellTax().call();

    return sellTax / 100;
  } catch (error) {
    return 'N/A';
  }
}

async function getBuyTax(web3, tokenContract) {
  try {
    const buyTax = await tokenContract.methods.buyTax().call();

    return buyTax / 100;
  } catch (error) {
    return 'N/A';
  }
}

async function canMintToken(web3, tokenContract) {
  try {
    const canMint = await tokenContract.methods.canMint().call();

    return canMint;
  } catch (error) {
    return 'N/A';
  }
}

async function canBurnToken(web3, tokenContract) {
  try {
    const canBurn = await tokenContract.methods.canBurn().call();

    return canBurn;
  } catch (error) {
    return 'N/A';
  }
}

async function getTokenPriceHistory(tokenAddress) {
  const url = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${tokenAddress}/market_chart?vs_currency=usd&days=30`;

  const response = await fetch(url);

  const data = await response.json();

  return data.prices.map((price) => ({
    x: price[0],
    y: price[1],
  }));
}

async function getTokenPrice(tokenAddress) {
  const url = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${tokenAddress}?tickers=true&market_data=true`;

  const response = await fetch(url);

  const data = await response.json();

  return data.market_data.current_price.usd;
}

async function getEthPrice() {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';

  const response = await fetch(url);

  const data = await response.json();

  return data.ethereum.usd;
}

function formatNumber(number, decimals) {
  const numberString = number.toString();

  const wholePart = numberString.slice(0, -decimals) || '0';
  const decimalPart = numberString.slice(-decimals);

  let formattedWholePart = wholePart;

  if (formattedWholePart.length > 3) {
    const wholePartChunks = [];

    for (let i = formattedWholePart.length; i > 0; i -= 3) {
      const chunk = formattedWholePart.slice(Math.max(i - 3, 0), i);

      wholePartChunks.unshift(chunk);
    }

    formattedWholePart = wholePartChunks.join(',');
  }

  return formattedWholePart + '.' + decimalPart;
}
}

init();

