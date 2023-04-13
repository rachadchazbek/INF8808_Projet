import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import * as d3Chromatic from 'd3-scale-chromatic'
import {DATA_PATH} from '../../constants/paths.js'

const margin = { top: 35, right: 200, bottom: 35, left: 200 }

const xScale = d3.scaleBand().padding(0.05)
const yScale = d3.scaleBand().padding(0.2)
let colorScale = d3.scaleSequential(d3Chromatic.interpolateOrRd)

const updateSize = (svg) => {
  const bounds = d3.select('#graph-g').node().getBoundingClientRect()
  const svgSize = {
    width: Math.max(bounds.width/1.5, 550),
    height: 550
  }
  svg.attr('width', 1000).attr('height', svgSize.height + 100);
  return svgSize
}

const preprocess = (data) => {
  data = summarizeCounts(data)
  return data
}

const build = (data, svg, size) => {
  updateXScale(xScale, size.width)
  updateYScale(yScale, size.height)

  drawXAxis(xScale, size.height - 25)
  drawYAxis(yScale, size.width)


  updateRects(xScale, yScale, colorScale)

  setRectHandler(xScale, yScale, rectSelected, rectUnselected, selectTicks, unselectTicks)

  drawLegend(margin.left / 2, margin.top + 5, size.height - 10, 15, 'url(#gradient)', colorScale)
}

export function summarizeCounts (data) {
  const result = []
  const glucLvls = [1, 2, 3]
  const cholLvls = [1, 2, 3]

  for (const glucLvl of glucLvls) {
    for (const cholLvl of cholLvls) {
      const individuals = data.filter(d => d.gluc === glucLvl && d.cholesterol === cholLvl)
      const totalCount = individuals.length
      const sickCount = individuals.filter(d => d.cardio === 1).length
      result.push({
        glucLvl: glucLvl,
        cholLvl: cholLvl,
        Comptes: sickCount/totalCount * 100
      })
    }
  }

  return result
}

const MetabolismHeatMap = () => {
  const heatMapRef = useRef(null)
  useEffect(() => {
    const svg = d3.select(heatMapRef.current);

    const fetchData = async () => {
      await d3.csv(DATA_PATH, d3.autoType).then((data) => {
        data = preprocess(data)
        
        d3.select('.heatmap-svg')
        .select('.container')
        .remove();
      
        d3.select('.heatmap-svg')
        .append('svg')
        .attr('class', 'container')

        colorScale = d3.scaleSequential(d3Chromatic.interpolateOrRd)
        setColorScaleDomain(colorScale, data)
        initGradient(colorScale)
        initLegendBar()
        initLegendAxis()
        const g = generateG(margin)
        appendAxes(g)
        appendRects(data)
        const size = updateSize(svg)
        
        build(data, svg, size)
        appendGraphLabels(g, size.width + 30, size.height + 15)
        drawLevelContext(size.width, size.height + 20) 
        drawScaleTitle(yScale, size.height)
        window.addEventListener('resize', () => {
          const size = updateSize(svg)
          build(data, svg, size)
        })
      })
    }

    fetchData()
  }, [])

  return (
    <div>
      <header>
        <h2>
          Prévalence des maladies cardiovasculaires selon les niveaux de cholestérol et de glucose
        </h2>
      </header>
      <div className="viz-container">
        <div className="graph" id="heatmap">
          <svg className="heatmap-svg" ref={heatMapRef}></svg>
        </div>
      </div>
    </div>
  )
}

export function setColorScaleDomain (colorScale, data) {
  colorScale.domain([0.0, 100.0])
}

export function initGradient (colorScale) {
  const svg = d3.select('.container')

  const defs = svg.append('defs')

  const linearGradient = defs
    .append('linearGradient')
    .attr('id', 'gradient')
    .attr('x1', 0).attr('y1', 1).attr('x2', 0).attr('y2', 0)

  linearGradient.selectAll('stop')
    .data(colorScale.ticks().map((tick, i, nodes) => (
      {
        offset: `${100 * (i / nodes.length)}%`,
        color: colorScale(tick)
      })))
    .join('stop')
    .attr('offset', d => d.offset)
    .attr('stop-color', d => d.color)
}

export function initLegendBar () {
  const svg = d3.select('.container')
  svg.append('rect').attr('class', 'legend bar')
}

export function initLegendAxis () {
  const svg = d3.select('.container')
  svg
    .append('g')
    .attr('class', 'legend-axis')
}

export function generateG (margin) {
  return d3.select('.container')
    .append('g')
    .attr('id', 'graph-g')
    .attr('transform',
      'translate(' + margin.left + ',' + margin.top + ')')
}

export function appendAxes (g) {
  g.append('g')
    .attr('class', 'x axis')

  g.append('g')
    .attr('class', 'y axis')
}

export function appendRects (data) {
  d3.select('#graph-g').selectAll()
    .data(data)
    .join('g')
    .append('rect')
    .attr('class', 'tile')
}

