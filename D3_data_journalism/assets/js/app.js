//set up svg
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };
  
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  
  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {

// Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
      });

// Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(healthData, d => d.obesity)])
      .range([0, width])
      .nice();

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.poverty)])
      .range([height, 0])
      .nice();

// Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

// Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

// Create Circles with state lables
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "15")
    .attr("fill", "blue")
    .classed("stateCircle", true)
    .attr("opacity", ".75");

    //adding the state label to each circle
    var circleLabels = chartGroup.selectAll(null).data(healthData).enter().append("text");

    circleLabels
    .attr("x", function(d) {
        return xLinearScale(d.obesity);
    })
    .attr("y", function(d) {
        return yLinearScale(d.poverty);
    })
    .text(function(d) {
        return d.abbr;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "black");
 

// Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Obesity Rate: ${d.obesity}<br>Poverty Rate: ${d.poverty}`);
      });
  
// Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

// Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
        toolTip.style("display", "block")
        toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });          

// Create axes labels
     chartGroup.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0 - margin.left + 40)
     .attr("x", 0 - (height / 2))
     .attr("dy", "1em")
     .attr("class", "axisText")
     .text("Poverty Rate (%)");

   chartGroup.append("text")
     .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
     .attr("class", "axisText")
     .text("Obesity Rate (%)");
 }).catch(function(error) {
   console.log(error);
 });   

