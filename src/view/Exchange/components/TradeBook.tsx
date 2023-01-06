import { web3FromAddress } from '@polkadot/extension-dapp';
import React from 'react'
import { Order, PriceItem, Trade } from '../../../store/types';
import openNotification from '../../utils/Notification';

function TradeBook(props: any) {
    const { curTradepair, curAccount, curTPInfo, buyItems, sellItems, trades, accountOrders, api } = props;

    const cancelOrder = async (orderHash: string) => {
        if (curAccount && curTradepair) {
            const address = curAccount.address;
            const injector = await web3FromAddress(address)
            try {
                const events = async () => {
                    await api.tx.trade
                        .cancelLimitOrder(orderHash)
                        .signAndSend(
                            address,
                            { signer: injector?.signer },
                            ({ status, events, dispatchError }: any) => {
                                if (dispatchError) {
                                    if (dispatchError.isModule) {
                                        const decoded = api.registry.findMetaError(dispatchError.asModule);
                                        const { name, section } = decoded;
                                        const err = 'Error'.concat(':', section, '.', name);
                                        throw new Error(err)
                                    } else {
                                        throw new Error(dispatchError.toString());
                                    }
                                }
                            }
                        )
                }
                await events();
                openNotification('success', 'Cancel Order Success', '')
            } catch (err) {
                console.log(err)
                openNotification('warning', 'Cancel Order Failed', '')
            }
        }
    }
    return (
        <div className=' flex-grow'>
            <div className=' flex text-white justify-between py-5 px-10 text-lg border-b border-violet-500'>
                <div>
                    <p className='text-3xl font-bold'>{`${curTradepair?.base.symbol || 'base'}-${curTradepair?.quote.symbol || 'quote'}`}<sup><i className="fa-regular fa-star text-xl cursor-pointer"></i></sup></p>
                </div>
                <div className='flex justify-between'>
                    <div className='px-10'>
                        <p className=' text-base text-gray-400'>Last Price ($)</p>
                        <p className='text-green-500'>{curTPInfo?.latestMatchedPrice / 10 ** 8 || '0'}</p>
                    </div>
                    <div className='px-10'>
                        <p className=' text-base text-gray-400'>24hr High ($)</p>
                        <p className='text-green-500'>{curTPInfo?.oneDayHighestPrice / 10 ** 8 || '0'}</p>
                    </div>
                    <div className='px-10'>
                        <p className=' text-base text-gray-400'>24hr Low ($)</p>
                        <p className='text-red-500'>{curTPInfo?.oneDayLowestPrice / 10 ** 8 || '0'}</p>
                    </div>
                    <div className='px-10'>
                        <p className=' text-base text-gray-400'>24hr volume ({curTradepair?.quote.symbol})</p>
                        <p>{curTPInfo?.oneDayTradeVolume || '0'}</p>
                    </div>
                </div>
            </div>
            <div className='flex'>
                <div className='flex-grow flex flex-col'>
                    <p className='text-white text-3xl font-semibold ml-3 mt-2 text-center'>Order Book</p>
                    <div className='flex flex-grow' style={{ height: '65vh' }}>
                        <div className="overflow-x-auto mt-3 w-1/2 px-2 border-r border-gray-500">
                            <p className='text-center text-green-500 font-bold text-2xl mb-3'>Buy Order</p>
                            <table className="min-w-full text-xs">
                                <colgroup>
                                    <col />
                                    <col />
                                    <col />
                                </colgroup>
                                <thead className='border-b border-gray-600'>
                                    <tr className="text-center text-gray-500 font-bold">
                                        <th className="p-2">ORDER</th>
                                        <th className="p-2">PRICE</th>
                                        <th className="p-2">AMOUNT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {buyItems.map((item: PriceItem, index: number) => {
                                        return (
                                            <tr className=" text-white text-center hover:bg-gray-500 hover:bg-opacity-50" key={index}>
                                                <td className="p-3">
                                                    <p className='text-green-500 font-semibold text-base'>Buy {index + 1}</p>
                                                </td>
                                                <td className="p-3">
                                                    <p className='text-green-500 font-semibold text-base'>{(item.price / 10 ** 8).toString()}$</p>
                                                </td>
                                                <td className="p-3">
                                                    <p className='text-gray-200 font-semibold text-base'>{item.buyAmount}</p>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="overflow-x-auto mt-3 w-1/2 px-2">
                            <p className='text-center text-red-500 font-bold text-2xl mb-3'>Sell Order</p>
                            <table className="min-w-full text-xs">
                                <colgroup>
                                    <col />
                                    <col />
                                    <col />
                                </colgroup>
                                <thead className='border-b border-gray-600'>
                                    <tr className="text-center text-gray-500 font-bold">
                                        <th className="p-2">ORDER</th>
                                        <th className="p-2">PRICE</th>
                                        <th className="p-2">AMOUNT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sellItems.map((item: PriceItem, index: number) => {
                                        return (
                                            <tr className=" text-white text-center hover:bg-gray-500 hover:bg-opacity-50" key={index}>
                                                <td className="p-3">
                                                    <p className='text-red-500 font-semibold text-base'>Sell {index + 1}</p>
                                                </td>
                                                <td className="p-3">
                                                    <p className='text-red-500 font-semibold text-base'>{(item.price / 10 ** 8).toString()}$</p>
                                                </td>
                                                <td className="p-3">
                                                    <p className='text-gray-200 font-semibold text-base'>{item.sellAmount}</p>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='border-t border-gray-500'>
                        <div className="overflow-x-auto">
                            <p className=' text-white font-bold text-lg mb-1 ml-2 text-center'>Order history</p>
                            <table className="min-w-full text-xs">
                                <colgroup>
                                    <col />
                                    <col />
                                    <col />
                                    <col />
                                    <col />
                                </colgroup>
                                <thead className='border-b border-gray-600'>
                                    <tr className="text-center text-gray-500 font-bold">
                                        <th className="p-2">TRADEPAIR</th>
                                        <th className="p-2">PRICE</th>
                                        <th className="p-2">AMOUNT</th>
                                        <th className="p-2">STATUS</th>
                                        <th className="p-2">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accountOrders.map((order: Order, index: number) => {
                                        return (
                                            <tr className=" text-white text-center hover:bg-gray-500 hover:bg-opacity-50" key={index}>
                                                <td className="p-3">
                                                    <span className={`text-xs font-semibold inline-block py-1 px-2 rounded text-black bg-${order.otype === 'Buy' ? 'green' : 'red'}-500 uppercase last:mr-0 mr-1`}>
                                                        {order.tradePair}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <p className={`text-${order.otype === 'Buy' ? 'green' : 'red'}-500 font-semibold text-base`}>{order.price / 10 ** 8}$</p>
                                                </td>
                                                <td className="p-3">
                                                    <p className='text-gray-200 font-semibold text-base'>{order.otype === 'Buy' ? order.buyAmount : order.sellAmount}</p>
                                                </td>
                                                <td className='p-3'>
                                                    <span className={`text-xs inline-block py-1 px-2 rounded bg-violet-800 uppercase last:mr-0 mr-1 tracking-wider`}>
                                                        {order.status === 'Created' ? 'Not Filled' : order.status}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    {order.status === 'Created'
                                                        && <button
                                                            className={`text-xs font-bold inline-block py-1 px-2 rounded bg-slate-600 hover:bg-slate-200  text-black uppercase last:mr-0 mr-1`}
                                                            onClick={() => cancelOrder(order.hash)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className=' w-1/4 border-l border-violet-500'>
                    <p className='text-white text-3xl font-semibold ml-3 mt-2 text-center'>Trades</p>
                    <div className="overflow-x-auto mt-3">
                        <table className="min-w-full text-xs">
                            <colgroup>
                                <col />
                                <col />
                                <col />
                            </colgroup>
                            <thead className='border-b border-gray-600'>
                                <tr className="text-center text-gray-500 font-bold">
                                    <th className="p-2">PRICE</th>
                                    <th className="p-2">AMOUNT</th>
                                    <th className="p-2">TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trades.map((trade: Trade, index: number) => {
                                    return (
                                        <tr className=" text-white text-center hover:bg-gray-500 hover:bg-opacity-50" key={index}>
                                            <td className="p-3">
                                                <p className={`text-${trade.otype === 'Buy' ? 'green' : 'red'}-500 font-semibold text-base`}>{(trade.price / (10 ** 8)).toString()}</p>
                                            </td>
                                            <td className="p-3">
                                                <p className='text-gray-200 font-semibold text-base'>{trade.quoteAmount}</p>
                                            </td>
                                            <td className="p-3">
                                                <p className='text-gray-500 font-semibold text-base'>{trade.baseAmount}</p>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TradeBook