#!/usr/bin/env nodejs
const mysql = require('mysql');
const util = require('util');
const Web3 = require("web3");



var DB_CONFIG = {
		host: "localhost",
		user: "root",
		password: "",
		database: "test",
		connectTimeout: 100000,
		port: 3306
};


const options = {
	timeout: 30000,
	reconnect: {
	  auto: true,
	  delay: 5000,
	  maxAttempts: 10,
	  onTimeout: true,
	},
	clientConfig: {
	  keepalive: true,
	  keepaliveInterval: 60000,
	  maxReceivedFrameSize: 100000000,
	  maxReceivedMessageSize: 100000000,
	},
};

var DTH_CHAIN_ID = 24;	// chain ID 24 is for the Dithereum Mainnet
var ETH_TOKEN_ADDRESS = "0x232A1fD8742a606238B53B7babA5fEe5835f3c97";
var BNB_TOKEN_ADDRESS = "0x57012f5fE63a47a668b1fF9f6eF3D234A22e8C19";
var MATIC_TOKEN_ADDRESS = "0xf2A16551D5ab32acf690548DcFaB1302224B9926";
var HT_TOKEN_ADDRESS = "0x5277346c4534028C535A7e8660c491DEB63A2155";
var DUSD_TOKEN_ADDRESS = "0xaE0e20478A312FAE7c9Fef6D80811C26b1Da0321";



var CONTRACT_ADDR = '0x87bA9F94DB64C6a5d0221f73721Bb92008835E66';
var CONTRACT_ADDR_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinOut","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinOutFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"signer","type":"address"},{"indexed":true,"internalType":"bool","name":"status","type":"bool"}],"name":"SignerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenOut","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenOutFailed","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_signer","type":"address"},{"internalType":"bool","name":"_status","type":"bool"}],"name":"changeSigner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"coinIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_orderID","type":"uint256"}],"name":"coinOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"orderID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"signer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"tokenIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint256","name":"_orderID","type":"uint256"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"tokenOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];


var httpprovider = new Web3(new Web3.providers.HttpProvider("https://node-mainnet.dithereum.org", options));

let web3 = new Web3(httpprovider);
const myinstance = new web3.eth.Contract(CONTRACT_ADDR_ABI, CONTRACT_ADDR.toString());

var con5 = mysql.createConnection(DB_CONFIG);
const query5 = util.promisify(con5.query).bind(con5);

execute();


async function execute(){
	
	
	
		var currentBlock = await web3.eth.getBlockNumber();
		currentBlock = currentBlock-5;	//we will go 5 blocks in the past, just for safe side
		


		try{
			var select_wallet_query = "SELECT * FROM lastblock";	
			var lastBlockData = await query5(select_wallet_query).catch(console.log);
			
		
			if(lastBlockData[0]){
				
				console.log(lastBlockData[0].dithereum);
				var lastBlockDatabase = lastBlockData[0].dithereum;
				
				//updating the current block in the database
				await lastBlockWorked(currentBlock);
				
					 
				await getEventData_TokenIn(lastBlockDatabase, currentBlock);
				await getEventData_TokenOut((lastBlockDatabase-20), (currentBlock-20));	//additional 20 blocks past for tokenOut
				

			}
			
		}catch(e){
			console.log(e);
				
		}finally{
			con5.end();
		}

}


async function getEventData_TokenIn(_fromBlock, _toBlock){
	 
	 try{				
		 		await myinstance.getPastEvents('TokenIn',  {
		 				fromBlock: _fromBlock,       
						toBlock: _toBlock
		    	},async function(error,events){	    	
		    		try{
		    					 				
		 				var eventlen = events.length;
		 				console.log("TOKEN IN >>> eventlen >>>>", eventlen);		 				
		 				
		 				for(var i=0;i<eventlen; i++){		 						 										
		 					var eve = events[i];
							console.log(eve)
		 					var _blkNumber = eve.blockNumber;
							var _txnHash = eve.transactionHash;
		 					var _orderid = eve.returnValues.orderID;							
							var _userWallet = eve.returnValues.user;
							var _amount = eve.returnValues.value;  
							var _tokenAddress = eve.returnValues.tokenAddress;
							var _fromCurrency = "";
							var _toCurrency = "";
							var _toChain = 0;
							
							if(_tokenAddress==ETH_TOKEN_ADDRESS){
								_fromCurrency = "ETH";
								_toCurrency = _fromCurrency;
								_toChain = 1;
							}
							else if(_tokenAddress==BNB_TOKEN_ADDRESS){
								_fromCurrency = "BNB";
								_toCurrency = _fromCurrency;
								_toChain = 56;
							}
							else if(_tokenAddress==MATIC_TOKEN_ADDRESS){
								_fromCurrency = "MATIC";
								_toCurrency = _fromCurrency;
								_toChain = 137;
							}
							else if(_tokenAddress==HT_TOKEN_ADDRESS){
								_fromCurrency = "HT";
								_toCurrency = _fromCurrency;
								_toChain = 128;
							}
							else if(_tokenAddress==DUSD_TOKEN_ADDRESS){
								_fromCurrency = "DUSD";
								_toCurrency = "BUSD";
								_toChain = 56;
							}
							else {	//this is very unlikely to happen
								_fromCurrency = "NA";
								_toCurrency = "NA";
							}
							
							
														
							if(parseInt(_amount)){							
								try{
									
									var insert_query = "INSERT INTO bridge_transactions (`userWallet`,`orderID`,`fromChain`,`fromCurrency`,`fromTxnHash`,`fromAmount`,`toChain`,`toCurrency`) VALUES ('"+_userWallet+"',"+_orderid+","+DTH_CHAIN_ID+",'"+_fromCurrency+"','"+_txnHash+"',"+_amount+","+_toChain+",'"+_toCurrency+"')";		
									console.log(">>> Inserting record, orderid, transactionHash >>>",_orderid, _txnHash);
									await db_query(insert_query).catch(console.log);
										
								}catch(e){
									console.log(">>>>>Catch >>>>",e);									
								}																
							}else{
								console.log(">>>> TokenIn >>>>In for loop, _orderid, _txnHash,  _amount, i >>>>", _orderid, _txnHash, _amount, i);						
							}														
						}
					}catch(e){
							console.log(e);
					}					
		 		});
		 		////
		 }catch(e){	console.log("<<<< Error >>>>",e); }	 	 	 
}



