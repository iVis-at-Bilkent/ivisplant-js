$(function () { // on dom ready

    $('#cy').cytoscape({
        layout: {
            name: 'cose',
            padding: 2,
            // Whether to animate while running the layout
            animate: true,
            // Number of iterations between consecutive screen positions update (0 -> only updated on the end)
            refresh: 4,
            // Whether to fit the network view after when done
            fit: true,
            // Whether to randomize node positions on the beginning
            randomize: true,
            // Node repulsion (non overlapping) multiplier
            nodeRepulsion: 400000,
            // Node repulsion (overlapping) multiplier
            nodeOverlap: 10,
            // Ideal edge (non nested) length
            //idealEdgeLength     : 30,
            // Divisor to compute edge forces
            edgeElasticity: 100,
            // Nesting factor (multiplier) to compute ideal edge length for nested edges
            nestingFactor: 5,
            // Gravity force (constant)
            gravity: 250,
            // Maximum number of iterations to perform
            numIter: 200,
            // Initial temperature (maximum node displacement)
            initialTemp: 300,
            // Cooling factor (how the temperature is reduced between consecutive iterations
            coolingFactor: 0.97,
            // Lower temperature threshold (below this point the layout will end)
            minTemp: 1.0
        },
        style: cytoscape.stylesheet()
                .selector('node')
                .css({
                    'shape': 'ellipse',
                    'width': 'mapData(weight, 30, 100,10, 80)',
                    'height': 'mapData(weight, 30, 100, 10, 80)',
                    'content': 'data(shortname)',
                    'text-valign': 'bottom',
                    'color': 'black',
                    'border-color': 'data(color)',
                    'border-width': 2,
                    'background-color': 'lightgrey'
                })
                .selector('edge')
                .css({
                    'width': 'mapData(width, 1, 4, 1, 6)',
                    'target-arrow-shape': 'triangle',
                    'source-arrow-color': 'grey',
                    'line-color': 'grey',
                    'target-arrow-color': 'grey'
                })
                .selector(':selected')
                .css({
                    'border-width': 2,
                    'background-color': 'orange',
                    'content': 'data(name)'.replace("_", " ")
                })
                .selector('edge.dashed')
                .css({
                    'line-style': 'dashed'
                }
                ),
        elements: {
            nodes: [
                {data: {id: 'G', shortname: 'G', name: 'Glucose', shape: 'ellipse', weight: 90, color: 'grey'}},
                {data: {id: 'As_A', shortname: 'As A', name: 'Aspartic Acid', shape: 'triangle', weight: 34, color: 'pink'}},
                {data: {id: 'S', shortname: 'S', name: 'Serine', shape: 'triangle', weight: 33, color: 'pink'}},
                {data: {id: 'F', shortname: 'F', name: 'Fructose', shape: 'ellipse', weight: 92, color: 'grey'}},
                {data: {id: 'Glut_A', shortname: 'Glut A', name: 'Glutamic Acid', shape: 'triangle', weight: 40, color: 'pink'}},
                {data: {id: 'Gly', shortname: 'Gly', name: 'Glycine', shape: 'triangle', weight: 32, color: 'pink'}},
                {data: {id: 'CA', shortname: 'CA', name: 'Citric Acid', shape: 'triangle', weight: 56, color: 'pink'}},
                {data: {id: 'MA', shortname: 'MA', name: 'Malic Acid', shape: 'rectangle', weight: 35, color: 'yellow'}},
                {data: {id: 'Na', shortname: 'Na', name: 'Sodium', shape: 'star', weight: 36, color: 'brown'}},
                {data: {id: 'Cl', shortname: 'Cl', name: 'Chloride', shape: 'star', weight: 35, color: 'brown'}},
                {data: {id: 'A', shortname: 'A', name: 'Alanine', shape: 'ellipse', weight: 32, color: 'pink'}},
                {data: {id: 'FC', shortname: 'FC', name: 'Fruit Color', shape: 'rectangle', weight: 40, color: 'red'}},
                {data: {id: 'FT', shortname: 'FT', name: 'Fruit Taste', shape: 'rectangle', weight: 41, color: 'red'}},
                {data: {id: 'FS', shortname: 'FS', name: 'Fruit Smell', shape: 'rectangle', weight: 41, color: 'red'}}
            ],
            edges: [
                {data: {source: 'G', target: 'F', width: 4}},
                {data: {source: 'G', target: 'MA', width: 1}, classes: 'dashed'},
                {data: {source: 'G', target: 'FC', width: 2}},
                {data: {source: 'F', target: 'FC', width: 2}},
                {data: {source: 'F', target: 'FT', width: 1}},
                {data: {source: 'G', target: 'FT', width: 1}},
                {data: {source: 'FC', target: 'FT', width: 4}},
                {data: {source: 'FC', target: 'FS', width: 2}},
                {data: {source: 'F', target: 'MA', width: 1}, classes: 'dashed'},
                {data: {source: 'G', target: 'Gly', width: 1}},
                {data: {source: 'As_A', target: 'Gly', width: 2}},
                {data: {source: 'S', target: 'As_A', width: 1}},
                {data: {source: 'S', target: 'Glut_A', width: 1}},
                {data: {source: 'Glut_A', target: 'As_A', width: 1}}
            ]
        },
        ready: function () {
            window.cy = this;
            var tapped;

            cy.on('tap', 'node', 'null', function (evt) {
                var node = evt.cyTarget;
                tapped = node.id();
                cy.$('#' + node.id()).select();
            });

            cy.on('mouseover', 'node', null, function (evt) {
                var node = evt.cyTarget;
                cy.$('#' + node.id()).select();
            });

            cy.on('mouseout', 'node', null, function (evt) {
                var node = evt.cyTarget;
                if (tapped != node.id())
                    cy.$('#' + node.id()).unselect();
            });

            // giddy up
        },
    });

}); // on dom ready