
declare module 'drizzle' {
  import { Store } from 'redux';

  export interface ABI {
    constant: boolean;
    inputs: {
      name: string;
      type: string;
      indexed?: boolean;
    }[];
    name: string;
    outputs: {
      name: string;
      type: string;
    }[];
    payable: boolean;
    stateMutability: string;
    type: string;
    anonymous?: boolean;
  }

  export interface AST {
    absolutePath: string;
    exportedSymbols: {
      [name: string]: number[];
    };
    id: number;
    nodeType: string;
    nodes: INode[];
    src: string;
  }

  export interface INetwork {
    events: any;
    links: any;
    address: string;
    transactionHash: string;
  }

  export interface INetworks {
    [key: number]: INetwork;
    [key: string]: INetwork;
  }

  export interface INode {
    id: number;
    literals: string[];
    nodeType: string;
    src: string;
    baseContracts: any[];
    contractDependencies: any[];
    contractKind: string;
    documentation?: any;
    fullyImplemented?: boolean;
    linearizedBaseContracts: number[];
    name: string;
    nodes: any[];
    scope?: number;
  }

  export interface IContract {
    contractName: string;
    abi: ABI[];
    metadata: string;
    bytecode: string;
    deployedBytecode: string;
    sourceMap: string;
    deployedSourceMap: string;
    source: string;
    sourcePath: string;
    ast: AST;
    legacyAST: AST;
    compiler: {
      name: string;
      version: string;
    };
    networks: INetworks;
    schemaVersion: string;
    updatedAt: Date;
    devdoc: {
      methods: any;
    };
    userdoc: {
      methods: any;
    };
  }

  export interface IDrizzleOptions {
    contracts: IContract[];
    events?: {
      [contractName: string]: any;
    };
    polls?: {
      accounts?: number;
      blocks?: number;
    };
    syncAlways?: any;
    web3?: {
      customProvider?: any;
      fallback?: {
        type: string;
        url: string;
      }
    },
    networkWhitelist?: number[];
  }

  export interface IStoreConfig {
    [key: string]: any;
    drizzleOptions: IDrizzleOptions;
    reducers?: any;
    appSagas?: any[];
    appMiddlewares?: any[];
    disableReduxDevTools?: boolean;
  }

  export function generateStore(config: IStoreConfig): Store;

  export interface IContractConfig {
    contractName: string;
    web3Contract?: {
      options: {
        jsonInterface: ABI;
      }
    };
    abi?: ABI;
  }

  export interface IContractInitialState {
    [key: string]: {};
    initialized: boolean;
    synced: boolean;
  }

  export interface IContractOptions {
    contracts?: IContractConfig[];
  }

  export function generateContractInitialState(contractConfig: IContractConfig): IContractInitialState;

  export function generateContractsInitialState(options: IContractOptions): IContractInitialState[];

  export class Drizzle {
    constructor(options?: IDrizzleOptions, store?: Store);

    addContract(contractConfig: IContractConfig, events: any[]): void;

    deleteContract(contractName: string): void;

    findContractByAddress(address: string): IContract;

    generateStore(options: IStoreConfig): Store;
  }

  export interface Drizzled {
    drizzle: Drizzle;
    drizzleState: any;
  }
}

declare module 'prop-types'
declare module 'drizzle-react'
declare module 'drizzle-react-components'
declare module '*.json'
declare module 'react-fade-in'
