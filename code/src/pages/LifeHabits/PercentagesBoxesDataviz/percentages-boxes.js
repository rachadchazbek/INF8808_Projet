import React, { useEffect } from 'react'
import "./percentages-boxes.css"
import * as d3 from 'd3'
import {DATA_PATH} from '../../../constants/paths'

const PercentagesBoxes = () => {
    const width = 750;
    const height = 150;
    const boxWidth = 150;

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

    const scalingFactor = 0.75;
    const boxSizes = [100, 0, 0, 0];
    for (let i = 1; i < boxSizes.length; i++) {
      boxSizes[i] = boxSizes[i - 1] * scalingFactor;
    }
    
    const boxMargin = 25;
    
    const createSVG = () => {
      return d3
        .select(".percentages-boxes-graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    };
    
    const appendBoxes = (svg, percentages) => {
      const maxPercentage = d3.max(boxSizes);
    
      svg
        .selectAll("rect")
        .data(boxSizes)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * (boxWidth + boxMargin))
        .attr("y", (d, i) => (height - boxSizes[i]) / 2)
        .attr("width", (d, i) => boxSizes[i])
        .attr("height", (d, i) => boxSizes[i])
        .style("fill", "red")
        .style("opacity", (d, i) => (i + 1) / boxSizes.length);
    };
    
    const appendText = (svg, percentages) => {
      svg
        .selectAll("text")
        .data(percentages)
        .enter()
        .append("text")
        .text((d) => `${d}%`)
        .attr("x", (d, i) => i * (boxWidth + boxMargin) + boxWidth / 2)
        .attr("y", height / 2 + 5)
        .attr("text-anchor", "middle")
        .style("font-size", "10px");
    };
    
    const svg = createSVG();
    appendBoxes(svg, [25, 50, 75, 100]);
    appendText(svg, [25, 50, 75, 100]);
    

  return (
    <div className='percentages-boxes-graph'></div>
  )
}

export default PercentagesBoxes