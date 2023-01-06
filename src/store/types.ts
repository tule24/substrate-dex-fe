import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

// homepage 
export interface AccountInfo {
    accounts: InjectedAccountWithMeta[],
    curAccount: InjectedAccountWithMeta | null,
    web3enable: boolean
}
export interface AccountState {
    accountInfo: AccountInfo,
    api: any,
}

// trade
export interface TokenInfo{
    hash_: string,
    symbol: string,
    totalSupply: string
}

export interface TradePair {
    hash_: string,
    base: TokenInfo,
    quote: TokenInfo,
}

export interface TPInfo {
    latestMatchedPrice: number | null | string,
    oneDayTradeVolume: number | null | string,
    oneDayHighestPrice: number | null | string,
    oneDayLowestPrice: number | null | string,
}

export interface Order {
    hash: string,
    base: string,
    quote: string,
    owner: string,
    price: number,
    sellAmount: number,
    buyAmount: number,
    remainedSellAmount: number,
    remainedBuyAmount: number,
    oopt: 'Limit' | 'Market',
    otype: 'Buy' | 'Sell',
    status: 'Created' | 'PartialFilled' | 'Filled' | 'Canceled'
    tradePair: string
}
export interface Trade {
    hash_: string,
    base: string,
    quote: string,

    buyer: string,           
    seller: string,          
    maker: string,           
    taker: string,         
    otype: 'Buy' | 'Sell',
    price: number,
    baseAmount: number,
    quoteAmount: number
}
export interface PriceItem {
    prev: number | null,
    next: number | null,
    price: number,
    buyAmount: number | null,
    sellAmount: number | null,
    orders: Array<string>
}
export interface TradeState {
    tokens: Array<TokenInfo>
    tradePairs: Array<TradePair>,
    buyItems: Array<PriceItem>,
    sellItems: Array<PriceItem>,
    trades: Array<Trade>,
    accountOrders: Array<Order>,
    accountBalance: Array<any>,
    curTradepair: TradePair | null,
    curTPInfo: TPInfo | null
}