async function getEventData_TokenOut(_fromBlock, _toBlock){ 
	 
	 try{				
		 		await myinstance.getPastEvents('TokenOut',  {
		 				fromBlock: _fromBlock,       
						toBlock: _toBlock
		    	},async function(error,events){	    	
		    		try{
		    			 				
		 				var eventlen = events.length;
		 				console.log("TOKEN OUT >>> eventlen >>>>", eventlen);		 				
		 				
		 				for(var i=0;i<eventlen; i++){		 						 										
		 					var eve = events[i];
							
							var _txnHash = eve.transactionHash;
		 					var _orderid = eve.returnValues.orderID;							
							var _userWallet = eve.returnValues.user;
							var _amount = eve.returnValues.value;  
							var _tokenAddress = eve.returnValues.tokenAddress;  
							var _chainID = eve.returnValues.chainID;  
							
														
							if(parseInt(_amount)){							
								try{
									
									var select_from_txn_query = "SELECT * FROM bridge_transactions where fromChain='"+_chainID+"' && orderID='"+_orderid+"' && status='Pending'";	
									var fromTxnData = await query5(select_from_txn_query).catch(console.log);
									
									
									//take the first result. Even any duplicate by mistake, then also it will take first one.
									if(fromTxnData[0]){	
										var update_query = "UPDATE `bridge_transactions` SET `toTxnHash`='"+_txnHash+"',`toAmount`='"+_amount+"',`status`='Completed' WHERE `fromChain`='"+_chainID+"' && `orderID`='"+_orderid+"'";		
										console.log(">>> Updating record, orderid, transactionHash >>>",_orderid, _txnHash);
										await db_query(update_query).catch(console.log);
									}
									else{
										//just in case, the order ID and chain ID are not found in the db, then it will log it. This is very rare to happen.
										console.log("Unprocessed Transaction: chain, Hash: "+DTH_CHAIN_ID+" - "+_txnHash);
									}
									
										
								}catch(e){
									console.log(">>>>>Catch >>>>",e);									
								}																
							}else{
								console.log(">>>> CoinIn >>>>In for loop, _orderid, _txnHash,  _amount, i >>>>", _orderid, _txnHash, _amount, i);						
							}														
						}
					}catch(e){
							console.log(e);
					}					
		 		});
		 		////
		 }catch(e){	console.log("<<<< Error >>>>",e); }	 	 	 
}








async function lastBlockWorked(_lastBlocknumber){	
  	_lastBlocknumber = _lastBlocknumber ? _lastBlocknumber : 0; 
  	var sql = "UPDATE lastblock SET dithereum="+_lastBlocknumber+" LIMIT 1";
  	console.log("<<< SQL >>>",sql);
  	return db_query(sql, "UpdateQuery");  	
}


async function	db_query(_sql, _querytype){
	var con = mysql.createConnection(DB_CONFIG);	
	try{		
		con.connect(function(err) {
	  		if (err) { console.log(">>> Error DB connect:",err); }
		  	console.log(">>> Connected to dithereum database:>>>");
		  	try{	  	
			  	con.query(_sql, function (err, result) {  		
		    		if(err){ console.log(">>> Error Occured:", err); }
		    		else{
		    			console.log(">>> Query Executed >>",_querytype);
		    			con.end();    			    			
		    		}
		    		setTimeout(()=>{},2000);		    		
		  		}); 		  		
		  	}catch(e){
				console.log(">>>In catchblock>>>",e);		  	
		  	} 	
		});
	}catch(e){
		console.log(">>>>>>EEEEEEE>>>>>",e);	
	}
}