// @TODO: YOUR CODE HERE!

var svgWidth = 900
var svgHeight = 600;

var margin = {
    top: 40,
    right: 40,
    bottom: 80,
    left: 90
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("assets/data/data.csv").then(function(data){

    data.forEach(function(myData) {
        myData.poverty = +myData.poverty
        myData.healthcare = +myData.healthcare    
    })

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.poverty) - 1, d3.max(data, d => d.poverty)])
        .range([0, chartWidth])


    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.healthcare) - 1, d3.max(data, d => d.healthcare)])
        .range([chartHeight, 0])


    var bottomAxis = d3.axisBottom(xLinearScale).ticks(7);
    var leftAxis = d3.axisLeft(yLinearScale);


    chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);


    chartGroup.append("g")
        .call(leftAxis);


    var circlesGroup = chartGroup.selectAll("circle")

        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 13)
        .attr("fill", "#6495ED")
        .attr("opacity", ".5");


    var circlesGroup = chartGroup.selectAll()
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .style("font-size", "9px")
        .style("text-anchor", "middle")
        .style('fill', 'white')
        .text(d => (d.abbr));


    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .style("padding", "5px")
        .style("text-align", "center")
        .style("background-color", "black")
        .style("color", "white")
        .style("border-radius", "5px")
        .style("font-size", "14px")
        .offset([100, -70])
        .html(function (d) {
            return (`${d.state}<br><br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}% `);
        });

    chartGroup.call(toolTip);

    circlesGroup
        .on("mouseover", function (myData) {
        toolTip.show(myData, this);
    })
        .on("mouseout", function (myData) {
        toolTip.hide(myData);
    });


    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("HealthCare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
});

