const ethers = require("ethers");
const feeStats = require('../lib/curl.js')
var fs = require('fs');

require("dotenv").config()


/*
Set Infura Provider to query blockchain
*/
async function getProvider(network){
    var provider = new ethers.providers.InfuraProvider(network, process.env.INFURA_API_KEY);
    return provider
}

function saveJson(json){
    fs.writeFile ("./data/arbitrumPercentage1.json", JSON.stringify(json), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
};

async function main(){
    var error = 0
    const provider = await getProvider("arbitrum");
    // var curr_block_height = await provider.getBlockNumber(); //start recording from most recent 
    var curr_block_height = 10574252 // (start = 1650966466, recent at time of recording = 1650968652 diff = 2186s = 36.43333 mins )
    var batch_size = 500; // 100 rollup blocks per batch
    var num_of_blocks = 100; // search 1000 blocks

   
    var total_txs = 0
    var percentages = []
    var number_to_data  = {}
    var batch_count = 0;
    //Go through each batch (batch size defined in batch_size) and calculate the percentage dominance
    for (let i = 0; i < batch_size; i++) {
        var batch_percentage = []
        var batch_fixed = 0
        var batch_cd = 0
        var batch_str = 0
        var batch_comp = 0
        var batch_tx_count = 0
        do {
            try{
                var first_block_data = await provider.getBlock(curr_block_height - i)
                error = 0
            } catch (e){
                error = 1
            }
        } while(error == 1)
        

        for (let j = i * num_of_blocks; j < (i+1) * num_of_blocks; j++) {
            do{
                try{
                    block_data = await provider.getBlock(curr_block_height - j)
                    error = 0
                } catch (e){
                    error = 1
                }
                
            } while(error == 1)
            
            total_txs += block_data.transactions.length
            batch_tx_count += block_data.transactions.length
            
            for(var tx_hash of block_data.transactions){
                fees = await feeStats.getTxFeeStats(tx_hash)
            
                var l1Transaction = parseInt(fees.l1Transaction, 16)
                var l1Calldata =  parseInt(fees.l1Calldata, 16) 
                var l2Storage =  parseInt(fees.l2Storage, 16)
                var l2Computation =  parseInt(fees.l2Computation, 16)
                batch_fixed += l1Transaction
                batch_cd += l1Calldata
                batch_str += l2Storage
                batch_comp += l2Computation
    
                total_fee = l1Transaction + l1Calldata + l2Storage + l2Computation
                percentages.push(l1Calldata/total_fee)
                batch_percentage.push(l1Calldata/total_fee)
            }
        }
        
        var batch_perc_sum = batch_percentage.reduce((partialSum, a) => partialSum + a, 0);

        number_to_data[block_data.number] = [first_block_data.timestamp, batch_tx_count, batch_fixed, batch_cd, batch_str, batch_comp, batch_perc_sum/batch_percentage.length]
        batch_count += 1
        saveJson(number_to_data);
    }

    saveJson(number_to_data);
    const sum = percentages.reduce((partialSum, a) => partialSum + a, 0);
    console.log(`Over ${num_of_blocks * batch_size} l1calldata cost takes up ${(sum/percentages.length) * 100}% of a transaction`)

}

main();