import React, { useState, useEffect } from 'react';
import { playClick } from '../../../utils/sounds';

const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return b === 0 ? NaN : a / b;
      case '%':
        return a % b;
      default:
        return b;
    }
  };

  const handleDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
    playClick();
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
    playClick();
  };

  const handleOperation = (nextOp: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const result = calculate(prevValue, inputValue, operation);
      setDisplay(String(result));
      setPrevValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
    playClick();
  };

  const handleEquals = () => {
    if (operation && prevValue !== null) {
      const inputValue = parseFloat(display);
      const result = calculate(prevValue, inputValue, operation);

      if (isNaN(result)) {
        setDisplay('Error');
      } else {
        setDisplay(String(result));
      }

      setPrevValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
    playClick();
  };

  const handleClear = () => {
    setDisplay('0');
    playClick();
  };

  const handleAllClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    playClick();
  };

  const handleToggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
    playClick();
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
    playClick();
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === '.') {
        handleDecimal();
      } else if (e.key === '+') {
        handleOperation('+');
      } else if (e.key === '-') {
        handleOperation('-');
      } else if (e.key === '*') {
        handleOperation('*');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperation('/');
      } else if (e.key === '%') {
        handleOperation('%');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleAllClear();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, prevValue, operation, waitingForOperand]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-[#e07a5f] border-b-[3px] border-black p-2">
        <h1 className="font-heading font-black text-sm">CALCULATOR</h1>
      </div>

      {/* Display */}
      <div className="p-4 border-b-[3px] border-black bg-[#fdf6e3]">
        <div className="text-right font-mono text-3xl font-bold break-all">
          {display}
        </div>
      </div>

      {/* Button Grid */}
      <div className="flex-1 p-4 grid grid-cols-4 gap-2">
        {/* Row 1 */}
        <button
          onClick={handleAllClear}
          className="bg-[#f2cc8f] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          AC
        </button>
        <button
          onClick={handleToggleSign}
          className="bg-[#f2cc8f] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          ±
        </button>
        <button
          onClick={() => handleOperation('%')}
          className="bg-[#f2cc8f] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          %
        </button>
        <button
          onClick={() => handleOperation('/')}
          className="bg-[#81b29a] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          onClick={() => handleDigit('7')}
          className="bg-[#fdf6e3] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          7
        </button>
        <button
          onClick={() => handleDigit('8')}
          className="bg-[#fdf6e3] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          8
        </button>
        <button
          onClick={() => handleDigit('9')}
          className="bg-[#fdf6e3] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          9
        </button>
        <button
          onClick={() => handleOperation('*')}
          className="bg-[#81b29a] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          onClick={() => handleDigit('4')}
          className="bg-[#fdf6e3] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          4
        </button>
        <button
          onClick={() => handleDigit('5')}
          className="bg-[#fdf6e3] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          5
        </button>
        <button
          onClick={() => handleDigit('6')}
          className="bg-[#fdf6e3] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          6
        </button>
        <button
          onClick={() => handleOperation('-')}
          className="bg-[#81b29a] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          -
        </button>

        {/* Row 4 */}
        <button
          onClick={() => handleDigit('1')}
          className="bg-[#fdf6e3] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          1
        </button>
        <button
          onClick={() => handleDigit('2')}
          className="bg-[#fdf6e3] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          2
        </button>
        <button
          onClick={() => handleDigit('3')}
          className="bg-[#fdf6e3] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          3
        </button>
        <button
          onClick={() => handleOperation('+')}
          className="bg-[#81b29a] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={() => handleDigit('0')}
          className="col-span-2 bg-[#fdf6e3] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          0
        </button>
        <button
          onClick={handleDecimal}
          className="bg-[#fdf6e3] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          .
        </button>
        <button
          onClick={handleEquals}
          className="bg-[#e07a5f] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75 font-heading font-black text-lg"
        >
          =
        </button>
      </div>
    </div>
  );
};

export default CalculatorApp;
