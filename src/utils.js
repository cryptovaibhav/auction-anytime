import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import getConfig from './config'

export const ItemStateEnum = {
	Created: 0,
	Auction: 1,
	Sold: 2,
	All: 3,
}

const nearConfig = getConfig(process.env.NODE_ENV || 'development')
console.log(nearConfig);

// Initialize contract & set global variables
export async function initContract() {
  console.log(nearConfig);
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near)

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId()

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['get_all_items'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['list_item', 'vote_for_item', 'add_bid', 'start_auction'],
  })
}

export function logout() {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName)
}
