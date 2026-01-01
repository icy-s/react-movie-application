// not used in final build, saved for learning purposes

import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const Card = ({ title }) => {
  // 1 arg - var name, 2 arg - set var name
  const [count, setCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // second arg hasLiked is for checking if that condition is satistied,
  // otherwise this effect won't be called (this is also known as Dependency Array)
  useEffect( () => {
    console.log(`${title} has been liked: ${hasLiked}`);
  }, [hasLiked]);

  return (
    <div className="card" onClick={() => setCount(count + 1)}>
      <h2>{title} <br/> {count || null}</h2>

      <button onClick={() => setHasLiked(!hasLiked)}>
        {hasLiked ? '❤️' : '🤍'}
      </button>
    </div>
  )
}

const App = () => {
  return (
    <div className="card-container">
      <Card title="Star Wars"/>
      <Card title="Avatar"/>
      <Card title="The Lion King"/>
    </div>
  )
}

export default App
