/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../common";

export interface FastRegistryInterface extends utils.Interface {
  functions: {
    "access()": FunctionFragment;
    "drainEth()": FunctionFragment;
    "ensureEthProvisioning(address,uint256)": FunctionFragment;
    "history()": FunctionFragment;
    "initialize(address)": FunctionFragment;
    "provisionWithEth()": FunctionFragment;
    "setAccessAddress(address)": FunctionFragment;
    "setHistoryAddress(address)": FunctionFragment;
    "setTokenAddress(address)": FunctionFragment;
    "spc()": FunctionFragment;
    "token()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "access"
      | "drainEth"
      | "ensureEthProvisioning"
      | "history"
      | "initialize"
      | "provisionWithEth"
      | "setAccessAddress"
      | "setHistoryAddress"
      | "setTokenAddress"
      | "spc"
      | "token"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "access", values?: undefined): string;
  encodeFunctionData(functionFragment: "drainEth", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "ensureEthProvisioning",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "history", values?: undefined): string;
  encodeFunctionData(functionFragment: "initialize", values: [string]): string;
  encodeFunctionData(
    functionFragment: "provisionWithEth",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setAccessAddress",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setHistoryAddress",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setTokenAddress",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "spc", values?: undefined): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;

  decodeFunctionResult(functionFragment: "access", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "drainEth", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ensureEthProvisioning",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "history", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "provisionWithEth",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAccessAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setHistoryAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTokenAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "spc", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;

  events: {
    "AccessAddressSet(address)": EventFragment;
    "EthDrained(address,uint256)": EventFragment;
    "EthReceived(address,uint256)": EventFragment;
    "HistoryAddressSet(address)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "TokenAddressSet(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AccessAddressSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EthDrained"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EthReceived"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "HistoryAddressSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokenAddressSet"): EventFragment;
}

export interface AccessAddressSetEventObject {
  access: string;
}
export type AccessAddressSetEvent = TypedEvent<
  [string],
  AccessAddressSetEventObject
>;

export type AccessAddressSetEventFilter =
  TypedEventFilter<AccessAddressSetEvent>;

export interface EthDrainedEventObject {
  to: string;
  amount: BigNumber;
}
export type EthDrainedEvent = TypedEvent<
  [string, BigNumber],
  EthDrainedEventObject
>;

export type EthDrainedEventFilter = TypedEventFilter<EthDrainedEvent>;

export interface EthReceivedEventObject {
  from: string;
  amount: BigNumber;
}
export type EthReceivedEvent = TypedEvent<
  [string, BigNumber],
  EthReceivedEventObject
>;

export type EthReceivedEventFilter = TypedEventFilter<EthReceivedEvent>;

export interface HistoryAddressSetEventObject {
  history: string;
}
export type HistoryAddressSetEvent = TypedEvent<
  [string],
  HistoryAddressSetEventObject
>;

export type HistoryAddressSetEventFilter =
  TypedEventFilter<HistoryAddressSetEvent>;

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface TokenAddressSetEventObject {
  token: string;
}
export type TokenAddressSetEvent = TypedEvent<
  [string],
  TokenAddressSetEventObject
>;

export type TokenAddressSetEventFilter = TypedEventFilter<TokenAddressSetEvent>;

export interface FastRegistry extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: FastRegistryInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    access(overrides?: CallOverrides): Promise<[string]>;

    drainEth(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    ensureEthProvisioning(
      a: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    history(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      _spc: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    provisionWithEth(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setAccessAddress(
      _access: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setHistoryAddress(
      _history: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setTokenAddress(
      _token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    spc(overrides?: CallOverrides): Promise<[string]>;

    token(overrides?: CallOverrides): Promise<[string]>;
  };

  access(overrides?: CallOverrides): Promise<string>;

  drainEth(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  ensureEthProvisioning(
    a: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  history(overrides?: CallOverrides): Promise<string>;

  initialize(
    _spc: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  provisionWithEth(
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setAccessAddress(
    _access: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setHistoryAddress(
    _history: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setTokenAddress(
    _token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  spc(overrides?: CallOverrides): Promise<string>;

  token(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    access(overrides?: CallOverrides): Promise<string>;

    drainEth(overrides?: CallOverrides): Promise<void>;

    ensureEthProvisioning(
      a: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    history(overrides?: CallOverrides): Promise<string>;

    initialize(_spc: string, overrides?: CallOverrides): Promise<void>;

    provisionWithEth(overrides?: CallOverrides): Promise<void>;

    setAccessAddress(_access: string, overrides?: CallOverrides): Promise<void>;

    setHistoryAddress(
      _history: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setTokenAddress(_token: string, overrides?: CallOverrides): Promise<void>;

    spc(overrides?: CallOverrides): Promise<string>;

    token(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "AccessAddressSet(address)"(
      access?: string | null
    ): AccessAddressSetEventFilter;
    AccessAddressSet(access?: string | null): AccessAddressSetEventFilter;

    "EthDrained(address,uint256)"(
      to?: string | null,
      amount?: null
    ): EthDrainedEventFilter;
    EthDrained(to?: string | null, amount?: null): EthDrainedEventFilter;

    "EthReceived(address,uint256)"(
      from?: string | null,
      amount?: null
    ): EthReceivedEventFilter;
    EthReceived(from?: string | null, amount?: null): EthReceivedEventFilter;

    "HistoryAddressSet(address)"(
      history?: string | null
    ): HistoryAddressSetEventFilter;
    HistoryAddressSet(history?: string | null): HistoryAddressSetEventFilter;

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "TokenAddressSet(address)"(
      token?: string | null
    ): TokenAddressSetEventFilter;
    TokenAddressSet(token?: string | null): TokenAddressSetEventFilter;
  };

  estimateGas: {
    access(overrides?: CallOverrides): Promise<BigNumber>;

    drainEth(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    ensureEthProvisioning(
      a: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    history(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _spc: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    provisionWithEth(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setAccessAddress(
      _access: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setHistoryAddress(
      _history: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setTokenAddress(
      _token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    spc(overrides?: CallOverrides): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    access(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    drainEth(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    ensureEthProvisioning(
      a: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    history(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      _spc: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    provisionWithEth(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setAccessAddress(
      _access: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setHistoryAddress(
      _history: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setTokenAddress(
      _token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    spc(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
