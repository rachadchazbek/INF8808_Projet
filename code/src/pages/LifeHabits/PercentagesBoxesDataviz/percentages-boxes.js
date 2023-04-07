import React, { useEffect } from 'react'
import "./percentages-boxes.css"
import * as d3 from 'd3'
import {DATA_PATH} from '../../../constants/paths'

const PercentagesBoxes = () => {

    useEffect(() => {
        const fetchData = async () => {
            d3.csv(DATA_PATH).then(data => {
                const processedData = processData(data);
                const percentages = calculatePercentages(processedData);
                console.log(percentages);

                const svg = createSVG();
                appendBoxes(svg, percentages);
                appendText(svg, percentages);
            })
        }
        fetchData()
    }, [])

    const processData = (data) => {
        // Filter out people who do not have cardiovascular disease
        data = data.filter(d => d.cardio === '1');

        // Transform smoke and alco to boolean values and return the processed data
        return data.map(d => {
            return {
                smoker: d.smoke === '1',
                drinker: d.alco === '1',
            }
        })
    }

    const calculatePercentages = (processedData) => {
        const total = processedData.length;

        const nonSmokersNonDrinkers = processedData.filter(d => !d.smoker && !d.drinker).length;
        const smokersNonDrinkers = processedData.filter(d => d.smoker && !d.drinker).length;
        const nonSmokersDrinkers = processedData.filter(d => !d.smoker && d.drinker).length;
        const smokersDrinkers = processedData.filter(d => d.smoker && d.drinker).length;

        const nonSmokersNonDrinkersPercentage = Math.round(nonSmokersNonDrinkers / total * 100);
        const smokersNonDrinkersPercentage = Math.round(smokersNonDrinkers / total * 100);
        const nonSmokersDrinkersPercentage = Math.round(nonSmokersDrinkers / total * 100);
        const smokersDrinkersPercentage = Math.round(smokersDrinkers / total * 100);

        return [
            nonSmokersNonDrinkersPercentage,
            smokersNonDrinkersPercentage,
            nonSmokersDrinkersPercentage,
            smokersDrinkersPercentage,
        ]
    }

    const createSVG = () => {
        const width = 500;
        const height = 100;

        const svg = d3.select('.percentages-boxes-graph' )
            .append('svg')
            .attr('width', width)
            .attr('height', height)

        return svg;
    }

    const appendBoxes = (svg, percentages) => {
        const width = 500;
        const height = 100;
        const boxWidth = width / percentages.length;
        
        svg.selectAll('rect')
            .data(percentages)
            .enter()
            .append('rect')
            .attr('x', (d, i) => i * boxWidth)
            .attr('y', 0)
            .attr('width', boxWidth)
            .attr('height', height)
            .attr('fill', (_d, i) => `rgb(255, ${255 - ((i + 1) * 30)}, ${255 - (i * 30)})`);
        }    

    const appendText = (svg, percentages) => {
        const boxWidth = 500 / percentages.length;
        svg.selectAll('text')
            .data(percentages)
            .enter()
            .append('text')
            .text((d) => `${d}%`)
            .attr('x', (d, i) => i * boxWidth)
            .attr('y', 100)
            .attr('text-anchor', 'middle')
            .style('font-size', (d, i) => `10px`)
        }


    
  return (
    <div className='percentages-boxes-graph'></div>
  )
}

export default PercentagesBoxes