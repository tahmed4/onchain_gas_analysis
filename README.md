# On-chain Data Availability Gas Cost Analysis

This repository contains the code used for calculating the cost to do on-chain data availability in both Arbitrum and Starknet. The contexts here contain the code necessary to calculate the average gas per transaction on both systems as well as the percentage dominance of that cost compared to the overall transaction.

## Repository Tree

```
├───average-data-cost                   # Average Cost for Data Availability per Transaction
│   │   arbGasData.js                   # Average Data Cost on Arbitrum
│   │   starknetGasData.js              # Average Data Cost on Starknet
│   │
│   ├───data                            # Data generated over a number of blocks
│   │       arbitrum3000.json
│   │       starknet215.json
│   │
│   └───graphs                          # Graphing the data generated over a number of blocks
│           arbitrum.png
│           graph_arbitrum.ipynb
│           graph_starknet.ipynb
│           starknet.png
│
├───lib                                 # Helper Tools used between programs
│   │   coinPrice.js
│   │   curl.js
│   │   etherScan.js
│   │   gasPrice.js
│   │   starknetLib.js
│   │
│   └───data
│           AvgGasPrice.csv
│           AvgGasPrice.json
│           genData.py
│
├───main-gas                            # General Average Gas Cost per transaction
│       arbGas.js                       # Average Cost on Etheruem
│       ethGas.js                       # Average Cost on Arbitrum
│
└───percentage_gas                      # Calculating the percentage dominance of data cost.
    │   percentageArbgas.js             # Percentage Dominance in Arbitrum
    │   percentageStarknetgas.js        # Percentage Dominance in Starknet
    │
    ├───data                            # Data generated over a number of blocks
    │       arbitrumPercentage1000.json
    │       mergedData.py
    │       starknetPercentage500.json
    │
    └───graphs                          # Graphing the data generated over a number of blocks
            arbitrum.png
            graph_arbitrum.ipynb
            graph_starknet.ipynb
            starknet.png
```
