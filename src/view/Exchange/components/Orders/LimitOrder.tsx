import { web3FromAddress } from '@polkadot/extension-dapp';
import React, { useState } from 'react'

function LimitOrder(props: any) {
    const { otype, curTradepair, curAccount, api } = props;
    const [input, setInput] = useState({ price: 0, amount: 0 })

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value })
    }

    const createOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let price = Number(input.price);
        let sellAmount = Number(input.amount);

        sellAmount = otype === 'Sell' ? sellAmount : sellAmount * price;
        price = price * 10 ** 8;

        if (curAccount && curTradepair && price > 0 && sellAmount > 0) {
            const address = curAccount.address;
            const injector = await web3FromAddress(address)
            const events = new Promise(async (resolve, reject) => {
                await api.tx.trade
                    .createOrder(curTradepair.base.hash_, curTradepair.quote.hash_, 'Limit', otype, price, sellAmount)
                    .signAndSend(
                        address,
                        { signer: injector?.signer },
                        ({ status, events, dispatchError }: any) => {
                            if (dispatchError) {
                                if (dispatchError.isModule) {
                                    const decoded = api.registry.findMetaError(dispatchError.asModule);
                                    const { name, section } = decoded;
                                    const res = 'Error'.concat(':', section, '.', name);
                                    resolve(res);
                                } else {
                                    resolve(dispatchError.toString());
                                }
                            }
                        }
                    )
            })
            console.log(await events)
            setInput({ price: 0, amount: 0 })
        }
    }

    return (
        <form onSubmit={(e) => createOrder(e)}>
            <div className='flex justify-between items-center mb-10'>
                <p className='text-white font-bold'>PRICE</p>
                <div className="flex w-2/3">
                    <input
                        type="number"
                        name='price'
                        className="w-4/5 text-left p-2 text-md dark:text-gray-100 dark:bg-gray-800 focus:outline-none"
                        style={{ border: '1px solid rgb(109 40 217 / 1)', borderRight: 'none' }}
                        onChange={(e) => handleInput(e)}
                        required
                    />
                    <span className="flex items-center justify-center flex-grow text-md dark:bg-gray-700 text-gray-400" style={{ border: '1px solid rgb(109 40 217 / 1)', borderLeft: 'none' }}>$</span>
                </div>
            </div>
            <div className='flex justify-between items-center mb-10'>
                <p className='text-white font-bold'>AMOUNT</p>
                <div className="flex w-2/3">
                    <input
                        type="number"
                        name="amount"
                        className="w-4/5 text-left p-2 text-md dark:text-gray-100 dark:bg-gray-800 focus:outline-none"
                        style={{ border: '1px solid rgb(109 40 217 / 1)', borderRight: 'none' }}
                        min={1}
                        onChange={(e) => handleInput(e)}
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
                        value={Number(input.amount) * Number(input.price)}
                        disabled
                    />
                    <span className="flex items-center justify-center px-2 flex-grow text-md font-semibold dark:bg-gray-700 text-gray-400" style={{ border: '1px solid rgb(109 40 217 / 1)', borderLeft: 'none' }}>{curTradepair?.base.symbol}</span>
                </div>
            </div>
            <button className={`w-full font-bold py-2 ${otype === 'Buy' ? 'bg-green-500' : 'bg-red-500'}`}>{otype === 'Buy' ? 'BUY' : 'SELL'} {curTradepair?.quote.symbol}</button>
        </form>
    )
}

export default LimitOrder