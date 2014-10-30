var correlationNetworkStyleSheet = cytoscape.stylesheet()
        .selector(":active")
        .css({
            "overlay-color": "orange",
            "overlay-padding": 10,
            "overlay-opacity": 0.3
        })
        .selector("core")
        .css({
            "selection-box-color": "orange",
            "selection-box-opacity": 0.5
        })
        .selector('node')
        .css({
            'shape': 'data(shape)',
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
        .selector('node:selected')
        .css({
            'border-width': 2,
            'background-color': 'orange',
            'content': 'data(name)'.replace("_", " ")
        })
        .selector('edge:selected')
        .css({
            'color': 'orange',
            'background-color': 'orange'
        })
        .selector('edge.dashed')
        .css({
            'line-style': 'dashed'
        }
        ); // end of sbgnStyleSheet

var coseOptions = {
    name: 'cose',
    padding: 15,
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
}

var NotyView = Backbone.View.extend({
    render: function () {
        //this.model["theme"] = " twitter bootstrap";
        this.model["layout"] = "bottomRight";
        this.model["timeout"] = 8000;
        this.model["text"] = "Right click on a gene to see its details!";

        noty(this.model);
        return this;
    }
});

var SBGNContainer = Backbone.View.extend({
    cyStyle: correlationNetworkStyleSheet,
    render: function () {
        (new NotyView({
            template: "#noty-info",
            model: {}
        })).render();

        var container = $(this.el);
        // container.html("");
        // container.append(_.template($("#loading-template").html()));


        var cytoscapeJsGraph = (this.model.cytoscapeJsGraph);

        var positionMap = {};

        //add position information to data for preset layout
        for (var i = 0; i < cytoscapeJsGraph.nodes.length; i++) {
            var xPos = cytoscapeJsGraph.nodes[i].position.x;
            var yPos = cytoscapeJsGraph.nodes[i].position.y;
            positionMap[cytoscapeJsGraph.nodes[i].data.id] = {'x': xPos, 'y': yPos};
        }

        var cyOptions = {
            elements: cytoscapeJsGraph,
            style: correlationNetworkStyleSheet,
            layout: {
                name: 'preset',
                positions: positionMap
            },
            showOverlay: false,
            minZoom: 0.125,
            maxZoom: 16,
            ready: function ()
            {
                window.cy = this;
                var tapped;

                var panProps = ({
                    fitPadding: 15,
                });
                container.cytoscapePanzoom(panProps);

                cy.on('tap', 'node', 'null', function (evt) {
                    var node = evt.cyTarget;
                    tapped = node.id();
                    cy.$('#' + node.id()).select();
                });

                cy.on('tap', 'edge', 'null', function (evt) {
                    var edge = evt.cyTarget;
                    var i = edge.id();
                    cy.$(i).select();
                });

                cy.on('mouseover', 'node', null, function (evt) {
                    var node = evt.cyTarget;
                    cy.$('#' + node.id()).select();
                });

                cy.on('mouseover', 'edge', null, function (evt) {
                    var edge = evt.cyTarget;
                    cy.$('#' + edge.id()).select();
                });

                cy.on('mouseout', 'node', null, function (evt) {
                    var node = evt.cyTarget;
                    if (tapped != node.id())
                        cy.$('#' + node.id()).unselect();
                });
            }
        };

        container.html("");
        container.cy(cyOptions);

        return this;
    },
    setCoseLayout: function () {
        cy.layout(coseOptions);
    }
});

var SBGNLayout = Backbone.View.extend({
    defaultLayoutProperties: {
        name: 'cose',
        nodeRepulsion: 10000,
        nodeOverlap: 10,
        idealEdgeLength: 10,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 250,
        numIter: 100
    },
    currentLayoutProperties: null,
    initialize: function () {
        var self = this;
        self.copyProperties();
        self.template = _.template($("#layout-settings-template").html(), self.currentLayoutProperties);
    },
    copyProperties: function () {
        this.currentLayoutProperties = _.clone(this.defaultLayoutProperties);
    },
    applyLayout: function () {
        var options = this.currentLayoutProperties;
        cy.layout(options);
    },
    render: function () {
        var self = this;
        self.template = _.template($("#layout-settings-template").html(), self.currentLayoutProperties);
        $(self.el).html(self.template);

        $(self.el).dialog();

        $("#save-layout").die("click").live("click", function (evt) {
            self.currentLayoutProperties.nodeRepulsion = document.getElementById("node-repulsion").value;
            self.currentLayoutProperties.nodeOverlap = document.getElementById("node-overlap").value;
            self.currentLayoutProperties.idealEdgeLength = document.getElementById("ideal-edge-length").value;
            self.currentLayoutProperties.edgeElasticity = document.getElementById("edge-elasticity").value;
            self.currentLayoutProperties.nestingFactor = document.getElementById("nesting-factor").value;
            self.currentLayoutProperties.gravity = document.getElementById("gravity").value;
            self.currentLayoutProperties.numIter = document.getElementById("num-iter").value;

            $(self.el).dialog('close');
        });

        $("#default-layout").die("click").live("click", function (evt) {
            self.copyProperties();
            self.template = _.template($("#layout-settings-template").html(), self.currentLayoutProperties);
            $(self.el).html(self.template);
        });

        return this;
    }
});