export function updateXScale (xScale, width) {
  xScale.domain([1, 2, 3]).range([0, width])
}

export function updateYScale (yScale, height) {
  yScale.domain([1, 2, 3]).range([0, height])
}

export function drawXAxis (xScale, height) {
  d3.select('#graph-g')
    .append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(d3.axisBottom(xScale))
    .select('.domain').remove()
}

export function drawYAxis (yScale, width) {
  d3.select('#graph-g')
    .append('g')
    .attr('class', 'yaxis')
    .attr('transform', 'translate(' + width + ', 0)')
    .call(d3.axisRight(yScale))
    .select('.domain').remove()
}


export function updateRects (xScale, yScale, colorScale) {
  d3.select('#graph-g').selectAll('.tile')
    .attr('x', data => xScale(data.glucLvl))
    .attr('y', data => yScale(data.cholLvl))
    .attr('fill', data => colorScale(data.Comptes))
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
}

export function drawLegend (x, y, height, width, fill, colorScale) {
  d3.select('.legend.bar')
    .attr('x', x)
    .attr('y', y)
    .attr('height', height)
    .attr('width', width)
    .attr('fill', fill)

  colorScale.range([height, 0])
  d3.select('.legend-axis')
    .attr('transform', 'translate(' + x + ', ' + y + ')')
    .call(d3.axisLeft(colorScale).ticks(7))
    .select('.domain').remove()
}

export function setRectHandler (xScale, yScale, rectSelected, rectUnselected, selectTicks, unselectTicks) {
  d3.selectAll('.tile')
    .on('mouseover', function (mouseEvent, data) {
      rectSelected(this, xScale, yScale)
      selectTicks(data.cholLvl, data.glucLvl)
    })
    .on('mouseout', function () {
      rectUnselected(this)
      unselectTicks()
    })
}

export function rectSelected (element, xScale, yScale) {
  d3.select(element.parentNode).append('text').text((d) => Math.round(d.Comptes * 100)/100 + '%')
    .attr('x', data => xScale(data.glucLvl))
    .attr('y', data => yScale(data.cholLvl))
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .attr('transform', 'translate(' + element.attributes.width.value * 0.5 + ', ' + element.attributes.height.value * 3 / 5 + ')')
    .attr('pointer-events', 'none')
    .attr('text-anchor', 'middle')
    .attr('font-weight', 'bold')
    .attr('fill', (d) => {
      if (d.Comptes > 1000) return 'white'
      else return 'white'
    })
}

export function rectUnselected (element) {
  d3.select(element.parentNode).select('text').remove()
}

export function selectTicks (chol, gluc) {
  d3.select('.xaxis').selectAll('.tick text').filter((d) => d === gluc).attr('font-weight', 'bold')
  d3.select('.yaxis').selectAll('.tick text').filter((d) => d === chol).attr('font-weight', 'bold')
}

export function unselectTicks () {
  d3.select('.xaxis').selectAll('.tick text').attr('font-weight', 'normal')
  d3.select('.yaxis').selectAll('.tick text').attr('font-weight', 'normal')
}

export function appendGraphLabels (g, width, height) {
  var w =  xScale(2) + xScale.bandwidth()/8
  var h =  yScale(2) + yScale.bandwidth()/2
  g.append('text')
    .text('Niveau de cholestérol')
    .attr('class', 'y axis-text')
    .attr('transform', 'translate(' + width + ', ' +  h + ')')
    .attr('font-size', 15)

  g.append('text')
    .text('Niveau de glucose')
    .attr('class', 'x axis-text')
    .attr('transform', 'translate(' + w + ', ' + height + ')')
    .attr('font-size', 15)
}

export function drawScaleTitle(yScale, height) 
{
  d3.select('.container').append('text')
    .text('% d\'individus ayant')
    .attr('class', 'scaleTitle')
    .attr('transform', 'translate(' + 27 + ', ' +  15 + ')')
    .attr('font-size', 15)

    d3.select('.container').append('text')
    .text('une maladie cardiovasculaire')
    .attr('class', 'scaleTitle')
    .attr('transform', 'translate(' + 0 + ', ' +  30 + ')')
    .attr('font-size', 15)
}

export function drawLevelContext(width, height) 
{
  width += 200
  d3.select('.container').append('text')
    .text('1: Normal')
    .attr('class', 'levelContext')
    .attr('transform', 'translate(' + width + ', ' +  height + ')')
    .attr('fill', '#898989')
    .attr('font-size', 15)

  height += 15
  d3.select('.container').append('text')
    .text('2: Au dessus de la normale')
    .attr('class', 'levelContext')
    .attr('transform', 'translate(' + width + ', ' +  height + ')')
    .attr('fill', '#898989')
    .attr('font-size', 15)

  height += 15
  d3.select('.container').append('text')
    .text('3: Bien au dessus de la normal')
    .attr('class', 'levelContext')
    .attr('transform', 'translate(' + width + ', ' +  height + ')')
    .attr('fill', '#898989')
    .attr('font-size', 15)
}

export default MetabolismHeatMap