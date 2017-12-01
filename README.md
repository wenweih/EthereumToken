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
### Get all transactions records for a contract address
My coworker, a PHPer, want to query all transactions records for a specify contract address. we can filter transactions by [web3.eth.filter](https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter)
```JavaScript
var filter = web3.eth.filter({fromBlock: 1, toBlock: web3.eth.getBlock('latest')["number"], address: "{contract_address}"});
```
filter object with the following methods
```JavaScript
filter.get(callback)      // return all the log of entries that fit the filter
filter.watch(callback)    // Watches for state changes that fit the filter and calls the callback.
filter.stopWatching()     // Stops the watch and uninstalls the filter in the node. Should always be called once it is done.
```
as the mehtods above, we can obtain all transactions records related with given address (in our example is contract address) by ```get``` method
```JavaScript
filter.get(function(error, log) {
  console.log(JSON.stringify(log));
});
filter.stopWatching()
/*
[{"address":"0x0d5f540f4f95b357aecbbbaf41cec3cb13b474b7","blockHash":"0x001652d07123bf5957d777d86c05c96adadf885d4366be4dd9eded48bac0f55f","blockNumber":4120,"data":"0x00000000000000000000000000000000000000000000000098a7d9b8314c0000","logIndex":0,"removed":false,"topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000d06039fc47d9102fc8cd873a2071ee033f4c6080","0x000000000000000000000000f6ef5620d9199ee8fdeb9a2fa823e479c0f5026c"],"transactionHash":"0x92c11874b0e3507629a508c170de048e522c1fa2b542376a10b065be2995dc19","transactionIndex":0},{"address":"0x0d5f540f4f95b357aecbbbaf41cec3cb13b474b7","blockHash":"0x001652d07123bf5957d777d86c05c96adadf885d4366be4dd9eded48bac0f55f","blockNumber":4120,"data":"0x00000000000000000000000000000000000000000000000098a7d9b8314c0000","logIndex":1,"removed":false,"topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000d06039fc47d9102fc8cd873a2071ee033f4c6080","0x000000000000000000000000f6ef5620d9199ee8fdeb9a2fa823e479c0f5026c"],"transactionHash":"0x3c1cabbd41a751d00c6dd0111e3529616a44ce2743da74fdcdda3ec81ef2bcca","transactionIndex":1},{"address":"0x0d5f540f4f95b357aecbbbaf41cec3cb13b474b7","blockHash":"0x001652d07123bf5957d777d86c05c96adadf885d4366be4dd9eded48bac0f55f","blockNumber":4120,"data":"0x00000000000000000000000000000000000000000000000098a7d9b8314c0000","logIndex":2,"removed":false,"topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000d06039fc47d9102fc8cd873a2071ee033f4c6080","0x000000000000000000000000f6ef5620d9199ee8fdeb9a2fa823e479c0f5026c"],"transactionHash":"0x6244ecbff8aa813669002c006927c8330a8511a2cb097a37bbc1ee4cc42f0539","transactionIndex":2},{"address":"0x0d5f540f4f95b357aecbbbaf41cec3cb13b474b7","blockHash":"0xc8d8d38caead6442de4ffda7123347f97c43a36bf9543d66dda9bfb56c301318","blockNumber":4160,"data":"0x00000000000000000000000000000000000000000000000098a7d9b8314c0000","logIndex":0,"removed":false,"topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000d06039fc47d9102fc8cd873a2071ee033f4c6080","0x00000000000000000000000015171ee8dc4e7233cd56bd141588fc0c75876179"],"transactionHash":"0x04dffa246cb52bf2c05895f983a28c87c43963b52421f75d5ea6c005cfccf522","transactionIndex":0},{"address":"0x0d5f540f4f95b357aecbbbaf41cec3cb13b474b7","blockHash":"0xc8d8d38caead6442de4ffda7123347f97c43a36bf9543d66dda9bfb56c301318","blockNumber":4160,"data":"0x0000000000000000000000000000000000000000000000008ac7230489e80000","logIndex":1,"removed":false,"topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000d06039fc47d9102fc8cd873a2071ee033f4c6080","0x000000000000000000000000f6ef5620d9199ee8fdeb9a2fa823e479c0f5026c"],"transactionHash":"0xdbe0cf854d071513bc1c02676576398bb888d14d03772543a3d345ce5287c97b","transactionIndex":1},{"address":"0x0d5f540f4f95b357aecbbbaf41cec3cb13b474b7","blockHash":"0xc8d8d38caead6442de4ffda7123347f97c43a36bf9543d66dda9bfb56c301318","blockNumber":4160,"data":"0x00000000000000000000000000000000000000000000000098a7d9b8314c0000","logIndex":2,"removed":false,"topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000d06039fc47d9102fc8cd873a2071ee033f4c6080","0x000000000000000000000000f6ef5620d9199ee8fdeb9a2fa823e479c0f5026c"],"transactionHash":"0xb0b034f58109b9504c323a3e951009f151a72f5e261fbf3d0a173852006aac3a","transactionIndex":2},{"address":"0x0d5f540f4f95b357aecbbbaf41cec3cb13b474b7","blockHash":"0x48e92532df668d736f1eff32bacc6638203dd751ea02d3da38a257579729856e","blockNumber":4224,"data":"0x000000000000000000000000000000000000000000000000d02ab486cedc0000","logIndex":0,"removed":false,"topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x000000000000000000000000d06039fc47d9102fc8cd873a2071ee033f4c6080","0x000000000000000000000000f6ef5620d9199ee8fdeb9a2fa823e479c0f5026c"],"transactionHash":"0xf305645ea4be5be1f214c9204057c47596927c8e68597f34a98cfa4aa9e1d817","transactionIndex":0}]
*/
```
