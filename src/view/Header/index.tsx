import React, { useCallback, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import Dropdown from './components/TPDropdown'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../../store'
import { setAccountInfo, setApi } from '../../store/reducers/account.reducer'
import { getApi, getWallet, getExtension } from '../../utils/util'
import openNotification from '../utils/Notification'
import { addAccountOrder, addTradepair, getAllAccountOrder, getAllPrice, getDataOnStart, getToken, getTrade } from '../../store/reducers/trade.reducer'

function Header() {
  let activeStyle = { borderBottom: '2px solid darkblue', color: 'darkblue' };
  const dispatch = useDispatch<AppDispatch>();
  const { curAccount, web3enable } = useSelector((state: AppState) => state.account.accountInfo);
  const { tradePairs, curTradepair } = useSelector((state: AppState) => state.trade);
  const { api } = useSelector((state: AppState) => state.account);


  const callApi = useCallback(async () => {
    const api = await getApi();
    console.log("🚀 ~ get api success", api);
    dispatch(setApi(api));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getWalletInfo = useCallback(async () => {
    const accountInfo = await getWallet();
    if (accountInfo) {
      dispatch(setAccountInfo(accountInfo))
      getExtension(web3enable, curAccount)
      openNotification('success', 'Connect Success', '')
    } else {
      openNotification('error', 'Connect Error', 'Please re-check your wallet and network')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curAccount, web3enable]);

  const listenEvent = useCallback(async () => {
    api && api.query.system.events((events: any) => {
      console.log(`\nReceived ${events.length} events: `)
      events.forEach((record: any) => {
        const { event } = record;
        if (event.section.toString() === 'tokens') {
          if (event.method.toString() === 'Issued') {
            const { tokenHash } = event.data.toHuman()
            dispatch(getToken(api, tokenHash))
          }
        } else if (event.section.toString() === 'trade') {
          if (event.method.toString() === 'TradePairCreated') {
            const { tradePair } = event.data.toHuman()
            dispatch(addTradepair(tradePair))
          }
          else if (event.method.toString() === 'OrderCreated') {
            const { baseToken, quoteToken, owner } = event.data.toHuman();
            const order = event.data.toJSON()[4];
            if (curAccount && owner === curAccount.address) {
              dispatch(addAccountOrder(order))
            }
            if (baseToken === curTradepair?.base.hash_ && quoteToken === curTradepair?.quote.hash_ && curTradepair) {
              curTradepair && dispatch(getAllPrice(api, curTradepair.hash_))
            }
          }
          else if (event.method.toString() === 'TradeCreated') {
            const { baseToken, quoteToken } = event.data.toHuman()
            const trade = event.data.toJSON()[4];
            if (baseToken === curTradepair?.base.hash_ && quoteToken === curTradepair?.quote.hash_ && curTradepair && curAccount) {
              dispatch(getTrade(api, curTradepair.hash_, trade, curAccount.address))
            }
          }
          // else if (event.method.toString() === 'OrderCanceled') {
          //   const {orderHash} = event.data.toHuman()
          // }
        }
      });
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, curTradepair, curAccount])

  useEffect(() => {
    listenEvent()
  }, [listenEvent])

  useEffect(() => {
    callApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getDataOnStart(api))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api])

  useEffect(() => {
    curAccount && dispatch(getAllAccountOrder(api, curAccount.address))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curAccount])

  return (
    <>
      <header className=" text-white body-font bg-violet-500">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <span className=' text-4xl font-bold'>DEX</span>
          <div className='ml-10'><Dropdown tradePairs={tradePairs} curTradepair={curTradepair} api={api} /></div>
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
            <NavLink className="mr-5 hover:text-gray-900 font-semibold text-xl" to='exchange' style={({ isActive }) => isActive ? activeStyle : undefined}>Exchange</NavLink>
            <NavLink className="mr-5 hover:text-gray-900 font-semibold text-xl" to='admin' style={({ isActive }) => isActive ? activeStyle : undefined}>Admin</NavLink>
          </nav>
          <div style={{ borderLeft: '2px solid white', height: '30px' }}></div>
          <button
            className="ml-5 inline-flex items-center border dark:border-gray-100 dark:text-gray-100 py-1 px-3 focus:outline-none hover:bg-violet-800 rounded text-base mt-4 md:mt-0"
            onClick={() => getWalletInfo()}
          >
            {curAccount ? curAccount.address.slice(0, 4) + '...' + curAccount.address.slice(curAccount.address.length - 3, curAccount.address.length) : 'Connect Wallet'}
            <i className="fa-solid fa-wallet ml-2"></i>
          </button>
        </div>
      </header>
    </>
  )
}

export default Header