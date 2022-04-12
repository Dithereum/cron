#!/usr/bin/env nodejs

const mysql = require('mysql');
const util = require('util');
const Web3 = require("web3");
const TronWeb = require('tronweb');

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

var TRON_CHAIN_ID = 9999;
var DTH_CHAIN_ID = 34; // chain ID 34 is for the Dithereum TESTNET
var DEFAULT_COIN = "TRX";
var FROM_TOKEN = "TRX";
var TO_TOKEN = "TRX";
var CONTRACT_ADDR = "TANjEAzJo3tw2dWwvQUBFR8xm7jr6AtA4W"; //TRX
var CONTRACT_ADDR_ABI = [{
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
    }],
    "name": "signer",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "tokenAddress",
        "type": "address"
    }, {
        "name": "user",
        "type": "address"
    }, {
        "name": "tokenAmount",
        "type": "uint256"
    }, {
        "name": "_orderID",
        "type": "uint256"
    }, {
        "name": "chainID",
        "type": "uint256"
    }],
    "name": "tokenOut",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_signer",
        "type": "address"
    }, {
        "name": "_status",
        "type": "bool"
    }],
    "name": "changeSigner",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "acceptOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "orderID",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "coinIn",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "tokenAddress",
        "type": "address"
    }, {
        "name": "tokenAmount",
        "type": "uint256"
    }, {
        "name": "chainID",
        "type": "uint256"
    }],
    "name": "tokenIn",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_newOwner",
        "type": "address"
    }],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "user",
        "type": "address"
    }, {
        "name": "amount",
        "type": "uint256"
    }, {
        "name": "_orderID",
        "type": "uint256"
    }],
    "name": "coinOut",
    "outputs": [{
        "name": "",
        "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "orderID",
        "type": "uint256"
    }, {
        "indexed": true,
        "name": "user",
        "type": "address"
    }, {
        "indexed": false,
        "name": "value",
        "type": "uint256"
    }],
    "name": "CoinIn",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "orderID",
        "type": "uint256"
    }, {
        "indexed": true,
        "name": "user",
        "type": "address"
    }, {
        "indexed": false,
        "name": "value",
        "type": "uint256"
    }],
    "name": "CoinOut",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "orderID",
        "type": "uint256"
    }, {
        "indexed": true,
        "name": "user",
        "type": "address"
    }, {
        "indexed": false,
        "name": "value",
        "type": "uint256"
    }],
    "name": "CoinOutFailed",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "orderID",
        "type": "uint256"
    }, {
        "indexed": true,
        "name": "tokenAddress",
        "type": "address"
    }, {
        "indexed": true,
        "name": "user",
        "type": "address"
    }, {
        "indexed": false,
        "name": "value",
        "type": "uint256"
    }, {
        "indexed": false,
        "name": "chainID",
        "type": "uint256"
    }],
    "name": "TokenIn",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "orderID",
        "type": "uint256"
    }, {
        "indexed": true,
        "name": "tokenAddress",
        "type": "address"
    }, {
        "indexed": true,
        "name": "user",
        "type": "address"
    }, {
        "indexed": false,
        "name": "value",
        "type": "uint256"
    }, {
        "indexed": false,
        "name": "chainID",
        "type": "uint256"
    }],
    "name": "TokenOut",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "orderID",
        "type": "uint256"
    }, {
        "indexed": true,
        "name": "tokenAddress",
        "type": "address"
    }, {
        "indexed": true,
        "name": "user",
        "type": "address"
    }, {
        "indexed": false,
        "name": "value",
        "type": "uint256"
    }, {
        "indexed": false,
        "name": "chainID",
        "type": "uint256"
    }],
    "name": "TokenOutFailed",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "_from",
        "type": "address"
    }, {
        "indexed": true,
        "name": "_to",
        "type": "address"
    }],
    "name": "OwnershipTransferred",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "signer",
        "type": "address"
    }, {
        "indexed": true,
        "name": "status",
        "type": "bool"
    }],
    "name": "SignerUpdated",
    "type": "event"
}];


const tronWeb = new TronWeb({
    fullHost: 'https://api.shasta.trongrid.io',
    headers: {
        "TRON-PRO-API-KEY": '7ecfcb7a-a43c-4967-9ae1-8efd5b2bf7a4'
    },
    privateKey: 'b216e46c7f01466eb6cc537e885d7c72c82bffe9c364a2fddc4480245e5723b4'
});

var con5 = mysql.createConnection(DB_CONFIG);
const query5 = util.promisify(con5.query).bind(con5);

