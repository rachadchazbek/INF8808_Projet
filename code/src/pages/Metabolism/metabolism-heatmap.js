import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import * as d3Chromatic from 'd3-scale-chromatic'

const margin = { top: 35, right: 200, bottom: 35, left: 200 }

let called = false
const xScale = d3.scaleBand().padding(0.05)
const yScale = d3.scaleBand().padding(0.2)
const colorScale = d3.scaleSequential(d3Chromatic.interpolateYlGnBu)

const updateSize = (svg) => {
  const bounds = d3.select('#graph-g').node().getBoundingClientRect()
  const svgSize = {
    width: Math.max(bounds.width/1.5, 550),
    height: 550
  }
  svg.attr('width', 1000).attr('height', svgSize.height);
  return svgSize
}

const preprocess = (data) => {
  data = summarizeCounts(data)
  return data
}

const build = (data, svg, size) => {

  updateXScale(xScale, size.width)
  updateYScale(yScale, size.height)

  drawXAxis(xScale)
  drawYAxis(yScale, size.width)


  updateRects(xScale, yScale, colorScale)

  //setRectHandler(xScale, yScale, hover.rectSelected, hover.rectUnselected, hover.selectTicks, hover.unselectTicks)

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
        Comptes: sickCount/totalCount
      })
    }
  }

  return result
}

const MetabolismHeatMap = () => {
  const heatMapRef = useRef(null)
  
  useEffect(() => {

    if(called) return
    called = true
    const svg = d3.select(heatMapRef.current);
    console.log("d")
    const fetchData = async () => {
      await d3.csv('./data/heart_data.csv', d3.autoType).then((data) => {
        data = preprocess(data)
        setColorScaleDomain(colorScale, data)
        initGradient(colorScale)
        initLegendBar()
        initLegendAxis()

        const g = generateG(margin)
        appendAxes(g)
        appendRects(data)

        const size = updateSize(svg)
        build(data, svg, size)

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
  colorScale.domain([0.0, 1.0])
}

export function initGradient (colorScale) {
  const svg = d3.select('.heatmap-svg')

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
  const svg = d3.select('.heatmap-svg')
  svg.append('rect').attr('class', 'legend bar')
}

export function initLegendAxis () {
  const svg = d3.select('.heatmap-svg')
  svg
    .append('g')
    .attr('class', 'legend-axis')
}

export function generateG (margin) {
  return d3.select('.graph')
    .select('svg')
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

export function drawXAxis (xScale) {
  d3.select('#graph-g')
    .append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0, 0)')
    .call(d3.axisTop(xScale))
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

export function rotateYTicks () {
  d3.select('.yaxis').selectAll('.tick text').attr('transform', 'rotate(-30)')
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

export default MetabolismHeatMap