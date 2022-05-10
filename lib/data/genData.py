import csv
import json

unix_to_gwei = {}

with open('AvgGasPrice.csv', 'r') as f:
    csv_read = csv.reader(f)
    for row in csv_read:
        unix_to_gwei[row[1]] = float(row[2])/(10 ** 9)

with open('AvgGasPrice.json', 'w') as f:
    json.dump(unix_to_gwei, f)

