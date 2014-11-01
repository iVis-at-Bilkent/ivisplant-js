/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function csvToJsonText(csvText) {
    if (csvText.indexOf(';') < 0) // if text doesn't have ";" in it (also covers empty string)
        return;
    
    var lines = csvText.split('\n');
    var line;
    var json = [];
    var node;
    var edge;
    var nodes = [];
    var edges = [];
    
            
    for (var i = 0; i < lines.length; i++) {
        line = lines[i].split(';');
         
        if(line[0] == "nodes"){
            if(line.length < 7){continue;}
            node = [];
            
            node.push('"id": "'+line[1]+'"');
            node.push('"shortname": "'+line[2]+'"');
            node.push('"name": "'  +line[3]+'"');
            node.push('"shape": "' +line[4]+'"');
            node.push('"weight": ' +line[5]);
            node.push('"color": "' +line[6]+'"');
            
            nodes.push('{\n"data":{' + node.join(',\n') + '\n}\n}');
        }else if (line[0] == "edges"){
            if(line.length < 4){continue;}
            edge = [];
            
            if(line.length == 4)// adding id to edges is optional
                edge.push('"id": "'+line[4]+'"');
            
            edge.push('"source": "'+line[1]+'"');
            edge.push('"target": "'+line[2]+'"');
            edge.push('"width": "'+line[3]+'"');
            
            edges.push('{\n"data":{' + edge.join(",\n") + '\n}\n}');
        }
    }
    
    json.push( '{' );
    json.push( '"nodes": [\n' );
    json.push( nodes.join(',\n') );
    json.push( '\n],\n');
    json.push( '"edges": [\n');
    json.push( edges.join(',\n') );
    json.push( '\n]');
    json.push( '\n}' );
    
    return json.join('');
}

function dummy(){
    return {
        "nodes": [
            { 
                "data": {"shortname": "G","name": "Glucose","shape": "ellipse","weight": "90","color": "grey"
                }
            },
            { 
                "data": {"shortname": "As A","name": "Aspartic Acid","shape": "triangle","weight": "34","color": "pink"
                }
            }
        ],
        "edges": [
            { 
                "data": {"source": "G","target": "As_A","width": "4"
                }
            }
        ]
    }

}