const ethers = require("ethers");

require("dotenv").config()


async function getProvider(network){
    var provider = new ethers.providers.InfuraProvider(network, process.env.INFURA_API_KEY);
    return provider
}

async function main(){
    const provider = await getProvider("arbitrum");
    var curr_block_height = await provider.getBlockNumber();
    var num_of_blocks = 100; // search 100 blocks

    var total_txs = 0
    var total_gas = 0

    for (let i = 0; i < num_of_blocks; i++) {
        block_data = await provider.getBlock(curr_block_height - i)
        total_txs += block_data.transactions.length
        total_gas += block_data.gasUsed.toNumber()
        console.log(`Block ${curr_block_height - i} consumed ${block_data.gasUsed.toNumber()} arbgas with ${block_data.transactions.length} transactions`)
        }


    //The gas in block information only contain l2 gas cost, but the gas on tx page contain both l1 and l2 cost.
    console.log(`Over ${num_of_blocks} blocks, each transaction used on average ${total_gas/total_txs} arbgas`)
    

}

main();
