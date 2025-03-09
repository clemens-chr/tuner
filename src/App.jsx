import './App.css'
import Webcam from 'react-webcam'
import HandTracker from './components/HandTracker'
import TunerChatbot from './TunerChat'
import TunerMarketplace from './components/Markeplace'
// import TunerChatbot from './TunerChatbot'

function App() {
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
        <TunerMarketplace />
      </div>
    </>
  )
}

export default App
