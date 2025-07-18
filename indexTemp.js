var svg = d3.select('svg');

// Append a circle element to the SVG
//d3.select('svg').append('circle').attr('cx', 50).attr('cy', 50).attr('r', 40).attr('fill', 'blue');
// Bind data and append new circle elements and turn them red
//svg.selectAll('circle').attr('fill', 'red');




// import Domestic Auto Production data from years 1993 - 2025 seasonally adjusted - DAUPSA.csv
const daupsa = d3.csv("DAUPSA.csv").then(function(data) {
    
    // Create a line chart with the data
    const lineChart = svg.append("g")
        .attr("transform", "translate(50, 50)");



    // Create scales for x axes - Dates
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => Date(d.observation_date)))
        .range([0, 387]);


    // Create scales 
    // const xScale = d3.scaleTime(d3.domain([new Date(1993, 0, 1), new Date(2025, 0, 1)]), 
    //                             d3.range([0, 387]));
 
    // Create scales for y axes - DAUPSA values
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.DAUPSA)])
        .range([0, 387]);


    // Add axes
    lineChart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${400})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    lineChart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));


    // Create line generator
    // const line = d3.line()
    //     .x(d => xScale(d.observation_date))
    //     .y(d => yScale(d.DAUPSA));

    // // Append the line path
    // lineChart.append("path")
    //     .datum(data)
    //     .attr("fill", "none")
    //     .attr("stroke", "steelblue")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", line);

});

