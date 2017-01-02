let request = new XMLHttpRequest();
request.open('GET', 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', true); // The last argument specifies whether you want your request to run asynchronously or not.
request.send();
request.onreadystatechange = () => {
    if (request.readyState == 4 && request.status == 200) {
        let response = JSON.parse(request.responseText);
        let baseTemperature = response.baseTemperature;
        console.log('baseTemperature:', baseTemperature);
        let data = response.monthlyVariance;
        console.log('data:', data);

        data.forEach(function (d) {
                d.date = new Date(d.year, d.month - 1);
                d.month = +d.month;
                d.year = +d.year;
            });
        
        // Set the dimensions of the canvas / graph
        let margin = { top: 30, right: 20, bottom: 40, left: 40 },
            width = 820 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        function drawGraph() {
            // Format time
            let formatTime = d3.timeFormat('%B, %Y');

            // Set the ranges
            let x = d3.scaleLinear().range([0, width]);
            let y = d3.scaleLinear().range([height, 0]);
            let c = d3.scaleLinear().rangeRound([0, 12])
            

            // Define the axes
            let xAxis = d3.axisBottom(x).ticks();
            let yAxis = d3.axisLeft(y); //.tickFormat(d3.timeFormat("%b")); // .tickValues(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);

            // Define the div for the tooltip
            let div = d3.select('body').append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);

            // Adds the svg canvas
            let svg = d3.select('.chart')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform',
                'translate(' + margin.left + ',' + margin.top + ')');

            // Scale the range of the data
            x.domain(d3.extent(data, function (d) { return d.year;}));
            y.domain([0, d3.max(data, function (d) { return d.month;})]);
            c.domain(d3.extent(data, function (d) { return d.variance;}));

            const colors = {
                "0": "rgb(15, 240, 0)",
                "1": "rgb(55, 240, 0)",
                "2": "rgb(95, 240, 0)",
                "3": "rgb(135, 240, 0)",
                "4": "rgb(175, 240, 0)",
                "5": "rgb(215, 240, 0)",
                "6": "rgb(255, 240, 0)",
                "7": "rgb(255, 200, 0)",
                "8": "rgb(255, 160, 0)",
                "9": "rgb(255, 120, 0)",
                "10": "rgb(255, 80, 0)",
                "11": "rgb(255, 40, 0)",
                "12": "rgb(255, 0, 0)",
            };
            function getColor(variance) {
              return colors[c(variance)];
            }
            
            // Add the scatterplot
            svg.selectAll('dot')
                .data(data)
                .enter().append('rect')
                .attr('height', height / 12)
                .attr('width', width / (2015 - 1753))
                .style('fill', function (d) { return getColor(d.variance) })
                .attr('x', function (d) { return x(d.year); })
                .attr('y', function (d) { return y(d.month); })
                .on('mouseover', function (d) {
                    div.transition()
                        .duration(200)
                        .style('opacity', .9);
                    div.html(
                        `<b>Date: </b>  ${formatTime(d.date)}</br>
                        <b>Diff from baseline: </b> ${d.variance}</br>`
                    )
                        .style('left', (d3.event.pageX - 130) + 'px')
                        .style('top', (d3.event.pageY - 60) + 'px');
                })
                .on('mouseout', function (d) {
                    div.transition()
                        .duration(500)
                        .style('opacity', 0);
                });
            // Add the X Axis
            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')')
                .style('stroke-width', '0.5')
                .style('stroke', 'white')
                .style('font-size', '12')
                .call(xAxis);

            // Add the Y Axis
            svg.append('g')
                .attr('class', 'y axis')
                .style('stroke-width', '0.5')
                .style('stroke', 'white')
                .style('font-size', '12')
                .call(yAxis);

            // adding names to axes
            svg.append('text')
                .attr('text-anchor', 'middle')  // this makes it easy to centre the text as the transform is applied to the anchor
                .attr('transform', 'translate(' + (-margin.left / 2 - 8) + ',' + (20) + ')rotate(-90)')  // text is drawn off the screen top left, move down and out and rotate
                .style('fill', 'white')
                .style('font-size', '16')
                .text('Month');

            svg.append('text')
                .attr('text-anchor', 'middle')  // this makes it easy to centre the text as the transform is applied to the anchor
                .attr('transform', 'translate(' + (width - 20) + ',' + (height + (margin.left / 2 + 15)) + ')')
                .style('fill', 'white')
                .style('font-size', '16')
                .text('Year');

            // svg.append('rect')
            //     .attr('height', 13)
            //     .attr('width', 20)
            //     .style('fill', 'none')
            //     .style('stroke-width', '2')
            //     .style('stroke', '#33ff33')
            //     .attr('transform', 'translate(' + (width - 160) + ',' + (height - 52) + ')')

            // svg.append('text')
            //     .attr('text-anchor', 'middle')  // this makes it easy to centre the text as the transform is applied to the anchor
            //     .attr('transform', 'translate(' + (width - 60) + ',' + (height - 40) + ')')
            //     .attr('font-weight', 'bold')
            //     .text('Warmer color ');

            // svg.append('rect')
            //     .attr('height', 13)
            //     .attr('width', 20)
            //     .style('fill', 'none')
            //     .style('stroke-width', '2')
            //     .style('stroke', 'black')
            //     .attr('transform', 'translate(' + (width - 160) + ',' + (height - 32) + ')')

            // svg.append('text')
            //     .attr('text-anchor', 'middle')  // this makes it easy to centre the text as the transform is applied to the anchor
            //     .attr('transform', 'translate(' + (width - 70) + ',' + (height - 20) + ')')
            //     .attr('font-weight', 'bold')
            //     .text('Doping alligations');
        }
        function show() {
            console.log('button show pressed');
            drawGraph();
            document.querySelector('.btn-show').style.display = 'none';
            document.querySelector('#source').style.visibility = 'visible';
            document.querySelector('.graphExplinationText').style.visibility = 'visible';
            document.querySelector('.graphExplinationText2').style.visibility = 'visible';
        }
        document.querySelector('.btn-show').addEventListener('click', show);
    }
}


