// index.js - Aaron Miller
//
// Fetch Consumer Price Indexes for All Urban Consumers - CPIAUCSL.csv.
async function fetchCPIData() {
    const data = await d3.csv("CPIAUCSL.csv").catch(error => {
        console.error('CSV load error:', error);
    });
    return data;
}
// Fetch Consumer Price Indexes for New Vehicles - CUSR0000SETA01.csv.
async function fetchCPIDataNewVehicles() {
    const data = await d3.csv("CUSR0000SETA01.csv").catch(error => {
        console.error('CSV load error:', error);
    });
    return data;
}
//
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
//
// Fetch Domestic Auto Production fetchedData from years 1993 - 2025 seasonally adjusted - DAUPSA.csv.
async function fetchDomesticAutoData() {
    const data = await d3.csv("DAUPSA.csv").catch(error => {
        console.error('CSV load error:', error);
    });
    return data;
}

//-------------------------------------------------------------MAIN FUNCTION----------------------------------------------------
async function main() {
    // Declare the chart dimensions and margins.
    const width = 928;
    const height = 525;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    // Create the SVG containers for all three graphs.
    const svg_cpi = d3.select("svg#graph-cpi")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])
                .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
    const svg_sales = d3.select("svg#graph-sales").style("display", "none");
    const svg_production = d3.select("svg#graph-production").style("display", "none");



    // Create the SVG container for the legends CPI and Sales.
    const svg_legend_cpi = d3.select("svg#legend-cpi")
        .attr("width", 200)
        .attr("height", 100)
        .attr("viewBox", [0, 0, 200, 100]);  
    const svg_legend_sales = d3.select("svg#legend-sales").style("display", "none");



    // Need to create heading for the graphs too
    const h2 = d3.select("h2")
        .style("text-align", "center");



    // declare variables for Consumer Price Indexes for All Urban Consumers
    const cpiAllItemsData = await fetchCPIData();
    // Declare a variable to hold data for Consumer Price Indexes for New Vehicles.
    const cpiNewVehiclesData = await fetchCPIDataNewVehicles();

    // Declare a variable to hold data for Motor Vehicle Retail Sales: Domestic Autos (DAUTONSA).
    const domesticAutoSalesData = await fetchDomesticAutoSalesData();
    // Declare a variable to hold data for Motor Vehicle Retail Sales: Domestic Light Weight Trucks (DLTRUCKSNSA)
    const domesticLightWeightTruckSalesData = await fetchDomesticLightWeightTruckSalesData();

    // Declare a variable to hold data for Domestic Auto Production (DAUPSA)
    const domesticAutoData = await fetchDomesticAutoData();


    // Clear the SVG container.
    function clearSVG() {
        svg_cpi.selectAll("*").remove();
        svg_sales.selectAll("*").remove();
        svg_production.selectAll("*").remove();
        svg_legend_cpi.selectAll("*").remove();
        svg_legend_sales.selectAll("*").remove();
        h2.select("*").remove();
        
        svg_cpi.style("display", "none");
        svg_sales.style("display", "none");
        svg_production.style("display", "none");
        // svg_legend_cpi.style("display", "none");
        // svg_legend_sales.style("display", "none");
    }

    function drawGraphBounds(svg, x, y, label) {
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
                .text(label));
    }

    // Function to draw a line and add points with tooltips.
    function drawLineAddPoints(svg, data, x, y, color, fieldName, label) {
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
                            `<strong>${label}:</strong> ${d[fieldName]}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip.transition().duration(500).style("opacity", 0);
            });
    }


    // function drawGraphLegend(svg, items) {
    //     const legend = svg.append("g")
    //         .attr("transform", "translate(20,20)");
    //     items.forEach((item, i) => {
    //         const y = i * 20;
    //         legend.append("circle")
    //             .attr("cx", 0)
    //             .attr("cy", y)
    //             .attr("r", 6)
    //             .style("fill", item.color);
    //         legend.append("text")
    //             .attr("x", 12)
    //             .attr("y", y + 4)
    //             .text(item.label)
    //             .style("font-size", "12px")
    //             .attr("alignment-baseline", "middle");
    //     });
    // }

    // function drawGraphHeader(svg, title) {
    //     svg.append("text")
    //         .attr("x", width / 2)
    //         .attr("y", marginTop - 10)
    //         .text(title)
    //         .style("font-size", "16px")
    //         .style("font-weight", "bold")
    //         .attr("text-anchor", "middle");
    // }

    // Function to draw the chart for Consumer Price Indexes for All Urban Consumers.
    function drawChartCPI() {
        svg_cpi.attr("height", height)
                .attr("viewBox", [0, 0, width, height])
                .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
        // Declare the x (horizontal position) scale for New Vehicles.
        const x_auto_CPI = d3.scaleUtc(d3.extent(cpiNewVehiclesData, d => new Date(d.observation_date)), [marginLeft, width - marginRight]);
        const x_CPI = d3.scaleUtc(d3.extent(cpiAllItemsData, d => new Date(d.observation_date)), [marginLeft, width - marginRight]);
        // Declare the y (vertical position) scale.
        const y = d3.scaleLinear([25, 325], [height - marginBottom, marginTop]);
        // Draw the graph bounds.
        drawGraphBounds(svg_cpi, x_auto_CPI, y, "CPI Index 1982-1984=100");
        // Draw the line and points for Domestic Auto Sales (DAUTONSA).
        drawLineAddPoints(svg_cpi, cpiNewVehiclesData, x_auto_CPI, y, "steelblue", "CUSR0000SETA01", "CPI Index 1982-1984=100");
        // Draw the line and points for Domestic Light Weight Truck Sales (DLTRUCKSNSA).
        drawLineAddPoints(svg_cpi, cpiAllItemsData, x_CPI, y, "coral", "CPIAUCSL", "CPI Index 1982-1984=100");



        // Add a legend to differentiate between the two lines CUSR0000SETA01 and CPIAUCSL.
        // svg_legend_cpi.append("g").attr("transform", "translate(0,0)")
        //                 .attr("width", 200)
        //                 .attr("height", 100)
        //                 .attr("viewBox", [0, 0, 200, 100]).style("display", "inline")    ; 

        // // Create legend items for the two lines.
        // const items = [ { color: "steelblue", label: "New Vehicles in U.S. City Average (CUSR0000SETA01)" },
        //                 { color: "coral", label: "All Items in U.S. City Average (CPIAUCSL)" }];
        // items.forEach((item, i) => {
        //     const y = i * 20;
        //     svg_legend_cpi.append("circle")
        //         .attr("cx", 0)
        //         .attr("cy", y)
        //         .attr("r", 6)
        //         .style("fill", item.color);
        //     svg_legend_cpi.append("text")
        //         .attr("x", 12)
        //         .attr("y", y + 4)
        //         .text(item.label)
        //         .style("font-size", "12px")
        //         .attr("alignment-baseline", "middle");
        // });


        // Add a legend to differentiate between the two lines DAUTONSA and DLTRUCKSNSA.
        const legend = svg_legend_cpi.append("g")
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
        h2.text("Consumer Price Indexes for All Urban Consumers from 1953 to 2025 (Seasonally Adjusted)");
    }

    // Function to draw the chart for Motor Vehicle Retail Sales for Domestic Autos and Domestic Light Weight Trucks.
    function drawChartSales() {
            
        svg_sales.attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])
                .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
        // Declare the x (horizontal position) scale.
        const x_auto = d3.scaleUtc(d3.extent(domesticAutoSalesData, d => new Date(d.observation_date)), [marginLeft, width - marginRight]);
        const x_truck = d3.scaleUtc(d3.extent(domesticLightWeightTruckSalesData, d => new Date(d.observation_date)), [marginLeft, width - marginRight]);
        // Declare the y (vertical position) scale.
        const y = d3.scaleLinear([50, 1100], [height - marginBottom, marginTop]);
        // Draw the graph bounds.
        drawGraphBounds(svg_sales, x_auto, y, "Thousands of Units");
        // Draw the line and points for Domestic Auto Sales (DAUTONSA).
        drawLineAddPoints(svg_sales, domesticAutoSalesData, x_auto, y, "steelblue", "DAUTONSA", "Thousands of Units");
        // Draw the line and points for Domestic Light Weight Truck Sales (DLTRUCKSNSA).
        drawLineAddPoints(svg_sales, domesticLightWeightTruckSalesData, x_truck, y, "coral", "DLTRUCKSNSA", "Thousands of Units");
        // Add a legend to differentiate between the two lines DAUTONSA and DLTRUCKSNSA.
        // const legend = svg_legend.append("g")
        //     .attr("transform", "translate(20,20)");
        // const items = [ { color: "steelblue", label: "Domestic Autos (DAUTONSA)" },
        //                 { color: "coral", label: "Light Weight Trucks (DLTRUCKSNSA)" }];
        // items.forEach((item, i) => {
        //     const y = i * 20;
        //     legend.append("circle")
        //         .attr("cx", 0)
        //         .attr("cy", y)
        //         .attr("r", 6)
        //         .style("fill", item.color);
        //     legend.append("text")
        //         .attr("x", 12)
        //         .attr("y", y + 4)
        //         .text(item.label)
        //         .style("font-size", "12px")
        //         .attr("alignment-baseline", "middle");
        // });
        // Add a title to the chart.
        h2.text("Motor Vehicle Retail Sales for Domestic Autos and Domestic Light Weight Trucks from 1967 to 2025 (Not Seasonally Adjusted)"); 
    }

    // Function to draw the chart for Domestic Auto Production (DAUPSA).
    function drawChartDAUPSA() {
        svg_production.attr("width", width)
                        .attr("height", height)
                        .attr("viewBox", [0, 0, width, height])
                        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
        // Declare the x (horizontal position) scale.
        const x = d3.scaleUtc(d3.extent(domesticAutoData, d => new Date(d.observation_date)), [marginLeft, width - marginRight]);
        // Declare the y (vertical position) scale.
        const y = d3.scaleLinear([0, 600], [height - marginBottom, marginTop]);
        // Draw the graph bounds.
        drawGraphBounds(svg_production, x, y, "Thousands of Units");
        // Draw the line and points for Domestic Auto Production (DAUPSA).          
        drawLineAddPoints(svg_production, domesticAutoData, x, y, "steelblue", "DAUPSA", "Thousands of Units");
        // Add zoom functionality to the chart.
        // const zoom = d3.zoom()
        //     .scaleExtent([1, 10])
        //     .translateExtent([[marginLeft, marginTop], [width - marginRight, height - marginBottom]])
        //     .on("zoom", (event) => {
        //         svg.attr("transform", event.transform);
        //     });
        // svg.call(zoom);
        // Add the title to the chart.
        h2.text("Domestic Auto Production (DAUPSA) from 1993 to 2025 (Seasonally Adjusted)"); 
    }


    // Update the SVG based on the selected storyline
    function updateSVG(type) {
        clearSVG();
        switch (type) {
        case "one":
            drawChartCPI();
            break;
        case "two":
            drawChartSales();
            break;
        case "three":
            drawChartDAUPSA();
            break;
        case "summary":
            
            drawChartDAUPSA();
            drawChartSales();
            drawChartCPI();

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