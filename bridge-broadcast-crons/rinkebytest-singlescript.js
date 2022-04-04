#!/usr/bin/nodejs
var mysql = require('mysql');
const util = require('util');
require('dotenv').config();
const Web3 = require("web3");
var Tx = require('ethereumjs-tx').Transaction;
var Contract = require('web3-eth-contract');
var CronJob = require('cron').CronJob;
var CHAIN = {'chain':'rinkeby'};

var INFURA_PROVIDER = "https://rinkeby.infura.io/v3/8102c6c81e12418588c89d69ac7a3f04";
var CONTRACT_ADDR = '0xB6495879f4f88D3563B52c097Cb009E286586137';
const BigNumber = require('bignumber.js');

var DITHEREUM_CONTRACT_ADDR = '0x14B55b5Bfa8D442760Fd3e31678F38eF61cDab87';
var CONTRACT_ADDR_ABI = JSON.parse(process.env.BRIDGE_ABI);


process.env.RINKEBY_CONTRACT_ORDERS_TABLE = "rinkeby_contract_orders";

// FOR RINKEBY 
var chainid = 4; // rinkeby
var BRIDGE_CHAIN = 34; // TESTNET
// ORDERS
var myorderID = [...Array(90000).keys()].toString().split(',');

if(myorderID[0] === '0'){
	myorderID.shift();
 	//console.log(myorderID);	
} 

/// DB Connection Config Obj
var DB_CONFIG = {
  		host: process.env.DB_HOST.toString(),
  		user: process.env.DB_USER.toString(),
  		password: process.env.DB_PASSWORD.toString(),
  		database: process.env.DB_DATABASE.toString(),
  		connectTimeout: 100000,
  		port: process.env.DB_PORT
};

// TOKEN ADDRESSES -  Dithereum Token TESTNET
var ETH_TOKEN_ADDRESS = "0xc1A016C2c1aCa2F381dD14d3F0a5cDbe4c986F45";
var DUSD_TOKEN_ADDRESS = "0x4CA21032F6C89f9ec65F517e6dcce226714992D4";

//RINKEBY NETOWORK TOKENS 
var USDT_TOKEN_ADDRESS = "0xd4160737D90d6cC756f12E603e47e0E4FDADC870";								  
var USDC_TOKEN_ADDRESS = "0xd4160737D90d6cC756f12E603e47e0E4FDADC870";
var PAX_TOKEN_ADDRESS = "0xd4160737D90d6cC756f12E603e47e0E4FDADC870";
var DAI_TOKEN_ADDRESS = "0xd4160737D90d6cC756f12E603e47e0E4FDADC870";
	  
// for web3 contract object creation  
var CHAINID_URL=[];
CHAINID_URL[4] = 'https://rinkeby.infura.io/v3/8102c6c81e12418588c89d69ac7a3f04';
CHAINID_URL[34] = 'https://node-testnet.dithereum.io';


//// MIN AMOUNT -> BRIDGE UI
const MIN_ETH =  2500000000000000; 
const MIN_USDT = 10000000000000000000;
const MIN_USDC = 10000000000000000000;
const MIN_DAI = 10000000000000000000;
const MIN_PAX = 10000000000000000000;


// CHANGES DONE
async function	getAvailableAdminWallet(){	
	var con5 = mysql.createConnection(DB_CONFIG);
	const query5 = util.promisify(con5.query).bind(con5);	
	try{
			var _mywherecondition = " isFrozen=0 AND chainid="+chainid+" AND freezetime<(UNIX_TIMESTAMP()-600) limit 1";
			var select_wallet_query = "SELECT * FROM "+process.env.NONCE_ADMIN_TABLE+" WHERE "+_mywherecondition;
			console.log(">>>> Query <<<<#", select_wallet_query);			
			var _adminwallet = await query5(select_wallet_query).catch(console.log);	
			if(_adminwallet[0]){
				console.log("<<<< Available Wallet >>>> ", _adminwallet[0].walletid);
				process.env.ADMIN_WALLET=_adminwallet[0].walletid;
				process.env.ADMIN_WALLET_PK=_adminwallet[0].walletpk;
				process.env.CHAIN_ID=_adminwallet[0].chainid;
			}else{							
				console.log(">>>>> NOTE:::::::: No Admin wallet available >>>>");																	
			}		
	}catch(e){
			console.error(">>>>Error SQL>>Catch",e);
	}finally{
			con5.end();			
	}			
}


