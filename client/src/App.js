import React, { useEffect, useState } from 'react'
import './App.css'
import Socket from './services/socket'

function App() {
  const [status, setStatus] = useState({})

  useEffect(() => {
    console.log('app mounted')
    Socket.onMessage((message) => {
      setStatus(message)
    })
  }, [])

  return (
    <div>
      <div>Time {status.time}</div>
    </div>
  )
}

export default App
