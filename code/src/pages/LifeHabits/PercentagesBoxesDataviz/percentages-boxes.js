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
      const box1 = d3.select('#box1')
            .append('svg')
            .attr('width', 200)
            .attr('height', 200)
            .style('background-color', 'red')
            
        box1
      .append('text')
      .text(percentage + '%')
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
    }

    const buildBox2 = (percentage) => {
      const box2 = d3.select('#box2')
      .append('svg')
      .attr('width', 150)
      .attr('height', 150)
      .style('background-color', 'red')

        box2
      .append('text')
      .text(percentage + '%')
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
    }

    const buildBox3 = (percentage) => {
      const box3 = d3.select('#box3')
          .append('svg')
          .attr('width', 100)
          .attr('height', 100)
          .style('background-color', 'red')

        box3
          .append('text')
          .text(percentage + '%')
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
    }

    const buildBox4 = (percentage) => {
      const box4 = d3.select('#box4')
            .append('svg')
            .attr('width', 75)
            .attr('height', 75)
            .style('background-color', 'red')
            // Add text : 50% fument et boivent

        box4
            .append('text')
            .text(percentage + '%')
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
    <>

      <h3>Sux Xs personne souffrant de maladies cardiovasculaires</h3>
      <div class='boxes-container'>
        <div id='box1'></div>
        <div id='box2'></div>
        <div id='box3'></div>
        <div id='box4'></div>
      </div>
      
      <div>
        <p>
          Cette première visualisation aide à accomplir la première tâche, qui consiste à sensibiliser l'utilisateur à l'incidence entre les bonnes et mauvaises habitudes de vie et le risque de maladie cardiovasculaire, surligné en rouge foncé.

          Cette question est:
          Quelle est la proportion de fumeurs et de consommateurs d'alcool parmi les individus souffrant de maladies cardiovasculaires?

          Afin de répondre à cette question, nous avons pensé à utiliser un proportional shape chart d'individus souffrant de maladies cardiovasculaires. Voici notre maquette:

        </p>
      </div>

      <div>
          Comme nous pouvons voir, nous avons séparé nos données en 4 carrés, chacune contenant une sous-section visée. La première représente le pourcentage d'individus souffrant de maladies cardiovasculaires qui fument la cigarette et qui boivent de l'alcool de manière régulière. Cette section va être plus grande et plus foncée que les autres puisque le pourcentage sera plus gros. Ensuite, les autres sections vont être mises en ordre de grosseur. Elles vont représenter le pourcentage de ceux qui ne font que fumer, que boire de l'alcool et finalement aucun des deux.
          Nous avons choisi le proportional shape chart afin de mettre en évidence la corrélation entre l'habitude de fumer et de boire au risque de souffrir de maladies cardiovasculaires. La grosseur des différents carrés va rendre facile la comparaison des habitudes de vie. De plus, le gradient de couleur va ajouter à cet effet, avec un rouge foncé indiquant rapidement la source de préoccupation des habitudes de vie. Nous pensons que cela va aider à atteindre notre tâche de sensibiliser l'utilisateur.
          Afin de permettre à l'utilisateur d'interagir avec la visualisation, nous allons ajouter une fonction de survol aux différentes cases. Lorsque l'utilisateur survole une forme, celle-ci va devenir un peu plus pâle et le pourcentage va être changé pour présenter plus précisément le nombre d'individus utilisés pour arriver aux pourcentages. De plus, si l'utilisateur appuie sur la case, celle-ci va grossir et va offrir de l'information supplémentaire sur les données utilisées comme qu'est-ce qui est considéré comme fumer ou boire de façon habituelle, la source des données ainsi que des références supplémentaires si nécessaire.
      </div>
    </>
    )
}

export default PercentagesBoxes