let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

let padding = 60
let h = 600;
let w = 800;

let svg = d3.select("div").append("svg").attr("width", w).attr("height", h).attr("class", "svg-size");

let dataset = d3.json(url).then((data) => {

    let numbers = data.data
    const minY = d3.min(numbers, (d) => d[1])
    const maxY = d3.max(numbers, d => d[1])

    let yScale = d3.scaleLinear();

    yScale.domain([0, maxY]).range([h - padding, padding])
    const yAxis = d3.axisLeft(yScale);

    let date = numbers.map(d => new Date(d[0]))


    let minX = d3.min(date);
    let maxX = d3.max(date);
    let xScale = d3.scaleTime();
    xScale.domain([minX, maxX]).range([0, w - 2 * padding]);
    const xAxis = d3.axisBottom(xScale);


    let barWidth = (w - 2 * padding) / numbers.length;
    let scale = d3.scaleLinear().domain([minY, maxY]).range([0, h]);

    let tooltip = d3.select("div").append("div").style("opacity", "0").attr("id", "tooltip")

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

            tooltip.style("opacity", "1").html(`${i[0]} <br> $${i[1]} Billions`)
                .style('left', padding * 4 + numbers.indexOf(i) + "px")
                .style('top', (h - padding - numbers.indexOf(i) - 85) + "px")
                .attr("data-date", i[0])
        })
        .on("mouseout", () => {
            tooltip.style("opacity", "0")
        })

    svg.append("text")
        .attr("x", -(padding + 300))
        .attr("y", padding + 20)
        .attr("transform", "rotate(-90)")
        .text("Gross Domestic Product (Billions)")

    svg.append("g").attr("id", "x-axis").attr("transform", "translate(" + padding + "," + (h - padding) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);
});



