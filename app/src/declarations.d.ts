declare module 'drizzle' {
  import { Store } from 'redux';

  export interface ABI {
    constant?: boolean;
    inputs: {
      name: string;
      type: string;
      indexed?: boolean;
    }[];
    name?: string;
    outputs?: {
      name: string;
      type: string;
    }[];
    payable?: boolean;
    stateMutability?: string;
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
    nodes: Node[];
    src: string;
  }

  export interface Network {
    events: any;
    links: any;
    address: string;
    transactionHash: string;
  }

  export interface Networks {
    [key: number]: Network;
    [key: string]: Network;
  }

  export interface Node {
    id: number;
    literals: string[];
    nodeType: string;
    src: string;
    baseContracts?: any[];
    contractDependencies?: any[];
    contractKind?: string;
    documentation?: any;
    fullyImplemented?: boolean;
    linearizedBaseContracts?: number[];
    name?: string;
    nodes?: any[];
    scope?: number;
  }

  export interface Contract {
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
    networks: Networks;
    schemaVersion: string;
    updatedAt: Date;
    devdoc: {
      methods: any;
    };
    userdoc: {
      methods: any;
    };
  }

  export interface DrizzleOptions {
    contracts: Contract[];
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
      };
    };
    networkWhitelist?: number[];
  }

  export interface StoreConfig {
    [key: string]: any;
    drizzleOptions: DrizzleOptions;
    reducers?: any;
    appSagas?: any[];
    appMiddlewares?: any[];
    disableReduxDevTools?: boolean;
  }

  export function generateStore(config: StoreConfig): Store;

  export interface ContractConfig {
    contractName: string;
    web3Contract?: {
      options: {
        jsonInterface: ABI;
      };
    };
    abi?: ABI;
  }

  export interface ContractInitialState {
    [key: string]: {};
    initialized: boolean;
    synced: boolean;
  }

  export interface ContractOptions {
    contracts?: ContractConfig[];
  }

  export function generateContractInitialState(contractConfig: ContractConfig): ContractInitialState;

  export function generateContractsInitialState(options: ContractOptions): ContractInitialState[];

  export class Drizzle {
    constructor(options?: DrizzleOptions, store?: Store);

    addContract(contractConfig: ContractConfig, events: any[]): void;

    deleteContract(contractName: string): void;

    findContractByAddress(address: string): Contract;

    generateStore(options: StoreConfig): Store;
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
