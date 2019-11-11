// import TruffleContract from '@truffle/contract';
// import { ContractObject } from '@truffle/contract-schema'

export interface ContractListType {
  Governance: any;
  ArtifactApplication: any;
  ArtifactRegistry: any;
  Artists: any;
}

export interface ContractProps {
  contracts: ContractListType;
  accounts: Array<string>;
}

// keeping in case they're useful later
/* export interface ABI {
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
} */