////// Unfreeze Wallets 
function tryToUnfreezeWallets(){
	/// This will remove/unfreeze maximum two wallets if present in noncetable and freezed/locked 
	db_select_frozenWallets().then((frozenWallets)=>{		
			   console.log(">>>>Frozen Wallet Length >>>>",frozenWallets.length);
				if(frozenWallets.length > 0){					
					//console.log(">>>> frozenWallets >>>>",frozenWallets[0]);								
					frozenWallets.forEach((walet)=>{							
						(async()=>{					
							console.log("#>> Walet ##>>",walet);
							await gTransactionCount(walet).then((transcount)=>{
								console.log("#> Waletid, TransactionCount, walet.nonce, walet.chainid >>>>>",walet.walletid, transcount, walet.nonce, walet.chainid);								
								if((parseInt(walet.nonce) <= parseInt(transcount)) || (walet.nonce === undefined) || (walet.nonce === null) ){									
									console.log(">>>>> Removing from noncetable and unfreezing for >>> walet.walletid, walet.chainid >>>", walet.walletid, walet.chainid);
									unfreezeWallet(walet.chainid, walet.walletid);									
								}
							}).catch(console.log);
						})();						
					})												
				}
	}).catch(console.log);
}

async function gTransactionCount(mywallet){		
		console.log(">>>>>> mywallet.walletid, mywallet.chainid  >>>>", mywallet.walletid, mywallet.chainid);		
		let myweb3 = new Web3(new Web3.providers.HttpProvider(INFURA_PROVIDER));			
		return await myweb3.eth.getTransactionCount(mywallet.walletid, "pending").catch(console.log);		
}

process.env.lastnonce = 0;

/// FOR BRIDGE - 
async function	getAvailableAdminWallet_bridge(bridgeweb3){	
	var con5 = mysql.createConnection(DB_CONFIG);
	const query5 = util.promisify(con5.query).bind(con5);
	try{
			var _mywherecondition = " isFrozen=0 AND chainid="+BRIDGE_CHAIN+" AND freezetime<(UNIX_TIMESTAMP()-600) limit 1";
			var select_wallet_query = "SELECT * FROM "+process.env.NONCE_ADMIN_TABLE+" WHERE "+_mywherecondition;
			console.log(">>>> Bridge Query >>>>", select_wallet_query);			
			var _adminwallet = await query5(select_wallet_query).catch(console.log);			
			console.log("<<<< Bridge Available Wallet >>>> ", _adminwallet[0].walletid, _adminwallet[0].chainid, _adminwallet[0].nonce);			
			if(_adminwallet[0]){
				process.env.ADMIN_WALLET_BRIDGE=_adminwallet[0].walletid;
				process.env.ADMIN_WALLET_PK_BRIDGE=_adminwallet[0].walletpk;
				process.env.CHAIN_ID_BRIDGE=_adminwallet[0].chainid;	
				process.env.LAST_DB_NONCE_BRIDGE=_adminwallet[0].nonce;
				console.log(">>>>>~~~~~process.env.LAST_DB_NONCE_BRIDGE>>>>>",process.env.LAST_DB_NONCE_BRIDGE);			
				///
				await bridgeweb3.eth.getTransactionCount(process.env.ADMIN_WALLET_BRIDGE, "pending").then((z)=>{	
					process.env.lastnonce_bridge = (parseInt(process.env.LAST_DB_NONCE_BRIDGE) > parseInt(z)) ? parseInt(process.env.LAST_DB_NONCE_BRIDGE) : parseInt(z);
					console.log(">>~~~<< process.env.LAST_DB_NONCE_BRIDGE >>~~~<<",process.env.LAST_DB_NONCE_BRIDGE);			    			
					//process.env.lastnonce_bridge = parseInt(z);
					var _wherestr = " walletid='"+process.env.ADMIN_WALLET_BRIDGE+"' AND chainid="+process.env.CHAIN_ID_BRIDGE; 			
					var update_query = "UPDATE "+process.env.NONCE_ADMIN_TABLE+" SET isFrozen=1, freezetime=UNIX_TIMESTAMP() WHERE "+_wherestr;
					console.log(">>>> Bridge Query >>>> Update Query >>>>", update_query);		
					query5(update_query).catch(console.log);	
				}).catch(console.log);	
				///					
			}else{							
				console.log(">>>>> NOTE:::::::: No Admin wallet available >>>>");													
			}		
	}catch(e){
			console.error("ERROR SQL>>Catch",e);
	}finally{
			con5.end();			
	}			
}

var filter = {'to': CONTRACT_ADDR.toString()}

const options = {
    timeout: 90000,
    reconnect: {
      auto: true,
      delay: 5000,
      maxAttempts: 20,
      onTimeout: true,
    },
    clientConfig: {
      keepalive: true,
      keepaliveInterval: 120000,
      maxReceivedFrameSize: 100000000,
      maxReceivedMessageSize: 100000000,
    },
};


