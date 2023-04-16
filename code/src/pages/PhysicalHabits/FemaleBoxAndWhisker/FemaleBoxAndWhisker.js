import React, { useEffect } from 'react';
import * as d3 from 'd3';
import {DATA_PATH} from '../../../constants/paths.js'
import "./FemaleBoxAndWhisker.css"


function FefemaleBoxAndWhisker() {
  const margin = { top: 10, right: 30, bottom: 30, left: 60 };
  const width = 300 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    var parsedDatafemalecardio = [];
    var parsedDatafemaleNoncardio = [];
    await d3.csv(DATA_PATH, function (csvRow) {
      return {
        age: csvRow.age / 365,
        height: csvRow.height,
        weight: csvRow.weight,
        gender: csvRow.gender,
        cardio: csvRow.cardio
      };
    }).then(function (dataWhole) {
      const female = dataWhole.filter(d => d.gender === '1');
      parsedDatafemalecardio = female.filter(d => d.cardio === '1').map(d => ({ cardio: d.cardio, age: d.age, height: d.height, weight: d.weight }));
      parsedDatafemaleNoncardio = female.filter(d => d.cardio === '0').map(d => ({ cardio: d.cardio, age: d.age, height: d.height, weight: d.weight }));


    });
    drawChart(parsedDatafemalecardio, parsedDatafemaleNoncardio);
  }

  function drawChart(datacardio, dataNoncardio) {
    // Remove the old svg
    d3.select('#female-box-and-whisker-container')
      .selectAll('svg')
      .remove();

    // Create new svg for legend
    const legend = d3
      .select('#female-box-and-whisker-container')
      .append('svg')
      .attr('width', width + 2 * margin.left)
      .attr('height', height / 2 + 4 * margin.top)
      .append('g')
      .attr('transform', `translate(${0},${0})`);

    // Draw legend rectangles and text
    legend
      .append('rect')
      .attr('x', 0)
      .attr('y', 10)
      .attr('width', 20)
      .attr('height', 20)
      .style('fill', 'red');

    legend
      .append('text')
      .attr('x', 30)
      .attr('y', 25)
      .text('Femme malade');

    legend
      .append('rect')
      .attr('x', 150)
      .attr('y', 10)
      .attr('width', 20)
      .attr('height', 20)
      .style('fill', 'blue');

    legend
      .append('text')
      .attr('x', 180)
      .attr('y', 25)
      .text('Femme Saine');

    const maxcardioAge = d3.max(datacardio, (d) => parseFloat(d.age));
    const maxNoncardioAge = d3.max(dataNoncardio, (d) => parseFloat(d.age));
    const maxValAge = Math.max(maxcardioAge, maxNoncardioAge);
    // Create new svg
    const svg = d3
      .select('#female-box-and-whisker-container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);


    const xAge = d3.scaleBand().range([0, width]).domain(['Saine', 'Malade']).padding(0.05);
    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xAge));


    const yAge = d3.scaleLinear().domain([0, maxValAge + 20]).range([height, 0]);
    svg.append('g').call(d3.axisLeft(yAge));

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Age (année)");

    // Draw box and whisker plot for cardio females
    const agescardio = datacardio.map((d) => d.age);
    const q1cardio = d3.quantile(agescardio, 0.25);
    const mediancardio = d3.quantile(agescardio, 0.5);
    const q3cardio = d3.quantile(agescardio, 0.75);
    const mincardio = d3.min(datacardio, (d) => d.age);


    svg.selectAll('.vertLines')
      .data(['Malade'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2)
      .attr('y1', (d) => yAge(mincardio))
      .attr('y2', (d) => yAge(maxcardioAge))
      .attr('stroke', 'black')
      .style('width', 40);

    svg.selectAll('.boxes')
      .data(['Malade'])
      .enter()
      .append('rect')
      .attr('x', (d) => xAge(d))
      .attr('y', (d) => yAge(q3cardio))
      .attr('height', (d) => yAge(q1cardio) - yAge(q3cardio))
      .attr('width', xAge.bandwidth())
      .attr('stroke', 'black')
      .style('fill', 'red');

    svg
      .selectAll('.medianLines')
      .data(['Malade'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d))
      .attr('x2', (d) => xAge(d) + xAge.bandwidth())
      .attr('y1', (d) => yAge(mediancardio))
      .attr('y2', (d) => yAge(mediancardio))
      .attr('stroke', 'black')
      .style('width', 80);

    svg.selectAll('.minLines')
      .data(['Malade'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2 - 10)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2 + 10)
      .attr('y1', (d) => yAge(mincardio))
      .attr('y2', (d) => yAge(mincardio))
      .attr('stroke', 'black')
      .style('width', 80);

    svg.selectAll('.maxLines')
      .data(['Malade'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2 - 10)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2 + 10)
      .attr('y1', (d) => yAge(maxcardioAge))
      .attr('y2', (d) => yAge(maxcardioAge))
      .attr('stroke', 'black')
      .style('width', 80);

    // Draw box and whisker plot for Saine females
    const agesNoncardio = dataNoncardio.map((d) => d.age);
    const q1Noncardio = d3.quantile(agesNoncardio, 0.25);
    const medianNoncardio = d3.quantile(agesNoncardio, 0.5);
    const q3Noncardio = d3.quantile(agesNoncardio, 0.75);
    const minNoncardio = d3.min(dataNoncardio, (d) => d.age);

    svg.selectAll('.vertLines')
      .data(['Saine'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2)
      .attr('y1', (d) => yAge(minNoncardio))
      .attr('y2', (d) => yAge(maxNoncardioAge))
      .attr('stroke', 'black')
      .style('width', 40);

    svg.selectAll('.boxes')
      .data(['Saine'])
      .enter()
      .append('rect')
      .attr('x', (d) => xAge(d))
      .attr('y', (d) => yAge(q3Noncardio))
      .attr('height', (d) => yAge(q1Noncardio) - yAge(q3Noncardio))
      .attr('width', xAge.bandwidth())
      .attr('stroke', 'black')
      .style('fill', 'blue');

    svg
      .selectAll('.medianLines')
      .data(['Saine'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d))
      .attr('x2', (d) => xAge(d) + xAge.bandwidth())
      .attr('y1', (d) => yAge(medianNoncardio))
      .attr('y2', (d) => yAge(medianNoncardio))
      .attr('stroke', 'black')
      .style('width', 80);

    svg.selectAll('.minLines')
      .data(['Saine'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2 - 10)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2 + 10)
      .attr('y1', (d) => yAge(minNoncardio))
      .attr('y2', (d) => yAge(minNoncardio))
      .attr('stroke', 'black')
      .style('width', 80);

    svg.selectAll('.maxLines')
      .data(['Saine'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2 - 10)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2 + 10)
      .attr('y1', (d) => yAge(maxNoncardioAge))
      .attr('y2', (d) => yAge(maxNoncardioAge))
      .attr('stroke', 'black')
      .style('width', 80);

    const svg2 = d3
      .select('#female-box-and-whisker-container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const maxcardioHeight = d3.max(datacardio, (d) => parseFloat(d.height));
    const maxNoncardioHeight = d3.max(dataNoncardio, (d) => parseFloat(d.height));
    const maxValHeight = Math.max(maxcardioHeight, maxNoncardioHeight);

    const yy = d3.scaleLinear().domain([0, maxValHeight + 20]).range([height, 0]);
    svg2.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xAge));
    svg2.append('g').call(d3.axisLeft(yy));


    svg2.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Grandeur (cm)");

    // Draw box and whisker plot for cardio females
    const heightcardio = datacardio.map((d) => parseFloat(d.height));
    const q1cardioheight = d3.quantile(heightcardio, 0.25);
    const mediancardioheight = d3.quantile(heightcardio, 0.5);
    const q3cardioheight = d3.quantile(heightcardio, 0.75);
    const mincardioheight = d3.min(datacardio, (d) => parseFloat(d.height));

    svg2.selectAll('.vertLines')
      .data(['Malade'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2)
      .attr('y1', (d) => yy(mincardioheight))
      .attr('y2', (d) => yy(maxcardioHeight))
      .attr('stroke', 'black')
      .style('width', 40);

    svg2.selectAll('.boxes')
      .data(['Malade'])
      .enter()
      .append('rect')
      .attr('x', (d) => xAge(d))
      .attr('y', (d) => yy(q3cardioheight))
      .attr('height', (d) => yy(q1cardioheight) - yy(q3cardioheight))
      .attr('width', xAge.bandwidth())
      .attr('stroke', 'black')
      .style('fill', 'red');

    svg2
      .selectAll('.medianLines')
      .data(['Malade'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d))
      .attr('x2', (d) => xAge(d) + xAge.bandwidth())
      .attr('y1', (d) => yy(mediancardioheight))
      .attr('y2', (d) => yy(mediancardioheight))
      .attr('stroke', 'black')
      .style('width', 80);

    svg2.selectAll('.minLines')
      .data(['Malade'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2 - 10)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2 + 10)
      .attr('y1', (d) => yy(mincardioheight))
      .attr('y2', (d) => yy(mincardioheight))
      .attr('stroke', 'black')
      .style('width', 80);

    svg2.selectAll('.maxLines')
      .data(['Malade'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2 - 10)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2 + 10)
      .attr('y1', (d) => yy(maxcardioHeight))
      .attr('y2', (d) => yy(maxcardioHeight))
      .attr('stroke', 'black')
      .style('width', 80);

    // Draw box and whisker plot for Saine females
    const heightsNoncardio = dataNoncardio.map((d) => parseFloat(d.height));
    const q1Noncardioheight = d3.quantile(heightsNoncardio, 0.25);
    const medianNoncardioheight = d3.quantile(heightsNoncardio, 0.5);
    const q3Noncardioheight = d3.quantile(heightsNoncardio, 0.75);
    const minNoncardioheight = d3.min(dataNoncardio, (d) => parseFloat(d.height));

    svg2.selectAll('.vertLines')
      .data(['Saine'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2)
      .attr('y1', (d) => yy(minNoncardioheight))
      .attr('y2', (d) => yy(maxNoncardioHeight))
      .attr('stroke', 'black')
      .style('width', 40);

    svg2.selectAll('.boxes')
      .data(['Saine'])
      .enter()
      .append('rect')
      .attr('x', (d) => xAge(d))
      .attr('y', (d) => yy(q3Noncardioheight))
      .attr('height', (d) => yy(q1Noncardioheight) - yy(q3Noncardioheight))
      .attr('width', xAge.bandwidth())
      .attr('stroke', 'black')
      .style('fill', 'blue');

    svg2
      .selectAll('.medianLines')
      .data(['Saine'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d))
      .attr('x2', (d) => xAge(d) + xAge.bandwidth())
      .attr('y1', (d) => yy(medianNoncardioheight))
      .attr('y2', (d) => yy(medianNoncardioheight))
      .attr('stroke', 'black')
      .style('width', 80);

    svg2.selectAll('.minLines')
      .data(['Saine'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2 - 10)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2 + 10)
      .attr('y1', (d) => yy(minNoncardioheight))
      .attr('y2', (d) => yy(minNoncardioheight))
      .attr('stroke', 'black')
      .style('width', 80);

    svg2.selectAll('.maxLines')
      .data(['Saine'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2 - 10)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2 + 10)
      .attr('y1', (d) => yy(maxNoncardioHeight))
      .attr('y2', (d) => yy(maxNoncardioHeight))
      .attr('stroke', 'black')
      .style('width', 80);

    const svg3 = d3
      .select('#female-box-and-whisker-container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const maxcardioWeight = d3.max(datacardio, (d) => parseFloat(d.weight));
    const maxNoncardioWeight = d3.max(dataNoncardio, (d) => parseFloat(d.weight));
    const maxValWeight = Math.max(maxcardioWeight, maxNoncardioWeight);

    const yWeight = d3.scaleLinear().domain([0, maxValWeight + 20]).range([height, 0]);
    svg3.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xAge));
    svg3.append('g').call(d3.axisLeft(yWeight));


    svg3.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Poids (kg)");

    // Draw box and whisker plot for cardio females
    const weightcardio = datacardio.map((d) => parseFloat(d.weight));
    const q1cardioweight = d3.quantile(weightcardio, 0.25);
    const mediancardioweight = d3.quantile(weightcardio, 0.5);
    const q3cardioweight = d3.quantile(weightcardio, 0.75);
    const mincardioweight = d3.min(datacardio, (d) => parseFloat(d.weight));

    svg3.selectAll('.vertLines')
      .data(['Malade'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2)
      .attr('y1', (d) => yWeight(mincardioweight))
      .attr('y2', (d) => yWeight(maxcardioWeight))
      .attr('stroke', 'black')
      .style('width', 40);

    svg3.selectAll('.boxes')
      .data(['Malade'])
      .enter()
      .append('rect')
      .attr('x', (d) => xAge(d))
      .attr('y', (d) => yWeight(q3cardioweight))
      .attr('height', (d) => yWeight(q1cardioweight) - yWeight(q3cardioweight))
      .attr('width', xAge.bandwidth())
      .attr('stroke', 'black')
      .style('fill', 'red');

    svg3
      .selectAll('.medianLines')
      .data(['Malade'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d))
      .attr('x2', (d) => xAge(d) + xAge.bandwidth())
      .attr('y1', (d) => yWeight(mediancardioweight))
      .attr('y2', (d) => yWeight(mediancardioweight))
      .attr('stroke', 'black')
      .style('width', 80);

    svg3.selectAll('.minLines')
      .data(['Malade'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2 - 10)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2 + 10)
      .attr('y1', (d) => yWeight(mincardioweight))
      .attr('y2', (d) => yWeight(mincardioweight))
      .attr('stroke', 'black')
      .style('width', 80);

    svg3.selectAll('.maxLines')
      .data(['Malade'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2 - 10)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2 + 10)
      .attr('y1', (d) => yWeight(maxcardioWeight))
      .attr('y2', (d) => yWeight(maxcardioWeight))
      .attr('stroke', 'black')
      .style('width', 80);

    // Draw box and whisker plot for Saine females
    const weightsNoncardio = dataNoncardio.map((d) => parseFloat(d.weight));
    const q1Noncardioweight = d3.quantile(weightsNoncardio, 0.25);
    const medianNoncardioweight = d3.quantile(weightsNoncardio, 0.5);
    const q3Noncardioweight = d3.quantile(weightsNoncardio, 0.75);
    const minNoncardioweight = d3.min(dataNoncardio, (d) => parseFloat(d.weight));

    svg3.selectAll('.vertLines')
      .data(['Saine'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2)
      .attr('y1', (d) => yWeight(minNoncardioweight))
      .attr('y2', (d) => yWeight(maxNoncardioWeight))
      .attr('stroke', 'black')
      .style('width', 40);

    svg3.selectAll('.boxes')
      .data(['Saine'])
      .enter()
      .append('rect')
      .attr('x', (d) => xAge(d))
      .attr('y', (d) => yWeight(q3Noncardioweight))
      .attr('height', (d) => yWeight(q1Noncardioweight) - yWeight(q3Noncardioweight))
      .attr('width', xAge.bandwidth())
      .attr('stroke', 'black')
      .style('fill', 'blue');

    svg3
      .selectAll('.medianLines')
      .data(['Saine'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d))
      .attr('x2', (d) => xAge(d) + xAge.bandwidth())
      .attr('y1', (d) => yWeight(medianNoncardioweight))
      .attr('y2', (d) => yWeight(medianNoncardioweight))
      .attr('stroke', 'black')
      .style('width', 80);

    svg3.selectAll('.minLines')
      .data(['Saine'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2 - 10)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2 + 10)
      .attr('y1', (d) => yWeight(minNoncardioweight))
      .attr('y2', (d) => yWeight(minNoncardioweight))
      .attr('stroke', 'black')
      .style('width', 80);

    svg3.selectAll('.maxLines')
      .data(['Saine'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2 - 10)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2 + 10)
      .attr('y1', (d) => yWeight(maxNoncardioWeight))
      .attr('y2', (d) => yWeight(maxNoncardioWeight))
      .attr('stroke', 'black')
      .style('width', 80);
  }

  return (
    <div className="box">
      <h2 className="box">Distribution de la présence d'une maladie cardiovasculaire chez les femmes selon diverses caractéristiques</h2>
      <div id="female-box-and-whisker-container" />
      <div className="paragraphe">
        <h4 className="box">Facteur variable</h4>
        <p className="text-box">
        Certains facteurs, comme le poids, peuvent être modifiés pour réduire le risque de développer une maladie cardiovasculaire. Par exemple, perdre du poids 
        peut aider à réduire la pression artérielle et le taux de cholestérol, qui sont deux facteurs de risque majeurs pour les maladies cardiovasculaires.
        </p>
      </div>
      <br></br>
      <div className="paragraphe">
        <h4 className="box">Facteur invariables</h4>
        <p className="text-box">
        À l'opposé, l'âge, la taille et le sexe sont des facteurs inchangeables qui influencent également le risque de développer une maladie cardiovasculaire. 
        Par exemple, le risque de maladies cardiovasculaires augmente avec l'âge, car les artères ont tendance à durcir et à s'épaissir au fil du temps. 
        De même, les hommes sont plus susceptibles de développer une maladie cardiovasculaire que les femmes, en particulier avant la ménopause. 
        Enfin, la taille peut également jouer un rôle dans le risque de maladies cardiovasculaires, car les personnes plus grandes ont généralement des artères 
        plus larges, ce qui peut réduire la résistance au flux sanguin.
        </p>
      </div>
    </div>
  );
  

}

export default FefemaleBoxAndWhisker;