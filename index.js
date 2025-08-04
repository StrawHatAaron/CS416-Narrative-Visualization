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
    // Declare the buttons for the storyline.
    const buttonCPI = d3.select("button#one-cpi");
    const buttonSales = d3.select("button#two-sales").property("disabled", true);
    const buttonProduction = d3.select("button#three-production").property("disabled", true);
    const buttonSummary = d3.select("button#four-summary").property("disabled", true);
    // Declare the report sections
    const report = d3.selectAll("div#report").style("display", "none");

    // Declare seperators for the graphs
    const hr = d3.selectAll("hr#graph-seperator").style("display", "none"); 
    // Title containers for the graphs.
    const h2_cpi = d3.select("h2#h2-title-cpi")
        .style("text-align", "center");
    const h2_sales = d3.select("h2#h2-title-sales").style("display", "none");
    const h2_production = d3.select("h2#h2-title-production").style("display", "none");
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
        .attr("width", 350)
        .attr("height", 100)
        .attr("viewBox", [0, 0, 350, 100]);
    const svg_legend_sales = d3.select("svg#legend-sales").style("display", "none");
    // Declare variables for CPI graph (CUSR0000SETA01, CPIAUCSL), Sales graph (DAUTONSA, DLTRUCKSNSA), Domestic Auto Production graph (DAUPSA)
    const cpiAllItemsData = await fetchCPIData();
    const cpiNewVehiclesData = await fetchCPIDataNewVehicles();
    const domesticAutoSalesData = await fetchDomesticAutoSalesData();
    const domesticLightWeightTruckSalesData = await fetchDomesticLightWeightTruckSalesData();
    const domesticAutoData = await fetchDomesticAutoData();


    // Clear the SVG container.
    function clearSVG() {
        // Clear the SVG graphs and legends.
        svg_cpi.selectAll("*").remove();
        svg_sales.selectAll("*").remove();
        svg_production.selectAll("*").remove();
        svg_legend_cpi.selectAll("*").remove();
        svg_legend_sales.selectAll("*").remove();
        h2_cpi.select("*").remove();
        h2_sales.select("*").remove();
        h2_production.select("*").remove();
        // Hide the SVG graphs and legends.
        svg_cpi.style("display", "none");
        svg_sales.style("display", "none");
        svg_production.style("display", "none");
        svg_legend_cpi.style("display", "none");
        svg_legend_sales.style("display", "none");
        h2_cpi.style("display", "none");
        h2_sales.style("display", "none");
        h2_production.style("display", "none");
        report.style("display", "none");
        hr.style("display", "none")
    }


    // Function to fill the titles for graphs
    function fillTitle(h2, title) {
        h2.text(title);
        h2.style("display", "inline");
    }

    // Function to show and shape the SVG graphs.
    function showAndShapeSvgGragh(svg) {
        svg.attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
        svg.style("display", "inline");
    }

    // Function to show and shape the SVG legend for CPI and Sales graphs.
    function showShapeAndLabelSvgLegend(svg, labels) {
        // show and shape the SVG legend for CPI and Sales graphs.
        svg.attr("width", 350)
            .attr("height", 100)
            .attr("viewBox", [0, 0, 350, 100])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
        svg.style("display", "inline");
        // Add a legend to differentiate between the two lines DAUTONSA and DLTRUCKSNSA.  
        const legend = svg.append("g")
            .attr("transform", "translate(20,20)");
        const items = [ { color: "steelblue", label: labels[0] },
                        { color: "coral", label: labels[1] }];
        // Loop through the items and append circles and text to the legend.
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
    }

    // Function to draw the graph bounds with X and Y axes.
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
    function drawLineAddPoints(svg, data, x, y, color, fieldName, label, type) {
        
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
        if (type == "summary") {
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
    }

    // Highlight the 1980s to show the CPI trends 
    function showStoryCPI(){
        // point to the year where things flip
        svg_cpi.append("line")
            .attr("x1", 325)
            .attr("y1", 140)
            .attr("x2", 405)
            .attr("y2", 337)
            .attr("stroke", "black")
            .attr("stroke-width", 2);
        // highlight the year where things flip 
        svg_cpi.append("ellipse")
            .attr("cx", 275)       // center x
            .attr("cy", 445)        // center y
            .attr("rx", 54)       // horizontal radius
            .attr("ry", 25)        // vertical radius
            .attr("fill", "yellow")
            .attr("stroke-width", 3)
            .attr("opacity", 0.4) // 0 = fully transparent, 1 = fully opaque
            .attr("transform", "rotate(-25 150 75)"); // rotate 25° around center
        // Append the text
        const lines = ["In the start of the 1980s shortly after an energy crisis and during the ", 
                       "boom of the semi-conductor, the Big Three U.S. automakers experienced intense ",
                       "competition with Japan’s auto market to create modern autos (cars). This global",
                       "competition drove down the CPI of New Vehicles in U.S. City Average with",
                       "respect to other goods and services at large. This opened the way for tighter",
                       "profit margins."];
        const text = svg_cpi.append("text")
        .attr("x", 335)
        .attr("y", 54.5)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "black")
        .attr("font-size", "16px");
        lines.forEach((line, i) => {
        text.append("tspan")
            .attr("x", 335)
            .attr("dy", i === 0 ? 0 : "1em") // vertical spacing
            .text(line);
        });
    }

    // Highlight the 2000 and 2018 sales trends
    function showStorySales(){
        // point to the year where things flip
        svg_sales.append("line")
            .attr("x1", 365)
            .attr("y1", 70)
            .attr("x2", 490)
            .attr("y2", 180)
            .attr("stroke", "black")
            .attr("stroke-width", 2);
        // highlight the year where things flip 
        svg_sales.append("ellipse")
            .attr("cx", 515)       // center x
            .attr("cy", 225)        // center y
            .attr("rx", 54)       // horizontal radius
            .attr("ry", 54)        // vertical radius
            .attr("fill", "yellow")
            .attr("stroke-width", 3)
            .attr("opacity", 0.4); // 0 = fully transparent, 1 = fully opaque
        // Append the text
        const lines = ["At the turn of the millennium into the 2000s, a report from the ", 
                       "U.S. Department of Transportation showed sales of lightweight trucks",
                       "had fully caught up with autos in both use and sales for the first",
                       "time."];
        const text = svg_sales.append("text")
        .attr("x", 335)
        .attr("y", 14)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "black")
        .attr("font-size", "16px");
        lines.forEach((line, i) => {
        text.append("tspan")
            .attr("x", 335)
            .attr("dy", i === 0 ? 0 : "1.4em") // vertical spacing
            .text(line);
        });


        // point to the year where things flip
        svg_sales.append("line")
            .attr("x1", 777)
            .attr("y1", 70)
            .attr("x2", 800)
            .attr("y2", 105)
            .attr("stroke", "black")
            .attr("stroke-width", 2);
        // highlight the year where things flip 
        svg_sales.append("ellipse")
            .attr("cx", 805)       // center x
            .attr("cy", 110)        // center y
            .attr("rx", 15)       // horizontal radius
            .attr("ry", 15)        // vertical radius
            .attr("fill", "yellow")
            .attr("stroke-width", 3)
            .attr("opacity", 0.4); // 0 = fully transparent, 1 = fully opaque
        // Append the text
        const lines2 = ["11,609,00 light weight", "trucks were sold in",
                        "2018 which was 69% of new",
                        "light vehicle sales"];
        const text2 = svg_sales.append("text")
        .attr("x", 750)
        .attr("y", 77)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "black")
        .attr("font-size", "16px");
        lines2.forEach((line, i) => {
        text2.append("tspan")
            .attr("x", 700)
            .attr("dy", i === 0 ? 0 : "1.4em") // vertical spacing
            .text(line);
        });
        
    }

    // needs work
    function showStoryProduction(){
        // point to the year where things flip
        svg_production.append("line")
            .attr("x1", 335)
            .attr("y1", 308)
            .attr("x2", 455)
            .attr("y2", 400)
            .attr("stroke", "black")
            .attr("stroke-width", 2);
        // highlight the year where things flip 
        svg_production.append("ellipse")
            .attr("cx", 465)       // center x
            .attr("cy", 410)        // center y
            .attr("rx", 15)       // horizontal radius
            .attr("ry", 15)        // vertical radius
            .attr("fill", "yellow")
            .attr("stroke-width", 3)
            .attr("opacity", 0.4); // 0 = fully transparent, 1 = fully opaque
        // Append the text
        const lines = ["2008 Financial Crisis"];
        const text = svg_production.append("text")
        .attr("x", 335)
        .attr("y", 300)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "black")
        .attr("font-size", "16px");
        lines.forEach((line, i) => {
        text.append("tspan")
            .attr("x", 335)
            .attr("dy", i === 0 ? 0 : "1.2em") // vertical spacing
            .text(line);
        });


        // point to the year where things flip
        svg_production.append("line")
            .attr("x1", 670)
            .attr("y1", 435)
            .attr("x2", 755)
            .attr("y2", 485)
            .attr("stroke", "black")
            .attr("stroke-width", 2);
        // highlight the year where things flip 
        svg_production.append("ellipse")
            .attr("cx", 765)       // center x
            .attr("cy", 495)        // center y
            .attr("rx", 15)       // horizontal radius
            .attr("ry", 15)        // vertical radius
            .attr("fill", "yellow")
            .attr("stroke-width", 3)
            .attr("opacity", 0.4) // 0 = fully transparent, 1 = fully opaque
        // Append the text
        const lines2 = ["COVID-19 Recession"];
        const text2 = svg_production.append("text")
        .attr("x", 335)
        .attr("y", 430)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "black")
        .attr("font-size", "16px");
        lines2.forEach((line, i) => {
        text2.append("tspan")
            .attr("x", 670)
            .attr("dy", i === 0 ? 0 : "1.2em") // vertical spacing
            .text(line);
        });
    }


    // Function to draw the chart for Consumer Price Indexes for All Urban Consumers.
    
    function drawChartCPI(type) {
        // Add the title to the chart.
        fillTitle(h2_cpi, "Consumer Price Indexes for All Urban Consumers from 1953 to 2025 (Seasonally Adjusted)");
        // Show and shape the SVG graph for CPI.
        showAndShapeSvgGragh(svg_cpi);
        // Add a legend to differentiate between the two lines CUSR0000SETA01 and CPIAUCSL.
        showShapeAndLabelSvgLegend(svg_legend_cpi, 
            ["New Vehicles in U.S. City Average (CUSR0000SETA01)",
            "All Items in U.S. City Average (CPIAUCSL)"]);
        // Declare the x (horizontal position) scale for New Vehicles.
        const x_auto_CPI = d3.scaleUtc(d3.extent(cpiNewVehiclesData, d => new Date(d.observation_date)), [marginLeft, width - marginRight]);
        const x_CPI = d3.scaleUtc(d3.extent(cpiAllItemsData, d => new Date(d.observation_date)), [marginLeft, width - marginRight]);
        // Declare the y (vertical position) scale.
        const y = d3.scaleLinear([25, 325], [height - marginBottom, marginTop]);
        // Draw the graph bounds.
        drawGraphBounds(svg_cpi, x_auto_CPI, y, "CPI Index 1982-1984=100");
        // Draw the line and points for Domestic Auto Sales (DAUTONSA).
        drawLineAddPoints(svg_cpi, cpiNewVehiclesData, x_auto_CPI, y, "steelblue", "CUSR0000SETA01", "CPI Index 1982-1984=100", type);
        // Draw the line and points for Domestic Light Weight Truck Sales (DLTRUCKSNSA).
        drawLineAddPoints(svg_cpi, cpiAllItemsData, x_CPI, y, "coral", "CPIAUCSL", "CPI Index 1982-1984=100", type);
    }

    // Function to draw the chart for Motor Vehicle Retail Sales for Domestic Autos and Domestic Light Weight Trucks.
    function drawChartSales(type) {
        // Add the title to the chart.
        fillTitle(h2_sales, "Motor Vehicle Retail Sales for Domestic Autos and Domestic Light Weight Trucks from 1967 to 2025 (Not Seasonally Adjusted)");
        // Show and shape the SVG graph for Sales.
        showAndShapeSvgGragh(svg_sales);    
        // Add a legend to differentiate between the two lines DAUTONSA and DLTRUCKSNSA.
        showShapeAndLabelSvgLegend(svg_legend_sales, 
            ["Domestic Autos (DAUTONSA)",
            "Domestic Light Weight Trucks (DLTRUCKSNSA)"]);
        // Declare the x (horizontal position) scale.
        const x_auto = d3.scaleUtc(d3.extent(domesticAutoSalesData, d => new Date(d.observation_date)), [marginLeft, width - marginRight]);
        const x_truck = d3.scaleUtc(d3.extent(domesticLightWeightTruckSalesData, d => new Date(d.observation_date)), [marginLeft, width - marginRight]);
        // Declare the y (vertical position) scale.
        const y = d3.scaleLinear([50, 1100], [height - marginBottom, marginTop]);
        // Draw the graph bounds.
        drawGraphBounds(svg_sales, x_auto, y, "Thousands of Units");
        // Draw the line and points for Domestic Auto Sales (DAUTONSA).
        drawLineAddPoints(svg_sales, domesticAutoSalesData, x_auto, y, "steelblue", "DAUTONSA", "Thousands of Units", type);
        // Draw the line and points for Domestic Light Weight Truck Sales (DLTRUCKSNSA).
        drawLineAddPoints(svg_sales, domesticLightWeightTruckSalesData, x_truck, y, "coral", "DLTRUCKSNSA", "Thousands of Units", type);
    }

    // Function to draw the chart for Domestic Auto Production (DAUPSA).
    function drawChartProduction(type) {
        // Add the title to the chart.
        fillTitle(h2_production, "Domestic Auto Production (DAUPSA) from 1993 to 2025 (Seasonally Adjusted)");
        // Show and shape the SVG graph for Domestic Auto Production.
        showAndShapeSvgGragh(svg_production);
        // Declare the x (horizontal position) scale.
        const x = d3.scaleUtc(d3.extent(domesticAutoData, d => new Date(d.observation_date)), [marginLeft, width - marginRight]);
        // Declare the y (vertical position) scale.
        const y = d3.scaleLinear([0, 600], [height - marginBottom, marginTop]);
        // Draw the graph bounds.
        drawGraphBounds(svg_production, x, y, "Thousands of Units");
        // Draw the line and points for Domestic Auto Production (DAUPSA).          
        drawLineAddPoints(svg_production, domesticAutoData, x, y, "steelblue", "DAUPSA", "Thousands of Units", type);
        // Add zoom functionality to the chart.
        // const zoom = d3.zoom()
        //     .scaleExtent([1, 10])
        //     .translateExtent([[marginLeft, marginTop], [width - marginRight, height - marginBottom]])
        //     .on("zoom", (event) => {
        //         svg.attr("transform", event.transform);
        //     });
        // svg.call(zoom);
        // Add the title to the chart.
        // h2.text("Domestic Auto Production (DAUPSA) from 1993 to 2025 (Seasonally Adjusted)"); 
    }


    // Update the SVG based on the selected storyline
    function updateSVG(type) {
        clearSVG();
        switch (type) {
        case "one":
            drawChartCPI(type);
            showStoryCPI(type);
            buttonSales.property("disabled", false);
            break;
        case "two":
            drawChartSales(type);
            showStorySales(type);
            buttonProduction.property("disabled", false);
            break;
        case "three":
            drawChartProduction(type);
            showStoryProduction(type);
            buttonSummary.property("disabled", false);
            break;
        case "summary":
            hr.style("display", "block");
            drawChartProduction(type);
            drawChartSales(type);
            drawChartCPI(type);
            report.style("display", "inline");
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