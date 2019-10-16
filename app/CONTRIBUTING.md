# Contributing Guide (frontend)

This is the contributing guide for the frontend of `artistic-cryptids/ARRtistry`. If you are looking to contribute to `ARRtistry`'s smart contracts (backend) then please refer to [this document](../CONTRIBUTING.md).

## Dependencies
The frontend requires the compiled smart contracts. Please follow the **Installation** steps in [this document](../CONTRIBUTING.md) to enable the smart contracts to be compiled.


## Installation
Navigate to the `app` directory, by running `cd app` in the root directory.
Then install frontend dependencies using **npm**:

````
$ npm install
````

## Testing
**Jest** and **ESLint** are used for testing the frontend of `ARRtistry`.
To test the frontend ensure that you are in the `app` directory.

### Source linting: `npm run lint`
`npm run lint` performs a lint for `.js` files in the `app` directory.

### Unit testing: `npm test`
`npm test` launches the test runner in interactive watch mode and runs the unit tests stored in `app/src` (TODO update this when we have a separate directory for tests)

To run the tests in non-interactive mode set the `CI` environment variable to `true` (by running `export CI=true` for Mac and Linux) and then running `npm test`.

### Manual testing:
1. Start a local blockchain by navigating to the **root** directory and running:
```
$ ganache-cli -p 8545
```

2. Compile and deploy the smart contracts to the local blockchain in a different terminal by running (also in the **root** directory):
```
$ truffle compile
$ truffle migrate
```

3. Navigate to the `app` directory by running `cd app` and run the website using:
```
$ npm start
```
You will now be able to view ARRtistry at [http://localhost:3000](http://localhost:3000) in a browser. If you have **MetaMask** installed make sure to use an incognito window (or disable MetaMask for now). Otherwise, the app will try to use the network specified in MetaMask rather than the develop network of the local blockchain.

## Building

### Production build
To build the frontend for production run:
```
$ npm run build
```
This will minify and optimize the build for the best performance and place it in the `app/build` directory.
