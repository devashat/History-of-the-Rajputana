var margin = { top: 200, right: 80, bottom: 250, left: 125 },
    margin2 = { top: 550, right: 80, bottom: 50, left: 0 },
    width = 1000 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom,
    height2 = 750 - margin2.top - margin2.bottom;

var dynasty = "Sisodia";
var dynastyFile = "sisodias.json";


var tooltip = d3.select("#timelineDiv").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var warTooltip = d3.select("#timelineDiv").append("div")
    .attr("class", "warTooltip")
    .style("opacity", 0);

var svgTimeline = d3.select("#timelineDiv").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var legend = d3.select("#legendDiv")
    .append("svg")
    .attr("class", "svgLegend")
    .attr("width", 250)
    .attr("height", 200);

legend.append("rect").attr("class", "sisodia")
    .attr("width", 50)
    .attr("height", 25)
    .style("rx", 3);

legend.append("rect").attr("class", "rathore")
    .attr("width", 50)
    .attr("height", 25)
    .attr("x", 0)
    .attr("y", 65)
    .style("rx", 3);

legend.append("rect").attr("class", "noDyna")
    .attr("width", 50)
    .attr("height", 25)
    .attr("x", 0)
    .attr("y", 130)
    .style("rx", 3);

legend.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .text("Sisodia Dynasty Kings");

legend.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .text("(Darker = Longer Reign)");

legend.append("text")
    .attr("x", 0)
    .attr("y", 105)
    .text("Rathore Dynasty Kings");

legend.append("text")
    .attr("x", 0)
    .attr("y", 125)
    .text("(Darker = Longer Reign)");

legend.append("text")
    .attr("x", 0)
    .attr("y", 170)
    .text("Kings With No Dynasty");

var svgGradient = d3.select(".svgLegend")
    .append('linearGradient')
    .attr('id', 'mainGradient');

var svgGradient2 = d3.select(".svgLegend")
    .append('linearGradient')
    .attr('id', 'mainGradient2');

svgGradient.append('stop')
    .attr('class', 'stop-left1')
    .attr('offset', '0');

svgGradient.append('stop')
    .attr('class', 'stop-right1')
    .attr('offset', '1');

svgGradient2.append('stop')
    .attr('class', 'stop-left2')
    .attr('offset', '0');

svgGradient2.append('stop')
    .attr('class', 'stop-right2')
    .attr('offset', '1');

var warTimeline = svgTimeline
    .append("g")
    .attr("class", "wars")
    .attr("transform", "translate(" + margin.left + ", 40)");

var kingTimeLine = svgTimeline
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "kingtime");

var context = svgTimeline.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin.left + "," + margin2.top + ")");

var xScale = d3.scaleTime().range([0, width]);
var xScale2 = d3.scaleTime().range([0, width]);
var yScale = d3.scaleBand().rangeRound([0, height]).padding(0.1);
var yScale2 = d3.scaleBand().rangeRound([0, height2]).padding(0.1);

var colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(3);
var colorScaleSisodia = d3.scaleQuantile()
    .domain([1,100])
    .range(["#90c2de", "#85bcdc", "#75b3d7", "#59a1cf",  "#4a96c9", "#4895c8", "#4794c8", "#408fc4", "#3f8ec4", "#3e8dc3", "#3d8cc3", "#3c8bc2", "#3b8ac2", "#3a89c1", "#3988c1", "#3787c0", "#3686c0", "#3585bf", "#3484bf", "#3383be", "#3282bd", "#3181bd", "#3080bc", "#2f7fbc", "#2e7ebb", "#2d7dbb", "#2c7cba", "#2b7bb9", "#2a7ab9", "#2979b8", "#2878b8", "#2777b7", "#2676b6", "#2574b6", "#2473b5", "#2372b4", "#2371b4", "#2270b3", "#216fb3", "#206eb2", "#1f6db1", "#1e6cb0", "#1d6bb0", "#1c6aaf", "#1c69ae", "#1b68ae", "#1a67ad", "#1966ac", "#1865ab", "#1864aa", "#1763aa", "#1662a9", "#1561a8", "#1560a7", "#145fa6", "#135ea5", "#135da4", "#125ca4", "#115ba3", "#115aa2", "#1059a1", "#1058a0", "#0f579f", "#0e569e", "#0e559d", "#0e549c", "#0d539a", "#0d5299", "#0c5198", "#0c5097", "#0b4f96", "#0b4e95", "#0b4d93", "#0b4c92", "#0a4b91", "#0a4a90", "#0a498e", "#0a488d", "#09478c", "#09468a", "#094589", "#094487", "#094386", "#094285", "#094183", "#084082", "#083e80", "#083d7f", "#083c7d", "#083b7c", "#083a7a", "#083979", "#083877", "#083776", "#083674", "#083573", "#083471", "#083370", "#08326e", "#08316d", "#08306b"]);
