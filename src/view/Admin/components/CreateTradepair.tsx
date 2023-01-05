import React, { useState } from 'react'
import { web3FromAddress } from '@polkadot/extension-dapp';
import { useSelector } from 'react-redux';
import { AppState } from '../../../store';
import openNotification from '../../utils/Notification'

function CreateTradepair(props: any) {
    const { tab } = props;
    const { api, accountInfo } = useSelector((state: AppState) => state.account);
    const [input, setInput] = useState({ base: '', quote: '' })
    const { tokens } = useSelector((state: AppState) => state.trade);

    const handleInput = (e: any) => {
        const { name, value } = e.target;
        console.log(value)
        setInput({ ...input, [name]: value })
    }

    const createTradepair = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (accountInfo.curAccount && input.base && input.quote) {
            const curAccount = accountInfo.curAccount.address
            const injector = await web3FromAddress(curAccount)
            try {
                const events = async () => {
                    await api.tx.trade
                        .createTradePair(input.base, input.quote)
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
                openNotification('success', 'Create Tradepair Success', '')
            } catch(err) {
                console.log(err)
                openNotification('warning', 'Create Tradepair Failed', '')
            }
        }
    }

    return (
        <div className={`tab-panel p-6 ${tab === 'create' ? 'block' : 'hidden'}`}>
            <h2 className="text-3xl mb-10 font-bold glow text-center">CREATE TRADEPAIR FORM</h2>
            <form onSubmit={(e) => createTradepair(e)}>
                <div className="mb-10">
                    <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Base Token</label>
                    <select
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name='base'
                        value={input.base}
                        required
                        onChange={(e) => handleInput(e)}
                    >
                        <option className='text-black font-semibold bg-gray-600 text-md text-lg' value=''>Choose base token</option>
                        {tokens.filter(token => token.hash_ !== input.quote).map((token, index) => {
                            return (
                                <option className='text-black font-semibold bg-gray-600 text-md text-lg' value={token.hash_} key={index}>{token.symbol}</option>
                            )
                        })}
                    </select>
                </div>
                <div className="mb-10">
                    <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Quote Token</label>
                    <select
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name='quote'
                        value={input.quote}
                        required
                        onChange={(e) => handleInput(e)}
                    >
                        <option className='text-black font-semibold bg-gray-600 text-md text-lg' value=''>Choose quote token</option>
                        {tokens.filter(token => token.hash_ !== input.base).map((token, index) => {
                            return (
                                <option className='text-black font-semibold bg-gray-600 text-md text-lg' value={token.hash_} key={index}>{token.symbol}</option>
                            )
                        })}
                    </select>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="text-white bg-violet-700 hover:bg-violet-800 font-medium rounded-lg text-lg w-full sm:w-auto px-8 py-2.5 text-center">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default CreateTradepair