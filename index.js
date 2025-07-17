var svg = d3.select('svg');

// Append a circle element to the SVG
//d3.select('svg').append('circle').attr('cx', 50).attr('cy', 50).attr('r', 40).attr('fill', 'blue');
// Bind data and append new circle elements and turn them red
//svg.selectAll('circle').attr('fill', 'red');



// import Domestic Auto Production data from years 1994 - 2025 seasonally adjusted - DAUPSA.csv
const daupsa = d3.csv("DAUPSA.csv").then(function(data) {
    // create a bar chart with the Domestic Auto Production data
    
    // Parse the data
    data.forEach(function(d) {
        d.observation_date = +d.observation_date;
        d.DAUPSA = +d.DAUPSA;
    });

    // Set the dimensions of the SVG
    const width = 800;
    const height = 400;

    // Create scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.DAUPSA)])
        .range([height, 0]);

    // Append a group element to the SVG
    const g = svg.append('g')
        .attr('transform', `translate(50, 50)`);

    // Create bars
    g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.observation_date))
        .attr('y', d => yScale(d.DAUPSA))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.DAUPSA))
        .attr('fill', 'steelblue');

    // Add axes
    g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    g.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(yScale));
});

