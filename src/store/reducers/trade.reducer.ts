import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, PriceItem, TokenInfo, Trade, TradePair, TradeState } from '../types'
const initialState: TradeState = {
    tokens: [],
    tradePairs: [],
    buyItems: [],
    sellItems: [],
    trades: [],
    accountOrders: [],
    accountBalance: [],
    curTradepair: null,
    curTPInfo: null
}

export const tradeSlice = createSlice({
    name: "trade",
    initialState,
    reducers: {
        initToken: (state, action: PayloadAction<Array<TokenInfo>>) => {
            state.tokens = action.payload;
        },
        initTradepair: (state, action: PayloadAction<Array<any>>) => {
            const res: Array<TradePair> = [];
            action.payload.forEach(({ hash_, base, quote }) => {
                const new_base = state.tokens.find(token => token.hash_ === base);
                const new_quote = state.tokens.find(token => token.hash_ === quote);
                if (new_base && new_quote) {
                    res.push({ hash_, base: new_base, quote: new_quote })
                }
            })
            state.tradePairs = res;
        },
        initTrade: (state, action: PayloadAction<Array<Trade>>) => {
            state.trades = action.payload
        },
        initAccountOrder: (state, action: PayloadAction<Array<any>>) => {
            const res: Array<Order> = [];
            action.payload.forEach((order) => {
                const base = state.tokens.find(token => token.hash_ === order.base);
                const quote = state.tokens.find(token => token.hash_ === order.quote);

                if(base && quote) {
                    const tradePair = base.symbol.concat('/', quote.symbol);
                    res.unshift({...order, tradePair}) 
                }
            })
            state.accountOrders = res;
        },
        addToken: (state, action: PayloadAction<TokenInfo>) => {
            if(!state.tokens.find((token: TokenInfo) => token.hash_ === action.payload.hash_)) {
                state.tokens.push(action.payload);
            }
        },
        addTradepair: (state, action: PayloadAction<any>) => {
            const tp = action.payload
            if (!state.tradePairs.find(item => item.hash_ === tp.hash_)) {
                const base = state.tokens.find(token => token.hash_ === tp.base);
                const quote = state.tokens.find(token => token.hash_ === tp.quote);

                if (base && quote) {
                    state.tradePairs.push({ base, quote, hash_: tp.hash_ })
                }
            }
        },
        changeCurTradepair: (state, action: PayloadAction<string>) => {
            state.curTradepair = state.tradePairs.find(tp => tp.hash_ === action.payload) || null;
        },
        updateInfo: (state, action: PayloadAction<any>) => {
            const { latestMatchedPrice, oneDayTradeVolume, oneDayHighestPrice, oneDayLowestPrice } = action.payload;
            state.curTPInfo = { latestMatchedPrice, oneDayTradeVolume, oneDayHighestPrice, oneDayLowestPrice }
        },
        addBuyItems: (state, action: PayloadAction<Array<PriceItem>>) => {
            state.buyItems = action.payload;
        },
        addSellItems: (state, action: PayloadAction<Array<PriceItem>>) => {
            state.sellItems = action.payload;
        },
        addTrade: (state, action: PayloadAction<Trade>) => {
            if (!state.trades.find(trade => trade.hash_ === action.payload.hash_)) {
                state.trades.unshift(action.payload)
            }
        },
        addAccountOrder: (state, action: PayloadAction<any>) => {
            const order = action.payload;
            if (!state.accountOrders.find(o => o.hash === order.hash)){
                const base = state.tokens.find(token => token.hash_ === order.base);
                const quote = state.tokens.find(token => token.hash_ === order.quote);

                if(base && quote) {
                    const tradePair = base.symbol.concat('/', quote.symbol);
                    state.accountOrders.unshift({...order, tradePair}) 
                }
            }
        },
        cancleAccountOrder: (state, action: PayloadAction<string>) => {
            const index = state.accountOrders.findIndex(o => o.hash === action.payload);
            if (index !== -1) {
                state.accountOrders[index].status = 'Canceled'
            }
        },
        setBalance: (state, action: PayloadAction<Array<any>>) => {
            const res = action.payload.map((ele: any) => {
                const token = state.tokens.find(token => token.hash_ === ele.token);
                return {...ele, token}
            })
            state.accountBalance = res
        }
    }
});

export const { initToken, initTradepair, initTrade, initAccountOrder, addTradepair, addToken, addBuyItems, addSellItems, addTrade, addAccountOrder, cancleAccountOrder, changeCurTradepair, updateInfo, setBalance } = tradeSlice.actions;
export default tradeSlice.reducer;

