#!/usr/bin/env nodejs
const mysql = require('mysql');
const util = require('util');
const Web3 = require("web3");



var DB_CONFIG = {
		host: "localhost",
		user: "root",
		password: "Admin@1234",
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

var HT_CHAIN_ID = 256;	// chain ID 256 is for the Heco TESTNET
var DTH_CHAIN_ID = 34;	// chain ID 34 is for the Dithereum TESTNET
var DEFAULT_COIN = "HT";
var FROM_TOKEN = "HT";
var TO_TOKEN = "HT";
var CONTRACT_ADDR = '0x4a46f7eb468fc98e4c3c7d99f61c5f5e719c0b78';	//HT CONTRACT
var CONTRACT_ADDR_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinOut","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"CoinOutFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"signer","type":"address"},{"indexed":true,"internalType":"bool","name":"status","type":"bool"}],"name":"SignerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenOut","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"orderID","type":"uint256"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"TokenOutFailed","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_signer","type":"address"},{"internalType":"bool","name":"_status","type":"bool"}],"name":"changeSigner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"coinIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"_orderID","type":"uint256"}],"name":"coinOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"orderID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"signer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"tokenIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint256","name":"_orderID","type":"uint256"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"name":"tokenOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];


var httpprovider = new Web3(new Web3.providers.HttpProvider("https://http-testnet.hecochain.com", options));

let web3 = new Web3(httpprovider);
const myinstance = new web3.eth.Contract(CONTRACT_ADDR_ABI, CONTRACT_ADDR.toString());

var con5 = mysql.createConnection(DB_CONFIG);
const query5 = util.promisify(con5.query).bind(con5);

execute();


async function execute(){		
		var currentBlock = await web3.eth.getBlockNumber();
		currentBlock = currentBlock-5;	//we will go 5 blocks in the past, just for safe side
		//currentBlock = '12569500';
		//currentBlock = '13340558';

		try{
			var select_wallet_query = "SELECT * FROM lastblock";	
			var lastBlockData = await query5(select_wallet_query).catch(console.log);
			
			console.log("rrr");
			console.log(lastBlockData);
			console.log(currentBlock);
		
			if(lastBlockData[0]){
				console.log("Last Block >>>>",lastBlockData[0].hecochain);
				var lastBlockDatabase = lastBlockData[0].hecochain;
				
				//updating the current block in the database
				await lastBlockWorked(currentBlock);
				
				var lastBlockDatabase=currentBlock-5000;	
								
				await getEventData_CoinIn(lastBlockDatabase, currentBlock);
				await getEventData_CoinOut((lastBlockDatabase-20), (currentBlock-20));	//additional 20 blocks past, for coin out
			}
			
		}catch(e){
			console.log(e);
				
		}finally{
			con5.end();
		}

}
 

