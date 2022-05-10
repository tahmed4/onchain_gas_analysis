const starknetLib = require('../lib/starknetLib.js');
const gas = require('../lib/gasPrice.js');
const price = require('../lib/coinPrice.js')
var fs = require('fs');
const { number } = require('starknet');


//Ethereum's fixed gas per byte cost
const GAS_PER_BYTE = 16 
//Starkware defined consts as of 27/04/2022
//https://starknet.io/documentation/fee-mechanism/ 
const GAS_PER_STEP = 0.05
const GAS_PER_ECDSA = 25.6
const GAS_PER_RANGE_CHECK = 0.4
const GAS_PER_BITWISE = 12.8
const GAS_PER_PEDERSEN = 0.4

/*
Save recorded data as JSON
*/
function saveJson(json){
    fs.writeFile ("./data/starknetPercentageROUNDED.json", JSON.stringify(json), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
};

/*
Calculate the percentage of transaction cost is taken up by storing state diffs on-chain
*/
async function main(){
    var toBlockHeight = await starknetLib.getBlockNumber();
    var num_of_blocks = 500; 
    var number_to_data = {}
    var error = 0

    for (let i = 0; i < num_of_blocks; i++) {
        var current_block = toBlockHeight - i
        var messages = 0
        
        do {
            try{
                var state_diff_items = await starknetLib.fetchBlockStateCount(current_block)
                error = 0
            } catch (e){
                error = 1
            }
        } while(error == 1)

        var steps = 0
        var message_bytes = 0
        
        do {
            try{
                var blockInfo = await starknetLib.fetchBlock(current_block)
                error = 0
            } catch (e){
                error = 1
            }
        } while(error == 1)
        var receipts = blockInfo["data"]["transaction_receipts"]
        var tx_count = receipts.length
        var l2_cost = 0;

        for(var tx of receipts){
            var resources = tx["execution_resources"]
            var instance_counter = resources["builtin_instance_counter"]

            if (Object.keys(instance_counter).length > 0) {
                l2_cost += GAS_PER_STEP * resources["n_steps"] +  GAS_PER_ECDSA * instance_counter["ecdsa_builtin"] + GAS_PER_RANGE_CHECK * instance_counter["range_check_builtin"]  + GAS_PER_BITWISE * instance_counter["bitwise_builtin"] + GAS_PER_PEDERSEN * instance_counter["pedersen_builtin"]
            } 

            steps += resources["n_steps"]
            messages += tx["l2_to_l1_messages"].length

            for (var msg of tx["l2_to_l1_messages"]){
                for(var value of msg["payload"]){
                    var binary = parseInt(value, 16).toString(2)
                    message_bytes += Math.ceil(binary.length / 8)
                }
                message_bytes += 20 * 2 //message also contains both addresses
            }
            //parseInt(hex, 16).toString(2))

        }
        // Total cost calculated with the use of proposed fee formula https://community.starknet.io/t/fees-in-starknet-alpha/286
        // messages * 5000 + GAS_PER_BYTE * (message_bytes + state_diff_items * 2 * 31) + GAS_PER_STEP * steps L1 Computation + L1 Data (Message Data + Data Availiability)
        var total_cost = messages * 5000 + GAS_PER_BYTE * (message_bytes + state_diff_items * 2 * 31) + GAS_PER_STEP * steps + l2_cost
        var l1_data = GAS_PER_BYTE * (state_diff_items * 2 * 31)
        number_to_data[current_block] = [blockInfo.data.timestamp, tx_count,l1_data, l2_cost.toFixed(5),  total_cost.toFixed(5) , (l1_data/total_cost).toFixed(5)]
    }
    //blockNo -> [timestamp, txs, l2_cost, total_cost, l1_data/total_cost]
    saveJson(number_to_data)


}

main();