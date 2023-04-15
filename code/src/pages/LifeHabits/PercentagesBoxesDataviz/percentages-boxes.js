import React, { useEffect } from 'react'
import "./percentages-boxes.css"
import * as d3 from 'd3'
import {DATA_PATH} from '../../../constants/paths'

const PercentagesBoxes = () => {
  const [nbrPersonnes, setNbrPersonnes] = React.useState(0);
    useEffect(() => {
        const fetchData = async () => {
            d3.csv(DATA_PATH).then(data => {
                const processedData = processData(data);
                const percentages = calculatePercentages(processedData);
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
        setNbrPersonnes(processedData.length);
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
      buildBox1(percentages[0]);
      buildBox2(percentages[1]);
      buildBox3(percentages[2]);
      buildBox4(percentages[3]);
    }

    const buildBox1 = (percentage) => { 
      const size = 200;
      const box1 = d3.select('#box1')
            .append('svg')
            .attr('width', size)
            .attr('height', size)
            .style('background-color', 'red')
            
        box1
      .append('text')
      .text(percentage + '%')
      .attr('x', size / 2)
      .attr('y', size / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '25px')
      .style('font-weight', 'bold')

        box1
      .append('text')
      .attr('x', size / 2)
      .attr('y', size / 2 + 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .selectAll('tspan')
      .data(['Ne fument pas', 'et ne boivent pas'])
      .enter()
      .append('tspan')
      .attr('x', size / 2)
      .attr('dy', '1.2em') // set the line spacing to 1.2em
      .text(function(d) { return d; });
    }

    const buildBox2 = (percentage) => {
      const size = 150; 
      const box2 = d3.select('#box2')
      .append('svg')
      .attr('width', size)
      .attr('height', size)
      .style('background-color', 'red')

        box2
      .append('text')
      .text(percentage + '%')
      .attr('x', size / 2)
      .attr('y', size / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '25px')
      .style('font-weight', 'bold')

        box2
      .append('text')
      .attr('x', size / 2)
      .attr('y', size / 2 + 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .selectAll('tspan')
      .data(['Fument', 'et ne boivent pas'])
      .enter()
      .append('tspan')
      .attr('x', size / 2)
      .attr('dy', '1.2em') // set the line spacing to 1.2em
      .text(function(d) { return d; });
    }

    const buildBox3 = (percentage) => {
      const size = 100;
      const box3 = d3.select('#box3')
          .append('svg')
          .attr('width', size)
          .attr('height', size)
          .style('background-color', 'red')

        box3
          .append('text')
          .text(percentage + '%')
          .attr('x', size / 2)
          .attr('y', size / 2)
          .attr('text-anchor', 'middle')
          .style('font-size', '25px')
          .style('font-weight', 'bold')
                  // Add text : fument et boivent under each percentage

        box3
          .append('text')
          .attr('x', size / 2)
          .attr('y', size / 2 + 5)
          .attr('text-anchor', 'middle')
          .style('font-size', '11px')
          .style('font-weight', 'bold')

          .selectAll('tspan')
          .data(['Ne fument pas', 'et boivent'])
          .enter()
          .append('tspan')
          .attr('x', size / 2)
          .attr('dy', '1.2em') // set the line spacing to 1.2em
          .text(function(d) { return d; });
    }

    const buildBox4 = (percentage) => {
      const size = 75;
      const box4 = d3.select('#box4')
            .append('svg')
            .attr('width', size)
            .attr('height', size)
            .style('background-color', 'red')
            // Add text : 50% fument et boivent

        box4
            .append('text')
            .text(percentage + '%')
            .attr('x', size / 2)
            .attr('y', size / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '25px')
            .style('font-weight', 'bold')

        box4
            .append('text')
            .attr('x', size / 2)
            .attr('y', size / 2 + 5)
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .selectAll('tspan')
            .data(['Fument', 'et boivent'])
            .enter()
            .append('tspan')
            .attr('x', size / 2)
            .attr('dy', '1.2em') // set the line spacing to 1.2em
            .text(function(d) { return d; });
        }

  return (
    <>
      <h3>Sur {nbrPersonnes}  personnes souffrant de maladies cardiovasculaires</h3>
      <div class='boxes-container'>
        <div id='box1'></div>
        <div id='box2'></div>
        <div id='box3'></div>
        <div id='box4'></div>
      </div>
      
      <div>
        <p class="p"> 
          Comme nous pouvons voir, nous avons séparé nos données en 4 catégories :
          <ul>
            Non fumeurs et non buveurs,
            Fumeurs et non buveurs,
            Non fumeurs et buveurs,
            Fumeurs et buveurs
          </ul>
          Parmis chacune des catégories, on distingue le pourcentage d'individus souffrant de maladies cardiovasculaires qui ne fumment pas la cigarette et qui ne boivent pas de l'alcool de manière
          régulière. Cette section est la section la plus grande car le pourcentage de ses individus est plus elevé dans le dataset. 

          De base le pourcentage des personnes qui fument et boivent est faible dans le dataset. Ce qui montre pas adéquiotement l'impact de la cigarette et de l'alcool sur les maladies cardiovasculaires.
        </p>
      </div>
    </>
    )
}

export default PercentagesBoxes