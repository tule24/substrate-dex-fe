import React from 'react'

function MarketOrder(props: any) {
    const {otype, curTradepair} = props;
    return (
        <form>
            <div className='flex justify-between items-center mb-10'>
                <p className='text-white font-bold'>AMOUNT</p>
                <div className="flex w-2/3">
                    <input
                        type="number"
                        name="amount"
                        className="w-4/5 text-left p-2 text-md dark:text-gray-100 dark:bg-gray-800 focus:outline-none"
                        style={{ border: '1px solid rgb(109 40 217 / 1)', borderRight: 'none' }}
                        min={1}
                        required
                    />
                    <span className="flex items-center justify-center px-2 flex-grow text-md font-semibold dark:bg-gray-700 text-gray-400" style={{ border: '1px solid rgb(109 40 217 / 1)', borderLeft: 'none' }}>{curTradepair?.quote.symbol}</span>
                </div>
            </div>
            <div className='flex justify-between items-center mb-10'>
                <p className='text-white font-bold'>TOTAL</p>
                <div className="flex w-2/3">
                    <input
                        type="total"
                        className="w-4/5 text-left p-2 text-md dark:text-gray-100 dark:bg-gray-800 focus:outline-none"
                        style={{ border: '1px solid rgb(109 40 217 / 1)', borderRight: 'none' }}
                        disabled
                    />
                    <span className="flex items-center justify-center px-2 flex-grow text-md font-semibold dark:bg-gray-700 text-gray-400" style={{ border: '1px solid rgb(109 40 217 / 1)', borderLeft: 'none' }}>{curTradepair?.base.symbol}</span>
                </div>
            </div>
            <button className={`w-full font-bold py-2 ${otype === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}>{otype === 'buy' ? 'BUY' : 'SELL'} {curTradepair?.quote.symbol}</button>
        </form>
    )
}

export default MarketOrder