var colorScaleRathore = d3.scaleQuantile()
    .domain([1, 100])
    .range(["#e6352a", "#e5342a", "#e43229", "#e33128", "#e23028", "#e12f27", "#e02e27", "#df2d26", "#de2c26", "#dd2b25", "#dc2a25", "#db2924", "#da2824", "#d92723", "#d72623", "#d62522", "#d52422", "#d42321", "#d32221", "#d22121", "#d12020", "#d01f20", "#ce1f1f", "#cd1e1f", "#cc1d1f", "#cb1d1e", "#ca1c1e", "#c91b1e", "#c71b1d", "#c61a1d", "#c5191d", "#c4191c", "#c3181c", "#c2181c", "#c0171b", "#bf171b", "#be161b", "#bd161a", "#bb151a", "#ba151a", "#b91419", "#b81419", "#b61419", "#b51319", "#b41318", "#b21218", "#b11218", "#b01218", "#ae1117", "#ad1117", "#ac1117", "#aa1017", "#a91016", "#a71016", "#a60f16", "#a40f16", "#a30e15", "#a10e15", "#a00e15", "#9e0d15", "#9c0d14", "#9b0c14", "#990c14", "#970c14", "#960b13", "#940b13", "#920a13", "#900a13", "#8f0a12", "#8d0912", "#8b0912", "#890812", "#870811", "#860711", "#840711", "#820711", "#800610", "#7e0610", "#7c0510", "#7a0510", "#78040f", "#76040f", "#75030f", "#73030f", "#71020e", "#6f020e", "#6d010e", "#6b010e", "#69000d", "#67000d"]);

var colorScaleWars = d3.scaleOrdinal(d3.schemeTableau10).domain(3);

var parseDate = d3.timeParse("%d %B %Y");
var formatTime = d3.timeFormat("%B %d, %Y");

var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")).ticks(5);
var xAxis2 = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")).ticks(5);
var yAxis = d3.axisLeft(yScale);
var yAxis2 = d3.axisLeft(yScale2);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("start brush end", brushed);

// clips time rects to the graph so it won't go over the axis
svgTimeline.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

var color = d3.scaleThreshold()
    .domain([0.0, 0.1, 0.2, 0.3, 0.5, 0.6, 1, 1.3])
    .range(d3.schemeYlGnBu[9]);

