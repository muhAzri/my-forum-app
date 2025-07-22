import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" className="block">
          <img 
            src={viteLogo} 
            className="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa] will-change-transform" 
            alt="Vite logo" 
          />
        </a>
        <a href="https://react.dev" target="_blank" className="block">
          <img 
            src={reactLogo} 
            className="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa] animate-spin-slow will-change-transform" 
            alt="React logo" 
          />
        </a>
      </div>
      
      <h1 className="text-5xl font-bold leading-tight mb-8">Vite + React</h1>
      
      <div className="p-8 bg-gray-800 rounded-lg">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="bg-gray-700 hover:bg-gray-600 border border-transparent hover:border-blue-500 px-5 py-3 rounded-lg font-medium cursor-pointer transition-all duration-250"
        >
          count is {count}
        </button>
        <p className="mt-4 text-gray-300">
          Edit <code className="bg-gray-700 px-2 py-1 rounded">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      
      <p className="mt-8 text-gray-400 text-center max-w-4xl mx-auto px-8">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)