
const fetchData = () => {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(response => response.json())
    .then(dataset => {
        renderData(dataset);
    })
}

const renderData = (dataset) => {
    const w = 800;
    const h = 800;
    const padding = 60;

    const parseTime = d3.timeParse("%M:%S");
    const formatTime = d3.timeFormat("%M:%S");

    const times = dataset.map((item) => {
        const parsedTime = item.Time.split(":");
        
        return new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
    });

    console.log(times);

    const years = dataset.map((item) => item.Year);

    const xScale = d3.scaleLinear()
                        .domain([d3.min(years), d3.max(years)])
                        .range([padding, w - padding]);

    const yScale = d3.scaleTime()
                        .domain([d3.min(times), d3.max(times)])
                        .range([padding, h - padding]);

    const svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", w)
        .attr("height", h);


    let tooltip = d3.select("#chart-area").append("div")
        .attr("id", "tooltip")
        .style("position", 'absolute')
        .style("opacity", 0)
        .style("background-color", "white")
        .style("border-radius", "5px")
        .style("border", "1px solid black")

    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => xScale(years[i]))
        .attr("cy",(d, i) => yScale(times[i]))
        .attr("r", (d) => 5)
        .attr("fill", 'green')
        .attr("border", '5px solid black')
        .attr('class', 'dot')
        .attr("data-xvalue", (d, i) => years[i])
        .attr("data-yvalue",(d, i) => times[i])
        .style("fill", d => (d.Doping ? "red" : "green"))
        .on('mouseover', (e, d) => {
            let index = e.target.dataset.index
            tooltip
                .attr('data-year', d.Year)
                .style("left", "500px")		
                .style("top", "300px")
                .html("<p><strong>" + d.Name +"</strong><p><br><p>"+ d.Doping +"</p>" )
                .transition()
                .duration(200)		
                .style("opacity", .9)
        })
        .on("mouseout", (d, i) => {
            tooltip.transition()
                    .duration(200)
                    .style("opacity", 0)
        })
    
    const legend = svg
        .append("g")
        .attr("id", "legend")
        .style("fill", "black")
        .attr("transform", "translate(600, 500)");

    legend
        .append("text")
        .attr("x", 15)
        .attr("y", -5)
        .text("Riders with doping allegations")
        .style("font-size", "13px");
    
    legend
        .append("rect")
        .attr("width", "10px")
        .attr("height", "10px")
        .attr("x", 0)
        .attr("y", -15)
        .style("fill", "red");
    
    legend
        .append("text")
        .attr("x", 15)
        .attr("y", 30)
        .text("No doping allegations")
        .style("font-size", "13px");
    
    legend
        .append("rect")
        .attr("width", "10px")
        .attr("height", "10px")
        .attr("x", 0)
        .attr("y", 20)
        .style("fill", "green");
            
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format(4));
    const yAxis = d3.axisLeft(yScale).tickFormat(formatTime);

    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .attr('id', 'x-axis')
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(" + (padding) + ", 0)")
        .attr('id', 'y-axis')
        .call(yAxis);

}

fetchData();
