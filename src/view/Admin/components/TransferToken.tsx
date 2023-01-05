import React, { useState } from 'react'
import { web3FromAddress } from '@polkadot/extension-dapp';
import { useSelector } from 'react-redux';
import { AppState } from '../../../store';
import openNotification from '../../utils/Notification'

function TransferToken(props: any) {
    const { tab } = props;
    const { api, accountInfo } = useSelector((state: AppState) => state.account);
    const { tokens } = useSelector((state: AppState) => state.trade);
    const [input, setInput] = useState({ to: '', token: '', amount: '' })

    const handleInput = (e: any) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value })
    }

    const transferToken = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (accountInfo.curAccount && input.to && input.amount && input.token) {
            const curAccount = accountInfo.curAccount.address
            const injector = await web3FromAddress(curAccount)
            try {
                const events = async () => {
                    await api.tx.tokens
                        .transfer(input.to, input.token, Number(input.amount))
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
                await events();
                openNotification('success', 'Transfer Token Success', '')
            } catch(err) {
                console.log(err)
                openNotification('warning', 'Transfer Token Failed', '')
            }
            
        }
    }

    return (
        <div className={`tab-panel p-6 ${tab === 'transfer' ? 'block' : 'hidden'}`}>
            <h2 className="text-3xl mb-10 font-bold glow text-center">TRANSFER TOKEN FORM</h2>
            <form onSubmit={(e) => transferToken(e)}>
                <div className="mb-10">
                    <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Recipient Account</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="text"
                        name='to'
                        value={input.to}
                        required
                        onChange={(e) => handleInput(e)}
                    />
                </div>
                <div className="mb-10">
                    <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Token</label>
                    <select
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name='token'
                        value={input.token}
                        required
                        onChange={(e) => handleInput(e)}
                    >
                        <option className='text-black font-semibold bg-gray-600 text-md text-lg' value=''>Choose token</option>
                        {tokens.map((token, index) => {
                            return (
                                <option className='text-black font-semibold bg-gray-600 text-md text-lg' value={token.hash_} key={index}>{token.symbol}</option>
                            )
                        })}
                    </select>
                </div>
                <div className="mb-10">
                    <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Amount</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="number"
                        name='amount'
                        value={input.amount}
                        min={1}
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

export default TransferToken