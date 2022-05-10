const starknetLib = require('../lib/starknetLib.js');
const etherScan = require('../lib/etherScan.js');
const ethers = require("ethers");
const gas = require('../lib/gasPrice.js');
const price = require('../lib/coinPrice.js')
const fs = require('fs');

//https://etherscan.io/address/0x944960b90381d76368aecE61F269bD99FFfd627e
const starknetCoreContractABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"from_address","type":"uint256"},{"indexed":true,"internalType":"address","name":"to_address","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"payload","type":"uint256[]"}],"name":"ConsumedMessageToL1","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from_address","type":"address"},{"indexed":true,"internalType":"uint256","name":"to_address","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"selector","type":"uint256"},{"indexed":false,"internalType":"uint256[]","name":"payload","type":"uint256[]"}],"name":"ConsumedMessageToL2","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"from_address","type":"uint256"},{"indexed":true,"internalType":"address","name":"to_address","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"payload","type":"uint256[]"}],"name":"LogMessageToL1","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from_address","type":"address"},{"indexed":true,"internalType":"uint256","name":"to_address","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"selector","type":"uint256"},{"indexed":false,"internalType":"uint256[]","name":"payload","type":"uint256[]"}],"name":"LogMessageToL2","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"acceptedGovernor","type":"address"}],"name":"LogNewGovernorAccepted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"nominatedGovernor","type":"address"}],"name":"LogNominatedGovernor","type":"event"},{"anonymous":false,"inputs":[],"name":"LogNominationCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"operator","type":"address"}],"name":"LogOperatorAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"operator","type":"address"}],"name":"LogOperatorRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"removedGovernor","type":"address"}],"name":"LogRemovedGovernor","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"stateTransitionFact","type":"bytes32"}],"name":"LogStateTransitionFact","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"globalRoot","type":"uint256"},{"indexed":false,"internalType":"int256","name":"sequenceNumber","type":"int256"}],"name":"LogStateUpdate","type":"event"},{"inputs":[{"internalType":"uint256","name":"from_address","type":"uint256"},{"internalType":"uint256[]","name":"payload","type":"uint256[]"}],"name":"consumeMessageFromL2","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"finalize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"identify","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes","name":"data","type":"bytes"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isFinalized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isFrozen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"testedOperator","type":"address"}],"name":"isOperator","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"msgHash","type":"bytes32"}],"name":"l1ToL2Messages","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"msgHash","type":"bytes32"}],"name":"l2ToL1Messages","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"programHash","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOperator","type":"address"}],"name":"registerOperator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"to_address","type":"uint256"},{"internalType":"uint256","name":"selector","type":"uint256"},{"internalType":"uint256[]","name":"payload","type":"uint256[]"}],"name":"sendMessageToL2","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newProgramHash","type":"uint256"}],"name":"setProgramHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"starknetAcceptGovernance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"starknetCancelNomination","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"testGovernor","type":"address"}],"name":"starknetIsGovernor","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newGovernor","type":"address"}],"name":"starknetNominateNewGovernor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"governorForRemoval","type":"address"}],"name":"starknetRemoveGovernor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stateRoot","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"stateSequenceNumber","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"removedOperator","type":"address"}],"name":"unregisterOperator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int256","name":"sequenceNumber","type":"int256"},{"internalType":"uint256[]","name":"programOutput","type":"uint256[]"},{"internalType":"uint256","name":"onchainDataHash","type":"uint256"},{"internalType":"uint256","name":"onchainDataSize","type":"uint256"}],"name":"updateState","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const starknetCoreAddress = "0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4";

//https://etherscan.io/address/0x9bca5c55137057208ee5b14f3e269133bdcac1f8/advanced
const gpsVerifierABI = [{"inputs":[{"internalType":"address","name":"bootloaderProgramContract","type":"address"},{"internalType":"address","name":"memoryPageFactRegistry_","type":"address"},{"internalType":"address[]","name":"cairoVerifierContracts","type":"address[]"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"factHash","type":"bytes32"},{"indexed":false,"internalType":"bytes32[]","name":"pagesHashes","type":"bytes32[]"}],"name":"LogMemoryPagesHashes","type":"event"},{"inputs":[],"name":"hasRegisteredFact","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"identify","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32","name":"fact","type":"bytes32"}],"name":"isValid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"proofParams","type":"uint256[]"},{"internalType":"uint256[]","name":"proof","type":"uint256[]"},{"internalType":"uint256[]","name":"taskMetadata","type":"uint256[]"},{"internalType":"uint256[]","name":"cairoAuxInput","type":"uint256[]"},{"internalType":"uint256","name":"cairoVerifierId","type":"uint256"}],"name":"verifyProofAndRegister","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const gpsStatementVerifierAddress = "0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60";

