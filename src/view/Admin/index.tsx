import React, { useState } from 'react'
import * as Tabs from './components'
function Admin() {
    const [tab, setTab] = useState('issue');
    return (
        <div className=' w-1/3 m-auto'>
            <div className="relative w-max mx-auto mt-6 h-12 grid grid-cols-3 items-center px-[3px] rounded-full bg-gray-500 bg-opacity-50 overflow-hidden">
                <button className={`relative block h-10 px-6 tab rounded-full ${tab === 'issue' ? 'bg-violet-500 shadow-lg' : ''}`} onClick={() => setTab('issue')}>
                    <span className="text-white font-bold ">Issue Token</span>
                </button>
                <button className={`relative block h-10 px-6 tab rounded-full ${tab === 'transfer' ? 'bg-violet-500 shadow-lg' : ''}`} onClick={() => setTab('transfer')}>
                    <span className="text-white font-bold ">Transfer Token</span>
                </button>
                <button className={`relative block h-10 px-6 tab rounded-full ${tab === 'create' ? 'bg-violet-500 shadow-lg' : ''}`} onClick={() => setTab('create')}>
                    <span className="text-white font-bold">Create TradePair</span>
                </button>
            </div>
            <div className="mt-10 relative rounded-3xl bg-gray-500">
               <Tabs.IssueToken tab={tab}/>
               <Tabs.TransferToken tab={tab}/>
               <Tabs.CreateTradepair tab={tab}/>
            </div>
        </div>
    )
}

export default Admin