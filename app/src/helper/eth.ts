import { AbiItem } from 'web3-utils';
import * as Contracts from './contracts';

export interface ContractProps {
  contracts: Contracts.ContractListType;
  accounts: Array<string>;
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

export interface TruffleArtifact {
  contractName: string;
  abi: AbiItem[];
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

export const getABIAndAddress = (networkId: number, json: TruffleArtifact, defaultAddress: string): { abi: any; address: string } => {
  const deployed = json.networks[networkId];
  const address = deployed && deployed.address;
  return {
    abi: json.abi,
    address: address || defaultAddress,
  };
};
