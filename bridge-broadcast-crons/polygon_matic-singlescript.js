#!/usr/bin/nodejs

var mysql = require('mysql');
const util = require('util');
require('dotenv').config();
const Web3 = require("web3");
var Tx = require('ethereumjs-tx').Transaction;
var Contract = require('web3-eth-contract');
var CronJob = require('cron').CronJob;

process.env.POLYGON_CONTRACT_ORDERS_TABLE = "polygon_contract_orders";

// Polygon Provider
var PROVIDER = 'https://polygon-rpc.com';
var CONTRACT_ADDR = '0x4a6b64361e7b0ff7E97cB9BEbfb396EA9bA5d793';

var CONTRACT_ADDR_ABI = JSON.parse(JSON.stringify(
    [{
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "uint256",
            "name": "orderID",
            "type": "uint256"
        }, {
            "indexed": true,
            "internalType": "address",
            "name": "user",
            "type": "address"
        }, {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
        }],
        "name": "CoinIn",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "uint256",
            "name": "orderID",
            "type": "uint256"
        }, {
            "indexed": true,
            "internalType": "address",
            "name": "user",
            "type": "address"
        }, {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
        }],
        "name": "CoinOut",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "uint256",
            "name": "orderID",
            "type": "uint256"
        }, {
            "indexed": true,
            "internalType": "address",
            "name": "user",
            "type": "address"
        }, {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
        }],
        "name": "CoinOutFailed",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "address",
            "name": "_from",
            "type": "address"
        }, {
            "indexed": true,
            "internalType": "address",
            "name": "_to",
            "type": "address"
        }],
        "name": "OwnershipTransferred",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "address",
            "name": "signer",
            "type": "address"
        }, {
            "indexed": true,
            "internalType": "bool",
            "name": "status",
            "type": "bool"
        }],
        "name": "SignerUpdated",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "uint256",
            "name": "orderID",
            "type": "uint256"
        }, {
            "indexed": true,
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
        }, {
            "indexed": true,
            "internalType": "address",
            "name": "user",
            "type": "address"
        }, {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
        }, {
            "indexed": false,
            "internalType": "uint256",
            "name": "chainID",
            "type": "uint256"
        }],
        "name": "TokenIn",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "uint256",
            "name": "orderID",
            "type": "uint256"
        }, {
            "indexed": true,
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
        }, {
            "indexed": true,
            "internalType": "address",
            "name": "user",
            "type": "address"
        }, {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
        }, {
            "indexed": false,
            "internalType": "uint256",
            "name": "chainID",
            "type": "uint256"
        }],
        "name": "TokenOut",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "uint256",
            "name": "orderID",
            "type": "uint256"
        }, {
            "indexed": true,
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
        }, {
            "indexed": true,
            "internalType": "address",
            "name": "user",
            "type": "address"
        }, {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
        }, {
            "indexed": false,
            "internalType": "uint256",
            "name": "chainID",
            "type": "uint256"
        }],
        "name": "TokenOutFailed",
        "type": "event"
    }, {
        "inputs": [],
        "name": "acceptOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "_signer",
            "type": "address"
        }, {
            "internalType": "bool",
            "name": "_status",
            "type": "bool"
        }],
        "name": "changeSigner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [],
        "name": "coinIn",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "payable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "user",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "_orderID",
            "type": "uint256"
        }],
        "name": "coinOut",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [],
        "name": "orderID",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "name": "signer",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "tokenAmount",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "chainID",
            "type": "uint256"
        }],
        "name": "tokenIn",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
        }, {
            "internalType": "address",
            "name": "user",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "tokenAmount",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "_orderID",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "chainID",
            "type": "uint256"
        }],
        "name": "tokenOut",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "_newOwner",
            "type": "address"
        }],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "stateMutability": "payable",
        "type": "receive"
    }]
));

var CONTRACTS_ARY = [];
CONTRACTS_ARY[34] = '0x14B55b5Bfa8D442760Fd3e31678F38eF61cDab87'; // Dithereum TEstnet

const BigNumber = require('bignumber.js');