async function getEventData_CoinIn(_fromBlock, _toBlock){ 
	 
	 try{				
		 		await myinstance.getPastEvents('CoinIn',  {
		 				fromBlock: _fromBlock,       
						toBlock: _toBlock
		    	},async function(error,events){	    	
		    		try{
		    			console.log(error);		 				
		 				var eventlen = events.length;
		 				console.log("COIN IN >>> eventlen >>>>", eventlen);		 				
		 				
		 				for(var i=0;i<eventlen; i++){		 						 										
		 					var eve = events[i];
							//console.log(eve);
		 					var _blkNumber = eve.blockNumber;
							var _txnHash = eve.transactionHash;
		 					var _orderid = eve.returnValues.orderID;							
							var _userWallet = eve.returnValues.user;
							var _amount = eve.returnValues.value;  
							var _toTxnHash = '';
							var _toAmount = 0.0;
														
							if(parseInt(_amount)){							
								try{
									var sp_query = "call SP_BRIDGE_TRANSACTION ('"+_userWallet+"',"+_orderid+","+HT_CHAIN_ID+",'"+DEFAULT_COIN+"','"+_txnHash+"','"+_amount+"',"+DTH_CHAIN_ID+",'"+DEFAULT_COIN+"','"+_toTxnHash+"',"+_toAmount+")";
									console.log("-----------------------------------------------------------------------------");
									console.log(">>>>> SP_Query >>>>>",sp_query);
									console.log("-----------------------------------------------------------------------------");									
									await db_query(sp_query).catch(console.log);										
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


async function getEventData_TokenIn(_fromBlock, _toBlock){ 
	 
	 try{				
		 		await myinstance.getPastEvents('TokenIn',  {
		 				fromBlock: _fromBlock,       
						toBlock: _toBlock
		    	},async function(error,events){	    	
		    		try{
		    			console.log(error);		 				
		 				var eventlen = events.length;
		 				console.log("TOKEN IN >>> eventlen >>>>", eventlen);		 				
		 				
		 				for(var i=0;i<eventlen; i++){		 						 										
		 					var eve = events[i];
							//console.log("EVE >>>>>",eve);
		 					var _blkNumber = eve.blockNumber;
							var _txnHash = eve.transactionHash;
		 					var _orderid = eve.returnValues.orderID;							
							var _userWallet = eve.returnValues.user;
							var _amount = eve.returnValues.value;  
							var _toTxnHash='';
							var _toAmount= '';
														
							if(parseInt(_amount)){							
								try{
									var sp_query = "call SP_BRIDGE_TRANSACTION('"+_userWallet+"',"+_orderid+","+HT_CHAIN_ID+",'"+FROM_TOKEN+"','"+_txnHash+"','"+_amount+"',"+DTH_CHAIN_ID+",'"+DEFAULT_COIN+"','"+_toTxnHash+"',"+_toAmount+")";									
									console.log("-----------------------------------------------------------------------------");
									console.log(">>>>> SP_Query >>>>>",sp_query);
									console.log("-----------------------------------------------------------------------------");
									await db_query(sp_query).catch(console.log);
										
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




async function getEventData_CoinOut(_fromBlock, _toBlock){ 
	 
	 try{				
		 		await myinstance.getPastEvents('CoinOut',  {
		 				fromBlock: _fromBlock,       
						toBlock: _toBlock
		    	},async function(error,events){	    	
		    		try{
		    			 				
		 				var eventlen = events.length;
		 				console.log("COIN OUT >>> eventlen >>>>", eventlen);		 				
		 				
		 				for(var i=0;i<eventlen; i++){		 						 										
		 					var eve = events[i];
							
							var _txnHash = eve.transactionHash;
		 					var _orderid = eve.returnValues.orderID;							
							var _userWallet = eve.returnValues.user;
							var _amount = eve.returnValues.value;  
					 
							
														
							if(parseInt(_amount)){							
								try{
									
									var select_from_txn_query = "SELECT * FROM bridge_transactions where toChain='"+HT_CHAIN_ID+"' && orderID='"+_orderid+"' && status='Pending'";	
									var fromTxnData = await query5(select_from_txn_query).catch(console.log);
									
									
									//take the first result. Even any duplicate by mistake, then also it will take first one.
									if(fromTxnData[0]){	
										var update_query = "UPDATE `bridge_transactions` SET `toTxnHash`='"+_txnHash+"',`toAmount`='"+_amount+"',`status`='Completed' WHERE `toChain`='"+HT_CHAIN_ID+"' && `orderID`='"+_orderid+"'";		
										console.log(">>> Updating record, orderid, transactionHash >>>",_orderid, _txnHash);
										await db_query(update_query).catch(console.log);
									}
									else{
										//just in case, the order ID and chain ID are not found in the db, then it will log it. This is very rare to happen.
										console.log("Unprocessed Transaction: chain, Hash: "+HT_CHAIN_ID+" - "+_txnHash);
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
							
														
							if(parseInt(_amount)){							
								try{
									
									var select_from_txn_query = "SELECT * FROM bridge_transactions where toChain='"+HT_CHAIN_ID+"' && orderID='"+_orderid+"' && status='Pending'";	
									var fromTxnData = await query5(select_from_txn_query).catch(console.log);
									
									
									//take the first result. Even any duplicate by mistake, then also it will take first one.
									if(fromTxnData[0]){	
										var update_query = "UPDATE `bridge_transactions` SET `toTxnHash`='"+_txnHash+"',`toAmount`='"+_amount+"',`status`='Completed' WHERE `toChain`='"+HT_CHAIN_ID+"' && `orderID`='"+_orderid+"'";		
										console.log(">>> Updating record, orderid, transactionHash >>>",_orderid, _txnHash);
										await db_query(update_query).catch(console.log);
									}
									else{
										//just in case, the order ID and chain ID are not found in the db, then it will log it. This is very rare to happen.
										console.log("Unprocessed Transaction: chain, Hash: "+HT_CHAIN_ID+" - "+_txnHash);
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
  	var sql = "UPDATE lastblock SET hecochain="+_lastBlocknumber+" LIMIT 1";
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