/// SET THIS FOR EACH CHAIN 
var getwsprovider = () =>{  
	 var httpprovider = new Web3(new Web3.providers.HttpProvider(INFURA_PROVIDER, options));     
    return httpprovider
}
let web3 = new Web3(getwsprovider());




// When coinIn -> tokenOut
async function bridge_sendmethod(_toWallet, _amt, orderid, _chainid){
	 let bridgeweb3 = new Web3(new Web3.providers.HttpProvider(CHAINID_URL[BRIDGE_CHAIN].toString()));	 
	 console.log("<<>>CHAINID_URL[BRIDGE_CHAIN]<<>>",CHAINID_URL[BRIDGE_CHAIN].toString());		    
    web3.eth.handleRevert = true;  		    

	 try{
    		var company_bridgeinstance = new bridgeweb3.eth.Contract(CONTRACT_ADDR_ABI, DITHEREUM_CONTRACT_ADDR.toString());		    	
    }catch(e){
			console.log(" >>>>> EEEEE >>>>",e);		    
    }
    
    await getAvailableAdminWallet_bridge(bridgeweb3).then(()=>{
		    if(typeof process.env.ADMIN_WALLET_BRIDGE === 'undefined'){
		    	console.log(">> No admin wallet bridge available, Removing orderid from orders_table <<");
		    	remove_orderid_from_orders_table(orderid, _chainid).then(()=>{
		    		setTimeout(()=>{},1000);
		    		process.exit(1);
		    	})    	    	
		    }else{		    	        
		  	 	  console.log(">>>With admin wallet >>>",process.env.ADMIN_WALLET_BRIDGE.toString());		        
		        if((typeof process.env.lastnonce_bridge === 'undefined') || (typeof process.env.ADMIN_WALLET_BRIDGE === 'undefined')){				     
						process.exit(1);     
				  }     
		    } 
    });        
    setTimeout(()=>{}, 4000);
    var mydata = await company_bridgeinstance.methods.tokenOut(ETH_TOKEN_ADDRESS.toString(), _toWallet.toString(), _amt.toString(), orderid.toString(), _chainid.toString()).encodeABI();
    console.log(">>>>myData >>>>",mydata);    
    
    var requiredGas = await company_bridgeinstance.methods.tokenOut(ETH_TOKEN_ADDRESS.toString(), _toWallet.toString(), _amt.toString(), orderid.toString(), _chainid.toString()).estimateGas({from: process.env.ADMIN_WALLET_BRIDGE.toString()}).catch(console.log);
    requiredGas = (requiredGas > 0) ? requiredGas : 75000;
    console.log(">>>>>@@@@<<<<<requiredGas >>>>>@@@@<<<<<",requiredGas);
  	 (async()=>{
		  await bridgeweb3.eth.getGasPrice().then(gasPrice=>{
 	 	  		 console.log(">>>>> @@@@@ <<<<< NEW NONCE >>>>",process.env.lastnonce_bridge); 	 	  		                     			                    				                    			                                                                  
		       const raw_tx = {   
		           nonce: parseInt(process.env.lastnonce_bridge),                    
		           gasPrice: web3.utils.toHex(gasPrice),
		           gasLimit: requiredGas,
		           from: process.env.ADMIN_WALLET_BRIDGE.toString(),
		           to: DITHEREUM_CONTRACT_ADDR.toString(),                        
		           value: '0x0',
		           data: mydata,
		           chainId: 34
		       }; 
				 
		       console.log("raw_tx >>>>",raw_tx);
		       
		       	try{		       		
		       	   set_ordersTable(parseInt(_chainid), orderid.toString());	
		       	   console.log("Here >>>>");	 
						bridgeweb3.eth.accounts.signTransaction(raw_tx, process.env.ADMIN_WALLET_PK_BRIDGE.toString(), function(error,result){
							if(! error){
								try{									
									var serializedTx=result.rawTransaction;									 
									bridgeweb3.eth.sendSignedTransaction(serializedTx.toString('hex'))
									.on('transactionHash',function(xhash){
										console.log(".....SignedTranscationHash ==> ",xhash);
									})
									.on('error', myErr => {
										console.log("###ERR..",myErr);
									});									
								}catch(e){
									console.log('<= Error =>',e);
								}
							}
						});
						process.env.lastnonce_bridge = parseInt(process.env.lastnonce_bridge)+1;
						update_nonce(34, process.env.ADMIN_WALLET_BRIDGE.toString(), process.env.lastnonce_bridge);								
					}catch(e){
						console.log("##### :::: ERR0R :::: ######",e);
					}	                                                                                                                         
		  }) 
	 })();	
}

