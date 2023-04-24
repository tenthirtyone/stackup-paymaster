# Stackup Paymaster

A proof of concept for sending gasless transactions on the Polygon Mumbai testnet using the ERC-4337 implementation provided by [StackUp](https://www.stackup.sh/). Transactions sent by the integration test in this repo will send 0.001 MATIC back to itself and the account balance will remain unchanged -> no gas fees will be charged.

The `data` value of the transactions are currently hardcoded to `0x`, but you may perform any transaction an externally owned account is permitted to perform including launching and interacting with smart contracts.

The `userop` library will create a smart contract on the first transaction. This contract is used to verify the offchain data signed by the signingkey and execute the transactions. Effectively, it is a proxy for the external account that takes actions on behalf of the user, and its transaction gas is paid by the `paymaster` controlled by StackUp.

## Prerequisites

1. This code requires a developer API key from Stackup. A free account will not have access to the paymaster API and transactions will fail. The paymaster API allows for gasless transactions.
   A gasless transaction allows for the end user to hold no ETH/MATIC in their wallet and still transact on the EVM compatible network.

See `.env-template`

2. The Signing Key used by this must have a balance. Visit the [Polygon Faucet](https://faucet.polygon.technology/) and fund your signing key's address. Transactions sent from this address will appear under the "Internal Txns" tab.

[Example](https://mumbai.polygonscan.com/address/0x75A95b9a4846cFd235078063e002C351EF3fC7f7#internaltx)

## Installation

Use the package manager [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) to install the required dependencies for this project.

```bash
npm install
```

or

```bash
yarn install
```

## Usage

1. Make a copy of the .env.example file and name it .env:

```bash
cp .env.example .env
```

2. Update the .env file with the required API keys and other configuration options.

3. Import the Server class and use it as needed:

```bash
const server = new Server();

(async () => {
  const address = await server.getAddress();
  console.log(`Address: ${address}`);

  const amount = "0.001";
  const transactionHash = await server.sendTransaction(address, amount);
  console.log(`Transaction hash: ${transactionHash}`);
})();
```

## Testing

To run the unit and integration tests, execute the following command:

```bash
npm test
```
