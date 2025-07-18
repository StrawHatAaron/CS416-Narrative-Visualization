// Declare the chart dimensions and margins.
const width = 928;
const height = 500;
const marginTop = 20;
const marginRight = 30;
const marginBottom = 30;
const marginLeft = 40;


// Create the SVG container.
  const svg = d3.select("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");



// import Domestic Auto Production data from years 1993 - 2025 seasonally adjusted - DAUPSA.csv
const daupsa = d3.csv("DAUPSA.csv").then(function(data) {

    // Declare the x (horizontal position) scale.
    const x = d3.scaleUtc(d3.extent(data, d => Date(d.observation_date)), [marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear([0, d3.max(data, d => Number(d.DAUPSA))], [height - marginBottom, marginTop]);


    
    // console.log(Math.max(data, d => d.DAUPSA));
    console.log(data.map(d => d.observation_date));
    
    // // Add the x-axis.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    // // Add the y-axis, remove the domain line, add grid lines and a label.
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).ticks(height / 20))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("↑ DAUPSA ($ Millions)"));

    // // Declare the line generator.
    const line = d3.line()
        .x(d => x(d.observation_date))
        .y(d => y(d.DAUPSA));


});


