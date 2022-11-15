var margin = { top: 20, right: 80, bottom: 30, left: 125 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


var svgTimeline = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svgDenogram = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleTime().range([width, 0]);
var yScale = d3.scaleBand().rangeRound([0, height]).padding(0.1);
var colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(3);

var parseDate = d3.timeParse("%d %B %Y");

var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")).ticks(5);
var yAxis = d3.axisLeft(yScale);

d3.csv("sampleCsv.csv", function (error, data) {
    if (error) throw error;

    //xScale.domain([function(d) {return d3.min(parseDate(d.start));}, function(d) {return d3.max(parseDate(d.end));}]);
    xScale.domain([new Date(1800, 0, 0), new Date(1100, 0, 0)]);
    yScale.domain(data.map(function (d) { return d.name; }));

    svgTimeline.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svgTimeline.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text");

    svgTimeline.append("g").selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("class", "rect")
        .attr("y", function (d) { return yScale(d.name); })
        .attr("x", function (d) { return xScale(parseDate(d.start)); })
        .attr("width", function (d) { return (xScale(parseDate(d.end)) - xScale(parseDate(d.start))); })
        .attr("height", yScale.bandwidth())
        .style("fill", function (d) { return colorScale(d.name); });

});

d3.json("sample.json", function (error, data) {
    if (error) return console.error(error);

    var cluster = d3.cluster()
        .size([height, width - 100]);  // 100 is the margin I will have on the right side

    // Give the data to this cluster layout:
    var root = d3.hierarchy(data, function (d) {
        return d.children;
    });
    cluster(root);

    svgDenogram.selectAll('path')
        .data(root.descendants().slice(1))
        .enter()
        .append('path')
        .attr("d", function (d) {
            return "M" + d.y + "," + d.x
                + "C" + (d.parent.y + 50) + "," + d.x
                + " " + (d.parent.y + 150) + "," + d.parent.x // 50 and 150 are coordinates of inflexion, play with it to change links shape
                + " " + d.parent.y + "," + d.parent.x;
        })
        .style("fill", 'none')
        .attr("stroke", '#ccc');

    svgDenogram.selectAll("g")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")"
        })
        .append("circle")
        .attr("r", 7)
        .style("fill", "#69b3a2")
        .attr("stroke", "black")
        .style("stroke-width", 2);

});