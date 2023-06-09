// Define a function to fetch the API token from the IBM Quantum Experience
async function getApiToken() {
  const response = await fetch('https://auth.quantum-computing.ibm.com/api/users/loginWithToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      apiToken: '22c64af80310792cd9bc2ee7fee902193d82539d10b2fcace6cc65cd3c6cabcaab6dd2789d73d6d3fb7e61b494e7156033c584e3bed39e7e395485335007bbbf'
    })
  });
  const data = await response.json();
  return data.id;
}

// Define quantum circuit for random number generation
const circuit = {
  qasm: `
    OPENQASM 2.0;
    include "qelib1.inc";

    qreg q[3];
    creg c[3];

    h q[0];
    h q[1];
    h q[2];

    cx q[0],q[1];
    cx q[1],q[2];

    measure q -> c;
  `
};

// Define function to run quantum circuit on IBM Quantum Experience and return random number
async function getRandomNumber() {
  const apiToken = await getApiToken();
  const backend = 'ibmq_santiago';
  const shots = 1;
  const response = await fetch(`https://api.quantum-computing.ibm.com/v2.0/jobs?access_token=${apiToken}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      backend: {
        name: backend
      },
      shots: shots,
      qobj: {
        qobj_id: 'qobj-id',
        header: {},
        config: {},
        experiments: [{
          instructions: circuit.qasm.split('\n').filter(line => line.trim() !== '').map(line => ({
            name: 'u1',
            params: [0],
            qubits: [parseInt(line.split(' ')[1].substr(1))]
          }))
        }]
      }
    })
  });
  const data = await response.json();
  const jobId = data.id;
  let result;
  while (!result) {
    const response = await fetch(`https://api.quantum-computing.ibm.com/v2.0/jobs/${jobId}?access_token=${apiToken}`);
    const data = await response.json();
    if (data.status === 'DONE') {
      result = data;
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  const counts = result.results[0].data.counts;
  const measurement = Object.keys(counts)[0];
  const randomNumber = parseInt(measurement, 2);
  console.log(`The random number is ${randomNumber}`);
  return randomNumber;
}

// Implement the guessing game logic
// Implement the guessing game logic
let randomNumber;
let guesses = 0;

function guess() {
  if (!randomNumber || guesses >= 3) {
    return;
  }
  const guess = parseInt(document.getElementById('guessInput').value);
  if (isNaN(guess) || guess < 0 || guess > 7) {
    document.getElementById('feedback').innerHTML = 'Please enter a valid number between 0 and 7.';
  } else {
    guesses++;
    if (guess === randomNumber) {
      document.getElementById('feedback').innerHTML = `Congratulations! You guessed the number ${randomNumber} in ${guesses} tries.`;
      document.getElementById('guessInput').disabled = true;
      document.getElementById('guessButton').disabled = true;
      document.getElementById('startButton').disabled = false;
    } else {
      const message = guess > randomNumber ? 'Too high!' : 'Too low!';
      document.getElementById('feedback').innerHTML = message;
      if (guesses >= 3) {
        document.getElementById('feedback').innerHTML = `Sorry, you didn't guess the number ${randomNumber} in 3 tries.`;
        document.getElementById('guessInput').disabled = true;
        document.getElementById('guessButton').disabled = true;
        document.getElementById('startButton').disabled = false;
      }
    }
  }
}

async function startGame() {
  document.getElementById('startButton').disabled = true;
  document.getElementById('guessInput').disabled = false;
  document.getElementById('guessButton').disabled = false;
  document.getElementById('feedback').innerHTML = 'Guess a number between 0 and 7:';
  randomNumber = await getRandomNumber();
  guesses = 0;
}

