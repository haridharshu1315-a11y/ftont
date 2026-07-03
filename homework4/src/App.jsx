import { useEffect, useState } from 'react'
import './App.css'

const operators = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
}

const buttons = [
  ['AC', '+/-', '%', '/'],
  ['7', '8', '9', '*'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', 'DEL', '='],
]

function cleanNumber(value) {
  if (!Number.isFinite(value)) {
    return 'Error'
  }

  return Number.parseFloat(value.toFixed(10)).toString()
}

function App() {
  const [display, setDisplay] = useState('0')
  const [storedValue, setStoredValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForNumber, setWaitingForNumber] = useState(false)

  function clearCalculator() {
    setDisplay('0')
    setStoredValue(null)
    setOperator(null)
    setWaitingForNumber(false)
  }

  function inputDigit(digit) {
    if (display === 'Error') {
      setDisplay(digit)
      return
    }

    if (waitingForNumber) {
      setDisplay(digit)
      setWaitingForNumber(false)
      return
    }

    setDisplay((current) => (current === '0' ? digit : `${current}${digit}`))
  }

  function inputDecimal() {
    if (display === 'Error' || waitingForNumber) {
      setDisplay('0.')
      setWaitingForNumber(false)
      return
    }

    if (!display.includes('.')) {
      setDisplay((current) => `${current}.`)
    }
  }

  function deleteLastDigit() {
    if (display === 'Error' || waitingForNumber || display.length === 1) {
      setDisplay('0')
      setWaitingForNumber(false)
      return
    }

    setDisplay((current) => current.slice(0, -1))
  }

  function toggleSign() {
    if (display === '0' || display === 'Error') {
      return
    }

    setDisplay((current) =>
      current.startsWith('-') ? current.slice(1) : `-${current}`,
    )
  }

  function applyPercent() {
    if (display === 'Error') {
      return
    }

    setDisplay((current) => cleanNumber(Number.parseFloat(current) / 100))
  }

  function chooseOperator(nextOperator) {
    if (display === 'Error') {
      clearCalculator()
      return
    }

    const currentValue = Number.parseFloat(display)

    if (storedValue === null) {
      setStoredValue(currentValue)
    } else if (operator) {
      const result = operators[operator](storedValue, currentValue)
      const nextValue = cleanNumber(result)

      setDisplay(nextValue)
      setStoredValue(Number.parseFloat(nextValue))
    }

    setOperator(nextOperator)
    setWaitingForNumber(true)
  }

  function calculateResult() {
    if (!operator || storedValue === null || display === 'Error') {
      return
    }

    const currentValue = Number.parseFloat(display)
    const result = cleanNumber(operators[operator](storedValue, currentValue))

    setDisplay(result)
    setStoredValue(null)
    setOperator(null)
    setWaitingForNumber(true)
  }

  function handleButtonPress(value) {
    if (/^\d$/.test(value)) {
      inputDigit(value)
      return
    }

    if (value === '.') inputDecimal()
    if (value === 'AC') clearCalculator()
    if (value === 'DEL') deleteLastDigit()
    if (value === '+/-') toggleSign()
    if (value === '%') applyPercent()
    if (['+', '-', '*', '/'].includes(value)) chooseOperator(value)
    if (value === '=') calculateResult()
  }

  useEffect(() => {
    function handleKeyDown(event) {
      const keyMap = {
        Enter: '=',
        Escape: 'AC',
        Backspace: 'DEL',
        x: '*',
        X: '*',
      }

      const key = keyMap[event.key] || event.key

      if (/^\d$/.test(key) || ['.', '+', '-', '*', '/', '='].includes(key)) {
        event.preventDefault()
        handleButtonPress(key)
      }

      if (['AC', 'DEL'].includes(key)) {
        event.preventDefault()
        handleButtonPress(key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  return (
    <main className="calculator-page">
      <section className="calculator-shell" aria-label="Calculator">
        <div className="calculator-header">
          <p>React Calculator</p>
          <span>{operator ? `Using ${operator}` : 'Ready'}</span>
        </div>

        <output className="display" aria-live="polite">
          {display}
        </output>

        <div className="button-grid">
          {buttons.flat().map((button) => (
            <button
              className={`calc-button ${button === '0' ? 'zero' : ''} ${
                ['+', '-', '*', '/', '='].includes(button) ? 'operator' : ''
              } ${['AC', '+/-', '%', 'DEL'].includes(button) ? 'utility' : ''}`}
              key={button}
              onClick={() => handleButtonPress(button)}
              type="button"
            >
              {button}
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
