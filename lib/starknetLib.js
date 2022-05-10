const axios = require("axios");

async function fetchBlock(blockNo){
    try{ 
        if (blockNo == undefined){
            blockNo = "pending"
        }
        let resp = await axios.get(`https://alpha-mainnet.starknet.io/feeder_gateway/get_block?blockNumber=${blockNo}`)
        return resp

    } catch (e) {
        console.log({ e });
        throw new Error("Unable to find block");
    }
}

async function fetchBlockState(blockNo){
    try{ 
        let resp = await axios.get(`https://alpha-mainnet.starknet.io/feeder_gateway/get_state_update?blockNumber=${blockNo}`)
        return resp

    } catch (e) {
        console.log({ e });
        throw new Error("Unable to find block");
    }
}

async function fetchBlockStateCount(blockNo){
    try{ 
        let data = await fetchBlockState(blockNo) 
        let storage_diffs = data["data"]["state_diff"]["storage_diffs"]
        let count = 0
        for(var addr in storage_diffs){
            count += storage_diffs[addr].length
        }
        
        return count

    } catch (e) {
        console.log({ e });
        throw new Error("Unable find block");
    }
}

/*
state_diff – The changes in the state applied in this block, 
given as a mapping of addresses to the new values and/or new contracts.
*/
async function fetchBlockTxCount(blockNo){
    try{ 
        let data = await fetchBlock(blockNo) 

        return data["data"]["transactions"].length
    } catch (e) {
        console.log({ e });
        throw new Error("Unable find block");
    }
}


async function getBlockNumber(){
    try{ 
        let resp = await axios.get("https://alpha-mainnet.starknet.io/feeder_gateway/get_block?blockNumber=pending")
        let parent_block_hash = resp["data"]["parent_block_hash"]
        resp = await axios.get(`https://alpha-mainnet.starknet.io/feeder_gateway/get_block?blockHash=${parent_block_hash}`)

        return resp["data"]["block_number"]

    } catch (e) {
        console.log({ e });
        throw new Error("Unable to find block");
    }
}

module.exports = { fetchBlock,  fetchBlockTxCount, fetchBlockState, fetchBlockStateCount, getBlockNumber} 