const axios = require("axios");
require("dotenv").config()

async function fetchContractTransactions(address, fromBlock, toBlock) {
  try {
    let resp = await axios.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${fromBlock}&endblock=${toBlock}&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`)
    return resp.data.result; 
  } catch (e) {
    console.log({ e });
    throw new Error("Unable to fetch transaction");
  }
}


module.exports = { fetchContractTransactions }