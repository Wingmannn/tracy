import React, { useEffect, useState } from 'react'
import Header from './Header'
import Content from './Content'
import Socket from '../services/socket'
import './Overlay.css'

const Overlay = (props) => {
  const [status, setStatus] = useState({})

  useEffect(() => {
    console.log('app mounted')
    Socket.onMessage((message) => {
      if (message.partial !== status) {
        setStatus(message)
      }
    })
  }, [status])
  return (
    <div className='overlay'>
      <Header state={status} />
      <Content state={status} />
    </div>
  )
}
export default Overlay