// For Polygon TestNet
var chainid = 137; // Polygon TESTNET
var BRIDGE_CHAIN = 34; // Dithereum TestNet

//// MIN AMOUNT -> BRIDGE UI
const MIN_MATIC = 10000000000000000000;

// ORDERS
var myorderID = [...Array(90000).keys()].toString().split(',');

if (myorderID[0] === '0') {
    myorderID.shift();
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

// TOKEN ADDRESSES -
var MATIC_TOKEN_ADDRESS = "0xaF5945CdA54707E081eC52a79E5cbC19FAA42B57"; // ON DITHEREUM BRIDGE

// for web3 contract object creation  
var CHAINID_URL = [];
//DITHEREUM TESTNET
CHAINID_URL[34] = 'https://node-testnet.dithereum.io';

// CHANGES DONE
async function getAvailableAdminWallet() {
    var con5 = mysql.createConnection(DB_CONFIG);
    const query5 = util.promisify(con5.query).bind(con5);
    try {
        var _mywherecondition = " isFrozen=0 AND chainid=" + chainid + " AND freezetime<(UNIX_TIMESTAMP()-600) limit 1";
        var select_wallet_query = "SELECT * FROM " + process.env.NONCE_ADMIN_TABLE + " WHERE " + _mywherecondition;
        console.log(">>>> Query <<<<#", select_wallet_query);
        var _adminwallet = await query5(select_wallet_query).catch(console.log);
        console.log("<<<< Available Wallet >>>> ", _adminwallet[0]);
        if (_adminwallet[0]) {
            process.env.ADMIN_WALLET = _adminwallet[0].walletid;
            process.env.ADMIN_WALLET_PK = _adminwallet[0].walletpk;
            process.env.CHAIN_ID = _adminwallet[0].chainid;
        } else {
            console.log(">>>>> NOTE:::::::: No Admin wallet available >>>>");
        }
    } catch (e) {
        console.error("ERROR SQL>>Catch", e);
    } finally {
        con5.end();
    }
}

////// Unfreeze Wallets 
function tryToUnfreezeWallets() {
    /// This will remove/unfreeze maximum two wallets if present in noncetable and freezed/locked 
    db_select_frozenWallets().then((frozenWallets) => {
        console.log(">>>>Frozen Wallet Length >>>>", frozenWallets.length);
        if (frozenWallets.length > 0) {
            //console.log(">>>> frozenWallets >>>>",frozenWallets[0]);								
            frozenWallets.forEach((walet) => {
                (async () => {
                    console.log("#>> Walet ##>>", walet);
                    await gTransactionCount(walet).then((transcount) => {
                        console.log("#> Waletid, TransactionCount, walet.nonce, walet.chainid >>>>>", walet.walletid, transcount, walet.nonce, walet.chainid);
                        if ((parseInt(walet.nonce) <= parseInt(transcount)) || (walet.nonce === undefined) || (walet.nonce === null)) {
                            console.log(">>>>> Removing from noncetable and unfreezing for >>> walet.walletid, walet.chainid >>>", walet.walletid, walet.chainid);
                            unfreezeWallet(walet.chainid, walet.walletid);
                        }
                    }).catch(console.log);
                })();
            })
        }
    }).catch(console.log);
}

async function gTransactionCount(mywallet) {
    console.log(">>>>>> mywallet.walletid, mywallet.chainid  >>>>", mywallet.walletid, mywallet.chainid);
    let myweb3 = new Web3(new Web3.providers.HttpProvider(PROVIDER));
    return await myweb3.eth.getTransactionCount(mywallet.walletid, "pending").catch(console.log);
}

process.env.lastnonce = 0;

/// FOR BRIDGE - 
async function getAvailableAdminWallet_bridge(bridgeweb3, _chainid) {
    var con5 = mysql.createConnection(DB_CONFIG);
    const query5 = util.promisify(con5.query).bind(con5);
    try {
        var _xobj = {};
        var _mywherecondition = " isFrozen=0 AND chainid=" + _chainid + " AND freezetime<(UNIX_TIMESTAMP()-600) limit 1";
        var select_wallet_query = "SELECT * FROM " + process.env.NONCE_ADMIN_TABLE + " WHERE " + _mywherecondition;
        console.log(">>>> Bridge Query >>>>", select_wallet_query);
        var _adminwallet = await query5(select_wallet_query).catch(console.log);
        console.log("<<<< Bridge Available Wallet >>>> ", _adminwallet[0]);
        if (_adminwallet[0]) {
            var Objx = JSON.stringify({
                "walletid": _adminwallet[0].walletid,
                "walletpk": _adminwallet[0].walletpk,
                "chainid": _adminwallet[0].chainid,
                "lastnonce": _adminwallet[0].nonce
            });

            if (parseInt(_chainid) == 34) {
                console.log(">>Fetching wallets from db ..Objx, _chainid >>>>", Objx, _chainid);
                process.env.ADMIN_WALLET_BRIDGE_34 = Objx;
                _xobj = JSON.parse(process.env.ADMIN_WALLET_BRIDGE_34);
            }

            console.log(">>>>>>> _xobj['walletid'], _xobj['walletpk']", _xobj['walletid'], _xobj['walletpk']);
            console.log(">>>>>>> _xobj['chainid'], _xobj['lastnonce'] <<<<<<<<", _xobj['chainid'], _xobj['lastnonce']);
            console.log("~~~~~~~ _xobj >>>", JSON.stringify(_xobj));

            // Working here  03 FEB 2022
            await bridgeweb3.eth.getTransactionCount(_xobj['walletid'], "pending").then((z) => {
                console.log(">>>>>>_xobj['walletid'] >>>>>", _xobj['walletid']);
                console.log(">>>>z>>>>", z);
                var nonce1 = (parseInt(_xobj['lastnonce']) > parseInt(z)) ? parseInt(_xobj['lastnonce']) : parseInt(z);
                console.log("--->>>>>> _xobj --->>>>>", _xobj, _xobj['chainid']);
                var Objx2 = JSON.stringify({
                    "walletid": _xobj['walletid'],
                    "walletpk": _xobj['walletpk'],
                    "chainid": _xobj['chainid'],
                    "lastnonce": nonce1
                });
                console.log("###### Objx2 <<<<<", Objx2);
                //var _xobj = {};
                if (_xobj['chainid'] === 34) {
                    process.env.ADMIN_WALLET_BRIDGE_34 = Objx2;
                    _xobj = JSON.parse(process.env.ADMIN_WALLET_BRIDGE_34);
                }

                var _wherestr = " walletid='" + _xobj['walletid'] + "' AND chainid=" + _xobj['chainid'];
                var update_query = "UPDATE " + process.env.NONCE_ADMIN_TABLE + " SET isFrozen=1, freezetime=UNIX_TIMESTAMP() WHERE " + _wherestr;
                console.log(">>>> Bridge Query >>>> Update Query >>>>", update_query);
                query5(update_query).catch(console.log);
            }).catch(console.log);
            ///					
        } else {
            console.log(">$$$< NoTe >$$$<:::::::: No Admin wallet available >$$$<");
            //// NEWLY ADDED
            remove_orderid_from_orders_table(_chainid).then(() => {
                setTimeout(() => {
                    process.exit(1);
                }, 100000);
            });
            ////																	
        }
    } catch (e) {
        console.error("ERROR SQL>>Catch", e);
    } finally {
        con5.end();
    }
}

var filter = {
    'to': CONTRACT_ADDR.toString()
}

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

async function company_bridge_send_method_coinin(_toWallet, _amt, orderid, _chainid) {
    if (!CHAINID_URL[_chainid]) {
        console.log(">>> not valid chainid >>>", _chainid);
        return;
    }

    let bridgeweb3 = new Web3(new Web3.providers.HttpProvider(CHAINID_URL[_chainid]));
    console.log(">>>>>@@@@ CHAINID_URL[_chainid] >>> ", CHAINID_URL[_chainid]);
    web3.eth.handleRevert = true;

    try {
        var company_bridgeinstance = new bridgeweb3.eth.Contract(CONTRACT_ADDR_ABI, CONTRACTS_ARY[_chainid].toString());
    } catch (e) {
        console.log(" >>>>> EEEEE >>>>", e);
    }

    ////////	 	 
    await getAvailableAdminWallet_bridge(bridgeweb3, _chainid).then(() => {
        var _envobj = {};
        console.log("~~~~~~~~~~ GET AvailableAdminWallet ~~~~~~~~~~~");
        if (parseInt(_chainid) == 34) {
            _envobj = process.env.ADMIN_WALLET_BRIDGE_34;
        }
        console.log("_envobj >>>>>", _envobj);

        if (
            (!_envobj)
        ) {
            //console.log("Restarting >>>>");				
            remove_orderid_from_orders_table(_chainid).then(() => {
                setTimeout(() => {
                    process.exit(1);
                }, 120000);
            })
        }

        console.log("~~~~~>>>>>>", _envobj, JSON.parse(_envobj)['walletid']);
        if (typeof(JSON.parse(_envobj)['walletid']) == "undefined") {
            console.log("<<@@@>@@@>>No admin wallet bridge available,Removing orderid from orders_table<<@@@@@@>>");
            remove_orderid_from_orders_table(_chainid).then(() => {
                setTimeout(() => {
                    process.exit(1);
                }, 120000);
            })
        } else {
            var _envobj;
            if (_chainid === 34) {
                _envobj = process.env.ADMIN_WALLET_BRIDGE_34;
            }

            console.log(">! walletid, _chainid, walletid !<", _envobj, _chainid, JSON.parse(_envobj)['walletid']);
            console.log(">JSON.parse(_envobj)['walletpk'], JSON.parse(_envobj)['chainid'], JSON.parse(_envobj)['lastnonce']<", JSON.parse(_envobj)['walletpk'], JSON.parse(_envobj)['chainid'], JSON.parse(_envobj)['lastnonce']);

            if (!_envobj) {
                job.start();
            }
            if ((typeof JSON.parse(_envobj)['lastnonce'] === 'undefined') || (typeof JSON.parse(_envobj)['walletid'] === 'undefined')) {
                process.exit(1);
            }

            console.log(">>>>>>!!!!!!!!!!!!!!!!!!!!!!!!~~~~~~~~~~~~~~~~~~~~~~~~", _chainid, JSON.parse(_envobj)['walletid']);
            var mydata = '';
            var requiredGas = 0;
            _amt = _amt / 1000; // JUST FOR TESTING SMALL AMOUNT AS NOT ENOUGH COINS/TOKENS TO TEST			    
            (async () => {
                mydata = await company_bridgeinstance.methods.tokenOut(MATIC_TOKEN_ADDRESS.toString(), _toWallet.toString(), _amt.toString(), orderid.toString(), _chainid.toString()).encodeABI();
                requiredGas = await company_bridgeinstance.methods.tokenOut(MATIC_TOKEN_ADDRESS, _toWallet, _amt, orderid, _chainid).estimateGas({
                    from: JSON.parse(_envobj)['walletid'].toString()
                }).catch(console.log);
                console.log(">>>> TokenOut Dithereum [Matic] Token >> _toWallet, myData >>>>", _toWallet, mydata);
            })();
            console.log("ReEqueried Gas >>> ", requiredGas);
            requiredGas = (requiredGas > 0) ? (requiredGas + 1000) : 100000;
            console.log("<<@@@>><<@@@>>REQUIRED GAS, bridge_admin_wallet<<@@@>><<@@@>>", requiredGas, JSON.parse(_envobj)['walletid']);

            (async () => {
                await bridgeweb3.eth.getGasPrice().then(gasPrice => {
                    var nonc = (parseInt(JSON.parse(_envobj)['lastnonce']) == 0) ? 1 : JSON.parse(_envobj)['lastnonce'];
                    console.log(">>>>>parseInt(JSON.parse(_envobj)['lastnonce'])...", parseInt(JSON.parse(_envobj)['lastnonce']));
                    const raw_tx = {
                        nonce: web3.utils.toHex(nonc),
                        gasPrice: web3.utils.toHex(gasPrice),
                        gasLimit: requiredGas,
                        from: JSON.parse(_envobj)['walletid'].toString(),
                        to: CONTRACTS_ARY[_chainid],
                        data: mydata,
                        chainId: parseInt(_chainid)
                    };
                    console.log(">>>> RAW TX [raw_tx] >>>>", raw_tx);
                    try {
                        set_ordersTable(parseInt(_chainid), orderid.toString());
                        bridgeweb3.eth.accounts.signTransaction(raw_tx, JSON.parse(_envobj)['walletpk'].toString(), function(error, result) {
                            if (!error) {
                                try {
                                    var serializedTx = result.rawTransaction;
                                    console.log("-->> Signed Transaction -->> Serialized Tx ::", serializedTx);
                                    bridgeweb3.eth.sendSignedTransaction(serializedTx.toString('hex')).on('receipt', console.log);
                                } catch (e) {
                                    console.log(e);
                                }
                            }
                        });
                        var nextnonce = nonc + 1;
                        console.log(">>> Updating nonce >>>", _chainid, JSON.parse(_envobj)['walletid'].toString(), nextnonce);
                        update_nonce(_chainid, JSON.parse(_envobj)['walletid'].toString(), nextnonce);
                    } catch (e) {
                        console.log("##### :::: ERR0R :::: ######", e);
                    }
                })
            })();
        }
    });
}


async function checkLatestBlock() {
    var toblock = await web3.eth.getBlockNumber();
    var fromblock = toblock - 1500;

    console.log(">>TESTING FOR>>toblock>>,fromblock>>", toblock, fromblock);
    getEventData_CoinIn(fromblock, toblock);
}

// cHANGES DONE
async function freeze_wallet() {
    var con8 = mysql.createConnection(DB_CONFIG);
    const query8 = util.promisify(con8.query).bind(con8);
    try {
        var _wherestr = " walletid='" + process.env.ADMIN_WALLET + "' AND chainid=" + process.env.CHAIN_ID;
        var update_query = "UPDATE " + process.env.NONCE_ADMIN_TABLE + " SET isFrozen=1, freezetime=UNIX_TIMESTAMP() WHERE " + _wherestr;
        console.log(">>>> Query >>>> Update Query >>>>", update_query);
        await query8(update_query).catch(console.log);
        checkLatestBlock();
    } catch (e) {
        console.error("ERROR SQL>>Catch", e);
    } finally {
        con8.end();
    }
}

function set_ordersTable(chainid, orderid) {
    var con9 = mysql.createConnection(DB_CONFIG);
    const query9 = util.promisify(con9.query).bind(con9);
    try {
        var _wherestr = " orderid=" + orderid + " AND chainid=" + chainid;
        var update_query = "UPDATE polygon_contract_orders SET transactionSent=1 WHERE " + _wherestr;
        console.log(">>>> Query >>>> Update Query [SET ORDERS_TABLE] >>>>", update_query);
        query9(update_query).catch(console.log);
    } catch (e) {
        console.error("ERROR SQL>>Catch", e);
    } finally {
        con9.end();
    }
}

/// SET THIS FOR EACH CHAIN 
var getwsprovider = () => {
    var httpprovider = new Web3(new Web3.providers.HttpProvider(PROVIDER, options));
    return httpprovider
}
let web3 = new Web3(getwsprovider());

// CoinIn -> TokenOut
async function getEventData_CoinIn(_fromBlock, _toBlock) {
    const myinstance = new web3.eth.Contract(CONTRACT_ADDR_ABI, CONTRACT_ADDR.toString());
    await myinstance.getPastEvents('CoinIn', {
        fromBlock: _fromBlock,
        toBlock: _toBlock
    }, function(error, myevents) {
        //await myinstance.getPastEvents('CoinIn', { fromBlock: 26563028, toBlock: 26563028 }, function(error,myevents){
        console.log("EVENTS >>>>", myevents.blockNumber);
        if (myevents === undefined) {
            return
        }
        var myeventlen = myevents.length;
        process.env.CoinInEventLen = myevents.length;
        if ((parseInt(process.env.CoinInEventLen) === 0) && (parseInt(process.env.CoinInEventLen) === 0)) {
            // UNFREEZE ROW as no events found in specified block range 
            no_records_found_unfreeze_row()
        }
        console.log("=================================================");
        console.log("COIN IN >>> myeventlen >>>>", myeventlen);
        console.log("=================================================");
        var secretText = Math.random(23439, 5654624);
        process.env.secretText = secretText.toString();
        for (var k = 0; k < myeventlen; k++) {
            var myeve = myevents[k];
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            //console.log("Event Details ::: >>>",myeve, myeve.event, myeve.blockNumber);
            console.log("Event Details ::: >>>", myeve.event, myeve.blockNumber);
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            //console.log("~~~~~~~~~~~~~~~~~~~>>> k, myeve >>>",k, myeve);
            var _myorderid = myeve.returnValues.orderID;
            var _mysendcoinsTo = myeve.returnValues.user;
            var _myamount = myeve.returnValues.value;

            if (!BigNumber(_myamount).lt(MIN_MATIC)) {
                console.log(">>>> in minimum amount check condition >>>>");
                try {
                    (async () => {
                        var cnt = await db_coinin_select(BRIDGE_CHAIN, _myorderid, _mysendcoinsTo, _myamount, secretText).catch(console.log);
                    })();
                } catch (e) {
                    console.log(">>>>>Catch >>>>", e);
                }
            } else {
                console.log(">>> Amount is too small / Skipping >>>");
            }
        }
    });
}

// DONE changes
async function no_records_found_unfreeze_row() {
    var con6 = mysql.createConnection(DB_CONFIG);
    const query = util.promisify(con6.query).bind(con6);
    const insertquery = util.promisify(con6.query).bind(con6);
    try {
        var _mywhereclause = " walletid='" + process.env.ADMIN_WALLET + "' AND chainid=" + parseInt(process.env.CHAIN_ID);
        var unfreeze_query = "UPDATE " + process.env.NONCE_ADMIN_TABLE + " SET isFrozen=0 AND freezetime=NULL WHERE " + _mywhereclause;
        console.log(">>>>> UNFREEZE QUERY >>>>>", unfreeze_query);
        await query(unfreeze_query).catch(console.log);
    } catch (e) {
        console.error("ERROR SQL>>Catch", e);
    } finally {
        con6.end();
    }
}


// Changes Done
async function db_coinin_select(chainid, orderid, sendcoinsTo, amount, secretText) {
    var con6 = mysql.createConnection(DB_CONFIG);
    const query = util.promisify(con6.query).bind(con6);
    const insertquery = util.promisify(con6.query).bind(con6);
    try {
        var _whereclause = " where chainid=" + parseInt(chainid) + " AND orderid=" + parseInt(orderid);
        var select_query = "SELECT count(orderid) as rec FROM " + process.env.POLYGON_CONTRACT_ORDERS_TABLE + " " + _whereclause;
        console.log(">>>>>> select_query >>>>>", select_query);
        var records = await query(select_query).catch(console.log);
        console.log(">>>>>> records <<<<<<", records);
        if (parseInt(records[0].rec) < 1) {
            var insert_query = "INSERT INTO " + process.env.POLYGON_CONTRACT_ORDERS_TABLE + " (`chainid`,`orderid`,`transactionSent`,`secretText`) VALUES (" + chainid + "," + orderid + ",0," + secretText + ")";
            console.log(">>> Inserting record, orderid, chainid >>>", orderid, chainid);
            await insertquery(insert_query).catch(console.log);
            var z = await company_bridge_send_method_coinin(sendcoinsTo, amount, orderid, chainid).catch(console.log);
        } else {
            console.log(">>> Skipping already in database, orderid, chainid ", orderid, chainid);
            return 1;
        }
    } catch (e) {
        console.error("ERROR SQL>>Catch", e);
    } finally {
        con6.end();
    }
}


///Get frozenWallets and which freezetime > 10 mins
async function db_select_frozenWallets() {
    var con = mysql.createConnection(DB_CONFIG);
    const query = util.promisify(con.query).bind(con);
    try {
        var _wherecond = " isFrozen=1 AND chainid=" + chainid + " AND freezetime<(UNIX_TIMESTAMP()-600)";
        var select_query = "SELECT walletid, chainid, nonce from " + process.env.NONCE_ADMIN_TABLE + " WHERE " + _wherecond;
        var wallets = await query(select_query);

        //console.log(">>>>> wallets >>>>", wallets);
        return wallets;
    } catch (e) {
        console.error("ERROR SQL>>Catch", e);
    } finally {
        con.end();
    }
}

async function unfreezeWallet(_chainid, _walletid) {
    console.log("IN UnfreezeWallet function >>> _chainid, _walletid >>>>", _chainid, _walletid);
    var con8 = mysql.createConnection(DB_CONFIG);
    const query8 = util.promisify(con8.query).bind(con8);
    try {
        var _wherecond = " walletid='" + _walletid + "' AND chainid IN (34,4,97,137,256,80001) AND freezetime<(UNIX_TIMESTAMP()-600)";
        var update_query = "UPDATE " + process.env.NONCE_ADMIN_TABLE + " SET isFrozen=0,freezetime=0,nonce=NULL WHERE " + _wherecond;
        console.log("------------------------------------------");
        console.log(">>UNFREEZING...., UPDATE QUERY<<", update_query)
        var wallets = await query8(update_query);
        //console.log(">>>>> wallets >>>>", wallets);
        return wallets;
    } catch (e) {
        console.error("ERROR SQL>>Catch", e);
    } finally {
        con8.end();
    }
}

async function update_nonce(mychain, mywalletid, mynonce) {
    var mycon = mysql.createConnection(DB_CONFIG);
    const myquery = util.promisify(mycon.query).bind(mycon);
    try {
        var _wherestr = " walletid='" + mywalletid + "' AND chainid=" + mychain;
        var update_query = "UPDATE " + process.env.NONCE_ADMIN_TABLE + " SET nonce=" + mynonce + " WHERE " + _wherestr;
        myquery(update_query).catch(console.log);
    } catch (e) {
        console.error("ERROR IN SQL UPDATE NONCE >>", e);
    } finally {
        mycon.end();
    }
}

async function remove_orderid_from_orders_table(mychain) {
    var mycon = mysql.createConnection(DB_CONFIG);
    const myquery = util.promisify(mycon.query).bind(mycon);
    try {
        var delete_query = "Delete from `polygon_contract_orders` where `transactionSent`=0 AND `secretText`='" + process.env.secretText + "' AND `chainid`=" + mychain;
        console.log("<<< Query >>>", delete_query);
        return myquery(delete_query).catch(console.log);
    } catch (e) {
        console.log("ERROR IN SQL DELETE QUERY >>", e);
    } finally {
        mycon.end();
    }
}

tryToUnfreezeWallets();

//Every 3 mins
var job = new CronJob('0 */3 * * * *', function() {
    console.log("-------------------------------------");
    console.log('Cron running, every 3 mins [ Polygon Matic Single Script ]');
    console.log("-------------------------------------");
    // DONE Changes
    getAvailableAdminWallet().then(() => {
        console.log(" >>>> ADMIN_WALLET:, >>>> CHAIN_ID:", process.env.ADMIN_WALLET, process.env.CHAIN_ID);
        if (process.env.ADMIN_WALLET) {
            (async () => {
                await web3.eth.getTransactionCount(process.env.ADMIN_WALLET, "pending").then((z) => {
                    process.env.lastnonce = parseInt(z);
                    freeze_wallet();
                }).catch(console.log);
            })();
        } else {
            console.log(">>> Admin Wallet not available >>>");
            process.exit(1);
        }
    }).catch(console.log);
}, null, true, 'America/Los_Angeles');

job.start();
