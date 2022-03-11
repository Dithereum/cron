#!/usr/bin/env nodejs
const mysql = require('mysql');
const util = require('util');
const Web3 = require("web3");



var DB_CONFIG = {
		host: "localhost",
		user: "root",
		password: "",
		database: "dithereum",
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

var httpprovider = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/", options));

let web3 = new Web3(httpprovider);

var con5 = mysql.createConnection(DB_CONFIG);
const query5 = util.promisify(con5.query).bind(con5);

execute();


async function execute(){
	
	
	
		var currentBlock = await web3.eth.getBlockNumber();
		currentBlock = currentBlock-5;
		


		try{
			var select_wallet_query = "SELECT * FROM lastblock";	
			var lastBlockData = await query5(select_wallet_query).catch(console.log);
			
			
			
			console.log("rrr");
			console.log(lastBlockData);
			console.log(currentBlock);
		
			if(lastBlockData[0]){
				
				console.log(lastBlockData[0].blockid);
				var lastBlockDatabase = lastBlockData[0].blockid;
				
				//updating the current block in the database
				await lastBlockWorked(currentBlock);
				
				//looping through all the blocks and extract the data from it and save in the DB
				for(var i=lastBlockDatabase; i < currentBlock; i++){
					
					var myblk = await web3.eth.getBlock(i);
					
					var totalTransactions = myblk.transactions.length;
					
					console.log("total transactions: "+ totalTransactions);
					
					for(var j=0; j<totalTransactions; j++){
						
						var individualTransaction = myblk.transactions[j];
						
						//individualTransaction = "0x33175c6b721da24ece54363fb66394100aa8546121c5d042360e7316ab77be86";
						
						await getTransactionDetails(individualTransaction);
						
						
						//console.log(individualTransaction);
						
						
						
					}
					//console.log(myblk.transactions);
					
					
					
					
					
				}
				

			}
			
		}catch(e){
			console.log(e);
				
		}finally{
			con5.end();
		}



		




}

async function lastBlockWorked(_lastBlocknumber){	
  	_lastBlocknumber = _lastBlocknumber ? _lastBlocknumber : 0; 
  	var sql = "UPDATE lastblock SET blockid="+_lastBlocknumber+" LIMIT 1";
  	console.log("<<< SQL >>>",sql);
  	return db_query(sql, "UpdateQuery");  	
}



async function getTransactionDetails(q){

	var transactionReceipt = await web3.eth.getTransactionReceipt(q);


		/// IF in to:null means is Contract creation	
		if(transactionReceipt.contractAddress !== null){
			
									
			var _deployer_addr = transactionReceipt.from;
			var _contractAddress = transactionReceipt.contractAddress;
			var _transactionHash = transactionReceipt.transactionHash;
																				
			var insertsql = "INSERT INTO deployer_data (contract_address, deployer_address, transaction_hash) VALUES ('"+_contractAddress+"','"+_deployer_addr.toString()+"','"+_transactionHash.toString()+"')";
			console.log("<<< INSERTING >>>",insertsql);		
			return await db_query(insertsql,"InsertQuery");					
				
							
										
		}else{  // This block will find the valid deployer wallet for any contract and reward it
		
			var select_deployer_query = "SELECT deployer_address FROM deployer_data where contract_address='"+transactionReceipt.to+"'";	
			var deployerData = await query5(select_deployer_query).catch(console.log);
		
			if(deployerData[0]){
				
				var transaction = await web3.eth.getTransaction(q);
				var _usersGasPrice = parseInt(transaction.gasPrice);
				var _transaction_fees_wei = _usersGasPrice * parseInt(transactionReceipt.gasUsed.toString());
				var _deployerCommission = _transaction_fees_wei * 40 / 100; //40% of transaction fee goes to the deployer
				var _deployerAddress = deployerData[0].deployer_address;
				var _contractAddress = transactionReceipt.to;
				var _transactionHash = transactionReceipt.transactionHash;
				var _blockNumber = transactionReceipt.blockNumber;
				var _user = transactionReceipt.from;
				
				var insertsql = "INSERT INTO transactions_data (block_num, txnHash, txnMaker, contract_address, trans_fee_wei, deployer_addr) VALUES ('"+_blockNumber+"','"+_transactionHash+"','"+_user+"','"+_contractAddress+"','"+_transaction_fees_wei+"','"+_deployerAddress+"')";
				console.log("<<< INSERTING >>>",insertsql);		
				return await db_query(insertsql,"InsertQuery");	
			}
			
			
			
								
		}		
	
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
