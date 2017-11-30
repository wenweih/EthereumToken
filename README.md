# EthereumToken
Completely simple process to issue a token on ethereum blockchain
### Require
A running geth node, which is allowed to connect by jsonrpc
### Deploy contract and Issue token
- modify web3 HttpProvider host and port as you geth node
- npm install
- unlock coinbase in geth console
- ```./app.js```

If use in private chain, you can use ```miner.start()``` in geth console to confirm contract deploy transaction.
After transaction add to the blockchain, you can see something as follow:
```
➜  EthereumToken git:(master) ✗ ./app.js
Contract transactionhash:0x26262b9411de98875d72ddde1fcf1a54a1ed9a3482d1aca0e21c0f6ccfd91b60 wait to be minded
contract minded, address:0xa313691966ff5d00a2dd6749784b6e68ed625022
```
If the token contract is deployed successfully, the contract tokenAbi and contract address will be append to the abi.js file. Default issue 10000 token, feel free to modify the amount in the app.js
### Call contract method
as you see, we have issue a token on Ethereum, that's awesome! Now, I will show you how to call the contract method, get the token balance amount for externally owned account address, transfer etc...

#### Get balance
Connect with geth by interactive model
```shell
$ geth attach http://{geth_node_ip}:8545
Welcome to the Geth JavaScript console!

instance: Geth/test/v1.7.3-unstable-bfdc0fa3/linux-amd64/go1.7.3
coinbase: 0xd06039fc47d9102fc8cd873a2071ee033f4c6080
at block: 4117 (Thu, 30 Nov 2017 09:51:45 CST)
 datadir: /root/eth_private_net_1
 modules: admin:1.0 eth:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 web3:1.0

> var abi = {raw abi, which append to abi.js}
undefined
> var contract_address = {contract address append to abj.js}
undefined
> var contract_object = eth.contract(abi).at(contract_address)
undefined
> var coinbase_token = contract_object.balanceOf(address).div(1e18);
10000
```
#### Token transfer
At first, we can create the token contract object by abi and token address we append in the abi.js file.
```js
...
// get contract_object as we get balance above

// send 10 token to web3.eth.contract[1] for coinbase
contract_object.transfer.sendTransaction(web3.eth.accounts[1], 10000000000000000000, {from: web3.eth.accounts[0]});
// response with transaction id

/// miner.start() and miner.stop() to confirm transaction.

// check account[1] token balance
tokenObject.balanceOf(web3.eth.accounts[1])  // 10
```
