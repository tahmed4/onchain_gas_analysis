const axios = require("axios");
const fs = require('fs');

const HOST = "https://ethgasstation.info/api/ethgasAPI.json";;


async function fetchGas() {
  try {
    let gasStationPrice = await axios.get(HOST)
    return gasStationPrice.data.average/10; //div 10 to convert to gwei
  } catch (e) {
    console.log({ e });
    throw new Error("Unable to fetch gas");
  }
}

function getAvgGas(timestamp){
  try {
    let ts = parseInt(timestamp)

    let data = fs.readFileSync('./data/AvgGasPrice.json');
    let unix_to_gwei = JSON.parse(data);
    let keys = Object.keys(unix_to_gwei);
    if(ts < parseInt(keys[0])){
      return unix_to_gwei[keys[0]];
    }

    if(ts > parseInt(keys[keys.length - 1])){
      return unix_to_gwei[keys[keys.length - 1]];
    }
    
    let low = 0;
    let high = keys.length - 1

    while (low <= high){
      let mid = Math.floor((high + low) / 2);

      if (ts < parseInt(keys[mid])){
        high = mid - 1;
      } else if (ts > parseInt(keys[mid])){
        low = mid + 1;
      } else {
        return unix_to_gwei[keys[mid]];
      }
    }

    return unix_to_gwei[keys[high]]

  } catch (e) {
    console.log({ e });
    throw new Error("Unable to fetch gas");
  }
};

module.exports = { fetchGas, getAvgGas }