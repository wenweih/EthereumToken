# EthereumToken
Completely simple process to issue a token on ethereum blockchain
### Require
A running geth node, which is allowed to connect by jsonrpc
### Usage
- modify web3 HttpProvider host and port as you geth node
- npm install
- ```./app.js```

If use in private chain, you can use ```miner.start()``` in geth console to confirm contract deploy transaction.  
After transaction add to the blockchain, you can see something as follow:
```
➜  EthereumToken git:(master) ✗ ./app.js
Contract transactionhash:0x26262b9411de98875d72ddde1fcf1a54a1ed9a3482d1aca0e21c0f6ccfd91b60 wait to be minded
contract minded, address:0xa313691966ff5d00a2dd6749784b6e68ed625022
issue 500
```
If the token contract is deployed successfully, the contract tokenAbi and contract address will be append to the abi.js file.  
### issue token
At first, we can create the token contract by abi and token address we append in the abi.js file.  
```
//creation of contract object
var tokenContract = web3.eth.contract(abi);

// initiate contract for token address
var tokenObject = tokenContract.at(token_address);

// now ,we can get account token balance
tokenObject.getBalance(eth.coinbase); // 500

// issue 100 token to coinbase
tokenObject.issue.sendTransaction(web3.eth.accounts[0], 100, {from: web3.eth.accounts[0]});
"0xde6f4fd391029fbe39ab185188eec7723ed9f98e952a6f1bd0ade232edf148bd"

// in private blockchain we can miner.start() to confirm the tx
miner.start();

// if geth log output: commit new work on block 377 with 1 txs & 0 uncles. Took 908.85µs, it mean the transaction has bean mininged
miner.stop();

// check coinbase token balance
tokenObject.getBalance(eth.coinbase); // 600

// send 10 token to web3.eth.contract[1] for coinbase
tokenObject.issue.sendTransaction(web3.eth.accounts[1], 10, {from: web3.eth.accounts[0]});
"0xc6f3431d8ee18f068fb0b53bdcb52a0f3b7e0a8b258462c3cd40188deccc5b98"

/// miner.start() and miner.stop() to confirm transaction.

// check account[1] token balance
tokenObject.getBalance(web3.eth.accounts[1])
10
```
