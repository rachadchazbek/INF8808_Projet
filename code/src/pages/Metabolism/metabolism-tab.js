import React from 'react'
import MetabolismHeatMap from './metabolism-heatmap'
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