execute();

async function execute() {
    var myblock = await tronWeb.trx.getCurrentBlock().catch(console.log);
    var currentBlock = myblock.block_header.raw_data.number;
    console.log(">>>>> Curr Block >>>>>", currentBlock);
    currentBlock = currentBlock - 5; //we will go 5 blocks in the past, just for safe side
    try {
        var select_wallet_query = "SELECT trx FROM lastblock";
        var lastBlockData = await query5(select_wallet_query).catch(console.log);

        console.log(">>>> TRX Syncing_trx.js >>>> rrr");
        console.log(lastBlockData);
        console.log(currentBlock);

        if (lastBlockData[0]) {
            //var lastBlockDatabase = lastBlockData[0].trx;
            //console.log(">>>> lastBlockData[0].trx >>>>", lastBlockData[0].trx);

            //updating the current block in the database
            await lastBlockWorked(currentBlock);
            var lastBlockDatabase = currentBlock - 5000;

            await getEventTRX_CoinIn(lastBlockDatabase, currentBlock);
        }

    } catch (e) {
        console.log(e);

    } finally {
        con5.end();
    }
}


async function getEventTRX_CoinIn(_fromBlock, _toBlock) {
    try {
        var result = await tronWeb.getEventResult(CONTRACT_ADDR.toString(), {
            eventName: "CoinIn"
        });
        result.forEach((eve) => {
            if ((eve.block >= _fromBlock) && (eve.block <= _toBlock)) {
                var _blkNumber = eve.block;
                var _txnHash = eve.transaction;
                var _orderid = eve.result.orderID;
                var _userWallet = eve.result.user;
                var _amount = eve.result.value;
                var _toTxnHash = '';
                var _toAmount = 0.0;

                if (parseInt(_amount)) {
                    try {
                        var select_query = "SELECT count(*) as cnt from bridge_transactions where `fromTxnHash`='" + _txnHash.toString() + "'";
                        var con3 = mysql.createConnection(DB_CONFIG);
                        const query3 = util.promisify(con3.query).bind(con3);
                        async function x() {
                            return await query3(select_query);
                        }
                        x().then((record) => {
                            if (typeof record[0] !== 'undefined') {
                                var cnt = parseInt(record[0].cnt);
                                if (cnt < 1) {
                                    var insert_query = "INSERT INTO bridge_transactions (`userWallet`,`orderID`,`fromChain`,`fromCurrency`,`fromTxnHash`,`fromAmount`,`toChain`,`toCurrency`,`toTxnHash`,`toAmount`) VALUES ('" + _userWallet + "'," + _orderid + "," + TRON_CHAIN_ID + ",'" + DEFAULT_COIN + "','" + _txnHash + "'," + _amount + "," + DTH_CHAIN_ID + ",'" + DEFAULT_COIN + "','" + _toTxnHash + "','" + _toAmount + "')";
                                    var w = async function y() {
                                        return await db_query(insert_query).catch(console.log);
                                    }
                                    w();
                                }
                            }
                        });
                    } catch (e) {
                        console.log(">>>>>Catch >>>>", e);
                    }
                } else {
                    console.log(">>>> CoinIn >>>>In for loop, _orderid, _txnHash,  _amount, i >>>>", _orderid, _txnHash, _amount, i);
                }
            } else {
                // skipping 
                console.log("Skipping Block >>>", eve.block);
            }
        });
    } catch (e) {
        console.log("E >>>>", e);
    }
}


async function lastBlockWorked(_lastBlocknumber) {
    _lastBlocknumber = _lastBlocknumber ? _lastBlocknumber : 0;
    var sql = "UPDATE lastblock SET trx=" + _lastBlocknumber + " LIMIT 1";
    console.log("<<< SQL >>>", sql);
    return db_query(sql, "UpdateQuery");
}


async function db_query(_sql, _querytype) {
    var con = mysql.createConnection(DB_CONFIG);
    try {
        con.connect(function(err) {
            if (err) {
                console.log(">>> Error DB connect:", err);
            }
            console.log(">>> Connected to dithereum database:>>>");
            try {
                con.query(_sql, function(err, result) {
                    if (err) {
                        console.log(">>> Error Occured:", err);
                    } else {
                        console.log(">>> Query Executed >>", _querytype);
                        con.end();
                    }
                    setTimeout(() => {}, 2000);
                });
            } catch (e) {
                console.log(">>>In catchblock>>>", e);
            }
        });
    } catch (e) {
        console.log(">>>>>>EEEEEEE>>>>>", e);
    }
}