async function company_bridge_send_method( _tokenaddr ,_toWallet, _amt, orderid, _chainid){	
	  // ForceSet
 	  _chainid = BRIDGE_CHAIN;	  
	  // not valid token addr
	  var _ary = [DAI_TOKEN_ADDRESS.toString(), PAX_TOKEN_ADDRESS.toString(), USDC_TOKEN_ADDRESS.toString(), USDT_TOKEN_ADDRESS.toString()];
	  if(_ary.includes(_tokenaddr)){}else{
	  		return 1;
	  }	
	  var pairedwithContract = '';
	  
	  //USDT RINKBY ETH to DUSD [DITHEREUM]
	  if(_tokenaddr === USDT_TOKEN_ADDRESS){	  		
			pairedwithContract = DUSD_TOKEN_ADDRESS;
	  }
	  //USDC RINKBY ETH to DUSD [DITHEREUM]  
	  if(_tokenaddr === USDC_TOKEN_ADDRESS){	  	   
	  		pairedwithContract = DUSD_TOKEN_ADDRESS;
	  } 	  
	  //PAX RINKBY ETH to DUSD [DITHEREUM]
 	  if(_tokenaddr === PAX_TOKEN_ADDRESS){	  	   
	  		pairedwithContract = DUSD_TOKEN_ADDRESS;
	  } 	  
	  //DAI RINKBY ETH to DUSD [DITHEREUM]
	  if(_tokenaddr === DAI_TOKEN_ADDRESS){
	  		pairedwithContract = DUSD_TOKEN_ADDRESS;
	  } 	  

	  if(! CHAINID_URL[_chainid]){
    	 console.log(">>> not valid chainid >>>", _chainid);
    	 return;
     }    

     let bridgeweb3 = new Web3(new Web3.providers.HttpProvider(CHAINID_URL[BRIDGE_CHAIN]));
     console.log(">>>>>@@@@ pairedwithContract, ChainID >>> ",pairedwithContract, CHAINID_URL[BRIDGE_CHAIN]);		    
     web3.eth.handleRevert = true; 		    

	 try{
    		var company_bridgeinstance = new bridgeweb3.eth.Contract(CONTRACT_ADDR_ABI, DITHEREUM_CONTRACT_ADDR.toString());		    	
    }catch(e){
			console.log(" >>>>> EEEEE >>>>",e);		    
    }
	 
	 await getAvailableAdminWallet_bridge(bridgeweb3).then(()=>{
		    if(typeof process.env.ADMIN_WALLET_BRIDGE === 'undefined'){
		    	console.log("<<@@@>><<@@@>>No admin wallet bridge available,Removing orderid from orders_table<<@@@>><<@@@>>");
		    	remove_orderid_from_orders_table(_chainid).then(()=>{
		    		setTimeout(()=>{},1000);
		    		process.exit(1);
		    	})    	    	
		    }else{		    	        
		  	 	  console.log("<<@@@>>With admin wallet<<@@@>>",process.env.ADMIN_WALLET_BRIDGE.toString());		        
		        if((typeof process.env.lastnonce_bridge === 'undefined') || (typeof process.env.ADMIN_WALLET_BRIDGE === 'undefined')){				     
						process.exit(1);     
				  }     
		    } 
    }); 
	 _amt = _amt/100;  // JUST TO TEST- MAKING AMT SMALL	         
    var mydata = await company_bridgeinstance.methods.tokenOut(pairedwithContract.toString(), _toWallet.toString(), _amt.toString(), orderid.toString(), _chainid.toString()).encodeABI();    
	 console.log("<<@@@>>##pairedwithContract, myData ##<<@@@>>",pairedwithContract, mydata);
	 var requiredGas = await company_bridgeinstance.methods.tokenOut(pairedwithContract.toString(), _toWallet.toString(), _amt.toString(), orderid.toString(), _chainid.toString()).estimateGas({from: process.env.ADMIN_WALLET_BRIDGE.toString()}).catch(console.log);
    requiredGas = (requiredGas > 0) ? requiredGas : 70000;    
    console.log("<<@@@>><<@@@>>REQUIRED GAS,bridge_admin_wallet<<@@@>><<@@@>>",requiredGas, process.env.ADMIN_WALLET_BRIDGE.toString());     		
 
  	 (async()=>{
		  await bridgeweb3.eth.getGasPrice().then(gasPrice=>{
		  	    var nonc = (parseInt(process.env.lastnonce_bridge) == 0) ? 1 : parseInt(process.env.lastnonce_bridge);                      			                    				                    			                                                                  
		       const raw_tx = {   
		           nonce: nonc,                    
		           gasPrice: web3.utils.toHex(gasPrice),
		           gasLimit: requiredGas,
		           from: process.env.ADMIN_WALLET_BRIDGE.toString(),
		           to: DITHEREUM_CONTRACT_ADDR.toString(),                     
		           data: mydata,
		           chainId:34		            
		       };
		       		       
		      console.log(">>>> RAW TX [raw_tx] >>>>",raw_tx);
		      try{	
		      		set_ordersTable(parseInt(_chainid), orderid.toString());		 	       		
						bridgeweb3.eth.accounts.signTransaction(raw_tx, process.env.ADMIN_WALLET_PK_BRIDGE.toString(), function(error,result){
							if(! error){
								try{
									console.log(">> Signed Transaction >>");
									var serializedTx=result.rawTransaction;
									console.log("Serialized Tx ::", serializedTx);
								   bridgeweb3.eth.sendSignedTransaction(serializedTx.toString('hex')).on('receipt', console.log).on('error', console.log);
								}catch(e){
									console.log(e);
								}
							}
						});
						process.env.lastnonce_bridge = parseInt(process.env.lastnonce_bridge)+1;
						update_nonce(34, process.env.ADMIN_WALLET_BRIDGE.toString(), process.env.lastnonce_bridge);								
					}catch(e){
						console.log("##### :::: ERR0R :::: ######",e);
					}                                                                                                        
		  }) 
	 })();		 
}


