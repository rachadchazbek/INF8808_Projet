import React from 'react'
import PercentagesBoxes from './PercentagesBoxesDataviz/percentages-boxes'
import PhysicalActivityPieChart from './PhysicalActivityPieChart/physical-activity-pie-chart'
import './life-habits-tab.css'

const LifeHabitsPage = () => {
  return (
      <div class='container'>
        <PhysicalActivityPieChart />
        <PercentagesBoxes />
      </div>
  )
}

export default LifeHabitsPage