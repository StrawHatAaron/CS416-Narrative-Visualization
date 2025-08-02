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
    const svg = d3.select("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("viewBox", [0, 0, width, height])
                    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

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
    }

    function drawChartDAUPSA() {
        console.log(domesticAutoData);
        // Declare the x (horizontal position) scale.
        const x = d3.scaleUtc(d3.extent(domesticAutoData, d => new Date(d.observation_date)), [marginLeft, width - marginRight]);
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
            .attr("d", line(domesticAutoData));
        // Add a title to the chart.
        h2.text("Domestic Auto Production (DAUPSA) from 1993 to 2025 (Seasonally Adjusted)"); 
    }

    function drawChartSales() {
        // Declare the x (horizontal position) scale.
        const x = d3.scaleUtc(d3.extent(domesticAutoSalesData, d => new Date(d.observation_date)), [marginLeft, width - marginRight]);
        // Declare the y (vertical position) scale.
        const y = d3.scaleLinear([50, 1100], [height - marginBottom, marginTop]);
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
        const lineAuto = d3.line()
            .x(d => x(new Date(d.observation_date)))
            .y(d => y(Number(d.DAUTONSA)));
        // Append a path for the line of domesticAutoSalesData
        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", lineAuto (domesticAutoSalesData));
        // Append a path for the line of domesticLightWeightTruckSalesData
        const lineTruck = d3.line()
            .x(d => x(new Date(d.observation_date)))
            .y(d => y(Number(d.DLTRUCKSNSA)));
        // Append a path for the line of domesticLightWeightTruckSalesData
        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", "coral")
            .attr("stroke-width", 1.5)
            .attr("d", lineTruck(domesticLightWeightTruckSalesData));
        
        
        
        // Add a title to the chart.
        h2.text("Motor Vehicle Retail Sales: Domestic Autos (DAUTONSA) and Light Weight Trucks (DLTRUCKSNSA) from 1967 to 2025 (Not Seasonally Adjusted)");
        
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








      



