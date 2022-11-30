var margin = { top: 200, right: 80, bottom: 250, left: 125 },
    margin2 = { top: 550, right: 80, bottom: 50, left: 0 },
    width = 1000 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom,
    height2 = 750 - margin2.top - margin2.bottom;

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var warTooltip = d3.select("body").append("div")
    .attr("class", "warTooltip")
    .style("opacity", 0);

var svgTimeline = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var legend = d3.select("#legendDiv")
    .append("svg")
    .attr("class", "svgLegend")
    .attr("width", 175)
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
    .attr("y", 105)
    .text("Rathore Dynasty Kings");

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
var colorScaleSisodia = d3.scaleOrdinal()
    .domain(1, 20)
    .range(["#90c2de", "#7bb6d9", "#5fa6d1", "#3e8dc3", "#2d7dbb", "#2979b8", "#206eb2", "#1c6aaf", "#1966ac", "#1865ab", "#1763aa", "#0f579f", "#094589", "#083776", "#083370", "#08326e", "#08316d", "#08306b"]);
var colorScaleRathore = d3.scaleOrdinal()
    .domain(1, 20)
    .range(["#fb7859", "#f86448", "#f34e38", "#ee4332", "#df2d26", "#d92723", "#d72623", "#d62522", "#d52422", "#c91b1e", "#b61419", "#b51319", "#b41318", "#b21218", "#b11218", "#b01218", "#ae1117", "#ad1117", "#940b13", "#920a13", "#900a13", "#8f0a12", "#69000d", "#67000d"]);

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
                return colorScaleSisodia(d.name);
            } else {
                return colorScaleRathore(d.name);
            };
        })
        .attr("width", function (d) { return (xScale(parseDate(d.end)) - xScale(parseDate(d.start))); })
        .attr("height", yScale.bandwidth())
        .style("fill", function (d) {
            if (d.dynasty === "Sisodia") {
                return colorScaleSisodia(d.name);
            } else {
                return colorScaleRathore(d.name);
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

    // kingTimeLine.selectAll(".timeRect")
    //     .data(data)
    //     .append("text")
    //     .text(function (d) {
    //         return d.name
    //     })
    //     .attr("transform", "rotate(-90)");

    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    // context.append("g")
    //     .attr("class", "axis axis--y")
    //     .call(yAxis2)
    //     .append("text");

    context.selectAll("rect")
        .data(data)
        .enter().append("rect")
        //.attr("class", "rect")
        .attr("y", function (d) { return yScale2(d.dynasty); })
        .attr("x", function (d) { return xScale2(parseDate(d.start)); })
        .attr("width", function (d) { return (xScale2(parseDate(d.end)) - xScale2(parseDate(d.start))); })
        .attr("height", yScale2.bandwidth())
        .style("fill", function (d) {
            if (d.dynasty === "Sisodia") {
                return colorScaleSisodia(d.name);
            } else {
                return colorScaleRathore(d.name);
            };
        })
        .style("rx", 3);

    context.append("g")
        .attr("class", "brush")
        .attr("x", 125)
        .call(brush)
        .call(brush.move, xScale.range());

    //[xScale(1400), xScale(1600)]

});

d3.csv("wars&enemies.csv", function (error, data) {
    if (error) throw error;

    xScale.domain([new Date(1200, 0, 0), new Date(1801, 0, 0)]);
    yScale.domain(["Wars"]);
    xScale2.domain(xScale.domain());
    yScale2.domain(yScale.domain());

    // warTimeline.append("g")
    //     .attr("class", "topAxis")
    //     .attr("transform", "translate(0," + height2 + ")")
    //     .call(xAxis2);

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
        //.attr('r', function (d) { return (xScale2(parseDate(d.end)) - xScale2(parseDate(d.start)));})
        .attr('r', 10)
        .style('fill', function (d) {
            //console.log((""+d.king).replaceAll(' ','')); 
            if (d3.select(("#" + d.king).replaceAll(' ', '')).size() != 0) {
                //console.log(d3.select(("#"+d.king).replaceAll(' ','')).attr("color"));
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



var svgDenogram = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("sample.json", function (error, treeData) {
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