// CHANGES DONE
async function update_nonce_admin_table(newnonce, isbridge=0){
	var con7 = mysql.createConnection(DB_CONFIG);
	const query7 = util.promisify(con7.query).bind(con7);	
	try{
			var _wherestring = '';
			if(isbridge > 0){
				_wherestring = " isFrozen=1 AND chainid="+process.env.CHAIN_ID_BRIDGE+" AND walletid='"+process.env.ADMIN_WALLET_BRIDGE+"'";
			}else{
				_wherestring = " isFrozen=1 AND chainid="+process.env.CHAIN_ID+" AND walletid='"+process.env.ADMIN_WALLET+"'";
			}
			var update_nonce_admin_query = "UPDATE "+process.env.NONCE_ADMIN_TABLE+" SET nonce="+parseInt(newnonce)+", freezetime=UNIX_TIMESTAMP() WHERE "+_wherestring;   	
			console.log(">><< QUERY >><<", update_nonce_admin_query);	
			await query7(update_nonce_admin_query).catch(console.log);			
	}catch(e){
			console.error("ERROR SQL>>Catch",e);
	}finally{
			con7.end();			
	}
}

async function checkLatestBlock(){
	 //######  UNCOMMENT BELOW LINE FOR 100 BLOCKS  ######//
 	 var toblock =  await web3.eth.getBlockNumber().catch(console.log);
 	 var fromblock = toblock-500;
 	 
 	 // For testing 	  	  
 	 //var toblock=10268897;
 	 //var fromblock=10268894;
 	 var toblock= 10444879;
 	 var fromblock= 10441878;   	
 	 console.log(">>TESTING FOR>>toblock>>,fromblock>>",toblock, fromblock); 
	 getEventData_CoinIn(fromblock, toblock);	 
	 getEventData_TokenIn(fromblock, toblock); 	
}

// cHANGES DONE
async function freeze_wallet(){
	var con8 = mysql.createConnection(DB_CONFIG);
	const query8 = util.promisify(con8.query).bind(con8);	
	try{
			var _wherestr = " walletid='"+process.env.ADMIN_WALLET+"' AND chainid="+process.env.CHAIN_ID; 			
			var update_query = "UPDATE "+process.env.NONCE_ADMIN_TABLE+" SET isFrozen=1, freezetime=UNIX_TIMESTAMP() WHERE "+_wherestr;
			console.log(">>>> Query >>>> Update Query >>>>", update_query);		
			await query8(update_query).catch(console.log);	
			console.log("-------------------------------------------------");		
			checkLatestBlock();		
	}catch(e){
			console.error("ERROR SQL>>Catch",e);
	}finally{
			con8.end();			
	}
}

function set_ordersTable(chainid, orderid){
	var con9 = mysql.createConnection(DB_CONFIG);
	const query9 = util.promisify(con9.query).bind(con9);	
	try{
			var _wherestr = " orderid="+orderid+" AND chainid="+chainid; 			
			var update_query = "UPDATE rinkeby_contract_orders SET transactionSent=1 WHERE "+_wherestr;
			console.log(">>>> Query >>>> Update Query [SET ORDERS_TABLE] >>>>", update_query);		
			query9(update_query).catch(console.log);		
	}catch(e){
			console.error("ERROR SQL>>Catch",e);
	}finally{
			con9.end();			
	}
}



