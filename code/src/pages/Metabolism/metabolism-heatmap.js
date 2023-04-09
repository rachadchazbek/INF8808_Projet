import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import * as d3Chromatic from 'd3-scale-chromatic'

const updateSize = (svg) => {
  const bounds = d3.select('.graph').node().getBoundingClientRect()
  const svgSize = {
    width: Math.max(bounds.width / 2, 550),
    height: 550
  }
  svg.attr('width', svgSize.width).attr('height', svgSize.height);
}

const preprocess = (data) => {
  console.log(data)
}

const MetabolismHeatMap = () => {
  const heatMapRef = useRef(null)

  // const xScale = d3.scaleBand().padding(0.05)
  // const yScale = d3.scaleBand().padding(0.2)
  // const colorScale = d3.scaleSequential(d3Chromatic.interpolateMagma)

  useEffect(() => {
    const svg = d3.select(heatMapRef.current);

    const fetchData = async () => {
      await d3.csv('./data/heart_data.csv', d3.autoType).then((data) => {
        preprocess(data)
      })
    }

    window.addEventListener('resize', () => {
      updateSize(svg)
      // build()
    })
    
    updateSize(svg)
    // build()

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

export default MetabolismHeatMap