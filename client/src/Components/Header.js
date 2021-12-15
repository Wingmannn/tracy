import React from 'react'
import './Header.css'
const Header = (props) => {
  return (
    <div className='header'>
      <div className='tracy'>Tracy</div>
      <div className='description'>The Smart Assistant</div>
      <div
        className={
          props.state.isWoke ? 'header-item-woke' : 'header-item-sleep'
        }
      >
        Awake: {props.state.isWoke ? 'yes' : 'no'}
      </div>
    </div>
  )
}

export default Header