async function getEventData_CoinIn(_fromBlock, _toBlock){
	 const myinstance = new web3.eth.Contract(CONTRACT_ADDR_ABI, CONTRACT_ADDR.toString());
	 try{				
		 		await myinstance.getPastEvents('CoinIn',  {
		 				'filter':{'orderID': myorderID},
		 				fromBlock: _fromBlock,       
						toBlock: _toBlock
		    	},function(error,events){	    	
		    		try{
		    			console.log(error);	
		    			if(events === undefined){
		    				return
		    			}	 				
		 				var eventlen = events.length;
		 				process.env.CoinInEventLen = events.length;
		 				//console.log("COIN IN >>> eventlen >>>>", eventlen);		 				
		 				var secretText = Math.random(23439, 5654624);	
		 				process.env.secretText = secretText.toString();	
		 				for(var i=0;i<eventlen; i++){		
		 					var eve = events[i];		 					
 				         /////emit CoinIn(orderID, msg.sender, msg.value)
		 					var _blkNumber = eve.blockNumber;			 									
		 					var _orderid = eve.returnValues.orderID;							
							var _sendcoinsTo = eve.returnValues.user;
							var _amount = eve.returnValues.value;
							var _chainid = eve.returnValues.chainID ? eve.returnValues.chainID : BRIDGE_CHAIN.toString();
							//console.log(">>>>eve<<<<",eve.returnValues);  
							console.log(">>>>>CoinIn >> CHAIN id, Order Id >>>>",_chainid, _orderid);						
							if(_chainid && (! BigNumber(_amount).lt(MIN_ETH))){						
								try{
									(async()=>{																		 		
									   var cnt = await db_select_coinin(_chainid, _orderid, _sendcoinsTo, _amount, secretText).catch(console.log);											      											   
									})();									   										   
								}catch(e){
									console.log(">>>>>Catch >>>>",e);									
								}																
							}else{
								console.log(">>>> CoinIn/Else >>>>In for loop, _orderid, _chainid,  _amount, i >>>>", _orderid, _chainid, _amount, i);						
							}														
						}
					}catch(e){
							console.error(e);
					}					
		 		});
		 		////
		 }catch(e){	console.error("<<<< Error >>>>",e); }	 	 	 
}


async function getEventData_TokenIn(_fromBlock, _toBlock){	
	 const myinstance = new web3.eth.Contract(CONTRACT_ADDR_ABI, CONTRACT_ADDR.toString());	 	 
	 try{
		 		await myinstance.getPastEvents('TokenIn', {	'filter':{'orderID': myorderID},	fromBlock: _fromBlock, toBlock: _toBlock },function(error,myevents){		    			
		 				console.log(error);
		 				if(myevents === undefined){
		 					return
		 				}		 				
		 				var myeventlen = myevents.length;		
		 				process.env.TokenInEventLen = myevents.length;
		 				if((parseInt(process.env.CoinInEventLen) === 0) && (parseInt(process.env.TokenInEventLen) === 0)){
		 						// UNFREEZE ROW as no events found in specified block range 
								no_records_found_unfreeze_row()
						}	
						console.log("================================================="); 								 				
		 				console.log("TOKEN IN >>> myeventlen >>>>", myeventlen);		 		
		 				console.log("=================================================");	
		 				var secretText = Math.random(23439, 5654624);	
		 				process.env.secretText = secretText.toString();		
		 				for(var k=0; k<myeventlen;k++){		 						 	
		 					var myeve = myevents[k];		 					
		 					//console.log("~~~~~~~~~~~~~~~~~~~>>> k, myeve >>>",k, myeve);							
		 					var _myblkNumber = myeve.blockNumber;					
		 					var _myorderid = myeve.returnValues.orderID;
							var _mytokenAddress = myeve.returnValues.tokenAddress.trim();
							var _mysendcoinsTo = myeve.returnValues.user;
							var _myamount = myeve.returnValues.value;
							var _mychainid = myeve.returnValues.chainID;
							//console.log(">>>>>### TokenIn eventlen, k, 	 id, Order Id >>>>",myeventlen, k, _mychainid, _myorderid);
							/// MIN AMOUNT CHECK CONDITION 
							var _check = false;														 
							if((_mytokenAddress === DAI_TOKEN_ADDRESS.toString()) && (! BigNumber(_myamount).lt(MIN_DAI))){								
								_check = true;
								console.log(">>>> _check DAI Token >>>", _check);
							}
							if((_mytokenAddress === PAX_TOKEN_ADDRESS.toString()) && (! BigNumber(_myamount).lt(MIN_PAX))){
								_check = true;
								console.log(">>>> _check PAX Token >>>", _check);
							}
							if((_mytokenAddress === USDC_TOKEN_ADDRESS.toString()) && (! BigNumber(_myamount).lt(MIN_USDC))){
								_check = true;
								console.log(">>>> _check USDC TOKEN >>>", _check);
							}
							if((_mytokenAddress === USDT_TOKEN_ADDRESS.toString()) && (! BigNumber(_myamount).lt(MIN_USDT))){
								_check = true;
								console.log(">>>> _check USDT Token >>>", _check);
							}														
							///
							if((_mychainid) && (_check)){
								console.log("!!!!!! tokenAddress >>>>>", _mytokenAddress);
								var _ary = [DAI_TOKEN_ADDRESS.toString(), PAX_TOKEN_ADDRESS.toString(), USDC_TOKEN_ADDRESS.toString(), USDT_TOKEN_ADDRESS.toString()];
								if(_ary.includes(_mytokenAddress)){							 
									console.log("<<<<@>>>> Looking for ---->>>>", _mytokenAddress);						
									try{
										console.log("~~~~~TokenIn EVENT >>>>_mytokenAddress ~~~~~",_mytokenAddress);
										(async()=>{																																			 		
										   var cnt = await db_select(_mychainid, _myorderid, _mysendcoinsTo, _myamount, _mytokenAddress, secretText).catch(console.log);											      											   
										})();									   										   
									}catch(e){
										console.log(">>>>>Catch >>>>",e);									
									}																
								}else{
									console.log(">>>> not matched !!");
								}
							}else{
								console.log(">>> TOKENIN >>>> In for loop, _orderid, _mychainid,  _myamount, k >>>>", _myorderid, _mychainid, _myamount, k);						
							}							
						}													 												
		 		});
		 }catch(e){	console.error("<<<< Error >>>>",e); }	 	 	 
}

