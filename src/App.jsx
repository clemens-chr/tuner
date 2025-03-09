import './App.css'
import { useState } from 'react'
import Webcam from 'react-webcam'
import HandTracker from './components/HandTracker'
import TunerChatbot from './TunerChat'
import TunerMarketplace from './components/Markeplace'
// import TunerChatbot from './TunerChatbot'

function App() {
  const [showMarketplace, setShowMarketplace] = useState(false)

  const toggleMarketplace = () => {
    setShowMarketplace(!showMarketplace)
  }

  return (
    <>
      <div>
        {/* <div className="rounded-lg bg-gray-100 p-4"> */}
          {/* <HandTracker /> */}
        {/* <div className="webcam-container">
          <Webcam />
        </div> */}
      </div>
      <div>
        {!showMarketplace ? (
          <TunerChatbot onMarketplaceClick={toggleMarketplace} />
        ) : (
          <>
            <div className="navigation flex justify-end p-4">
              <button 
                onClick={toggleMarketplace}
                className="toggle-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Go to Chat
              </button>
            </div>
            <TunerMarketplace />
          </>
        )}
      </div>
    </>
  )
}

export default App
