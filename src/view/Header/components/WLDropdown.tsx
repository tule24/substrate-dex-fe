import React, { useState } from 'react';
import Identicon from '@polkadot/react-identicon'
function Dropdown(props: any) {
    const { accountBalance, curAccount } = props;
    const [open, setOpen] = useState(false);
    return (
        <div>
            <button type="button" className="inline-flex items-center border dark:border-gray-100 dark:text-gray-100 py-1 px-3 focus:outline-none hover:bg-violet-800 rounded text-base mt-4 md:mt-0" onClick={() => setOpen(!open)}>
                Wallet Balance
                <i className="fa-solid fa-coins ml-2"></i>
            </button>
            <div className={`bg-gray-900 mt-2 overflow-y-auto rounded-lg overflow-x-hidden absolute z-50 ${open ? 'max-h-80' : 'max-h-0'} w-60 scrollbar`}>
                <div className='p-2'>
                    <button className="absolute top-2 right-2" onClick={() => setOpen(!open)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="flex-shrink-0 w-6 h-6">
                            <polygon points="427.314 107.313 404.686 84.687 256 233.373 107.314 84.687 84.686 107.313 233.373 256 84.686 404.687 107.314 427.313 256 278.627 404.686 427.313 427.314 404.687 278.627 256 427.314 107.313" />
                        </svg>
                    </button>
                    <div className='flex flex-col justify-center items-center'>
                        <Identicon size={32} value={curAccount?.address || '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'} theme={'polkadot'}/>
                        <p>{curAccount?.meta.name || 'No name'}</p>
                    </div>
                    <ul className='mx-2 mt-5'>
                        {accountBalance.map((ele: any, index: number) => {
                            return (
                                <li className='flex justify-around font-semibold rounded-lg py-2 mb-2 bg-gray-800 hover:bg-violet-500' key={index}>
                                    <p>{ele.token.symbol}</p>
                                    <p>{ele.bal}</p>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Dropdown