// DONE changes
async function no_records_found_unfreeze_row(){
	var con6 = mysql.createConnection(DB_CONFIG);
	const query = util.promisify(con6.query).bind(con6);
	const insertquery = util.promisify(con6.query).bind(con6);	
	try{		  	
			var _mywhereclause=" walletid='"+process.env.ADMIN_WALLET+"' AND chainid="+parseInt(process.env.CHAIN_ID);
			var unfreeze_query="UPDATE "+process.env.NONCE_ADMIN_TABLE+" SET isFrozen=0 AND freezetime=NULL WHERE "+_mywhereclause;
			console.log(">>>>> UNFREEZE QUERY >>>>>", unfreeze_query);			
			await query(unfreeze_query).catch(console.log);		
	}catch(e){
			console.error("ERROR SQL>>Catch",e);
	}finally{
			con6.end();			
	}	
}

// Changes Done
async function	db_select(chainid, orderid, sendcoinsTo, amount, mytokenAddress, secretText){	
	var con6 = mysql.createConnection(DB_CONFIG);
	const query = util.promisify(con6.query).bind(con6);
	const insertquery = util.promisify(con6.query).bind(con6);	
	try{
			var _whereclause = " where chainid="+parseInt(chainid)+" AND orderid="+parseInt(orderid);
			var select_query = "SELECT count(orderid) as rec FROM "+process.env.RINKEBY_CONTRACT_ORDERS_TABLE+" "+_whereclause;
			console.log(">>>>>> select_query >>>>>",select_query);			
			var records = await query(select_query).catch(console.log);			
			if(parseInt(records[0].rec) < 1){
				var insert_query = "INSERT INTO "+process.env.RINKEBY_CONTRACT_ORDERS_TABLE+" (`chainid`,`orderid`,`transactionSent`,`secretText`) VALUES ("+chainid+","+orderid+",0,"+secretText+")";
				console.log(">>> Inserting record, orderid, chainid >>>",orderid, chainid);
				await insertquery(insert_query).catch(console.log);				
				var z = await company_bridge_send_method(mytokenAddress, sendcoinsTo, amount, orderid, chainid).catch(console.log);				
			}else{
				console.log(">>> Skipping already in database, orderid, chainid ",orderid, chainid);
			}
	}catch(e){
			console.error("ERROR SQL>>Catch",e);
	}finally{
			con6.end();			
	}			
}

async function	db_select_coinin(chainid, orderid, sendcoinsTo, amount, secretText){	
	var con6 = mysql.createConnection(DB_CONFIG);
	const query = util.promisify(con6.query).bind(con6);
	const insertquery = util.promisify(con6.query).bind(con6);	
	try{
			var _whereclause = " where chainid="+parseInt(chainid)+" AND orderid="+parseInt(orderid);
			var select_query = "SELECT count(orderid) as rec FROM "+process.env.RINKEBY_CONTRACT_ORDERS_TABLE+" "+_whereclause;
			console.log(">>>>>> select_query >>>>>",select_query);			
			var records = await query(select_query).catch(console.log);			
			if(parseInt(records[0].rec) < 1){
				var insert_query = "INSERT INTO "+process.env.RINKEBY_CONTRACT_ORDERS_TABLE+" (`chainid`,`orderid`,`transactionSent`,`secretText`) VALUES ("+chainid+","+orderid+",0,"+secretText+")";	
				console.log(">>> Inserting record, orderid, chainid >>>",orderid, chainid);
				await insertquery(insert_query).catch(console.log);		
				var z = await bridge_sendmethod(sendcoinsTo, amount, orderid, chainid).catch(console.log);				
			}else{
				console.log(">>> Skipping already in database, orderid, chainid ",orderid, chainid);
			}
	}catch(e){
			console.error("ERROR SQL>>Catch",e);
	}finally{
			con6.end();			
	}			
}


