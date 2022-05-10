const ethers = require("ethers");
const gas = require('../lib/gasPrice.js');
const price = require('../lib/coinPrice.js')
var fs = require('fs');
require("dotenv").config()

//Sequencer Inbox ABI = https://etherscan.io/address/0x9685e7281Fb1507B6f141758d80B08752faF0c43#code
const seqDeployerABI = 
[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"firstMessageNum","type":"uint256"},{"indexed":true,"internalType":"bytes32","name":"beforeAcc","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"newMessageCount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalDelayedMessagesRead","type":"uint256"},{"indexed":false,"internalType":"bytes32[2]","name":"afterAccAndDelayed","type":"bytes32[2]"},{"indexed":false,"internalType":"uint256","name":"seqBatchIndex","type":"uint256"}],"name":"DelayedInboxForced","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"addr","type":"address"},{"indexed":false,"internalType":"bool","name":"isSequencer","type":"bool"}],"name":"IsSequencerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newMaxDelayBlocks","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newMaxDelaySeconds","type":"uint256"}],"name":"MaxDelayUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"firstMessageNum","type":"uint256"},{"indexed":true,"internalType":"bytes32","name":"beforeAcc","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"newMessageCount","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"afterAcc","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"transactions","type":"bytes"},{"indexed":false,"internalType":"uint256[]","name":"lengths","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"sectionsMetadata","type":"uint256[]"},{"indexed":false,"internalType":"uint256","name":"seqBatchIndex","type":"uint256"},{"indexed":false,"internalType":"address","name":"sequencer","type":"address"}],"name":"SequencerBatchDelivered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"firstMessageNum","type":"uint256"},{"indexed":true,"internalType":"bytes32","name":"beforeAcc","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"newMessageCount","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"afterAcc","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"seqBatchIndex","type":"uint256"}],"name":"SequencerBatchDeliveredFromOrigin","type":"event"},{"inputs":[{"internalType":"bytes","name":"transactions","type":"bytes"},{"internalType":"uint256[]","name":"lengths","type":"uint256[]"},{"internalType":"uint256[]","name":"sectionsMetadata","type":"uint256[]"},{"internalType":"bytes32","name":"afterAcc","type":"bytes32"}],"name":"addSequencerL2Batch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"transactions","type":"bytes"},{"internalType":"uint256[]","name":"lengths","type":"uint256[]"},{"internalType":"uint256[]","name":"sectionsMetadata","type":"uint256[]"},{"internalType":"bytes32","name":"afterAcc","type":"bytes32"}],"name":"addSequencerL2BatchFromOrigin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"delayedInbox","outputs":[{"internalType":"contract IBridge","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_totalDelayedMessagesRead","type":"uint256"},{"internalType":"uint8","name":"kind","type":"uint8"},{"internalType":"uint256[2]","name":"l1BlockAndTimestamp","type":"uint256[2]"},{"internalType":"uint256","name":"inboxSeqNum","type":"uint256"},{"internalType":"uint256","name":"gasPriceL1","type":"uint256"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"bytes32","name":"messageDataHash","type":"bytes32"},{"internalType":"bytes32","name":"delayedAcc","type":"bytes32"}],"name":"forceInclusion","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getInboxAccsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"inboxAccs","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IBridge","name":"_delayedInbox","type":"address"},{"internalType":"address","name":"_sequencer","type":"address"},{"internalType":"address","name":"_rollup","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isMaster","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isSequencer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxDelayBlocks","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxDelaySeconds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"messageCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"postUpgradeInit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"proof","type":"bytes"},{"internalType":"uint256","name":"_messageCount","type":"uint256"}],"name":"proveBatchContainsSequenceNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"proof","type":"bytes"},{"internalType":"uint256","name":"_messageCount","type":"uint256"}],"name":"proveInboxContainsMessage","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rollup","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sequencer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"bool","name":"newIsSequencer","type":"bool"}],"name":"setIsSequencer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newMaxDelayBlocks","type":"uint256"},{"internalType":"uint256","name":"newMaxDelaySeconds","type":"uint256"}],"name":"setMaxDelay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalDelayedMessagesRead","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
const arbitrumSequencerInboxAddress = "0x4c6f947ae67f572afa4ae0730947de7c874f95ef";

/*
Set Infura Provider to query blockchain
*/
async function getProvider(network){
    var provider = new ethers.providers.InfuraProvider(network, process.env.INFURA_API_KEY);
    return provider
}