//https://etherscan.io/address/0x96375087b2f6efc59e5e0dd5111b4d090ebfdd8b#code
const memoryPageFactRegistryABI = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"factHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"memoryHash","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"prod","type":"uint256"}],"name":"LogMemoryPageFactContinuous","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"factHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"memoryHash","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"prod","type":"uint256"}],"name":"LogMemoryPageFactRegular","type":"event"},{"inputs":[],"name":"hasRegisteredFact","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"fact","type":"bytes32"}],"name":"isValid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"startAddr","type":"uint256"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"uint256","name":"z","type":"uint256"},{"internalType":"uint256","name":"alpha","type":"uint256"},{"internalType":"uint256","name":"prime","type":"uint256"}],"name":"registerContinuousMemoryPage","outputs":[{"internalType":"bytes32","name":"factHash","type":"bytes32"},{"internalType":"uint256","name":"memoryHash","type":"uint256"},{"internalType":"uint256","name":"prod","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"memoryPairs","type":"uint256[]"},{"internalType":"uint256","name":"z","type":"uint256"},{"internalType":"uint256","name":"alpha","type":"uint256"},{"internalType":"uint256","name":"prime","type":"uint256"}],"name":"registerRegularMemoryPage","outputs":[{"internalType":"bytes32","name":"factHash","type":"bytes32"},{"internalType":"uint256","name":"memoryHash","type":"uint256"},{"internalType":"uint256","name":"prod","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]
const memoryPageFactRegistryAddress = "0x96375087b2F6eFc59e5e0dd5111B4d090EBFDD8B";

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

function saveJson(json){
  fs.writeFile ("./data/starknet500.json", JSON.stringify(json), function(err) {
      if (err) throw err;
      console.log('complete');
      }
  );
};

/*
Estimated block number to cover all batches
*/
function getEstimatedFromBlock(toBlockHeight, numOfBatches){
    // calc = (numOfBatches * starknet_time_to_post_to_l1) / average_ethereum_block_time
    // posts to the core contract are variable depending on txs on L2 but
    // in my calculation I'm going to say the core contract posts twice every 10 hours to give
    // a loose upper bound #10hr

    return toBlockHeight - parseInt((numOfBatches * 36000)/15)
}


/*
Return Event Logs based on Options
*/
async function getEventLogs(provider, options, toBlockHeight, fromBlockHeight){
  var err = 0;
  do {
    try{
      var logs = provider.getLogs({
        topics: options.topics,
        address: options.address,
        toBlock: toBlockHeight,
        fromBlock: fromBlockHeight,
      }); 
      err = 0;
    }
    catch (e){
      err = 1;
    }
  } while(err == 1)

  return logs
}

/*
Retrieve State Transition Facts from the Starknet Core Contract
*/
async function getStateTransitionFacts(numOfBatches, toBlockHeight, fromBlockHeight, starknetCoreContract, provider){
  var err = 0;
  var options = starknetCoreContract.filters.LogStateTransitionFact();

  do{
    try{
      var eventLogs = await getEventLogs(provider, options, toBlockHeight, fromBlockHeight)
      err = 0;
    } catch (e){
      err = 1
    }
  } while(err == 1);

  var batches = {};
  var count = 0

  while (count != numOfBatches){
      batch = eventLogs[eventLogs.length - 1 - count]
      
      do{
        try{
          var eth_block = await provider.getBlock(batch.blockNumber)
          err = 0;
        } catch (e){
          err = 1
        }
      } while(err == 1);

      
      var eth_block_time = eth_block.timestamp


      var parsed_batch = starknetCoreContract.interface.parseLog({
          topics: batch.topics,
          data: batch.data,
        });

      var stateTransitionFact = parsed_batch.args.stateTransitionFact
      var transactionHash = batch.transactionHash
      
      batches[transactionHash] = [stateTransitionFact,eth_block_time]

      count += 1
  }

  return batches
}

/*
Retrieve Sequence Numbers (Starknet Sequencer Block Number) from the Starknet Core Contract
*/
async function getSequenceNumbers(numOfBatches, toBlockHeight, fromBlockHeight, starknetCoreContract, provider){
  var options = starknetCoreContract.filters.LogStateUpdate();
  var err = 0;
  do{
    try{
      var eventLogs = await getEventLogs(provider, options, toBlockHeight, fromBlockHeight)
      err = 0;
    } catch (e){
      err = 1
    }
  } while(err == 1);

  var batches = {};
  var count = 0

  while (count != numOfBatches){
      batch = eventLogs[eventLogs.length - 1 - count]

      var parsed_batch = starknetCoreContract.interface.parseLog({
          topics: batch.topics,
          data: batch.data,
        });
      
      var sequenceNumber = parsed_batch.args.sequenceNumber.toNumber()

      var transactionHash = batch.transactionHash
      batches[transactionHash] = sequenceNumber

      count += 1
  }

  return batches
}

/*
Retrieve Information from the Starknet Core Contract
*/
async function getCoreInfo(numOfBatches, toBlockHeight, fromBlockHeight, starknetCoreContract, provider){
    var info = {}
    //{txHash: stateTransitionFact}
    var err = 0;
    do{
      try{
        var stateTransitionFacts = await getStateTransitionFacts(numOfBatches, toBlockHeight, fromBlockHeight, starknetCoreContract, provider) 
        err = 0;
      } catch (e){
        err = 1
      }
    } while(err == 1);
    //{txHash: sequenceNumber}
    do{
      try{
        var sequenceNumbers = await getSequenceNumbers(numOfBatches, toBlockHeight, fromBlockHeight, starknetCoreContract, provider) 
        err = 0;
      } catch (e){
        err = 1
      }
    } while(err == 1);

    for(tx_hash in stateTransitionFacts){
      if(tx_hash in sequenceNumbers){
        var block_no = sequenceNumbers[tx_hash]
        do{
          try{
            var tx_count = await starknetLib.fetchBlockTxCount(block_no)
            err = 0;
          } catch (e){
            err = 1
          }
        } while(err == 1);
    
        info[(stateTransitionFacts[tx_hash])[0]] = {coreTxHash: tx_hash, ethTimestamp: (stateTransitionFacts[tx_hash])[1], sequenceNumber: block_no, txCount: tx_count}

      } else{
        console.log(`Missing txHash, ${tx_hash}`)
      }
    }

    return info
}

/*
Retrieve Information from the Generic Proof Service Contract
*/
async function getGpsInfo(toBlockHeight, fromBlockHeight, gpsVerifierContract, provider){
  var err = 0;
 
  do{
    try{
      var gpsTransactions = await etherScan.fetchContractTransactions(gpsVerifierContract.address, fromBlockHeight, toBlockHeight)
      err = 0;
    } catch (e){
      err = 1
    }
  } while(err == 1);

  var gpsReceipts = []

  for (var i = gpsTransactions.length - 1; i >= 0; i--) {
    var err = 0;
    var transaction_hash = gpsTransactions[i].hash
    do{
      try{
        var tx_receipt = await provider.getTransactionReceipt(transaction_hash)
        err = 0;
      } catch (e) {
        err = 1;
      }
    } while (err == 1);

    
    gpsReceipts.push(tx_receipt)
  }

  var options = gpsVerifierContract.filters.LogMemoryPagesHashes();
  const iface = new ethers.utils.Interface(gpsVerifierABI)


  // {factHash : tx_hash, pageHashes}
  var info = {}

  for (var receipt of gpsReceipts){
    for (var log of receipt.logs){
      if (log.topics[0] == options.topics[0]){
        var parsed_log = iface.decodeEventLog("LogMemoryPagesHashes", log.data, log.topics)
        info[parsed_log.factHash] = {gpsTxHash: log.transactionHash, pagesHashes: parsed_log.pagesHashes}
      }
    }
  }
  return info

}

/*
Retrieve Information from the Memory Page Fact Registry Contract
*/
async function getMpfrInfo(toBlockHeight, fromBlockHeight, memoryPageFactRegistryContract, provider){
  var options = memoryPageFactRegistryContract.filters.LogMemoryPageFactContinuous();

  var err = 0;
  do{
    try{
      var eventLogs = await getEventLogs(provider, options, toBlockHeight, fromBlockHeight)
      err = 0;
    } catch (e){
      err = 1
    }
  } while(err == 1);

  //{pageHash: {txHash, gasUsed}]}
  var info = {};


  for (var log of eventLogs){ 
      var err = 0;
      var parsed_log = memoryPageFactRegistryContract.interface.parseLog({
          topics: log.topics,
          data: log.data,
        });
      do{
        try{
          var tx_receipt = await provider.getTransactionReceipt(log.transactionHash)
          err = 0;
        } catch (e) {
          err = 1;
        }
      } while (err == 1);

      info[parsed_log.args.memoryHash._hex] = {mprfTxHash: log.transactionHash, gasUsed: tx_receipt.gasUsed.toNumber()}

  }

  return info
}

function getTransactionCost(gas_price, eth_price, average_gas){
  // ETH PRICE (USD) * GWEI PRICE * GAS USED / 10^9 (gwei) = Price in dollars 
  return (gas_price * eth_price * average_gas) / 1000000000
}

async function main(){
    const provider = await getProvider("mainnet");
    const starknetCoreContract = await getContract(starknetCoreAddress, starknetCoreContractABI, provider);
    const gpsVerifierContract = await getContract(gpsStatementVerifierAddress, gpsVerifierABI, provider);
    const memoryPageFactRegistryContract = await getContract(memoryPageFactRegistryAddress, memoryPageFactRegistryABI, provider)

    var toBlockHeight = await provider.getBlockNumber();
    var numOfBatches = 215; //the number of batches you want to get the average gas for
    var fromBlockHeight = getEstimatedFromBlock(toBlockHeight, numOfBatches);

    // {stateTransitionHash : [tx_hash, sequenceNumber, transactionCount]}
    // {stateTransitionHash : [tx_hash, [pageHashes]}
    // {pageHash: tx_hash, gasUsed}
    //{sequenceNumber, transactionCount, core: {txHash, stateTransitionHash}, gps: {txHash, pageHashes}, memoryFactRegistry: {cost} }
    var coreInfo = await getCoreInfo(numOfBatches, toBlockHeight, fromBlockHeight, starknetCoreContract, provider)
    var gpsInfo = await getGpsInfo(toBlockHeight, fromBlockHeight, gpsVerifierContract, provider)
    var mpfrInfo = await getMpfrInfo(toBlockHeight, fromBlockHeight, memoryPageFactRegistryContract, provider)

    console.log("Core")
    console.log(coreInfo)
    console.log("GPS")
    console.log(gpsInfo)
    console.log("MPFR")
    console.log(mpfrInfo)

    var combinedInfo = {}
    var totalGasConsumed = 0
    var totalTxCount = 0
    var number_to_info = {}
    
    for (stateTransitionFact in coreInfo){
      var pagesHashes = gpsInfo[stateTransitionFact]["pagesHashes"]
      var blockNo = coreInfo[stateTransitionFact]["sequenceNumber"]
      var coreTxHash = coreInfo[stateTransitionFact]["coreTxHash"]
      var eth_timestamp = coreInfo[stateTransitionFact]["ethTimestamp"]
      var gpsTxHash =  gpsInfo[stateTransitionFact]["gpsTxHash"]
      var mpfrTxHashes = []
      var blockGasConsumed = 0
       
      for (var pageHash of pagesHashes){
        blockGasConsumed += mpfrInfo[pageHash].gasUsed
        mpfrTxHashes.push(mpfrInfo[pageHash]["mprfTxHash"])
      }
      
      tx_count = coreInfo[stateTransitionFact]["txCount"]
      totalTxCount += tx_count
      totalGasConsumed += blockGasConsumed


      console.log(`Block ${blockNo} consumed ${blockGasConsumed} gas with ${tx_count} transactions`)

      number_to_info[blockNo] = [eth_timestamp, tx_count, blockGasConsumed]

      combinedInfo[blockNo] = {stateTransitionFact: stateTransitionFact, 
        coreTxHash: coreTxHash, 
        gpsTxHash: gpsTxHash, 
        mpfrTxHashes: mpfrTxHashes, 
        txCount: tx_count, 
        gasUsed: blockGasConsumed}
    }

    
    saveJson(number_to_info)

    var gas_price = await gas.fetchGas() //gas cost in gwei
    var eth_price = await price.fetchPrice("ethereum", "usd")
   
    gas_cost_in_usd = getTransactionCost(gas_price, eth_price,totalGasConsumed/totalTxCount)
    console.log("")
    console.log(`Over ${numOfBatches} blocks, each transaction used on average ${totalGasConsumed/totalTxCount} gas costing $${gas_cost_in_usd}`)

}

main();