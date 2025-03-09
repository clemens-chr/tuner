import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Webcam from 'react-webcam'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="webcam-container">
        <Webcam />
      </div>
    </>
  )
}

export default App
