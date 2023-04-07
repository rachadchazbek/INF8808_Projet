import React, { useEffect } from 'react'
import "./percentages-boxes.css"
import * as d3 from 'd3'
import {DATA_PATH} from '../../../constants/paths'

const PercentagesBoxes = () => {

    useEffect(() => {
        const fetchData = async () => {
            d3.csv(DATA_PATH).then(data => {
                const processedData = processData(data);
            })
        }

        fetchData()
    })

    const processData = (data) => {
        return data.map(d => {
            return {
                smoker: d.smoke === '1',
                drinker: d.alco === '1',
            }
        })
    }

  return (
    <div>percentages-boxes</div>
  )
}

export default PercentagesBoxes