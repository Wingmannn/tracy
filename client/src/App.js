import React, { useEffect, useState } from 'react'
import './App.css'
import Socket from './services/socket'
// import Blob from './Components/Blob'
import InfoBar from './Components/InfoBar'

const App = () => {
  const [status, setStatus] = useState({})

  useEffect(() => {
    console.log('app mounted')
    Socket.onMessage((message) => {
      if (message.text) {
        setStatus(message)
      }
    })
  }, [])

  return (
    <div className='App'>
      {/* <Blob /> */}
      <InfoBar state={status} />
    </div>
  )
}

export default App