///Get frozenWallets and which freezetime > 10 mins
async function	db_select_frozenWallets(){
	var con = mysql.createConnection(DB_CONFIG);
	const query = util.promisify(con.query).bind(con);	
	try{	
			var _wherecond = " isFrozen=1 AND chainid="+chainid+" AND freezetime<(UNIX_TIMESTAMP()-600)";
			var select_query = "SELECT walletid, chainid, nonce from "+process.env.NONCE_ADMIN_TABLE+" WHERE "+_wherecond;						
			var wallets = await query(select_query);	
			
			//console.log(">>>>> wallets >>>>", wallets);
			return wallets;
	}catch(e){
			console.error("ERROR SQL>>Catch",e);
	}finally{
			con.end();			
	}
}

async function unfreezeWallet(_chainid, _walletid){
	console.log("IN UnfreezeWallet function >>> _chainid, _walletid >>>>",_chainid, _walletid);
	var con8 = mysql.createConnection(DB_CONFIG);	
	const query8 = util.promisify(con8.query).bind(con8);	
	try{	
			var _wherecond = " walletid='"+_walletid+"' AND chainid IN (34,4,97,137,256,80001) AND freezetime<(UNIX_TIMESTAMP()-600)";
			var update_query = "UPDATE "+process.env.NONCE_ADMIN_TABLE+" SET isFrozen=0,freezetime=0,nonce=NULL WHERE "+_wherecond;						
			console.log("---------------------------------------------------------------");			
			console.log(">>UNFREEZING...., UPDATE QUERY<<", update_query)			
			var wallets = await query8(update_query);
			console.log("---------------------------------------------------------------");
			return wallets;
	}catch(e){
			console.error("ERROR SQL>>Catch",e);
	}finally{
			con8.end();			
	}
}

async function update_nonce(mychain, mywalletid, mynonce){
	var mycon = mysql.createConnection(DB_CONFIG);
	const myquery = util.promisify(mycon.query).bind(mycon);
	try{
		var _wherestr = " walletid='"+mywalletid+"' AND chainid="+mychain; 			
		var update_query = "UPDATE "+process.env.NONCE_ADMIN_TABLE+" SET nonce="+mynonce+" WHERE "+_wherestr;
		myquery(update_query).catch(console.log);	
	}catch(e){
		console.error("ERROR IN SQL UPDATE NONCE >>",e);	
	}finally{
		mycon.end();	
	}
}

async function remove_orderid_from_orders_table(mychain){
	var mycon = mysql.createConnection(DB_CONFIG);
	const myquery = util.promisify(mycon.query).bind(mycon);
	try{		
 		var delete_query = "Delete from `rinkeby_contract_orders` where `transactionSent`=0 AND `secretText`='"+process.env.secretText+"' AND `chainid`=34";		
		console.log("<<< Query >>>",delete_query);		
		return myquery(delete_query).catch(console.log);		
	}catch(e){
		console.log("ERROR IN SQL DELETE QUERY >>",e);	
	}finally{
		mycon.end();	
	}
}

tryToUnfreezeWallets();

//Every 3 mins
var job = new CronJob('0 */3 * * * *', function() {
	console.log("-----------------------------------------------------------");
   console.log('>>> CRON RUNNING every 3 mins, [ Rinkebytest-singlescript ] >>>>');
   console.log("-----------------------------------------------------------");
   // DONE Changes   
	getAvailableAdminWallet().then(()=>{
			console.log(" >>>> ADMIN_WALLET:, >>>> CHAIN_ID:",process.env.ADMIN_WALLET, process.env.CHAIN_ID);				
			if(process.env.ADMIN_WALLET){
				console.log("--------------------------------------------------");		
				(async()=>{
					console.log("===============================================");					
					await web3.eth.getTransactionCount(process.env.ADMIN_WALLET, "pending").then((z)=>{				
						process.env.lastnonce = parseInt(z);
						freeze_wallet();	
					}).catch(console.log);	
				})();	
			}else{
				console.log(">>> Admin Wallets not available >>>");		
			}	
	}).catch(console.log);  
}, null, true, 'America/Los_Angeles');
job.start()
