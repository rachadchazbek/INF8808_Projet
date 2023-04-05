import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// ap_hi = systolic blood pressure => x axis
// ap_lo = diastolic blood pressure => y axis

const ScatterPlot = () => {
    const svgRef = useRef(null);

    const preprocess = (dataRow) => {
        // filter outlier
        const ap_hi = Number(dataRow.ap_hi);
        const ap_low = Number(dataRow.ap_lo);
        const validRange = (ap) => ap < 400 && ap > 30;

        if (validRange(ap_hi) && validRange(ap_low)) {
            return {
                x: ap_hi,
                y: ap_low,
                cardio: Number(dataRow.cardio)
            };
        }
        
    }

    const drawChart = (data) => {
        const margin = 50;
        const width = 1000 - 2 * margin;
        const height = 1000 - 2 * margin;

        const xAxis = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.x)])
            .range([0, width]);


        const yAxis = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.y)])
            // height to 0 because in html top right is 0, 0. By doing that the data is reversed so it appears naturally
            .range([height, 0]);
        
        const color = d3
            .scaleOrdinal()
            .domain([0, 1])
            .range(['green', 'red']);

        const svg = d3.select(svgRef.current);

        svg.selectAll("*").remove();

        
        svg
            .attr('width', width + 2 * margin)
            .attr('height', height + 2 * margin)
            .append('g')
            .attr('transform', `translate(${margin},${margin})`)
            .selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xAxis(d.x))
            .attr('cy', d => yAxis(d.y))
            .attr('r', 3)
            .style('fill', d => color(d.cardio));
        
        svg
            .append('g')
            .attr('transform', `translate(${margin}, ${height})`)
            .call(d3.axisBottom(xAxis));

        svg.append('g').call(d3.axisLeft(yAxis));
    }



    useEffect(() => {

        const fetchData = async () => {
            await d3.csv("./data/heart_data.csv", d3.autoType, preprocess)
                .then(drawChart);
        };

        fetchData();
    });
    return (
        <svg ref={svgRef} width={1000} height={1000}>
        </svg>
    );
};

export default ScatterPlot;