// Thunk
export const getDataOnStart = (api: any) => async (dispatch: any) => {
    try {
        if (api) {
            let tokens = await api.query.tokens.tokens.entries();
            tokens = tokens.map(([key, val]: any) => {
                return val.toHuman()
            })
            dispatch(initToken(tokens))
    
            let tradePairs = await api.query.trade.tradePairs.entries();
            tradePairs = tradePairs.map(([key, val]: any) => {
                return val.toHuman()
            })
            dispatch(initTradepair(tradePairs))
        }
    } catch(err) {
        console.log(err)
    }
}
export const getToken = (api: any, hash: String) => async (dispatch: any) => {
    try {
        if (api) {
            const token = await api.query.tokens.tokens(hash);
            dispatch(addToken(token.toHuman()))
        }
    } catch (err) {
        console.log(err)
    }
}
export const getAllPrice = (api: any, tpHash: string) => async (dispatch: any) => {
    try {
        if(api) {
            let priceList = await api.query.trade.linkedItemList.entries(tpHash);
            priceList = priceList.map(([key, val]: any) => val.toJSON())
                                 .filter((item: any) => item.buyAmount !== 0)
                                 .sort((a: any, b: any) => a.price - b.price)
            const index = priceList.findIndex((item: any) => item.next === null)
            const buyItems = priceList.slice(0, index + 1);
            const sellItems = priceList.slice(index + 1);

            dispatch(addBuyItems(buyItems.reverse()))
            dispatch(addSellItems(sellItems))
        }
    } catch(err) {
        console.log(err)
    }
}
export const changeTradePair = (api: any, tpHash: string) => async (dispatch: any) => {
    try {
        if (api) {
            const tp = await api.query.trade.tradePairs(tpHash);
            if (tp) {
                dispatch(changeCurTradepair(tpHash))
                dispatch(updateInfo(tp.toJSON()))
                dispatch(getAllPrice(api, tpHash))
                dispatch(getAllTrade(api, tpHash))
            }
        }
    } catch (err) {
        console.log(err)
    }
}
export const updateTradepairInfo = (api: any, tpHash: string) => async (dispatch: any) => {
    try {
        const tp = await api.query.trade.tradePairs(tpHash);
        dispatch(updateInfo(tp.toJSON()))
    } catch (err) {
        console.log(err)
    }
}
export const getTrade = (api: any, tpHash: string, trade: Trade, accountId: string) => async (dispatch: any) => {
    if (api) {
        dispatch(addTrade(trade))
        dispatch(updateTradepairInfo(api, tpHash))
        dispatch(getAllPrice(api, tpHash))
        if(trade.buyer === accountId || trade.maker === accountId) {
            dispatch(getAllAccountOrder(api, accountId))
        }
    }
}
export const getAllTrade = (api: any, tpHash: string) => async (dispatch: any) => {
    if (api) {
        let trades = await api.query.trade.tradePairOwnedTrades.entries(tpHash);
        trades = trades.map(([key, val]: any) => {
            const index = key.toHuman()[1];
            const hash = val.toHuman();
            return {index: Number(index), hash: hash}
        }).sort((a: any, b: any) => b.index - a.index)

        let trade = [];
        for (let i = 0; i < trades.length; i++) {
            const res = await api.query.trade.trades(trades[i].hash);
            trade.push(res.toJSON());
        }
        dispatch(initTrade(trade))
    }
}
export const getAllAccountOrder = (api: any, accountId: string) => async (dispatch: any) => {
    try {
        if (api) {
            let orders = await api.query.trade.ownedOrders.entries(accountId);
            orders = orders.map(([key, val]: any) => {
                const index = key.toHuman()[1];
                const hash = val.toHuman();
                return {index: Number(index), hash: hash}
            }).sort((a: any, b: any) => b.index - a.index)

            let order = [];
            for (let i = 0; i < orders.length; i++) {
                const res = await api.query.trade.orders(orders[i].hash);
                order.unshift(res.toJSON())
            }
            dispatch(initAccountOrder(order))
        }
    } catch(err) {
        console.log(err)
    }
}
export const cancelOrder = (api: any, orderHash: string, curTradepair: TradePair) => async (dispatch: any) => {
    try {
        if(api) {
            let order = await api.query.trade.orders(orderHash)
            order = order.toHuman()
            if (order.base === curTradepair?.base.hash_ && order.quote === curTradepair?.quote.hash_) {
                dispatch(getAllPrice(api, curTradepair.hash_))
            }
        }
    } catch (err) {
        console.log(err)
    }
}
export const getBalance = (api: any, accountId: string) => async (dispatch: any) => {
    try {
        if(api) {
            let balance = await api.query.tokens.balanceOf.entries(accountId);
            balance = balance.map(([key, val]: any) => {
                return {token: key.toHuman()[1], bal: val.toHuman()}
            })
            dispatch(setBalance(balance))
        }
    } catch(err) {
        console.log(err)
    }
}

