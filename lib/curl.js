var request = require('request-promise');


async function getTxFeeStats(tx_hash){
    var headers = {
        'Content-Type': 'application/json'
    };
    
    var payload = `{"jsonrpc":"2.0","method":"eth_getTransactionReceipt","params":["${tx_hash}"],"id":0}`;
    
    var options = {
        url: 'https://arb1.arbitrum.io/rpc',
        method: 'POST',
        headers: headers,
        body: payload
    };

    return request(options).then(body => {
        body = JSON.parse(body)
        return body.result.feeStats.paid})
}

module.exports = { getTxFeeStats }

