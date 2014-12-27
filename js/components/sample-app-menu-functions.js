var setFileContent = function (fileName) {
    var span = document.getElementById('file-name');
    while (span.firstChild) {
        span.removeChild(span.firstChild);
    }
    span.appendChild(document.createTextNode(fileName));
}

$(document).ready(function () {
    var jsonObject;
    $.ajax({
        url: "samples/Deneme.json",
        type: 'GET',
        async: false,
        cache: false,
        success: function (data)
        {
            jsonObject = data;
        }
    });

    //setFileContent("correlationNetwork.json");

    var sbgnContainer = new SBGNContainer({
        el: '#sbgn-network-container',
        model: {cytoscapeJsGraph: jsonObject}
    })
    sbgnContainer.render();

    var sbgnLayoutProp = new SBGNLayout({
        el: '#sbgn-layout-table'
    });

    var sbgnNewNodeProp = new SBGNNewNode({
        el: '#sbgn-newNode-table'
    });
    var decimalToHexPadding = function (d) {
        var hex = Number(d).toString(16);
        var padding = 2;

        while (hex.length < padding) {
            hex = "0" + hex;
        }

        return hex;
    };
    // following function is adapted to this project from Paul's answer to the question at
    // http://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
    var normalizedToColor = function (n) {
        var r, g, b, i, f, p, q, t;

        if (n >= 0 && n <= 1) {
            h = (1 - n) / 3.5; // our target range for h value is 0 - 0.28 and in reverse order
            s = 0.9;
            v = 1;
        } else {
            return -1;
        }

        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v, g = t, b = p;
                break;
            case 1:
                r = q, g = v, b = p;
                break;
            case 2:
                r = p, g = v, b = t;
                break;
            case 3:
                r = p, g = q, b = v;
                break;
            case 4:
                r = t, g = p, b = v;
                break;
            case 5:
                r = v, g = p, b = q;
                break;
        }

        r = Math.floor(r * 255);
        g = Math.floor(g * 255);
        b = Math.floor(b * 255);

        return "#" + decimalToHexPadding(r) + decimalToHexPadding(g) + decimalToHexPadding(b);
    };

    $("body").on("change", "#file-input", function (e) {
        if ($("#file-input").val() == "") {
            return;
        }
        var fileInput = document.getElementById('file-input');
        var file = fileInput.files[0];
        //var textType = /text.*/
        if (!/.txt$/.test(file.name) && !/.json$/.test(file.name)) {
            alert(file.name + " should be a .json or .txt file.");
            return;
        }

        var reader = new FileReader();



        reader.onload = function (e) {
            if (/.txt$/.test(file.name)) {
                //console.debug(csvToJsonText(this.result).toString());

                (new SBGNContainer({
                    el: '#sbgn-network-container',
                    model: {cytoscapeJsGraph:
                                JSON.parse(txtToJsonText(this.result))}
                })).render();
            } else {
                (new SBGNContainer({
                    el: '#sbgn-network-container',
                    model: {cytoscapeJsGraph:
                                JSON.parse(this.result)}
                })).render();
            }
        }
        reader.readAsText(file);
        setFileContent(file.name);
        $("#file-input").val("");
    });

    /*$("#node-legend").click(function (e) {
     e.preventDefault();
     $.fancybox(
     _.template($("#node-legend-template").html(), {}),
     {
     'autoDimensions': false,
     'width': 420,
     'height': 393,
     'transitionIn': 'none',
     'transitionOut': 'none',
     });
     });
     
     $("#edge-legend").click(function (e) {
     e.preventDefault();
     $.fancybox(
     _.template($("#edge-legend-template").html(), {}),
     {
     'autoDimensions': false,
     'width': 400,
     'height': 220,
     'transitionIn': 'none',
     'transitionOut': 'none',
     });
     });
     
     $("#about").click(function (e) {
     e.preventDefault();
     $.fancybox(
     _.template($("#about-template").html(), {}),
     {
     'autoDimensions': false,
     'width': 300,
     'height': 320,
     'transitionIn': 'none',
     'transitionOut': 'none',
     });
     });*/

    $("#load-sample0").click(function (e) {
        $.ajax({
            url: "samples/correlationNetwork.json",
            type: 'GET',
            async: false,
            cache: false,
            success: function (data)
            {
                jsonObject = data;
            }
        });

        //setFileContent("correlationNetwork.json");

        var sbgnContainer = new SBGNContainer({
            el: '#sbgn-network-container',
            model: {cytoscapeJsGraph: jsonObject}
        })
        sbgnContainer.render();

        var sbgnLayoutProp = new SBGNLayout({
            el: '#sbgn-layout-table'
        });

        var sbgnNewNodeProp = new SBGNNewNode({
            el: '#sbgn-newNode-table'
        });

        /*
         var file = new Blob(['samples/Deneme.json'], {
         type: "text/plain;charset=utf-8;",
         });
         var textType = /text.*//*
          
          var reader = new FileReader();
          var result = "";
          
          
          (new SBGNContainer({
          el: '#sbgn-network-container',
          model: {cytoscapeJsGraph:
          JSON.parse(this.result)}
          })).render();
          
          reader.readAsText(file);
          setFileContent(file.name);
          $("#file-input").val("");*/
    });

    $("#hide-selected").click(function (e) {
        sbgnFiltering.hideSelected();
    });

    $("#show-selected").click(function (e) {
        sbgnFiltering.showSelected();
    });

    $("#show-all").click(function (e) {
        sbgnFiltering.showAll();
    });

    $("#delete-selected").click(function (e) {
        sbgnFiltering.deleteSelected();
    });

    $("#neighbors-of-selected").click(function (e) {
        sbgnFiltering.highlightNeighborsofSelected();
    });

    $("#processes-of-selected").click(function (e) {
        sbgnFiltering.highlightProcessesOfSelected();
    });

    $("#remove-highlights").click(function (e) {
        sbgnFiltering.removeHighlights();
    });

    $("#layout-properties").click(function (e) {
        sbgnLayoutProp.render();
    });

    $("#perform-layout").click(function (e) {
        //sbgnLayoutProp.applyLayout();
        cy.layout(coseOptions);
    });

    $("#add-node").click(function (e) {
        sbgnNewNodeProp.render();
    });


    $("#add-edge").click(function (e) {
        cy.edgehandles({
            enabled: true,
            toggleOffOnLeave: true,
            hoverDelay: 0,
            stop: function (sourceNode) {// fired when edgehandles interaction is stopped (either complete with added edges or incomplete)
                cy.edgehandles('disable')// closes edge-handle after adding an edge
            }
        });
    });

    $("#save-as-png").click(function (evt) {
        var pngContent = cy.png();
        window.open(pngContent, "_blank");
    });

    $("#load-file").click(function (evt) {
        $("#file-input").trigger('click');
    });

    $("#load-csv-file").click(function (evt) {
        $("#file-input").trigger('click');
    });

    $("#show-labels-full").click(function (evt) {
        cy.style()
                .selector('node')
                .css({
                    'content': 'data(name)',
                })

                .update() // update the elements in the graph with the new style
                ;
    });

    $("#show-labels-short").click(function (evt) {
        cy.style()
                .selector('node')
                .css({
                    'content': 'data(shortname)',
                })

                .update() // update the elements in the graph with the new style
                ;
    });

    $("#color-code-degree").click(function (evt) {
        var centralities = cy.elements().degreeCentralityNormalized();

        cy.nodes().forEach(function (ele) {
            ele.data('centrality', normalizedToColor(centralities.degree_n(ele)));
        });
    });

    $("#color-code-closeness").click(function (evt) {
        var centralities = cy.elements().closenessCentralityNormalized();

        cy.nodes().forEach(function (ele) {
            ele.data('centrality', normalizedToColor(centralities.closeness_n(ele)));
        }); 
    });
    
    $("#color-code-betweenness").click(function (evt) {
        var centralities = cy.elements().betweennessCentrality();

        cy.nodes().forEach(function (ele) {
            ele.data('centrality', normalizedToColor(centralities.betweenness_n(ele)));
        }); 
    });
    
    $("#color-code-clear").click(function (evt) {
        cy.nodes().forEach(function (ele) {
            ele.data('centrality', '#D3D3D3');
        }); 
    });

    $("#save-as-sbgnml").click(function (evt) {
        var deneme = cy.json().elements;
        var blob = new Blob([JSON.stringify(deneme, null, 4)], {
            type: "text/plain;charset=utf-8;",
        });
        saveAs(blob, "network.json")
    });

    $("body").on("click", ".biogene-info .expandable", function (evt) {
        var expanderOpts = {slicePoint: 150,
            expandPrefix: ' ',
            expandText: ' (...)',
            userCollapseText: ' (show less)',
            moreClass: 'expander-read-more',
            lessClass: 'expander-read-less',
            detailClass: 'expander-details',
            expandEffect: 'fadeIn',
            collapseEffect: 'fadeOut'
        };

        $(".biogene-info .expandable").expander(expanderOpts);
        expanderOpts.slicePoint = 2;
        expanderOpts.widow = 0;
    });


});
