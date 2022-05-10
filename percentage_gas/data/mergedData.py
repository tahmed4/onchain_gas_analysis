import json

data = None
with open('arbitrumPercentage.json', 'r') as f:
    data = json.load(f)

data1 = None
with open('arbitrumPercentage1.json', 'r') as f:
    data1 = json.load(f)
    
data2 = None
with open('arbitrumPercentage3.json', 'r') as f:
    data2 = json.load(f)
    
data3 = None
with open('arbitrumPercentage4.json', 'r') as f:
    data3 = json.load(f)

for dp in data:
    if data[dp][6] == None:
        data[dp][6] = data[dp][3]/(data[dp][2] + data[dp][3] + data[dp][4] + data[dp][5] )
        
for dp in data1:
    if data1[dp][6] == None:
        data1[dp][6] = data1[dp][3]/(data1[dp][2] + data1[dp][3] + data1[dp][4] + data1[dp][5] )
        
for dp in data2:
    if data2[dp][6] == None:
        data2[dp][6] = data2[dp][3]/(data2[dp][2] + data2[dp][3] + data2[dp][4] + data2[dp][5] )

for dp in data3:
    if data3[dp][6] == None:
        data3[dp][6] = data3[dp][3]/(data3[dp][2] + data3[dp][3] + data3[dp][4] + data3[dp][5] )
merged = {**data, **data1, **data2, **data3}
final = {}


for key in sorted(merged.keys()):
    final[key] = merged[key]
print(len(final))

#number_to_data[block_data.number] = [first_block_data.timestamp, batch_tx_count, batch_fixed, batch_cd, batch_str, batch_comp, batch_perc_sum/batch_percentage.length]
print(final)

with open('arbitrumPercentage1000.json', 'w') as f:
    json.dump(final, f)

