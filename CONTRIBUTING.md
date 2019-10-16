# Contributing Guide

Contributing to `artistic-cryptids/contracts` is fairly easy. This document shows you how to get the project, run all provided tests and generate a production-ready build for `ARRtistry`'s smart contracts (backend). If you are looking to contribute to the frontend please refer to [this document](app/CONTRIBUTING.md).

It also covers provided grunt tasks that help you develop with `artistic-cryptids/contracts`.

## Dependencies

To make sure that the following instructions work, please install the following dependencies
on you machine:

- Node.js (comes with a bundles npm)
- Git

## Installation

To get the source of `contracts`, clone the git repository via:

````
$ git clone https://github.com/artistic-cryptids/contracts
````

This will clone the complete source to your local machine. Navigate to the project folder
and install all needed dependencies via **npm**:

````
$ npm install
````

This commands installs everything which is required for building and testing the project.

## Testing
Internally `contracts` depends on **Solint**, **ESLint**, **Truffle** and **Ganache**, however we have masked all steps behind simple tasks processed by **npm**.

### Source linting: `npm run lint`
`npm run lint` performs a lint for both `.js` files and `.sol` files in the contract directory.

For specific linting you can use: `npm run lint:{js, sol}` and to attempt automatic fixing of lint errors use `npm run lint:fix` (currently this only works with `.js` files)

### Unit testing: `npm run test`
`npm run test` executes (as you might think) the unit tests, which are located
in `test/unit`. The task uses **karma**, the spectacular test runner, to execute the tests with
the **jasmine testing framework**.

#### Testing of different scopes: `npm run test-scopes`
Because `contracts` supports multiple different versions of AngularJS 1.x, we also test the code against these.

`npm run test-scopes` performs a `npm run test` against each registered scope which can be found at `/test_scopes/*`.

#### Coverage: `npm run coverage`
Just like `npm run test`, this command will run the tests on a different **Ganache** instance which returns coverage information to the directory.

## Building
### Standard build
TODO

## Versioning
```bash
npm version minor -m "Bump version to %s for a feature"
npm version patch -m "Bump version to %s for a patch"
```

## Developing
### `grunt watch`
_TODO This sounds awesome_
This task will watch all relevant files. When it notices a change, it'll run the **lint** and **test** tasks. Use this task while developing on the source to make sure that every time you make a change, you get notified if your code is inconsistent or doesn't pass the tests.

### Consistent Blockchain
Running `docker-compose up -d` will deploy a **Ganache** instance on the standard port, and a pre-installed environment for **truffle** which can be accessed via `docker exec -it contract_truffleapp_1 bash`.

## Contributing/Submitting changes

- Check out a new branch based on <code>master</code> and name it to what you intend to do:
  - Example:
    ````
    $ git checkout -b feature/BRANCH_NAME origin/master
    ````
    If you get an error, you may need to fetch canary first by using
    ````
    $ git remote update && git fetch
    ````
  - Use one branch per fix/feature
- Make your changes
  - Make sure to provide a spec for unit tests.
  - When all tests pass, everything's fine.
- Commit your changes
  - Please provide a git message that explains what you've done
- Make a pull request
  - Make sure you send the PR to the <code>master</code> branch.
  - CI is watching you!

If you follow these instructions, your PR will land pretty safely in the main repo!
