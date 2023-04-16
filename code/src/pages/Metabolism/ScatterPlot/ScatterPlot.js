import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import "./ScatterPlot.css"
import {DATA_PATH} from '../../../constants/paths.js'


// ap_hi = systolic blood pressure => x axis
// ap_lo = diastolic blood pressure => y axis

const SIZE = 600;
const xAxisLabel = "Pression systolique";
const yAxisLabel = "Pression diastolique";

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
        const width = SIZE - 2 * margin;
        const height = SIZE - 2 * margin;

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
            .call(d3.axisBottom(xAxis))

        svg
            .append('g')
            .attr('transform', `translate(${margin}, 0)`)
            .call(d3.axisLeft(yAxis))


        
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", 2*(width + margin)/3)
            .attr("y", height + margin - 10)
            .text(xAxisLabel);
         
         svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("x", -margin)
            .attr("y", margin - 30)
            .text(yAxisLabel);


        const legend = svg
            .append('g')
            .attr('transform', `translate(${width}, ${margin})`);
        
          legend.selectAll('rect')
            .data(color.domain())
            .enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', (d, i) => i * 20)
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', color);
        
          legend.selectAll('text')
            .data(color.domain())
            .enter()
            .append('text')
            .attr('x', 15)
            .attr('y', (d, i) => i * 20 + 9)
            .text(d => d === 0 ? 'Sain' : 'Malade')
            .attr('text-anchor', 'start');

    }



    useEffect(() => {

        const fetchData = async () => {
            await d3.csv(DATA_PATH, d3.autoType, preprocess)
                .then(drawChart);
        };

        fetchData();
    });
    return (
        <div className='container'>
            <h2>Pression diastolique et systolique</h2>
            <div className='box'>
                <svg ref={svgRef} width={SIZE} height={SIZE} />
            </div>
            <p className='text-box'>L'hypertension artérielle est l'un des principaux facteurs de risque des maladies cardiovasculaires. 
            En effet, l'hypertension chronique exerce une pression constante sur les parois des artères, 
            ce qui peut endommager les vaisseaux sanguins et les rendre plus vulnérables aux dépôts de graisse. 
            Ces dépôts peuvent conduire à la formation de plaques d'athérosclérose, qui peuvent à leur tour obstruer les artères et réduire le débit sanguin. 
            Si une artère obstruée se trouve dans le cœur, cela peut entraîner une crise cardiaque. 
            Par conséquent, il est important de contrôler sa pression artérielle pour réduire le risque de maladies cardiovasculaires.</p>
        </div>
        
    );
};

export default ScatterPlot;