d3.csv("kings.csv", function (error, data) {
    if (error) throw error;

    //xScale.domain([function(d) {return d3.min(parseDate(d.start));}, function(d) {return d3.max(parseDate(d.end));}]);
    xScale.domain([new Date(1200, 0, 0), new Date(1801, 0, 0)]);
    yScale.domain(data.map(function (d) { return d.dynasty; }));
    xScale2.domain(xScale.domain());
    yScale2.domain(yScale.domain());

    kingTimeLine.append("g").selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("class", "timeRect")
        .attr("id", function (d) { return d.name.replaceAll(' ', ''); })
        .attr("y", function (d) { return yScale(d.dynasty); })
        .attr("x", function (d) { return xScale(parseDate(d.start)); })
        .attr("color", function (d) {
            if (d.dynasty.localeCompare("Sisodia") == 0) {
                console.log("" +d.reign+ " " + colorScaleSisodia(d.reign))
                return colorScaleSisodia(d.reign);
            } else {
                return colorScaleRathore(d.reign);
            };
        })
        .attr("width", function (d) { return (xScale(parseDate(d.end)) - xScale(parseDate(d.start))); })
        .attr("height", yScale.bandwidth())
        .style("fill", function (d) {
            if (d.dynasty === "Sisodia") {
                return colorScaleSisodia(d.reign);
            } else {
                return colorScaleRathore(d.reign);
            };
        })
        .style("rx", 3)
        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("<b>" + d.name + "</b> <br>" + formatTime(parseDate(d.birth)) + " - " + formatTime(parseDate(d.death)) + "<br><br> <b>Reign</b> <br>" + formatTime(parseDate(d.start)) + " - " + formatTime(parseDate(d.end)))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });



    kingTimeLine.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    kingTimeLine.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis)
        .append("text");

    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    context.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("y", function (d) { return yScale2(d.dynasty); })
        .attr("x", function (d) { return xScale2(parseDate(d.start)); })
        .attr("width", function (d) { return (xScale2(parseDate(d.end)) - xScale2(parseDate(d.start))); })
        .attr("height", yScale2.bandwidth())
        .style("fill", function (d) {
            if (d.dynasty === "Sisodia") {
                return colorScaleSisodia(d.reign);
            } else {
                return colorScaleRathore(d.reign);
            };
        })
        .style("rx", 3);

    context.append("g")
        .attr("class", "brush")
        .attr("x", 125)
        .call(brush)
        .call(brush.move, xScale.range());

});

