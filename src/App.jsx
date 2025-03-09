// import { useState } from 'react'
import './App.css'
import Webcam from 'react-webcam'
import HandTracker from './components/HandTracker'
// import TunerApp from './TunerApp'
import TunerChatbot from './TunerChat'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <div className="rounded-lg bg-gray-100 p-4">
        {/* <HandTracker /> */}
      {/* <div className="webcam-container">
        <Webcam />
      </div> */}
      </div>
      <div>
        {/* <TunerApp /> */}
        <TunerChatbot />
      </div>
    </>
  )
}

export default App
