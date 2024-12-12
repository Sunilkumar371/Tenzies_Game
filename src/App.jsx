import { useState,useRef,useEffect } from 'react'
import Confetti from 'react-confetti'
import {nanoid} from 'nanoid'
import './App.css'
import Die from './components/Die'
function App() {

  const[dice,setDice]=useState(()=>generateDiceElements())
  const gameOver = dice.every(die=>die.value===dice[0].value) &&
                    dice.every(die=>die.isHeld)
  const gameRef = useRef(null)
  useEffect(()=>{
    if(gameOver){
      gameRef.current.focus()
    }
  },[gameOver])
  function generateDiceElements(){
    return new Array(10)
            .fill(0)
            .map(()=>({
              value:Math.ceil(Math.random()*6),
              isHeld:false,
              id:nanoid()
            }))
  }
  
  function rollDice(){
    if(!gameOver){
      setDice(prev=>prev.map(item=>
        (item.isHeld?{...item}:{...item,value:Math.ceil(Math.random()*6)})
      ))
    }else{
      setDice(generateDiceElements())
    }
  }

  function hold(_id){
    setDice(prev=>prev.map(item=>
      (item.id===_id?{...item,isHeld:!item.isHeld}:item)
    ))
  }

  const DiceValues = dice.map(diceEl=>{
    return(
      <Die
        key={diceEl.id}
        value={diceEl.value}
        isHeld={diceEl.isHeld}
        hold={()=>{hold(diceEl.id)}}
      />
    )
  })

  return(
    <main>
        <div className='box'>
          <h1>Tenzies</h1>
          <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
          <div className='Die-Container'>
            {DiceValues}
          </div>
          <button 
            ref={gameRef} 
            className='roll-button'
            onClick={rollDice}
          >{gameOver?"New Game":"Roll"}</button>
          {gameOver===true?<Confetti/>:null}
          <div 
            aria-live="polite"
            className='sr-only'
            >{gameOver && <p>Congratulations you won Press "New Game" to start again
            </p>}
          </div>
        </div>
    </main>
  )
}

export default App
