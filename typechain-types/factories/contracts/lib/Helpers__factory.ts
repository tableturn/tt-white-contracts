/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Helpers, HelpersInterface } from "../../../contracts/lib/Helpers";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "upTo",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x610256610053600b82828239805160001a607314610046577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600436106100355760003560e01c8063d0485ef71461003a575b600080fd5b610054600480360381019061004f91906100ed565b61006a565b6040516100619190610138565b60405180910390f35b6000808373ffffffffffffffffffffffffffffffffffffffff163190508281106100985760009150506100bd565b80836100a49190610153565b92506000479050838110156100b7578093505b83925050505b92915050565b6000813590506100d2816101f2565b92915050565b6000813590506100e781610209565b92915050565b6000806040838503121561010057600080fd5b600061010e858286016100c3565b925050602061011f858286016100d8565b9150509250929050565b610132816101b9565b82525050565b600060208201905061014d6000830184610129565b92915050565b600061015e826101b9565b9150610169836101b9565b92508282101561017c5761017b6101c3565b5b828203905092915050565b600061019282610199565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6101fb81610187565b811461020657600080fd5b50565b610212816101b9565b811461021d57600080fd5b5056fea26469706673582212202826cd610dc9297c0fe7473652f91e56ccb7ed8bcb718bc03e51e9639d3235ca64736f6c63430008040033";

type HelpersConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: HelpersConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Helpers__factory extends ContractFactory {
  constructor(...args: HelpersConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Helpers> {
    return super.deploy(overrides || {}) as Promise<Helpers>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Helpers {
    return super.attach(address) as Helpers;
  }
  override connect(signer: Signer): Helpers__factory {
    return super.connect(signer) as Helpers__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): HelpersInterface {
    return new utils.Interface(_abi) as HelpersInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Helpers {
    return new Contract(address, _abi, signerOrProvider) as Helpers;
  }
}
