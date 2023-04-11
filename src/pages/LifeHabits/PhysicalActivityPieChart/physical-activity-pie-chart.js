import React, { useEffect } from 'react';
import * as d3 from 'd3';
import './PhysicalActivityPieChart.css';

function PhysicalActivityPieChart() {
    const outerRadius = 250;
    const innerRadius = 0;
  
    const margin = {
      top: 50, right: 150, bottom: 50, left: 50,
    };
  
    const width = 2 * outerRadius + margin.left + margin.right;
    const height = 2 * outerRadius + margin.top + margin.bottom;
  
    const colorScale = d3     
      .scaleSequential()      
      .interpolator(d3.interpolateWarm)      
      .domain([0, 2]);
  
    useEffect(() => {
      const fetchData = async () => {
        var parsedDataNonHealthy = [];
        var parsedDataHealthy = [];
        await d3.csv("./data/heart_data.csv", function(csvRow){
          return {
            active: csvRow.active,
            cardio: csvRow.cardio
          };
        }).then( function(dataWhole) {
          const nonHealthy = dataWhole.filter(d => d.cardio === '0');
          const healthy = dataWhole.filter(d => d.cardio === '1');
          const nonHealthyNumberNonActive = nonHealthy.filter(d => d.active === '0').length;
          const nonHealthyNumberActive = nonHealthy.filter(d =>d.active === '1').length;
          parsedDataNonHealthy = [
            { name: 'Gens non-actifs', value: nonHealthyNumberNonActive },
            { name: 'Gens actifs', value: nonHealthyNumberActive }
          ];

          const healthyNumberNonActive = healthy.filter(d => d.active === '0').length;
          const healthyNumberActive = healthy.filter(d =>d.active === '1').length;
          parsedDataHealthy = [
            { name: 'Gens non-actifs', value: healthyNumberNonActive },
            { name: 'Gens actifs', value: healthyNumberActive }
          ];

        });
        drawChart(parsedDataNonHealthy, '#pie-container-non-healthy');
        drawChart(parsedDataHealthy, '#pie-container-healthy')
      }
      fetchData()
    });
  
    function drawChart(dataParsed, containerName) {
      // Remove the old svg
      d3.select(containerName)
          .select('svg')
          .remove();
  
      // Create new svg
      const svg = d3
          .select(containerName)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${width / 2}, ${height / 2})`);
  
      const arcGenerator = d3
          .arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius);
  
      const pieGenerator = d3
          .pie()
          .padAngle(0)
          .value((d) => d.value);
  
      const arc = svg
          .selectAll()
          .data(pieGenerator(dataParsed))
          .enter();
  
      // Append arcs
      arc
          .append('path')
          .attr('d', arcGenerator)
          .style('fill', (_, i) => colorScale(i))
          .style('stroke', '#ffffff')
          .style('stroke-width', 0);
  
      // Append text labels
      arc
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .text((d) => d.data.name)
          .attr('transform', (d) => {
          const [x, y] = arcGenerator.centroid(d);
          return `translate(${x}, ${y})`;
          });

      // Append legend
      const legend = svg
          .append('g')
          .attr('transform', `translate(${outerRadius/1.3}, ${-outerRadius})`);

      legend
        .selectAll()
        .data(dataParsed)
        .enter()
        .append('rect')
        .attr('y', (_, i) => i * 25)
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', (_, i) => colorScale(i));

      legend
        .selectAll()
        .data(dataParsed)
        .enter()
        .append('text')
        .attr('x', 30)
        .attr('y', (_, i) => i * 25 + 14)
        .text((d) => d.name);
    }    
  

    return <div className='container'>
      <h4 className='box'>Distribution des gens actifs et non-actifs chez les personnes souffrant de maladies cardiaques</h4>
      <div className='box' id="pie-container-non-healthy"/>
      <h4 className='box'>Distribution des gens actifs et non-actifs chez les personnes ne souffrant pas de maladies cardiaques</h4>
      <div className='box' id="pie-container-healthy"/>
      <p className='text-box'>
        L'activité physique est essentielle pour maintenir une bonne santé cardiaque. 
        En effet, l'inactivité physique est l'un des principaux facteurs de risque pour les maladies cardiovasculaires, qui peuvent avoir des conséquences graves sur la santé et la qualité de vie. 
        En faisant régulièrement de l'exercice, on renforce notre cœur et nos vaisseaux sanguins, ce qui améliore la circulation sanguine et réduit le risque de maladies cardiaques. 
        De plus, l'activité physique peut également aider à contrôler d'autres facteurs de risque tels que l'hypertension artérielle, le diabète et l'obésité. 
        Il est donc important de trouver des moyens d'incorporer de l'activité physique dans notre quotidien, que ce soit en faisant du sport, en marchant, en faisant du vélo ou en jardinant.</p>
    </div>
  }
export default PhysicalActivityPieChart;