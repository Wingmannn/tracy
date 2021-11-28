import React from 'react'
import './InfoBar.css'

const InfoBar = (props) => {
  return (
    <div className='infoBar'>
      <div className='tracy'>Tracy</div>
      <div className='infoBar-item'>{props.state.text}</div>
      <div className='infoBar-item'>{props.state.time}</div>
      <div className='infoBar-item'>{props.state.time}</div>
    </div>
  )
}

export default InfoBar
