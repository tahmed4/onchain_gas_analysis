const ethers = require("ethers");
const gas = require('../lib/gasPrice.js');
const price = require('../lib/coinPrice.js')
require("dotenv").config()

const INFURA_API_KEY = process.env.INFURA_API_KEY; 


async function getProvider(network){
    var provider = new ethers.providers.InfuraProvider(network, process.env.INFURA_API_KEY);
    return provider
}

function getTransactionCost(gas_price, eth_price, average_gas){
    // ETH PRICE (USD) * GWEI PRICE * GAS USED / 10^9 (gwei) = Price in dollars 
    return (gas_price * eth_price * average_gas) / 1000000000
}


async function main(){
    const provider = await getProvider("mainnet");
    var curr_block_height = await provider.getBlockNumber();
    var num_of_blocks = 100; // search 100 blocks
    
    var gas_price = await gas.fetchGas() //gas cost in gwei
    var eth_price = await price.fetchPrice("ethereum", "usd")
   
    var total_txs = 0
    var total_gas = 0

    for (let i = 0; i < num_of_blocks; i++) {
        block_data = await provider.getBlock(curr_block_height - i)
        total_txs += block_data.transactions.length
        total_gas += block_data.gasUsed.toNumber()
        console.log(`Block ${curr_block_height - i} consumed ${block_data.gasUsed.toNumber()} gas with ${block_data.transactions.length} transactions`)
        }

    //console.log(gas_price, eth_price, block_data.gasUsed.toNumber()/ block_data.transactions.length)

    gas_cost_in_usd = getTransactionCost(gas_price, eth_price,total_gas/ total_txs)
    console.log("")
    console.log(`Over ${num_of_blocks} blocks, each transaction used on average ${total_gas/total_txs} gas costing $${gas_cost_in_usd}`)
    

}

main();
