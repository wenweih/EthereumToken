#!/usr/bin/env node
var fs = require('fs');
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://192.168.202.2:8545'));
var eth = web3.eth;
var coinbase = web3.eth.coinbase;

var token_source_code = fs.readFileSync("token.sol", "utf8");
var tokenCompile = web3.eth.compile.solidity(token_source_code);
var token_contract = web3.eth.contract(tokenCompile.Token.info.abiDefinition);

var abi_file = 'abi.js';

//web3.personal.unlockAccount(coinbase, "W&qQ6Nb3Wj{X}", 1000);

var initializer = {
  from: coinbase,
  data: tokenCompile.Token.code,
  gas: 300000
};

var deploy_callback = function(e, contract){
  if(!e){
    if(!contract.address){
      console.log("Contract transactionhash:" + contract.transactionHash + " wait to be minded");
    }else {
      console.log("contract minded, address:" + contract.address);
      contract.issue.sendTransaction(coinbase, 500, {from: coinbase}, function(){
        console.log("issue 500");
      });

      fs.appendFileSync(abi_file, "var tokenAbi = " + JSON.stringify(contract.abi) + ";\r\n");
      fs.appendFileSync(abi_file, "var contract_address = \"" + contract.address + "\";\r\n");
    }
  }
};

var token = token_contract.new(initializer, deploy_callback);
