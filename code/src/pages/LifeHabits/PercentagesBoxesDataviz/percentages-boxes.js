import React, { useEffect } from 'react'
import "./percentages-boxes.css"
import * as d3 from 'd3'
import {DATA_PATH} from '../../../constants/paths'

const PercentagesBoxes = () => {
  const [nbrPersonnes, setNbrPersonnes] = React.useState(34979);
    useEffect(() => {
        const fetchData = async () => {
            d3.csv(DATA_PATH).then(data => {
                const processedData = processData(data);
                setNbrPersonnes(processedData.length);
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
            .style('background-color', 'red');
            
      appendPercentage(box1, percentage, size) 

      box1
      .append('text')
      .attr('x', size / 2)
      .attr('y', size / 2 + 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .style('user-select', 'none')
      .selectAll('tspan')
      .data(['Ne fument pas', 'et ne boivent pas'])
      .enter()
      .append('tspan')
      .attr('x', size / 2)
      .attr('dy', '1.2em') // set the line spacing to 1.2em
      .style('user-select', 'none')
      .text(function(d) { return d; });


      box1
      .on('mouseover', function() {
        d3.select(this)

        .selectAll('text')
        .remove()

        d3.select(this)
        .append('text')
        .text(Math.round(nbrPersonnes * percentage / 100) + ' personnes')
        .attr('x', size / 2)
        .attr('y', size / 2 )
        .attr('text-anchor', 'middle')
        .style('font-size', '24px')
        .style('font-weight', 'bold')
        .style('user-select', 'none')
        .style('pointer-events', 'none')

        d3.select(this)
        .append('text')
        .attr('x', size / 2)
        .attr('y', size / 2 + 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '20px')
        .style('font-weight', 'bold')
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .selectAll('tspan')
        .data(['Ne fument pas', 'et ne boivent pas'])
        .enter()
        .append('tspan')
        .attr('x', size / 2)
        .attr('dy', '1.2em') // set the line spacing to 1.2em
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .text(function(d) { return d; });
      }); 

      box1
      .on('mouseout', function() {
        d3.select(this)
        .selectAll('text')
        .remove()


        d3.select(this)
        .append('text')
        .text(percentage + '%')
        .attr('x', size / 2)
        .attr('y', size / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '25px')
        .style('font-weight', 'bold')
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        
        d3.select(this)
        .append('text')
        .attr('x', size / 2)
        .attr('y', size / 2 + 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .selectAll('tspan')
        .data(['Ne fument pas', 'et ne boivent pas'])
        .enter()
        .append('tspan')
        .attr('x', size / 2)
        .attr('dy', '1.2em') // set the line spacing to 1.2em
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .text(function(d) { return d; });
      });
    }

    const buildBox2 = (percentage) => {
      const size = 150; 
      const box2 = d3.select('#box2')
      .append('svg')
      .attr('width', size)
      .attr('height', size)
      .style('background-color', 'red')

      appendPercentage(box2, percentage, size)

        box2
      .append('text')
      .attr('x', size / 2)
      .attr('y', size / 2 + 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .style('user-select', 'none')
      .style('pointer-events', 'none')
      .selectAll('tspan')
      .data(['Fument', 'et ne boivent pas'])
      .enter()
      .append('tspan')
      .attr('x', size / 2)
      .attr('dy', '1.2em') // set the line spacing to 1.2em
      .style('user-select', 'none')
      .style('pointer-events', 'none')
      .text(function(d) { return d; });


      box2
      .on('mouseover', function() {
        d3.select(this)

        .selectAll('text')
        .remove()

        d3.select(this)
        .append('text')
        .text(Math.round(nbrPersonnes * percentage / 100) + ' personnes')
        .attr('x', size / 2)
        .attr('y', size / 2 )
        .attr('text-anchor', 'middle')
        .style('font-size', '17px')
        .style('font-weight', 'bold')
        .style('user-select', 'none')
        .style('pointer-events', 'none')

        d3.select(this)
        .append('text')
        .attr('x', size / 2)
        .attr('y', size / 2 + 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '15px')
        .style('font-weight', 'bold')
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .selectAll('tspan')
        .data(['Ne fument pas', 'et ne boivent pas'])
        .enter()
        .append('tspan')
        .attr('x', size / 2)
        .attr('dy', '1.2em') // set the line spacing to 1.2em
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .text(function(d) { return d; });
      }); 

      box2
      .on('mouseout', function() {
        d3.select(this)
        .selectAll('text')
        .remove()

        d3.select(this)
        .append('text')
        .text(percentage + '%')
        .attr('x', size / 2)
        .attr('y', size / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '25px')
        .style('font-weight', 'bold')
        .style('user-select', 'none')
        .style('pointer-events', 'none')

        d3.select(this)
        .append('text')
        .attr('x', size / 2)
        .attr('y', size / 2 + 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .selectAll('tspan')
        .data(['Ne fument pas', 'et ne boivent pas'])
        .enter()
        .append('tspan')
        .attr('x', size / 2)
        .attr('dy', '1.2em') // set the line spacing to 1.2em
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .text(function(d) { return d; });
      });
    }

    const buildBox3 = (percentage) => {
      const size = 100;
      const box3 = d3.select('#box3')
          .append('svg')
          .attr('width', size)
          .attr('height', size)
          .style('background-color', 'red')

        appendPercentage(box3, percentage, size) 


        box3
        .append('text')
        .attr('x', size / 2)
        .attr('y', size / 2 + 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .selectAll('tspan')
        .data(['Ne fument pas', 'et boivent'])
        .enter()
        .append('tspan')
        .attr('x', size / 2)
        .attr('dy', '1.2em') // set the line spacing to 1.2em
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .text(function(d) { return d; });

      
          box3
          .on('mouseover', function() {
            d3.select(this)
    
            .selectAll('text')
            .remove()
    
            d3.select(this)
            .append('text')
            .text(Math.round(nbrPersonnes * percentage / 100))
            .attr('x', size / 2)
            .attr('y', size / 2 - 10)
            .attr('text-anchor', 'middle')
            .style('font-size', '15px')
            .style('font-weight', 'bold')
            .style('user-select', 'none')
            .style('pointer-events', 'none')

            d3.select(this)
            .append('text')
            .text('personnes')
            .attr('x', size / 2)
            .attr('y', size / 2 + 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '15px')
            .style('font-weight', 'bold')
            .style('user-select', 'none')
            .style('pointer-events', 'none')
            .selectAll('tspan')
            
    
            d3.select(this)
            .append('text')
            .attr('x', size / 2)
            .attr('y', size / 2 + 5)
            .attr('text-anchor', 'middle')
            .style('font-size', '13px')
            .style('font-weight', 'bold')
            .style('user-select', 'none')
            .style('pointer-events', 'none')
            .selectAll('tspan')
            .data(['Ne fument pas', 'et boivent'])
            .enter()
            .append('tspan')
            .attr('x', size / 2)
            .attr('dy', '1.2em') // set the line spacing to 1.2em
            .style('user-select', 'none')
            .style('pointer-events', 'none')
            .text(function(d) { return d; });
          }); 
    
          box3
          .on('mouseout', function() {
            d3.select(this)
            .selectAll('text')
            .remove()
    

            d3.select(this)
            .append('text')
            .text(percentage + '%')
            .attr('x', size / 2)
            .attr('y', size / 2 + 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '25px')
            .style('font-weight', 'bold')
            .style('user-select', 'none')
            .style('pointer-events', 'none')
    
            d3.select(this)
            .append('text')
            .attr('x', size / 2)
            .attr('y', size / 2 )
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .style('user-select', 'none')
            .style('pointer-events', 'none')
            .selectAll('tspan')
            .data(['Ne fument pas', 'et boivent'])
            .enter()
            .append('tspan')
            .attr('x', size / 2)
            .attr('dy', '1.2em') // set the line spacing to 1.2em
            .style('user-select', 'none')
            .style('pointer-events', 'none')
            .text(function(d) { return d; });
          });
    }

    const buildBox4 = (percentage) => {
      const size = 75;
      const box4 = d3.select('#box4')
            .append('svg')
            .attr('width', size)
            .attr('height', size)
            .style('background-color', 'red')
            // Add text : 50% fument et boivent


        appendPercentage(box4, percentage, size) 

        box4
            .append('text')
            .attr('x', size / 2)
            .attr('y', size / 2 )
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .style('user-select', 'none')
            .style('pointer-events', 'none')
            .selectAll('tspan')
            .data(['Fument', 'et boivent'])
            .enter()
            .append('tspan')
            .attr('x', size / 2)
            .attr('dy', '1.2em') // set the line spacing to 1.2em
            .style('user-select', 'none')
            .style('pointer-events', 'none')
            .text(function(d) { return d; });


      box4
      .on('mouseover', function() {
        d3.select(this)

        .selectAll('text')
        .remove()

        d3.select(this)
        .append('text')
        .text(Math.round(nbrPersonnes * percentage / 100))
        .attr('x', size / 2)
        .attr('y', size / 2 - 10)
        .attr('text-anchor', 'middle')
        .style('font-size', '13px')
        .style('font-weight', 'bold')
        .style('user-select', 'none')
        .style('pointer-events', 'none')

        d3.select(this)
        .append('text')
        .text('personnes')
        .attr('x', size / 2)
        .attr('y', size / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '13px')
        .style('font-weight', 'bold')
        .style('user-select', 'none')
        .style('pointer-events', 'none')

        d3.select(this)
        .append('text')
        .attr('x', size / 2)
        .attr('y', size / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '13px')
        .style('font-weight', 'bold')
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .selectAll('tspan')
        .data(['Fument', 'et boivent'])
        .enter()
        .append('tspan')
        .attr('x', size / 2)
        .attr('dy', '1.2em') // set the line spacing to 1.2em
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .text(function(d) { return d; });
      }); 

      box4
      .on('mouseout', function() {
        d3.select(this)
        .selectAll('text')
        .remove()


        d3.select(this)
        .append('text')
        .text(percentage + '%')
        .attr('x', size / 2)
        .attr('y', size / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '25px')
        .style('font-weight', 'bold')
        .style('user-select', 'none')
        .style('pointer-events', 'none')

        d3.select(this)
        .append('text')
        .attr('x', size / 2)
        .attr('y', size / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .selectAll('tspan')
        .data(['Fument', 'et boivent'])
        .enter()
        .append('tspan')
        .attr('x', size / 2)
        .attr('dy', '1.2em') // set the line spacing to 1.2em
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .text(function(d) { return d; });
      });
    }

  
  const appendPercentage = (g, percentage, size) => {
    g
      .append('text')
      .text(percentage + '%')
      .attr('x', size / 2)
      .attr('y', size / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '25px')
      .style('font-weight', 'bold')
  }

  return (
    <>
      <h2>Sur {nbrPersonnes}  personnes souffrant de maladies cardiovasculaires</h2>
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