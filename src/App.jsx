import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Webcam from 'react-webcam'
import HandTracker from './components/HandTracker'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="rounded-lg bg-gray-100 p-4">
        <HandTracker />
      </div>
    </>
  )
}

export default App
