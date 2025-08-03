// index.js - Aaron Miller

// Fetch Domestic Auto Production fetchedData from years 1993 - 2025 seasonally adjusted - DAUPSA.csv.
async function fetchDomesticAutoData() {
    const data = await d3.csv("DAUPSA.csv").catch(error => {
        console.error('CSV load error:', error);
    });
    return data;
}
// Fetch Motor Vehicle Retail Sales: Domestic Autos - DAUTONSA.csv.
async function fetchDomesticAutoSalesData() {
    const data = await d3.csv("DAUTONSA.csv").catch(error => {
        console.error('CSV load error:', error);
    });
    return data;
}

// Fetch Motor Vehicle Retail Sales: Domestic Light Weight Trucks - DLTRUCKSNSA.csv.
async function fetchDomesticLightWeightTruckSalesData() {
    const data = await d3.csv("DLTRUCKSNSA.csv").catch(error => {
        console.error('CSV load error:', error);
    });
    return data;
        }

//MAIN FUNCTION
async function main() {
    // Declare the chart dimensions and margins.
    const width = 928;
    const height = 525;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    // Create the SVG container.
    const svg = d3.select("svg#chart")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("viewBox", [0, 0, width, height])
                    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const svg_legend = d3.select("svg#legend")
        .attr("width", 200)
        .attr("height", 100)
        .attr("viewBox", [0, 0, 200, 100]);  

    const h2 = d3.select("h2")
        .style("text-align", "center");

    // Declare a variable to hold data for Domestic Auto Production (DAUPSA)
    const domesticAutoData = await fetchDomesticAutoData();
    console.log("fetchDomesticAutoData returned value", domesticAutoData);

    // Declare a variable to hold data for Motor Vehicle Retail Sales: Domestic Autos (DAUTONSA).
    const domesticAutoSalesData = await fetchDomesticAutoSalesData();
    // Declare a variable to hold data for Motor Vehicle Retail Sales: Domestic Light Weight Trucks (DLTRUCKSNSA)
    const domesticLightWeightTruckSalesData = await fetchDomesticLightWeightTruckSalesData();

    // Clear the SVG container.
    function clearSVG() {
        svg.selectAll("*").remove();
        svg_legend.selectAll("*").remove();
        h2.select("*").remove();

    }

    function drawGraphBounds(x, y) {
        // Add the X-axis.
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));
        // Y-Axis Setup with Gridlines and Labe
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
    }

    // Function to draw a line and add points with tooltips.
    function drawLineAddPoints(data, x, y, color, fieldName) {
        // Create a tooltip for displaying data on hover.
        const tooltip = d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .style("position", "absolute")
                        .style("background", color)
                        .style("padding", "6px")
                        .style("border", "1px solid #ccc")
                        .style("border-radius", "4px")
                        .style("pointer-events", "none")
                        .style("opacity", 0);
        // Declare the line generator.
        const line = d3.line()
            .x(d => x(new Date(d.observation_date)))
            .y(d => y(Number(d[fieldName])));
        // Append a path for the line.
        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 1.5)
            .attr("d", line(data));
        // Add points of tooltip data
        svg.selectAll(".dot" + fieldName) 
            .data(data)
            .enter().append("circle")
            .attr("class", "dot" + fieldName)
            .attr("cx", d => x(new Date(d.observation_date)))
            .attr("cy", d => y(Number(d[fieldName])))
            .attr("r", 4)
            .attr("fill", color)
            .attr("opacity", 0.6)
            .on("mouseover", (event, d) => {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(`<strong>Date:</strong> ${d.observation_date}<br>`+
                            `<strong>Thousands of Units:</strong> ${d[fieldName]}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip.transition().duration(500).style("opacity", 0);
            });
    }

    function drawChartDAUPSA() {
        console.log(domesticAutoData);
        // Declare the x (horizontal position) scale.
        const x = d3.scaleUtc(d3.extent(domesticAutoData, d => new Date(d.observation_date)), [marginLeft, width - marginRight]);
        // Declare the y (vertical position) scale.
        const y = d3.scaleLinear([0, 600], [height - marginBottom, marginTop]);
        // Draw the graph bounds.
        drawGraphBounds(x, y)
        // Draw the line and points for Domestic Auto Production (DAUPSA).          
        drawLineAddPoints(domesticAutoData, x, y, "steelblue", "DAUPSA");
        // Add the title to the chart.
        h2.text("Domestic Auto Production (DAUPSA) from 1993 to 2025 (Seasonally Adjusted)"); 
    }

    function drawChartSales() {
        // Declare the x (horizontal position) scale.
        const x_auto = d3.scaleUtc(d3.extent(domesticAutoSalesData, d => new Date(d.observation_date)), [marginLeft, width - marginRight]);
        const x_truck = d3.scaleUtc(d3.extent(domesticLightWeightTruckSalesData, d => new Date(d.observation_date)), [marginLeft, width - marginRight]);
        // Declare the y (vertical position) scale.
        const y = d3.scaleLinear([50, 1100], [height - marginBottom, marginTop]);
        // Draw the graph bounds.
        drawGraphBounds(x_auto, y);
        // Draw the line and points for Domestic Auto Sales (DAUTONSA).
        drawLineAddPoints(domesticAutoSalesData, x_auto, y, "steelblue", "DAUTONSA");
        // Draw the line and points for Domestic Light Weight Truck Sales (DLTRUCKSNSA).
        drawLineAddPoints(domesticLightWeightTruckSalesData, x_truck, y, "coral", "DLTRUCKSNSA");



        // Add a legend to differentiate between the two lines DAUTONSA and DLTRUCKSNSA.
        const legend = svg_legend.append("g")
            .attr("transform", "translate(20,20)");
        const items = [ { color: "steelblue", label: "Domestic Autos (DAUTONSA)" },
                        { color: "coral", label: "Light Weight Trucks (DLTRUCKSNSA)" }];

        items.forEach((item, i) => {
            const y = i * 20;
            legend.append("circle")
                .attr("cx", 0)
                .attr("cy", y)
                .attr("r", 6)
                .style("fill", item.color);
            legend.append("text")
                .attr("x", 12)
                .attr("y", y + 4)
                .text(item.label)
                .style("font-size", "12px")
                .attr("alignment-baseline", "middle");
        });

        


        // Add a title to the chart.
        h2.text("Motor Vehicle Retail Sales for Domestic Autos and Domestic Light Weight Trucks from 1967 to 2025 (Not Seasonally Adjusted)"); 
    }

    // Update the SVG based on the selected storyline
    function updateSVG(type) {
        clearSVG();
        switch (type) {
        case "one":
            drawChartSales();
            break;
        case "two":
            drawChartDAUPSA();
            break;
        case "three":
            drawChartSales();
            break;
        case "four-daupsa":
            drawChartDAUPSA();
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
    updateSVG('one');
    d3.select("[data-type='one']").classed("active", true);
}

main();