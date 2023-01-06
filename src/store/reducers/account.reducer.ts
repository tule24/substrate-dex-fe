import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountInfo, AccountState} from '../types'

const initialState: AccountState = {
    accountInfo: {
        accounts: [],
        curAccount: null,
        web3enable: false,
    },
    api: null,
}

export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setAccountInfo: (state, action: PayloadAction<AccountInfo>) => {
            state.accountInfo = action.payload;
        },
        setApi: (state,  action: PayloadAction<any>) => {
            state.api = action.payload;
        }
    }
});

export const { setAccountInfo, setApi } = accountSlice.actions;
export default accountSlice.reducer;

