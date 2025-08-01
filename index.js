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




function clearSVG() {
    svg.selectAll("*").remove();
}

function updateSVG(type) {
    clearSVG();
    switch (type) {
    case "circle":
        svg.append("circle")
            .attr("cx", 150).attr("cy", 100).attr("r", 50)
            .attr("fill", "steelblue");
        break;
    case "rect":
        svg.append("rect")
            .attr("x", 75).attr("y", 50)
            .attr("width", 150).attr("height", 100)
            .attr("fill", "tomato");
        break;

    case "line":
        svg.append("line")
            .attr("x1", 50).attr("y1", 150)
            .attr("x2", 250).attr("y2", 50)
            .attr("stroke", "green").attr("stroke-width", 4);
        break;

    case "daupsa":
        // import Domestic Auto Production data from years 1993 - 2025 seasonally adjusted - DAUPSA.csv
        const daupsa = d3.csv("DAUPSA.csv").then(function(data) {

            // Declare the x (horizontal position) scale.
            const x = d3.scaleUtc(d3.extent(data, d => new Date(d.observation_date)), [marginLeft, width - marginRight]);

            // Declare the y (vertical position) scale.
            const y = d3.scaleLinear([0, 600], [height - marginBottom, marginTop]);

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
                    .text("Thousands of Units"));

            // // Declare the line generator.
            const line = d3.line()
                .x(d => x(new Date(d.observation_date)))
                .y(d => y(Number(d.DAUPSA)));

            // Append a path for the line.
            svg.append("path")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line(data));

            // Add a title to the chart.
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", marginTop)
                .attr("text-anchor", "middle")
                .attr("font-size", "1.5em")
                .text("Domestic Auto Production (DAUPSA) from 1993 to 2025");
        });
        break;
    }
}

// Button interaction
d3.selectAll("#controls button").on("click", function() {
    d3.selectAll("button").classed("active", false);
    d3.select(this).classed("active", true);
    const type = d3.select(this).attr("data-type");
    updateSVG(type);
});

// Initial render
updateSVG("circle");
d3.select("[data-type='circle']").classed("active", true);












      



