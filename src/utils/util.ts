import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

const WS_PROVIDER = "ws://222.252.31.175:4000";
let api: ApiPromise;

export async function getApi() {
  const wsProvider = new WsProvider(WS_PROVIDER);

  if (!api) {
    api = await ApiPromise.create({ provider: wsProvider });
    console.log("Connect to blockchain");

    // // Subscribe to system events via storage
    // api.query.system.events((events: any) => {
    //   console.log(`\nReceived ${events.length} events: `)

    //   // Loop through the Vec<EventRecord>
    //   events.forEach((record: any) => {
    //     // Extract the phase, event and the event types
    //     const { event, phase } = record;
    //     // const types = event.typeDef;

    //     // Show what we are busy with
    //     console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
    //     // console.log(`\t\t${event.meta}`);

    //     // Loop through each of the parameters, displaying the type and data
    //     // event.data.forEach((data: any, index: any) => {
    //     //   console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
    //     // });
    //   });
    // })
  }
  return api;
}

export async function getWallet() {
  const extensions = await web3Enable("ScoreChain");
  console.log("🚀 ~ get extensions success", extensions);

  if (extensions.length === 0) {
    console.error("No web3 extension found!!!");
    return null;
  } else {
    const accounts = await web3Accounts();
    console.log("🚀 ~ get allAccounts success", accounts);
    const curAccount = accounts[0] || null;
    return { accounts, curAccount, web3enable: true }
  }
}

export async function getExtension(web3enable: Boolean, curAccount: InjectedAccountWithMeta | null) {
  if (!web3enable) {
    await getWallet();
  }

  if (!curAccount) {
    return null;
  }

  const injector = await web3FromSource(curAccount.meta.source);
  return injector;
}