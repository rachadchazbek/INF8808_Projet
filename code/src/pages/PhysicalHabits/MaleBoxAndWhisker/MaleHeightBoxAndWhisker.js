import React, { useEffect } from 'react';
import * as d3 from 'd3';

function MaleHeightBoxAndWhisker() {
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
        height: csvRow.height,
        gender: csvRow.gender,
        cardio: csvRow.cardio
      };
    }).then( function(dataWhole) {
      const male = dataWhole.filter(d => d.gender === '2');
      parsedDataMalecardio = male.filter(d => d.cardio === '1').map(d => ({ cardio: d.cardio, height: d.height }));
      parsedDataMaleNoncardio = male.filter(d => d.cardio === '0').map(d => ({ cardio: d.cardio, height: d.height }));
    });
    drawChart(parsedDataMalecardio, parsedDataMaleNoncardio);
  }

  function drawChart(datacardio, dataNoncardio) {

    // Create new svg
    const svg = d3
        .select('#box-and-whisker-container')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${2*width + margin.left},${margin.top})`);

    const x = d3.scaleBand().range([0, width]).domain(['Sain', 'Malade']).padding(0.05);
    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));

    const y = d3.scaleLinear().domain([20, 70]).range([height, 0]);
    svg.append('g').call(d3.axisLeft(y));

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Grandeur");

    // Draw box and whisker plot for cardio males
    const heightscardio = datacardio.map((d) => d.height);
    const q1cardio = d3.quantile(heightscardio, 0.25);
    const mediancardio = d3.quantile(heightscardio, 0.5);
    const q3cardio = d3.quantile(heightscardio, 0.75);
    //const interQuantileRangecardio = q3cardio - q1cardio;
    const mincardio = d3.min(datacardio, (d) => d.height);
    const maxcardio = d3.max(datacardio, (d) => d.height);

   svg.selectAll('.vertLines')
        .data(['Malade'])
        .enter()
        .append('line')
        .attr('x1', (d) => x(d) + x.bandwidth() / 2)
        .attr('x2', (d) => x(d) + x.bandwidth() / 2)
        .attr('y1', (d) => y(mincardio))
        .attr('y2', (d) => y(maxcardio))
        .attr('stroke', 'black')
        .style('width', 40);

        svg.selectAll('.boxes')
        .data(['Malade'])
        .enter()
        .append('rect')
        .attr('x', (d) => x(d))
        .attr('y', (d) => y(q3cardio))
        .attr('height', (d) => y(q1cardio) - y(q3cardio))
        .attr('width', x.bandwidth())
        .attr('stroke', 'black')
        .style('fill', '#69b3a2');

    svg
      .selectAll('.medianLines')
      .data(['Malade'])
      .enter()
      .append('line')
      .attr('x1', (d) => x(d))
      .attr('x2', (d) => x(d) + x.bandwidth())
      .attr('y1', (d) => y(mediancardio))
      .attr('y2', (d) => y(mediancardio))
      .attr('stroke', 'black')
      .style('width', 80);

    svg.selectAll('.minLines')
    .data(['Malade'])
    .enter()
    .append('line')
    .attr('x1', (d) => x(d) + x.bandwidth() / 2 - 10)
    .attr('x2', (d) => x(d) + x.bandwidth() / 2 + 10)
    .attr('y1', (d) => y(mincardio))
    .attr('y2', (d) => y(mincardio))
    .attr('stroke', 'black')
    .style('width', 80);

    svg.selectAll('.maxLines')
    .data(['Malade'])
    .enter()
    .append('line')
    .attr('x1', (d) => x(d) + x.bandwidth() / 2 - 10)
    .attr('x2', (d) => x(d) + x.bandwidth() / 2 + 10)
    .attr('y1', (d) => y(maxcardio))
    .attr('y2', (d) => y(maxcardio))
    .attr('stroke', 'black')
    .style('width', 80);

    // Draw box and whisker plot for Sain males
    const heightsNoncardio = dataNoncardio.map((d) => d.height);
    const q1Noncardio = d3.quantile(heightsNoncardio, 0.25);
    const medianNoncardio = d3.quantile(heightsNoncardio, 0.5);
    const q3Noncardio = d3.quantile(heightsNoncardio, 0.75);
    //const interQuantileRangeNoncardio = q3Noncardio - q1Noncardio;
    const minNoncardio = d3.min(dataNoncardio, (d) => d.height);
    const maxNoncardio = d3.max(dataNoncardio, (d) => d.height);
    console.log(minNoncardio*365);

   svg.selectAll('.vertLines')
        .data(['Sain'])
        .enter()
        .append('line')
        .attr('x1', (d) => x(d) + x.bandwidth() / 2)
        .attr('x2', (d) => x(d) + x.bandwidth() / 2)
        .attr('y1', (d) => y(minNoncardio))
        .attr('y2', (d) => y(maxNoncardio))
        .attr('stroke', 'black')
        .style('width', 40);

    svg.selectAll('.boxes')
        .data(['Sain'])
        .enter()
        .append('rect')
        .attr('x', (d) => x(d))
        .attr('y', (d) => y(q3Noncardio))
        .attr('height', (d) => y(q1Noncardio) - y(q3Noncardio))
        .attr('width', x.bandwidth())
        .attr('stroke', 'black')
        .style('fill', '#69b3a2');

    svg
      .selectAll('.medianLines')
      .data(['Sain'])
      .enter()
      .append('line')
      .attr('x1', (d) => x(d))
      .attr('x2', (d) => x(d) + x.bandwidth())
      .attr('y1', (d) => y(medianNoncardio))
      .attr('y2', (d) => y(medianNoncardio))
      .attr('stroke', 'black')
      .style('width', 80);

      svg.selectAll('.minLines')
      .data(['Sain'])
      .enter()
      .append('line')
      .attr('x1', (d) => x(d) + x.bandwidth() / 2 - 10)
      .attr('x2', (d) => x(d) + x.bandwidth() / 2 + 10)
      .attr('y1', (d) => y(minNoncardio))
      .attr('y2', (d) => y(minNoncardio))
      .attr('stroke', 'black')
      .style('width', 80);
  
      svg.selectAll('.maxLines')
      .data(['Sain'])
      .enter()
      .append('line')
      .attr('x1', (d) => x(d) + x.bandwidth() / 2 - 10)
      .attr('x2', (d) => x(d) + x.bandwidth() / 2 + 10)
      .attr('y1', (d) => y(maxNoncardio))
      .attr('y2', (d) => y(maxNoncardio))
      .attr('stroke', 'black')
      .style('width', 80);
  }

  return <div id="box-and-whisker-container" />;
}

export default MaleHeightBoxAndWhisker;