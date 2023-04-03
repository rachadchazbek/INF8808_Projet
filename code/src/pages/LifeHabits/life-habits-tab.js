import React from 'react'
import PhysicalActivityPieChart from './PhysicalActivityPieChart/physical-activity-pie-chart'
import classes from "./LifeHabitsTab.css"

const LifeHabitsPage = () => {
  return (
      <div className={classes.container}>
        <PhysicalActivityPieChart/>
      </div>
  )
}

export default LifeHabitsPage