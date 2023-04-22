// Set URL for the JSON data
let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

// Define the dimensions of the chart and set the padding
let padding = 60
let h = 600;
let w = 800;

// Create an SVG element and set its size and class
let svg = d3.select("div").append("svg").attr("width", w).attr("height", h).attr("class", "svg-size");

// Fetch the JSON data and process it
let dataset = d3.json(url).then((data) => {

    // Extract the data and determine the minimum and maximum values
    let numbers = data.data
    const minY = d3.min(numbers, (d) => d[1])
    const maxY = d3.max(numbers, d => d[1])

    // Create a y-axis scale using the minimum and maximum values of the data
    let yScale = d3.scaleLinear();
    yScale.domain([0, maxY]).range([h - padding, padding])
    const yAxis = d3.axisLeft(yScale);

    // Create an array of dates from the data and determine the minimum and maximum dates
    let date = numbers.map(d => new Date(d[0]))
    let minX = d3.min(date);
    let maxX = d3.max(date);

    // Create an x-axis scale using the minimum and maximum dates
    let xScale = d3.scaleTime();
    xScale.domain([minX, maxX]).range([0, w - 2 * padding]);
    const xAxis = d3.axisBottom(xScale);

    // Determine the width of each bar and create a scale for the height of the bars
    let barWidth = (w - 2 * padding) / numbers.length;
    let scale = d3.scaleLinear().domain([minY, maxY]).range([0, h]);

    // Create a tooltip and set its initial opacity to 0 to be changed when hoverd later on
    let tooltip = d3.select("div").append("div").style("opacity", "0").attr("id", "tooltip")

    // Create the rectangles for each bar and set attributes and event listeners
    svg.selectAll("rect")
        .data(data.data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("width", barWidth)
        .attr("height", (d, i) => { return (h - padding - yScale(d[1])) })
        .attr("x", (e, i) => { return padding + xScale(new Date(e[0])) })
        .attr("y", (y, i) => { return yScale(y[1]) })
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .on("mouseover", (d, i) => {

            // Show the tooltip on mouseover with data from the current bar
            tooltip.style("opacity", "1").html(`${i[0]} <br> $${i[1]} Billions`)
                .style('left', padding * 4 + numbers.indexOf(i) + "px")
                .style('top', (h - padding - numbers.indexOf(i) - 85) + "px")
                .attr("data-date", i[0])
        })
        .on("mouseout", () => {
            // Hide the tooltip on mouseout
            tooltip.style("opacity", "0")
        })

    // Add a label for the y-axis
    svg.append("text")
        .attr("x", -(padding + 300))
        .attr("y", padding + 20)
        .attr("transform", "rotate(-90)")
        .text("Gross Domestic Product (Billions)")
    
    // Add the x-axis to the SVG
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(" + padding + "," + (h - padding) + ")")
        .call(xAxis);

    // Add the y-axis to the SVG
    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);
});



