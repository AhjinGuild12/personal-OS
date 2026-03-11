import React, { useState, useMemo } from 'react';
import { playClick } from '../../../utils/sounds';

const CURRENCIES: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  CNY: 'Chinese Yuan',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
};

// Rates relative to USD
const RATES_TO_USD: Record<string, number> = {
  USD: 1,
  EUR: 0.841,
  GBP: 0.7276,
  JPY: 149.5,
  CNY: 7.248,
  AUD: 1.532,
  CAD: 1.358,
  CHF: 0.8785,
};

const convert = (amount: number, from: string, to: string): number => {
  const inUsd = amount / RATES_TO_USD[from];
  return inUsd * RATES_TO_USD[to];
};

const getRate = (from: string, to: string): number => {
  return RATES_TO_USD[to] / RATES_TO_USD[from];
};

const CurrencyConverterApp: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [fromAmount, setFromAmount] = useState('1');
  const [isSelectingFrom, setIsSelectingFrom] = useState(false);
  const [isSelectingTo, setIsSelectingTo] = useState(false);

  const toAmount = useMemo(() => {
    const num = parseFloat(fromAmount);
    if (isNaN(num)) return '';
    const result = convert(num, fromCurrency, toCurrency);
    return Number.isInteger(result) ? result.toString() : result.toFixed(2);
  }, [fromAmount, fromCurrency, toCurrency]);

  const rate = useMemo(
    () => getRate(fromCurrency, toCurrency).toFixed(4),
    [fromCurrency, toCurrency]
  );

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount || '0');
    playClick();
  };

  const currencyKeys = Object.keys(CURRENCIES);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* From section */}
      <div className="p-5 border-b-[3px] border-black bg-white">
        <div className="border-[3px] border-black">
          <input
            type="text"
            inputMode="decimal"
            value={fromAmount}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                setFromAmount(val);
              }
            }}
            className="w-full px-4 pt-3 pb-1 text-3xl font-black bg-transparent
                       focus:outline-none border-b-[2px] border-black/10"
          />
          {/* Currency selector */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSelectingFrom(!isSelectingFrom);
                setIsSelectingTo(false);
                playClick();
              }}
              className="w-full px-4 py-2 text-left text-base font-bold text-gray-500
                         hover:bg-[#fdf6e3] transition-colors duration-75
                         flex items-center justify-between"
            >
              <span>{fromCurrency} – {CURRENCIES[fromCurrency]}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isSelectingFrom && (
              <div className="absolute top-full left-0 right-0 z-10 bg-white border-[3px] border-black
                             border-t-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-48 overflow-y-auto">
                {currencyKeys
                  .filter((c) => c !== toCurrency)
                  .map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setFromCurrency(code);
                        setIsSelectingFrom(false);
                        playClick();
                      }}
                      className={`w-full px-4 py-2 text-left text-sm font-bold
                                 hover:bg-[#f2cc8f] transition-colors duration-75
                                 ${code === fromCurrency ? 'bg-[#fdf6e3]' : ''}`}
                    >
                      {code} – {CURRENCIES[code]}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Swap button */}
      <div className="flex items-center justify-center -my-5 relative z-20">
        <button
          onClick={handleSwap}
          className="w-12 h-12 rounded-full border-[3px] border-black bg-white
                     shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                     hover:bg-[#fdf6e3]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                     transition-all duration-75
                     flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      {/* To section */}
      <div className="p-5 border-b-[3px] border-black bg-white">
        <div className="border-[3px] border-black">
          <div className="w-full px-4 pt-3 pb-1 text-3xl font-black text-black/70
                         border-b-[2px] border-black/10 min-h-[52px]">
            {toAmount || '0'}
          </div>
          {/* Currency selector */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSelectingTo(!isSelectingTo);
                setIsSelectingFrom(false);
                playClick();
              }}
              className="w-full px-4 py-2 text-left text-base font-bold text-gray-500
                         hover:bg-[#fdf6e3] transition-colors duration-75
                         flex items-center justify-between"
            >
              <span>{toCurrency} – {CURRENCIES[toCurrency]}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isSelectingTo && (
              <div className="absolute top-full left-0 right-0 z-10 bg-white border-[3px] border-black
                             border-t-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-48 overflow-y-auto">
                {currencyKeys
                  .filter((c) => c !== fromCurrency)
                  .map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setToCurrency(code);
                        setIsSelectingTo(false);
                        playClick();
                      }}
                      className={`w-full px-4 py-2 text-left text-sm font-bold
                                 hover:bg-[#f2cc8f] transition-colors duration-75
                                 ${code === toCurrency ? 'bg-[#fdf6e3]' : ''}`}
                    >
                      {code} – {CURRENCIES[code]}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rate display */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
        <p className="text-sm font-bold text-gray-400">
          1 {fromCurrency} = {rate} {toCurrency}
        </p>
        <p className="text-xs font-bold text-gray-300 mt-1">
          Updated just now
        </p>
      </div>
    </div>
  );
};

export default CurrencyConverterApp;
