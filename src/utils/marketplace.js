import { connect, Contract, keyStores, WalletConnection, utils } from 'near-api-js';
import environment from './config';
import { v4 as uuid4 } from 'uuid';
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format';

const nearEnv = environment('testnet');
const GAS = 100000000000000;

export function createProduct(product) {
  product.id = uuid4();
  product.price = parseNearAmount(product.price + "");
  return window.contract.writeProduct({ product });
}

export async function initializeContract() {
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearEnv));
  window.walletConnection = new WalletConnection(near);
  window.accountId = window.walletConnection.getAccountId();
  window.contract = await new Contract(window.walletConnection.account(), nearEnv.contractName, {
    // List here all view methods
    viewMethods: ['getPurchases', 'getProduct', 'getProducts'],
    // List call methods that change state
    changeMethods: ['buyProduct', 'writeProduct'],
  })
}

export async function accountBalance() {
  return formatNearAmount((await window.walletConnection.account().getAccountBalance()).total);
}

export async function getAccountId() {
  return window.walletConnection.getAccountId();
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearEnv.contractName)
}

export function logout() {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

export function getProducts() {
  return window.contract.getProducts();
};

export async function getPurchases(account) {
  return window.contract.getPurchases({ account });
};

export async function buyProduct({ id, price }) {
  await window.contract.buyProduct({ productId: id }, GAS, price);
};
