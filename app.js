#!/usr/bin/env node
var fs = require('fs');
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://{node_ip}:8545'));
var eth = web3.eth;
var solc = require('solc');

var coinbase = web3.eth.coinbase;

var token_source_code = fs.readFileSync("standard_token.sol", "utf8");
var tokenCompile = solc.compile(token_source_code, 1);

const bytecode = tokenCompile.contracts[':MyToken'].bytecode;
const abi = JSON.parse(tokenCompile.contracts[':MyToken'].interface);

var token_contract = web3.eth.contract(abi);

var abi_file = 'abi.js';

web3.personal.unlockAccount(coinbase, "111111", 1000);

var initializer = {
  from: coinbase,
  data: '0x' + bytecode,
  gas: 3000000
};

var deploy_callback = function(e, contract){
  if(!e){
    if(!contract.address){
      console.log("Contract transactionhash:" + contract.transactionHash + " wait to be minded");
    }else {
      console.log("contract minded, address: " + contract.address);
      fs.appendFileSync(abi_file, "var tokenAbi = " + JSON.stringify(contract.abi) + ";\r\n");
      fs.appendFileSync(abi_file, "var contract_address = \"" + contract.address + "\";\r\n");
    }
  }
};

var token = token_contract.new(10000000000000000000000, "hwwCoin", 1000, "hww", initializer, deploy_callback);
