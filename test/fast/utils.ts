import { ethers } from "hardhat";
import { BigNumber, ContractFactory } from "ethers";
import { smock, MockContract, MockContractFactory } from "@defi-wonderland/smock";
import { FacetCutAction, FixtureFunc } from "hardhat-deploy/dist/types";
import { deploymentSalt, ZERO_ADDRESS } from "../../src/utils";
import {
  Fast, FastTopFacet, FastAccessFacet, FastTokenFacet, FastHistoryFacet, FastFrontendFacet,
  FastTopFacet__factory, FastAccessFacet__factory, FastTokenFacet__factory,
  FastHistoryFacet__factory, FastFrontendFacet__factory, IDiamondCut
} from "../../typechain";
import { setupDiamondFacet } from "../utils";
import { FAST_FACETS } from "../../tasks/fast";

interface FastFixtureOpts {
  readonly name: string;
  readonly deployer: string;
  readonly afterDeploy: (result: FastFixtureResult) => void
};

interface FastInitFacetArgs {
  readonly spc: string;
  readonly exchange: string;
  readonly governor: string;
  readonly name: string;
  readonly symbol: string;
  readonly decimals: BigNumber;
  readonly hasFixedSupply: boolean;
  readonly isSemiPublic: boolean;
}

interface FastFixtureFuncArgs {
  readonly initWith: {};
  readonly opts: FastFixtureOpts;
};

interface FastFixtureResult {
  fast: Fast;
  topMock: MockContract<FastTopFacet>;
  accessMock: MockContract<FastAccessFacet>;
  tokenMock: MockContract<FastTokenFacet>;
  historyMock: MockContract<FastHistoryFacet>;
  frontendMock: MockContract<FastFrontendFacet>;
}

declare type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

const facetMock = async <F extends ContractFactory>(diamond: IDiamondCut, facet: string) => {
  const mockFactory = await smock.mock<F>(facet);
  // Yikes. We would need to be able to infer that `mockFactory` has a `deploy` function
  // that returns the same type than the successful promise type of the `deploy` on type `F`...
  const mock = await (mockFactory as MockContractFactory<any>).deploy();
  await setupDiamondFacet(diamond, mock, facet, FacetCutAction.Replace);
  // More or less solved here... But needing `any` two lines ago isn't great.
  return mock as MockContract<ThenArg<ReturnType<F['deploy']>>>;
};

export const FAST_INIT_DEFAULTS: FastInitFacetArgs = {
  exchange: ZERO_ADDRESS,
  spc: ZERO_ADDRESS,
  governor: ZERO_ADDRESS,
  name: 'Random FAST Token',
  symbol: 'RFT',
  decimals: BigNumber.from(18),
  hasFixedSupply: true,
  isSemiPublic: false
};

export const fastFixtureFunc: FixtureFunc<FastFixtureResult, FastFixtureFuncArgs> =
  async (hre, opts) => {
    // opts could be `undefined`.
    if (!opts) throw 'You must provide FAST fixture options.';
    const { opts: { deployer, name, afterDeploy }, initWith } = opts;
    // Deploy empty diamond.
    const { address: fastAddr } = await hre.deployments.diamond.deploy(name, {
      from: deployer,
      owner: deployer,
      facets: FAST_FACETS,
      execute: {
        contract: 'FastInitFacet',
        methodName: 'initialize',
        args: [{ ...FAST_INIT_DEFAULTS, ...initWith }]
      },
      deterministicSalt: deploymentSalt(hre)
    });

    // Get a FAST typed pointer.
    const fast = await ethers.getContractAt<Fast>('Fast', fastAddr);
    // Build result.
    const result = {
      fast,
      topMock: await facetMock<FastTopFacet__factory>(fast, 'FastTopFacet'),
      accessMock: await facetMock<FastAccessFacet__factory>(fast, 'FastAccessFacet'),
      tokenMock: await facetMock<FastTokenFacet__factory>(fast, 'FastTokenFacet'),
      historyMock: await facetMock<FastHistoryFacet__factory>(fast, 'FastHistoryFacet'),
      frontendMock: await facetMock<FastFrontendFacet__factory>(fast, 'FastFrontendFacet')
    };
    // Callback!
    await afterDeploy.apply(this, [result]);
    // Final return.
    return result;
  }