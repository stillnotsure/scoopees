import { useState } from 'react'

import './App.css'
import StrategyDashboard from './components/ui/strategyDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div  >
      <StrategyDashboard />
    </div>
  )
}

export default App
