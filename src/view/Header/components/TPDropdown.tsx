import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { changeTradePair } from '../../../store/reducers/trade.reducer';
import { TradePair } from '../../../store/types';

function Dropdown(props: any) {
    const { tradePairs, curTradepair, api } = props;
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const handleChange = (token: TradePair) => {
        dispatch(changeTradePair(api, token.hash_))
        setOpen(false);
    }
    return (
        <div className=' w-60 font-medium relative text-black'>
            <div className="inline-flex items-center divide-x rounded dark:bg-violet-700 divide-gray-900">
                <button type="button" className="px-5 font-bold text-white">{curTradepair ? `${curTradepair.base?.symbol}-${curTradepair.quote?.symbol}` : 'No Tradepair'}</button>
                <button type="button" className="p-3" onClick={() => setOpen(!open)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
            <ul className={`bg-white mt-2 overflow-y-auto overflow-x-hidden absolute z-50 ${open ? 'max-h-60' : 'max-h-0'} w-52 scrollbar`}>
                <div className='flex items-center px-2 sticky top-0 bg-white'>
                    <i className="fa-solid fa-magnifying-glass text-black"></i>
                    <input
                        type='text'
                        placeholder='Enter base token'
                        className='placeholder:text-gray-500 p-2 outline-none'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value.toLowerCase())}
                    />
                </div>
                {tradePairs?.map((tp: TradePair, index: number) => {
                    return (
                        <li className={`p-2 text-sm hover:bg-violet-400 hover:text-white cursor-pointer 
                        ${tp.base?.symbol.toLowerCase().startsWith(inputValue) ? 'block' : 'hidden'}`}
                            key={index}
                            onClick={() => handleChange(tp)}>
                            {`${tp.base?.symbol}-${tp.quote?.symbol}`}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Dropdown