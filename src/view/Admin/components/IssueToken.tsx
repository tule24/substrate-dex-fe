import React, { useState } from 'react'
import { web3FromAddress } from '@polkadot/extension-dapp';
import { useSelector } from 'react-redux';
import { AppState } from '../../../store';
import openNotification from '../../utils/Notification'

function IssueToken(props: any) {
    const { tab } = props;
    const { api, accountInfo } = useSelector((state: AppState) => state.account);
    const [input, setInput] = useState({ symbol: '', totalSupply: '' })

    const handleInput = (e: any) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value })
    }

    const issueToken = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (accountInfo.curAccount && input.symbol && input.totalSupply) {
            const curAccount = accountInfo.curAccount.address
            const injector = await web3FromAddress(curAccount)
            try {
                const event = async () => {
                    await api.tx.tokens
                        .issue(input.symbol, Number(input.totalSupply))
                        .signAndSend(
                            curAccount,
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
                await event();
                openNotification('success', 'Issue Token Success', '')
            } catch (err) {
                console.log(err)
                openNotification('warning', 'Issue Token Failed', '')
            }
        }
    }

    return (
        <div className={`tab-panel p-6 ${tab === 'issue' ? 'block' : 'hidden'}`}>
            <h2 className="text-3xl mb-10 font-bold glow text-center">ISSUE TOKEN FORM</h2>
            <form onSubmit={(e) => issueToken(e)}>
                <div className="mb-10">
                    <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Token Symbol</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="text"
                        name='symbol'
                        placeholder="ex: BTC, ETH,.."
                        value={input.symbol}
                        required
                        onChange={(e) => handleInput(e)}
                    />
                </div>
                <div className="mb-10">
                    <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Total supply</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="number"
                        name='totalSupply'
                        value={input.totalSupply}
                        required
                        onChange={(e) => handleInput(e)}
                    />
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="text-white bg-violet-700 hover:bg-violet-800 font-medium rounded-lg text-lg w-full sm:w-auto px-8 py-2.5 text-center">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default IssueToken