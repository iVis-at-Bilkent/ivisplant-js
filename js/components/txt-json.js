/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function txtToJsonText(csvText) {
    if (csvText.indexOf('\t') < 0) // if text doesn't have "\t" in it (also covers empty string)
        return;

    var line, node, edge, tmp;
    var lines = csvText.split('\n');
    var json = [];
    var nodes = [];
    var edges = [];


    for (var i = 0; i < lines.length; i++) {
        line = lines[i].split('\t');

        if (line[0] == "node") {
            if (line.length < 7) {
                continue;
            }
            node = [];

            node.push('"id": "' + line[1] + '"');
            node.push('"shortname": "' + line[2] + '"');
            node.push('"name": "' + line[3] + '"');
            node.push('"shape": "' + line[4] + '"');
            node.push('"color": "' + line[5] + '"');
            node.push('"centrality": "#D3D3D3"');
            node.push('"weight": ' + line[6]);

            if (line.length > 7) {
                tmp = node.join(',\n'); node = [];
                node.push('"x": ' + line[7]);
                node.push('"y": ' + line[8]);
                nodes.push('{\n"data":{' + tmp + '\n},\n"position":{' + node.join(',\n') + '\n}\n}');
            }else{
                nodes.push('{\n"data":{' + node.join(',\n') + '\n}\n}');
            }
        } else if (line[0] == "edge") {
            if (line.length < 4) {
                continue;
            }
            edge = [];

            if (line.length == 4)// adding id to edges is optional
                edge.push('"id": "' + line[4] + '"');

            edge.push('"source": "' + line[1] + '"');
            edge.push('"target": "' + line[2] + '"');
            edge.push('"width": "' + line[3] + '"');

            edges.push('{\n"data":{' + edge.join(",\n") + '\n}\n}');
        }
    }

    json.push('{');
    json.push('"nodes": [\n');
    json.push(nodes.join(',\n'));
    json.push('\n],\n');
    json.push('"edges": [\n');
    json.push(edges.join(',\n'));
    json.push('\n]');
    json.push('\n}');
    console.debug(json.join('').toString());
    return json.join('').toString();
}