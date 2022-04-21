#!/usr/bin/env nodejs
const mysql = require('mysql');
const util = require('util');
const Web3 = require("web3");



var DB_CONFIG = {
	host: "localhost",
	user: "root",
	password: "Admin@1234",
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

CONTRACT_ADDR_ABI = [{"inputs": [{"internalType": "address[]","name": "_mywallet","type": "address[]"},{"internalType": "uint256[]","name": "_amt","type": "uint256[]"}],"name": "updateData","outputs": [],"stateMutability": "nonpayable","type": "function"}];

CONTRACT_ADDR = "0x61B805d303353Af85A7cd07ACa98B3103A5560F3";
var chainid = 34;

process.env.ADMIN_WALLET = "0x3C621c04A1542E7fC31fDEb50d0f647Fa47C41A8";
process.env.ADMIN_WALLET_PK="4b6a0cb966b04a1d7790eda5f8dedf20b0c1a9743b918d22e51d7d4b4d18acef";

var httpprovider = new Web3(new Web3.providers.HttpProvider("https://node-testnet.dithereum.io", options));

let web3 = new Web3(httpprovider);

var contractInstance = new web3.eth.Contract(CONTRACT_ADDR_ABI, CONTRACT_ADDR.toString());


var con5 = mysql.createConnection(DB_CONFIG);
const query5 = util.promisify(con5.query).bind(con5);


execute();


async function execute(){


		try{
			var select_wallet_query = "SELECT sum(`trans_fee_wei`) as amounts, `deployer_addr` from transactions_data group by `deployer_addr`";	
			var walletData = await query5(select_wallet_query).catch(console.log);
			
			
			
			console.log("rrr");
			//console.log(walletData);
			
		
			if(walletData[0]){
				// UNCOMMENT BELOW LINES  - //COMMENTED FOR TESTING
				//truncate data from the DB
				//var truncate_query = "TRUNCATE `dithereum`.`transactions_data`";	
				//await query5(truncate_query).catch(console.log);
				
				var arrayLength = walletData.length;
				
				console.log("Length >>>>",arrayLength);
				
				var amountsArray = [];
				var addressArray = [];
				
				for(var i=0; i<arrayLength; i++){
					amountsArray.push(web3.utils.toHex(walletData[i].amounts));
					addressArray.push(walletData[i].deployer_addr);
				}
			
				var mydata = await contractInstance.methods.updateData(addressArray,amountsArray).encodeABI(); 
				
				try{
					var requiredGas = await contractInstance.methods.updateData(addressArray, amountsArray).estimateGas({from: process.env.ADMIN_WALLET.toString()});    
					console.log(">>>>> REQUIRED GAS, >>> bridge_admin_wallet <<<<<",requiredGas, process.env.ADMIN_WALLET.toString());
				}catch(e){
					console.log("Error >>>", e);
				}
				
				var gasPrice = await web3.eth.getGasPrice();
				
				var nonce = await web3.eth.getTransactionCount(process.env.ADMIN_WALLET);
				
				console.log("nonce: "+nonce)
				
				const raw_tx = {   
				   nonce: web3.utils.toHex(nonce),                    
				   gasPrice: web3.utils.toHex(gasPrice),
				   gasLimit: requiredGas,
				   from: process.env.ADMIN_WALLET.toString(),
				   to: CONTRACT_ADDR.toString(),                        
				   value: '0x0',
				   data: mydata,
				   chainId: chainid
			   }; 
			   
			   console.log("raw_tx >>>>",raw_tx);                                                                   		 									 
			   try{
						web3.eth.accounts.signTransaction(raw_tx, process.env.ADMIN_WALLET_PK, function(error,result){
							if(! error){
								try{
									console.log(">>>>>>>>>>>>>>>>> #### <<<<<<<<<<<<<<<<<");
									var serializedTx=result.rawTransaction;
									web3.eth.sendSignedTransaction(serializedTx.toString('hex'))
									.on('transactionHash',function(xhash){										
										//out put of the transaction in form of transaction hash
										console.log(".....SignedTranscationHash ==> "+xhash);										
									})
									.on('error', myErr => {
										console.log("###ERR..",myErr);
									});
								}catch(e){
									console.log("Error ....",e);
								}
							}
						});		
					}catch(e){
						console.log("##### :::: ERR0R :::: ######",e);
					}	
			}
			
		}catch(e){
			console.log(e);
				
		}finally{
			con5.end();
		}

}