d3.csv("wars&enemies.csv", function (error, data) {
    if (error) throw error;

    xScale.domain([new Date(1200, 0, 0), new Date(1801, 0, 0)]);
    yScale.domain(["Wars"]);
    xScale2.domain(xScale.domain());
    yScale2.domain(yScale.domain());

    warTimeline.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis2)
        .append("text");

    warTimeline.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("class", "circle")
        .attr('cx', function (d) { //console.log(parseDate(d.start)); 
            return xScale2(parseDate(d.start));
        })
        .attr('cy', function (d) { return yScale2(["Wars"]) + 50; })
        .attr('r', 10)
        .style('fill', function (d) {
            if (d3.select(("#" + d.king).replaceAll(' ', '')).size() != 0) {
                //console.log(d3.select(("#" + d.king).replaceAll(' ', '')).attr("color"));
                return d3.select(("#" + d.king).replaceAll(' ', '')).attr("color");
            }
            return "#89ff27";
        }) // wars of unshown kings
        .style('opacity', '0.6')
        .on("mouseover", function (d) {
            warTooltip.transition()
                .duration(200)
                .style("opacity", .9);
            warTooltip.html("<b>" + d.war + "</b> <br>" + formatTime(parseDate(d.start)) + " - " + formatTime(parseDate(d.end)) + "<br><br> <b>King vs Enemy</b> <br>" + d.king + " v. " + d.enemies + "<br><br> <b>Location</b> <br>" + d.location)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            warTooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

});


function brushed(d) {
    xScale.domain([xScale2.invert(d3.event.selection[0]), xScale2.invert(d3.event.selection[1])]);
    svgTimeline.selectAll(".xaxis").call(xAxis);
    //svgTimeline.selectAll(".topAxis").call(xAxis2);

    svgTimeline.selectAll(".timeRect")
        .attr("x", function (d) { return xScale(parseDate(d.start)); })
        .attr("width", function (d) { return (xScale(parseDate(d.end)) - xScale(parseDate(d.start))); });

    svgTimeline.selectAll(".circle")
        .attr('cx', function (d) { return xScale(parseDate(d.start)); });
}

var dmargin = { top: 0, right: 80, bottom: 0, left: 250 }
dwidth = 2800 - dmargin.left - dmargin.right,
    dheight = 300 - dmargin.top - dmargin.bottom;

var dynasty = "Sisodia";
var dynastyFile = "sisodias.json";

var svgDenogram = d3.select("#dynastyDiv").append("svg")
    .attr("width", dwidth + dmargin.left + dmargin.right)
    .attr("height", dheight + dmargin.top + dmargin.bottom)
    .append("g")
    .attr("transform", "translate(" + dmargin.left + "," + dmargin.top + ")");

drawDenoGram();

function drawDenoGram() {

    d3.json(dynastyFile, function (error, treeData) {
        if (error) return console.error(error);

        var i = 0,
            duration = 750,
            root;

        // declares a tree layout and assigns the size
        var treemap = d3.tree().size([height, width]);

        // Assigns parent, children, height, depth
        root = d3.hierarchy(treeData, function (d) { return d.children; });
        root.x0 = height / 2;
        root.y0 = 0;

        // Collapse after the second level
        root.children.forEach(collapse);

        update(root);

        // Collapse the node and all it's children
        function collapse(d) {
            if (d.children) {
                d._children = d.children
                d._children.forEach(collapse)
                d.children = null
            }
        }

        function update(source) {

            // Assigns the x and y position for the nodes
            var treeData = treemap(root);

            // Compute the new tree layout.
            var nodes = treeData.descendants(),
                links = treeData.descendants().slice(1);

            // Normalize for fixed-depth.
            nodes.forEach(function (d) { d.y = d.depth * 180 });

            // ****************** Nodes section ***************************

            // Update the nodes...
            var node = svgDenogram.selectAll('g.node')
                .data(nodes, function (d) { return d.id || (d.id = ++i); });

            // Enter any new modes at the parent's previous position.
            var nodeEnter = node.enter().append('g')
                .attr('class', 'node')
                .attr("transform", function (d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                .on('click', click);

            // Add Circle for the nodes
            nodeEnter.append('circle')
                .attr('class', 'node')
                .attr('r', 1e-6)
                .style("fill", function (d) {
                    return d._children ? "#FFE562" : "#fff";
                });

            // Add labels for the nodes
            nodeEnter.append('text')
                .attr("dy", ".35em")
                .attr("x", function (d) {
                    return d.children || d._children ? -13 : 13;
                })
                .attr("text-anchor", function (d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function (d) { return d.data.name; });

            // UPDATE
            var nodeUpdate = nodeEnter.merge(node);

            // Transition to the proper position for the node
            nodeUpdate.transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            // Update the node attributes and style
            nodeUpdate.select('circle.node')
                .attr('r', 10)
                .style("fill", function (d) {
                    return d._children ? "#FFE562" : "#fff";
                })
                .attr('cursor', 'pointer');


            // Remove any exiting nodes
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + source.y + "," + source.x + ")";
                })
                .remove();

            // On exit reduce the node circles size to 0
            nodeExit.select('circle')
                .attr('r', 1e-6);

            // On exit reduce the opacity of text labels
            nodeExit.select('text')
                .style('fill-opacity', 1e-6);

            // ****************** links section ***************************

            // Update the links...
            var link = svgDenogram.selectAll('path.link')
                .data(links, function (d) { return d.id; });

            // Enter any new links at the parent's previous position.
            var linkEnter = link.enter().insert('path', "g")
                .attr("class", "link")
                .attr('d', function (d) {
                    var o = { x: source.x0, y: source.y0 }
                    return diagonal(o, o)
                });

            // UPDATE
            var linkUpdate = linkEnter.merge(link);

            // Transition back to the parent element position
            linkUpdate.transition()
                .duration(duration)
                .attr('d', function (d) { return diagonal(d, d.parent) });

            // Remove any exiting links
            var linkExit = link.exit().transition()
                .duration(duration)
                .attr('d', function (d) {
                    var o = { x: source.x, y: source.y }
                    return diagonal(o, o)
                })
                .remove();

            // Store the old positions for transition.
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });

            // Creates a curved (diagonal) path from parent to the child nodes
            function diagonal(s, d) {

                path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

                return path
            }

            // Toggle children on click.
            function click(d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                update(d);
            }
        }

    });

}

var data = ["Sisodia", "Rathore"];

var select = d3.select('#dynastySelectDiv')
    .append('select')
    .attr('class', 'select')
    .on('change', onchange)

var options = select
    .selectAll('option')
    .data(data).enter()
    .append('option')
    .text(function (d) { return d; });

function onchange() {
    selectValue = d3.select('select').property('value')

    if (selectValue === "Sisodia")
        dynastyFile = "sisodias.json"
    if (selectValue === "Rathore")
        dynastyFile = "rathores.json"

    svgDenogram.selectAll('*').remove();

    drawDenoGram();
};