import React from 'react'
import MetabolismHeatMap from './HeatMap/metabolism-heatmap'
import ScatterPlot from './ScatterPlot/ScatterPlot'

const MetabolismPage = () => {
  return (
    <div>
    <>
      <MetabolismHeatMap/>
    </>
      <ScatterPlot></ScatterPlot>
    </div>
  )
}

export default MetabolismPage