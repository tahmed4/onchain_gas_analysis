const axios = require("axios");

async function fetchPrice(coin, currency){
    try{ 
        let resp = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${currency}`)
        return resp.data[coin][currency]

    } catch (e) {
        console.log({ e });
        throw new Error("Unable to price");
    }
}


module.exports = { fetchPrice }