# Prerequsities

Install the next tools:
* `node`
* `yarn`
* `near-cli`

Also, you'd need a code editor of choice. In this course we are going to use Visual Studio Code.

## Create project structure

The next directories and files must be created to proceed with smart contracts:
* assembly/ - this directory contains smart contracts source code
* asconfig.json - contains most of configuration properties
* assembly/tsconfig.json

### `asconfig.json`
By default it's needed to add the next content to the file. By adding this, we just extend the configuration provided by `near-sdk-as`.
```
{
    "extends": "near-sdk-as/asconfig.json"
}
```

### `assembly/tsconfig.json`
The purpose of this file is to specify compiler options and root level files that are necessary for a TypeScript project to be compiled.
Also, this file implies that the directory where `tsconfig.json` is located is the root of the TypeScript project.
```
{
  "extends": "../node_modules/assemblyscript/std/assembly.json",
  "include": [
    "./**/*.ts"
  ]
}
```

### `as_types.d.ts`
This files declares that some type names must be included in the compilation. In this case, names are imported from `near-sdk-as`
```
/// <reference types="near-sdk-as/assembly/as_types" />
```

## Initialize project

Run the next commands in a terminal window (in the project's root):
```
yarn init
```
It will create a `package.json` file where development dependencies can be added.


Run the next command to add `near-sdk-as` to the project:
```
yarn add -D near-sdk-as
```

The next step is to create an entry file for the smart contract - create `index.ts` file in the `assembly` directory.
The resulting project structure should be like this:
```
├── asconfig.json
├── assembly
│   ├── as_types.d.ts
│   ├── index.ts
│   └── tsconfig.json
├── package.json
└── yarn.lock
```

# Compile, build and deployt the smart contract

## Compile & build a smart contract
Before a smart contract can be deployed, it must be built as `.wasm`. 
To do that, the next command should be run from the project's root:
```
yarn asb
```

The output of this command is a `.wasm` file that is placed into `${PROJECT_ROOT}/build/release` directory.

## Deploy a smart contract
To deploy a smart contract, run the next command from in a terminal window:
```
near deploy --contractName=${CONTRACT_NAME} ${PATH_TO_WASM} --accountId=${ACCOUNT_NAME}
```
where:
* `${ACCOUNT_NAME}` - an account name that should be used to deploy a smart contract
* `${CONTRACT_NAME}` - an account name that should be used for the contract (we will use the same value as for `${ACCOUNT_NAME}`)
* `${PATH_TO_WASM}` - a path to the `.wasm` file issued by the `yarn asb` command - `${PROJECT_ROOT}/build/release/some_name.wasm`

# Invoke `view` and `call` functions

`view` functions are used to read state hence they are free. Nothing is modified/persisted when a `view` function is called.
`call` functions are used to modify state of the data stored in the blockchain.
