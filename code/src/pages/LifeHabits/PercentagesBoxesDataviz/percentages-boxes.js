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

                // const svg = createSVG();
                // appendBoxes(svg, percentages);
                // appendText(svg, percentages);
                createDataviz(percentages)
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

    const createDataviz = (percentages) => {
      const box1 = d3.select('#box1')
        .append('svg')
        .attr('width', 200)
        .attr('height', 200)
        .style('background-color', 'red')
        
        box1
        .append('text')
        .text(percentages[0] + '%')
        .attr('x', 200 / 2)
        .attr('y', 200 / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '25px')
        .style('font-weight', 'bold')

        box1
        .append('text')
        .attr('x', 200 / 2)
        .attr('y', 200 / 2 + 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .selectAll('tspan')
        .data(['Not Smokers', 'and Not Drinkers'])
        .enter()
        .append('tspan')
        .attr('x', 200 / 2)
        .attr('dy', '1.2em') // set the line spacing to 1.2em
        .text(function(d) { return d; });



      const box2 = d3.select('#box2')
        .append('svg')
        .attr('width', 150)
        .attr('height', 150)
        .style('background-color', 'red')

        box2
        .append('text')
        .text(percentages[1] + '%')
        .attr('x', 150 / 2)
        .attr('y', 150 / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '25px')
        .style('font-weight', 'bold')

        box2
        .append('text')
        .attr('x', 150 / 2)
        .attr('y', 150 / 2 + 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .selectAll('tspan')
        .data(['Smokers', 'and Not Drinkers'])
        .enter()
        .append('tspan')
        .attr('x', 150 / 2)
        .attr('dy', '1.2em') // set the line spacing to 1.2em
        .text(function(d) { return d; });
        
      const box3 = d3.select('#box3')
        .append('svg')
        .attr('width', 100)
        .attr('height', 100)
        .style('background-color', 'red')

        box3
        .append('text')
        .text(percentages[2] + '%')
        .attr('x', 100 / 2)
        .attr('y', 100 / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '25px')
        .style('font-weight', 'bold')
                // Add text : fument et boivent under each percentage

        box3
        .append('text')
        .attr('x', 100 / 2)
        .attr('y', 100 / 2 + 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')

        .selectAll('tspan')
        .data(['Not Smokers', 'and Drinkers'])
        .enter()
        .append('tspan')
        .attr('x', 100 / 2)
        .attr('dy', '1.2em') // set the line spacing to 1.2em
        .text(function(d) { return d; });

      const box4 = d3.select('#box4')
        .append('svg')
        .attr('width', 75)
        .attr('height', 75)
        .style('background-color', 'red')
        // Add text : 50% fument et boivent

        box4
        .append('text')
        .text(percentages[3] + '%')
        .attr('x', 75 / 2)
        .attr('y', 75 / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '25px')
        .style('font-weight', 'bold')

        box4
        .append('text')
        .attr('x', 75 / 2)
        .attr('y', 75 / 2 + 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')

        .selectAll('tspan')
        .data(['Smokers', 'and Drinkers'])
        .enter()
        .append('tspan')
        .attr('x', 75 / 2)
        .attr('dy', '1.2em') // set the line spacing to 1.2em
        .text(function(d) { return d; });
    }


  return (

    <div class='boxes-container'>
      <div id='box1'></div>
      <div id='box2'></div>
      <div id='box3'></div>
      <div id='box4'></div>
    </div>
    )
}

export default PercentagesBoxes