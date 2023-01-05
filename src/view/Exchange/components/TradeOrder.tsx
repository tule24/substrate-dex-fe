import React, { useState } from 'react'
import LimitOrder from './Orders/LimitOrder'
import MarketOrder from './Orders/MarketOrder';
function TradeOrder(props: any) {
    const [otype, setOtype] = useState('Buy');
    const [oopt, setOopt] = useState('Limit');
    const { curTradepair, curAccount, api } = props;
    return (
        <div className='bg-gray-800' style={{ width: '20%' }}>
            <div className="flex items-center space-x-2 overflow-x-auto overflow-y-hidden sm:justify-center flex-nowrap dark:text-gray-100 mt-5">
                <button
                    className={`w-2/5 font-bold flex items-center flex-shrink-0 px-5 py-2 border-b-4 ${otype === 'Buy' ? 'text-green-500 border-green-500' : 'text-gray-400 border-gray-700'}`}
                    onClick={() => setOtype('Buy')}
                >
                    BUY <i className="fa-solid fa-circle-check ml-2"></i>
                </button>
                <button
                    className={`w-2/5 font-bold flex items-center flex-shrink-0 px-5 py-2 border-b-4 ${otype === 'Sell' ? 'text-red-500 border-red-500' : 'text-gray-400 border-gray-700'}`}
                    onClick={() => setOtype('Sell')}
                >
                    SELL <i className="fa-solid fa-circle-check ml-2"></i>
                </button>
            </div>
            <div className='mt-10 px-5'>
                <div className='flex justify-between items-center mb-10'>
                    <p className='text-white font-bold'>TYPE</p>
                    <select
                        className='w-2/3 p-2 font-semibold border text-white border-violet-700'
                        style={{ background: 'none' }}
                        defaultValue="Limit"
                        onChange={(e) => setOopt(e.target.value)}
                    >
                        <option className='text-black font-semibold bg-gray-600 text-md text-lg' value="Limit">Limit</option>
                        <option className='text-black font-semibold bg-gray-600 text-md text-lg' value="Market">Market</option>
                        <option className='text-black font-semibold bg-gray-600 text-md text-lg' value="stoplimit">Stop Limit</option>
                        <option className='text-black font-semibold bg-gray-600 text-md text-lg' value="oco">Oco</option>
                    </select>
                </div>
                {oopt === 'Limit' ? <LimitOrder otype={otype} curTradepair={curTradepair} curAccount={curAccount} api={api}/> : <MarketOrder otype={otype} curTradepair={curTradepair} curAccount={curAccount} api={api}/>}
            </div>
        </div>
    )
}

export default TradeOrder