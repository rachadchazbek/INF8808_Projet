import React, { useEffect } from 'react';
import * as d3 from 'd3';

function MaleAgeBoxAndWhisker() {
  const margin = { top: 10, right: 30, bottom: 30, left: 60 };
  const width = 300 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    var parsedDataMalecardio = [];
    var parsedDataMaleNoncardio = [];
    await d3.csv("./data/heart_data.csv", function(csvRow){
      return {
        age: csvRow.age,
        height: csvRow.height,
        weight: csvRow.weight,
        gender: csvRow.gender,
        cardio: csvRow.cardio
      };
    }).then( function(dataWhole) {
      const male = dataWhole.filter(d => d.gender === '2');
      parsedDataMalecardio = male.filter(d => d.cardio === '1').map(d => ({ cardio: d.cardio, age: d.age, height: d.height, weight: d.weight }));
      parsedDataMaleNoncardio = male.filter(d => d.cardio === '0').map(d => ({ cardio: d.cardio, age: d.age, height: d.height, weight: d.weight  }));

      
    });
    drawChart(parsedDataMalecardio, parsedDataMaleNoncardio);
  }

  function drawChart(datacardio, dataNoncardio) {
    // Remove the old svg
    d3.select('#box-and-whisker-container')
        .selectAll('svg')
        .remove();

    const maxcardioAge = d3.max(datacardio, (d) => parseFloat(d.age));
    const maxNoncardioAge = d3.max(dataNoncardio, (d) => parseFloat(d.age));
    const maxValAge = Math.max(maxcardioAge, maxNoncardioAge);
    // Create new svg
    const svg = d3
        .select('#box-and-whisker-container')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xAge = d3.scaleBand().range([0, width]).domain(['Sain', 'Malade']).padding(0.05);
    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xAge));

    const y = d3.scaleLinear().domain([0, maxValAge+20]).range([height, 0]);
    svg.append('g').call(d3.axisLeft(y));

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Age (année)");

    // Draw box and whisker plot for cardio males
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
        .attr('y1', (d) => y(mincardio))
        .attr('y2', (d) => y(maxcardioAge))
        .attr('stroke', 'black')
        .style('width', 40);

        svg.selectAll('.boxes')
        .data(['Malade'])
        .enter()
        .append('rect')
        .attr('x', (d) => xAge(d))
        .attr('y', (d) => y(q3cardio))
        .attr('height', (d) => y(q1cardio) - y(q3cardio))
        .attr('width', xAge.bandwidth())
        .attr('stroke', 'black')
        .style('fill', '#69b3a2');

    svg
      .selectAll('.medianLines')
      .data(['Malade'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d))
      .attr('x2', (d) => xAge(d) + xAge.bandwidth())
      .attr('y1', (d) => y(mediancardio))
      .attr('y2', (d) => y(mediancardio))
      .attr('stroke', 'black')
      .style('width', 80);

    svg.selectAll('.minLines')
    .data(['Malade'])
    .enter()
    .append('line')
    .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2 - 10)
    .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2 + 10)
    .attr('y1', (d) => y(mincardio))
    .attr('y2', (d) => y(mincardio))
    .attr('stroke', 'black')
    .style('width', 80);

    svg.selectAll('.maxLines')
    .data(['Malade'])
    .enter()
    .append('line')
    .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2 - 10)
    .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2 + 10)
    .attr('y1', (d) => y(maxcardioAge))
    .attr('y2', (d) => y(maxcardioAge))
    .attr('stroke', 'black')
    .style('width', 80);

    // Draw box and whisker plot for Sain males
    const agesNoncardio = dataNoncardio.map((d) => d.age);
    const q1Noncardio = d3.quantile(agesNoncardio, 0.25);
    const medianNoncardio = d3.quantile(agesNoncardio, 0.5);
    const q3Noncardio = d3.quantile(agesNoncardio, 0.75);
    const minNoncardio = d3.min(dataNoncardio, (d) => d.age);

   svg.selectAll('.vertLines')
        .data(['Sain'])
        .enter()
        .append('line')
        .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2)
        .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2)
        .attr('y1', (d) => y(minNoncardio))
        .attr('y2', (d) => y(maxNoncardioAge))
        .attr('stroke', 'black')
        .style('width', 40);

    svg.selectAll('.boxes')
        .data(['Sain'])
        .enter()
        .append('rect')
        .attr('x', (d) => xAge(d))
        .attr('y', (d) => y(q3Noncardio))
        .attr('height', (d) => y(q1Noncardio) - y(q3Noncardio))
        .attr('width', xAge.bandwidth())
        .attr('stroke', 'black')
        .style('fill', '#69b3a2');

    svg
      .selectAll('.medianLines')
      .data(['Sain'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d))
      .attr('x2', (d) => xAge(d) + xAge.bandwidth())
      .attr('y1', (d) => y(medianNoncardio))
      .attr('y2', (d) => y(medianNoncardio))
      .attr('stroke', 'black')
      .style('width', 80);

      svg.selectAll('.minLines')
      .data(['Sain'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2 - 10)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2 + 10)
      .attr('y1', (d) => y(minNoncardio))
      .attr('y2', (d) => y(minNoncardio))
      .attr('stroke', 'black')
      .style('width', 80);
  
      svg.selectAll('.maxLines')
      .data(['Sain'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2 - 10)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2 + 10)
      .attr('y1', (d) => y(maxNoncardioAge))
      .attr('y2', (d) => y(maxNoncardioAge))
      .attr('stroke', 'black')
      .style('width', 80);



      const svg2 = d3
      .select('#box-and-whisker-container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

      const maxcardioHeight = d3.max(datacardio, (d) => parseFloat(d.height));
      const maxNoncardioHeight = d3.max(dataNoncardio, (d) => parseFloat(d.height));
      const maxValHeight = Math.max(maxcardioHeight, maxNoncardioHeight);

      const yy = d3.scaleLinear().domain([0, maxValHeight+20]).range([height, 0]);
      svg2.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xAge));
      svg2.append('g').call(d3.axisLeft(yy));


      svg2.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Grandeur");

      // Draw box and whisker plot for cardio males
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
      .style('fill', '#69b3a2');

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

    // Draw box and whisker plot for Sain males
    const heightsNoncardio = dataNoncardio.map( (d) => parseFloat(d.height));
    const q1Noncardioheight = d3.quantile(heightsNoncardio, 0.25);
    const medianNoncardioheight = d3.quantile(heightsNoncardio, 0.5);
    const q3Noncardioheight = d3.quantile(heightsNoncardio, 0.75);
    const minNoncardioheight = d3.min(dataNoncardio, (d) => parseFloat(d.height));

   svg2.selectAll('.vertLines')
        .data(['Sain'])
        .enter()
        .append('line')
        .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2)
        .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2)
        .attr('y1', (d) => yy(minNoncardioheight))
        .attr('y2', (d) => yy(maxNoncardioHeight))
        .attr('stroke', 'black')
        .style('width', 40);

    svg2.selectAll('.boxes')
        .data(['Sain'])
        .enter()
        .append('rect')
        .attr('x', (d) => xAge(d))
        .attr('y', (d) => yy(q3Noncardioheight))
        .attr('height', (d) => yy(q1Noncardioheight) - yy(q3Noncardioheight))
        .attr('width', xAge.bandwidth())
        .attr('stroke', 'black')
        .style('fill', '#69b3a2');

    svg2
      .selectAll('.medianLines')
      .data(['Sain'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d))
      .attr('x2', (d) => xAge(d) + xAge.bandwidth())
      .attr('y1', (d) => yy(medianNoncardioheight))
      .attr('y2', (d) => yy(medianNoncardioheight))
      .attr('stroke', 'black')
      .style('width', 80);

      svg2.selectAll('.minLines')
      .data(['Sain'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2 - 10)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2 + 10)
      .attr('y1', (d) => yy(minNoncardioheight))
      .attr('y2', (d) => yy(minNoncardioheight))
      .attr('stroke', 'black')
      .style('width', 80);
  
      svg2.selectAll('.maxLines')
      .data(['Sain'])
      .enter()
      .append('line')
      .attr('x1', (d) => xAge(d) + xAge.bandwidth() / 2 - 10)
      .attr('x2', (d) => xAge(d) + xAge.bandwidth() / 2 + 10)
      .attr('y1', (d) => yy(maxNoncardioHeight))
      .attr('y2', (d) => yy(maxNoncardioHeight))
      .attr('stroke', 'black')
      .style('width', 80);












  }

  return <div id="box-and-whisker-container" />;
}

export default MaleAgeBoxAndWhisker;