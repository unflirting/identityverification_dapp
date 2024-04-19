// JavaScript (app.js)
const connectWallet = document.getElementById('connectWallet');
const registerIdentityAttributeForm = document.getElementById('registerIdentityAttributeForm');
const attestIdentityAttributeForm = document.getElementById('attestIdentityAttributeForm');
const grantConsentForm = document.getElementById('grantConsentForm');
const revokeConsentForm = document.getElementById('revokeConsentForm');
const verifyIdentityForm = document.getElementById('verifyIdentityForm');

const identityAttestationContractAddress = '0xEe276E34be4Ff8d66399A434Ef8c88F97fE8157f';
const consentManagementContractAddress = '0x0Ae8BEA753f1d82F25D9D680ef5aD6b5785bD2C4';
const identityVerificationContractAddress = '0x285c3b2AaAEe3F748AC659FF1dfa1ce32D925693';

// Replace with the actual ABI for each contract
const identityAttestationContractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "individual",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "attribute",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "value",
				"type": "string"
			}
		],
		"name": "attestIdentity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "attestedIdentities",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasRegistered",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "attribute",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "value",
				"type": "string"
			}
		],
		"name": "registerIdentityAttribute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const consentManagementContractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "individual",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "serviceProvider",
				"type": "address"
			}
		],
		"name": "grantConsent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "individual",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "serviceProvider",
				"type": "address"
			}
		],
		"name": "revokeConsent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "individual",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "serviceProvider",
				"type": "address"
			}
		],
		"name": "checkConsent",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "consent",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const identityVerificationContractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_identityAttestationContract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_consentManagementContract",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "consentManagementContract",
		"outputs": [
			{
				"internalType": "contract ConsentManagementContract",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "identityAttestationContract",
		"outputs": [
			{
				"internalType": "contract IdentityAttestationContract",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "individual",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "serviceProvider",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "attribute",
				"type": "string"
			}
		],
		"name": "verifyIdentity",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let web3;
let identityAttestationContract;
let consentManagementContract;
let identityVerificationContract;

async function init() {
  if (typeof window.ethereum!== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    web3 = new Web3(window.ethereum);

    identityAttestationContract = new web3.eth.Contract(
      identityAttestationContractABI,
      identityAttestationContractAddress
    );

    consentManagementContract = new web3.eth.Contract(
      consentManagementContractABI,
      consentManagementContractAddress
    );

    identityVerificationContract = new web3.eth.Contract(
      identityVerificationContractABI,
      identityVerificationContractAddress
    );
  } else {
    console.log('MetaMask not detected. Please install MetaMask.');
  }
}

connectWallet.addEventListener('click', async () => {
  await init();
  console.log('Connected to wallet:', (await web3.eth.getAccounts())[0]);
});

registerIdentityAttributeForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const attribute = document.getElementById('registerAttribute').value;
  const value = document.getElementById('registerValue').value;
  await registerIdentityAttribute(attribute, value);
});

attestIdentityAttributeForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const individual = document.getElementById('attestIndividual').value;
  const attribute = document.getElementById('attestAttribute').value;
  const value = document.getElementById('attestValue').value;
  await attestIdentity(individual, attribute, value);
});

grantConsentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const individual = document.getElementById('grantIndividual').value;
  const serviceProvider = document.getElementById('grantServiceProvider').value;
  await grantConsent(individual, serviceProvider);
});

revokeConsentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const individual = document.getElementById('revokeIndividual').value;
  const serviceProvider = document.getElementById('revokeServiceProvider').value;
  await revokeConsent(individual, serviceProvider);
});

verifyIdentityForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const individual = document.getElementById('verifyIndividual').value;
  const serviceProvider = document.getElementById('verifyServiceProvider').value;
  const attribute = document.getElementById('verifyAttribute').value;
  const verificationResult = await verifyIdentity(individual, serviceProvider, attribute);
  console.log('Verified identity:', verificationResult);

    // Create a new result element
    const resultElement = document.createElement('div');
    resultElement.classList.add('result-box');
  
    // Add the verification result to the element
    const resultText = document.createElement('span');
    resultText.textContent = verificationResult ? 'True' : 'False';
    resultElement.appendChild(resultText);
  
    // Add the element to the page
    const resultContainer = document.getElementById('verifyResult');
    resultContainer.innerHTML = '';
    resultContainer.appendChild(resultElement);

  // Update the frontend with the verification result
  //const resultElement = document.getElementById('verifyResult');
  //resultElement.innerText = verificationResult? 'True' : 'False';
});

async function registerIdentityAttribute(attribute, value) {
  const from = (await web3.eth.getAccounts())[0];
  const registerFunction = identityAttestationContract.methods.registerIdentityAttribute(attribute, value);
  const transaction = await registerFunction.send({ from });
  console.log('Registered identity attribute:', transaction);
}

async function attestIdentity(individual, attribute, value) {
  const from = (await web3.eth.getAccounts())[0];
  const attestFunction = identityAttestationContract.methods.attestIdentity(individual, attribute, value);
  const transaction = await attestFunction.send({ from });
  console.log('Attested identity:', transaction);
}

async function grantConsent(individual, serviceProvider) {
  const from = (await web3.eth.getAccounts())[0];
  const grantFunction = consentManagementContract.methods.grantConsent(individual, serviceProvider);
  const transaction = await grantFunction.send({ from });
  console.log('Granted consent:', transaction);
}

async function revokeConsent(individual, serviceProvider) {
  const from = (await web3.eth.getAccounts())[0];
  const revokeFunction = consentManagementContract.methods.revokeConsent(individual, serviceProvider);
  const transaction = await revokeFunction.send({ from });
  console.log('Revoked consent:', transaction);
}

async function verifyIdentity(individual, serviceProvider, attribute) {
  const from = (await web3.eth.getAccounts())[0];
  const verificationFunction = identityVerificationContract.methods.verifyIdentity(individual, serviceProvider, attribute);
  const verificationResult = await verificationFunction.call();
  return verificationResult;
}