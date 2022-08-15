import * as chai from 'chai';
import { expect } from 'chai';
import { solidity } from 'ethereum-waffle';
import { deployments, ethers } from 'hardhat';
import { FakeContract, smock } from '@defi-wonderland/smock';
import { Issuer, Marketplace, Fast, IssuerFrontendFacet, FastFrontendFacet } from '../../typechain';
import { SignerWithAddress } from 'hardhat-deploy-ethers/signers';
import { BigNumber } from 'ethers';
import { FAST_INIT_DEFAULTS } from '../fixtures/fast';
import { issuerFixtureFunc } from '../fixtures/issuer';
import { ZERO_ADDRESS } from '../../src/utils';
chai.use(solidity);
chai.use(smock.matchers);

const FAST_DETAILS_DEFAULTS: FastFrontendFacet.DetailsStruct = {
  name: FAST_INIT_DEFAULTS.name,
  symbol: FAST_INIT_DEFAULTS.symbol,
  decimals: FAST_INIT_DEFAULTS.decimals,
  hasFixedSupply: FAST_INIT_DEFAULTS.hasFixedSupply,
  isSemiPublic: FAST_INIT_DEFAULTS.isSemiPublic,
  addr: ZERO_ADDRESS,
  totalSupply: BigNumber.from(20),
  transferCredits: BigNumber.from(30),
  reserveBalance: BigNumber.from(40),
  ethBalance: BigNumber.from(0),
  memberCount: BigNumber.from(1),
  governorCount: BigNumber.from(2)
};

describe('IssuerFrontendFacet', () => {
  let
    deployer: Readonly<SignerWithAddress>,
    issuerMember: Readonly<SignerWithAddress>,
    governor: Readonly<SignerWithAddress>;
  let
    marketplace: Readonly<FakeContract<Marketplace>>,
    fasts: ReadonlyArray<FakeContract<Fast>>;
  let
    issuer: Readonly<Issuer>,
    issuerMemberIssuer: Readonly<Issuer>,
    frontend: Readonly<IssuerFrontendFacet>;

  const issuerDeployFixture = deployments.createFixture(issuerFixtureFunc);

  before(async () => {
    // Keep track of a few signers.
    [deployer, issuerMember, governor] = await ethers.getSigners();
  });

  beforeEach(async () => {
    await issuerDeployFixture({
      opts: {
        name: 'IssuerFrontendFixture',
        deployer: deployer.address,
        afterDeploy: async (res) => {
          issuer = res.issuer;
          issuerMemberIssuer = issuer.connect(issuerMember);
          frontend = await ethers.getContractAt<IssuerFrontendFacet>('IssuerFrontendFacet', res.issuer.address);
          // Mock the Marketplace.
          marketplace = await smock.fake('Marketplace');
          marketplace.issuerAddress.returns(res.issuer.address);

          // Prepare a fake FAST.
          const values: Array<FakeContract<Fast>> = [];
          for (const index of [0, 1, 2]) {
            const fast = await smock.fake<Fast>('Fast');
            const symbol = `F0${index}`;
            fast.symbol.returns(symbol);
            fast.details.returns({ ...FAST_DETAILS_DEFAULTS, symbol });
            // Register the FAST.
            await issuerMemberIssuer.registerFast(fast.address);
            values.push(fast);
          }
          fasts = [...values];
        }
      },
      initWith: {
        member: issuerMember.address
      }
    });
  });

  describe('paginateDetailedFasts', async () => {
    it('returns a paginated list of detailed FAST details', async () => {
      const [/*results*/, nextCursor] = await issuerMemberIssuer.paginateDetailedFasts(0, 5);
      for (const fast of fasts)
        expect(fast.details).to.have.been.calledOnceWith();
      expect(nextCursor).to.eq(3);
    });
  });
});