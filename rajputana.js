var margin = { top: 20, right: 80, bottom: 30, left: 70 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


var svgTimeline = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleLinear().range([width, 0]);
var yScale = d3.scaleBand().rangeRound([0, height]).padding(0.1);

var xAxis = d3.axisBottom(xScale).ticks(5);
var yAxis = d3.axisLeft(yScale);

var parseDate = d3.timeFormat("%Y-%b-%d %H:%M:%S");
d3.csv("sampleCsv.csv", function (error, data) {
    if (error) throw error;

    xScale.domain([1200, 1700]);
    yScale.domain(data.map(function (d) { return d.name; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text");

}); 