import React from 'react'
import { useSelector } from 'react-redux';
import { AppState } from '../../store';
import * as Trade from './components'
function Homepage() {
  const {curTradepair, curTPInfo, buyItems, sellItems, trades, accountOrders} = useSelector((state: AppState) => state.trade);
  const {accountInfo, api} = useSelector((state: AppState) => state.account);
  return (
    <div className='flex w-full h-full'>
      <Trade.TradeBook curTradepair={curTradepair} curTPInfo={curTPInfo} buyItems={buyItems} sellItems={sellItems} trades={trades} accountOrders={accountOrders}/>
      <Trade.TradeOrder curTradepair={curTradepair} curAccount={accountInfo.curAccount} api={api}/>
    </div>
  )
}

export default Homepage