/*
Decode contract with abi
*/
async function getContract(address, abi, provider){
    var contract = new ethers.Contract(
        address,
        abi,
        provider
      );
    return contract
}

/*
Get a lower bound estimate for the block number to search up to.
*/
function getEstimatedFromBlock(toBlockHeight, numOfBatches){
    // arbitrum posts to l1 every ~7 minutes but this can vary due to gas fees
    // this calculations assumes arbitrum posts every 15 minutes to account for fluctuation
    // calc = (numOfBatches * arbitrum_time_to_post_to_l1) / average_ethereum_block_time
    return toBlockHeight - parseInt((numOfBatches * 900)/15)
}

/*
Go through batches in inbox and extra relevant data such as the gasUsed.
*/
async function getCleanedBatches(numOfBatches, eventLogs, contract, provider){
    var batches = [];

    for (let i = 0; i < numOfBatches; i++) {
        batch = eventLogs[i];
        //decode values in 0x..
        var parsed_batch = contract.interface.parseLog({
            topics: batch.topics,
            data: batch.data,
          });

        
        //get total number of tx's in batch by 
        var seqBatchIndex = parsed_batch.args.seqBatchIndex;
        var firstMessageNum = parsed_batch.args.firstMessageNum;
        var newMessageCount = parsed_batch.args.newMessageCount;
        var seqBatchIndex = parsed_batch.args.seqBatchIndex;

        var tx_receipt = await provider.getTransactionReceipt(
          batch.transactionHash
        );
        
        var block_data = await provider.getBlock(
            batch.blockNumber
          );


        batches.push({
            blockNumber: tx_receipt.logs[0].blockNumber,
            timestamp: block_data.timestamp,
            seqBatchIndex: seqBatchIndex.toNumber(),
            firstMessageNum: firstMessageNum.toNumber(),
            newMessageCount: newMessageCount.toNumber(),
            gasUsed: tx_receipt.gasUsed.toNumber() //cumulative gas is total gas in block, gasUsed is for specific transaction
        })
      
    }
    return batches
}

function getTransactionCost(gas_price, eth_price, average_gas){
    // ETH PRICE (USD) * GWEI PRICE * GAS USED / 10^9 (gwei) = Price in dollars 
    return (gas_price * eth_price * average_gas) / 1000000000
}


function saveJson(json){
    fs.writeFile ("./data/arbitrum3000.json", JSON.stringify(json), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
};

/*
Take all batches and calculate the total gas and total transactions.
*/
async function processBatches(batches){
    var total_txs = 0
    var total_gas = 0
    var timestamp_to_batch = {}

    for (const batch of batches){
        transactions = batch.newMessageCount - batch.firstMessageNum
        total_txs += transactions
        total_gas += batch.gasUsed
        
        //[timestamp -> (batch.blockNumber,transactions, batch.gasUsed/transactions)]
        timestamp_to_batch[batch.timestamp] = [batch.blockNumber, transactions, batch.gasUsed/transactions]
        console.log(`For block ${batch.blockNumber} there were ${transactions} transactions and consumed ${batch.gasUsed} gas with ${batch.gasUsed/transactions} gas used per transaction`)
    }

    gas_price = await gas.fetchGas() //gas cost in gwei
    eth_price = await price.fetchPrice("ethereum", "usd")
    
    saveJson(timestamp_to_batch)

    gas_cost_in_usd = getTransactionCost(gas_price, eth_price, total_gas/total_txs)
    console.log(`Over ${batches.length} batches the average gas used per transaction was ${total_gas/total_txs} costing on average $${gas_cost_in_usd}`)
}

async function main(){
    const provider = await getProvider("mainnet");
    const arbitrumContract = await getContract(arbitrumSequencerInboxAddress, seqDeployerABI, provider);
    var toBlockHeight = await provider.getBlockNumber();
    var numOfBatches = 3000; //the number of batches you want to get the average gas for
    var fromBlockHeight = getEstimatedFromBlock(toBlockHeight, numOfBatches);
    
    //options.topics = sha3 hashing of event signature
    const options = arbitrumContract.filters.SequencerBatchDeliveredFromOrigin();
    const eventLogs = await provider.getLogs({
        topics: options.topics,
        address: options.address,
        toBlock: toBlockHeight,
        fromBlock: fromBlockHeight,
      }); 

    var batches = await getCleanedBatches(numOfBatches, eventLogs, arbitrumContract, provider);
    await processBatches(batches);
}


main();