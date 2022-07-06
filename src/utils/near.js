import environment from "./config";
import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import { formatNearAmount } from "near-api-js/lib/utils/format";

const nearEnv = environment("testnet");

export async function initializeContract() {
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearEnv
    )
  );
  window.walletConnection = new WalletConnection(near);
  window.accountId = window.walletConnection.getAccountId();
  window.contract = new Contract(
    window.walletConnection.account(),
    nearEnv.contractName,
    // Methods from the AssemblyScript contract are listed here.
    // If you are working with a contract written in Rust, replace methods names using the correct case:
    //  - getProduct  -> get_product
    //  - getProducts -> get_products
    //  - buyProducts -> buy_products
    //  - setProduct  -> set_product
    {
      // List here all view methods
      viewMethods: ["getProduct", "getProducts"],
      // List call methods that change state
      changeMethods: ["buyProduct", "setProduct"],
    }
  );
}

export async function accountBalance() {
  return formatNearAmount(
    (await window.walletConnection.account().getAccountBalance()).total,
    2
  );
}

export async function getAccountId() {
  return window.walletConnection.getAccountId();
}

export function login() {
  window.walletConnection.requestSignIn(nearEnv.contractName);
}

export function logout() {
  window.walletConnection.signOut();
  window.location.reload();
}
