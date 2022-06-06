import * as chai from 'chai';
import { expect } from 'chai';
import { solidity } from 'ethereum-waffle';
import { BigNumber } from 'ethers';
import { deployments, ethers } from 'hardhat';
import { FakeContract, smock } from '@defi-wonderland/smock';
import { SignerWithAddress } from 'hardhat-deploy-ethers/signers';
import { DEPLOYMENT_SALT } from '../src/utils';
import { Spc, Exchange, Fast, FastHistoryFacet, FastInitFacet } from '../typechain';
chai.use(solidity);
chai.use(smock.matchers);

interface FastFixtureOpts {
  // Ops variables.
  deployer: string;
  governor: string;
  spc: string;
  exchange: string;
  // Config.
  name: string;
  symbol: string;
  decimals: BigNumber;
  hasFixedSupply: boolean;
  isSemiPublic: boolean;
}

const FAST_FACETS = ['FastFacet', 'FastHistoryFacet'];

const fastDeployFixture = deployments.createFixture(async (hre, uOpts) => {
  const opts = uOpts as FastFixtureOpts;
  // Deploy the fast.
  const fastDeploy = await deployments.diamond.deploy('Fast', {
    from: opts.deployer,
    owner: opts.deployer,
    facets: [...FAST_FACETS, 'FastInitFacet'],
    deterministicSalt: DEPLOYMENT_SALT
  });

  // Call the initialization facet.
  const init = await ethers.getContractAt('FastInitFacet', fastDeploy.address) as FastInitFacet;
  await init.initialize(opts);

  // Remove the initialization facet.
  await deployments.diamond.deploy('Fast', {
    from: opts.deployer,
    owner: opts.deployer,
    facets: FAST_FACETS,
    deterministicSalt: DEPLOYMENT_SALT
  });

  return fastDeploy;
});

describe('FastHistory', () => {
  let
    deployer: SignerWithAddress,
    spcMember: SignerWithAddress,
    governor: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    john: SignerWithAddress,
    rob: SignerWithAddress;
  let spc: FakeContract<Spc>,
    exchange: FakeContract<Exchange>,
    history: FastHistoryFacet,
    governedHistory: FastHistoryFacet;

  before(async () => {
    // Keep track of a few signers.
    [deployer, spcMember, governor, alice, bob, john, rob] = await ethers.getSigners();
    // Mock an SPC and a FAST.
    spc = await smock.fake('Spc');
    exchange = await smock.fake('Exchange');
  });

  beforeEach(async () => {
    const deploy = await fastDeployFixture({
      deployer: deployer.address,
      spcMember: spcMember.address,
      governor: governor.address,
      spc: spc.address,
      exchange: exchange.address,
      name: 'Better, Stronger, FASTer',
      symbol: 'BSF',
      decimals: 18,
      hasFixedSupply: true,
      isSemiPublic: true
    });

    const fast = await ethers.getContractAt('Fast', deploy.address) as Fast;

    // Spin up our History contract.
    history = fast as FastHistoryFacet;
    governedHistory = history.connect(governor);
  });

  /// Supply proof stuff.

  describe('burnt', async () => {
    it('requires that the caller is the diamond (anonymous)', async () => {
      const subject = history.burnt(1, 'One');
      await expect(subject).to.have
        .revertedWith('Cannot be called directly');
    });

    it('requires that the caller is the diamond (governor)', async () => {
      const subject = governedHistory.burnt(2, 'Two');
      await expect(subject).to.have
        .revertedWith('Cannot be called directly');
    });

    it('adds an entry to the supply proof list', async () => {
      // TODO: We need to find a way to be able to call this functions.
      // await history.burnt(3, 'Three');
      // const [[{ amount, ref, blockNumber }],] = await history.paginateSupplyProofs(0, 1);
      // expect(amount).to.eq(3);
      // expect(ref).to.eq('Three');
      // expect(blockNumber.toNumber()).to.be.greaterThan(1);
    });
  });

  describe('minted', async () => {
    it('requires that the caller is the token (anonymous)', async () => {
      const subject = history.minted(1, 'One');
      await expect(subject).to.have
        .revertedWith('Cannot be called directly');
    });

    it('requires that the caller is the token (governor)', async () => {
      const subject = governedHistory.minted(2, 'Two');
      await expect(subject).to.have
        .revertedWith('Cannot be called directly');
    });

    it('adds an entry to the supply proof list', async () => {
      // TODO: We need to find a way to be able to call this functions.
      // await history.minted(3, 'Three');
      // const [[{ amount, ref, blockNumber }],] = await history.paginateSupplyProofs(0, 1);
      // expect(amount).to.eq(3);
      // expect(ref).to.eq('Three');
      // expect(blockNumber.toNumber()).to.be.greaterThan(1);
    });
  });

  describe('supplyProofCount', async () => {
    beforeEach(async () => {
      // TODO: We need to find a way to be able to call this functions.
      // // Add a bunch of supply proofs.
      // await Promise.all(['One', 'Two', 'Three'].map((value, index) => {
      //   return history.minted(index, value);
      // }));
    });

    // it('counts how many supply proofs have been stored', async () => {
    //   const subject = await history.supplyProofCount();
    //   expect(subject).to.eq(3);
    // });
  });

  describe('paginateSupplyProofs', async () => {
    beforeEach(async () => {
      // TODO: We need to find a way to be able to call this functions.
      // // Add a bunch of supply proofs.
      // await Promise.all(['One', 'Two', 'Three'].map((value, index) => {
      //   return history.minted((index + 1) * 100, value);
      // }));
    });

    // it('returns the cursor to the next page', async () => {
    //   // We're testing the pagination library here... Not too good. But hey, we're in a rush.
    //   const [, cursor] = await history.paginateSupplyProofs(0, 3);
    //   expect(cursor).to.eq(3);
    // });

    // it('does not crash when overflowing and returns the correct cursor', async () => {
    //   // We're testing the pagination library here... Not too good. But hey, we're in a rush.
    //   const [, cursor] = await history.paginateSupplyProofs(1, 10);
    //   expect(cursor).to.eq(3);
    // });

    // it('returns the supply proofs in the order they were added', async () => {
    //   // We're testing the pagination library here... Not too good. But hey, we're in a rush.
    //   const [[proof1, proof2, proof3],] = await history.paginateSupplyProofs(0, 3);
    //   // Check all proofs in order.
    //   expect(proof1.amount).to.eq(100);
    //   expect(proof1.ref).to.eq('One');
    //   expect(proof2.amount).to.eq(200);
    //   expect(proof2.ref).to.eq('Two');
    //   expect(proof3.amount).to.eq(300);
    //   expect(proof3.ref).to.eq('Three');
    // });
  });

  /// Transfer proof stuff.

  describe('transfered', async () => {
    it('requires that the caller is the token (anonymous)', async () => {
      const subject = history.transfered(alice.address, bob.address, john.address, 100, 'Attempt 1');
      await expect(subject).to.have
        .revertedWith('Cannot be called directly');
    });

    it('requires that the caller is the token (governor)', async () => {
      const subject = governedHistory.transfered(alice.address, bob.address, john.address, 100, 'Attempt 2');
      await expect(subject).to.have
        .revertedWith('Cannot be called directly');
    });

    it('adds an entry to the transfer proof list', async () => {
      // TODO: We need to find a way to be able to call this functions.
      // history.transfered(alice.address, bob.address, john.address, 300, 'Attempt 3');
      // const [[{ spender, from, to, amount, ref, blockNumber }],] = await history.paginateTransferProofs(0, 1);
      // expect(spender).to.eq(alice.address);
      // expect(from).to.eq(bob.address);
      // expect(to).to.eq(john.address);
      // expect(amount).to.eq(300);
      // expect(ref).to.eq('Attempt 3');
      // expect(blockNumber.toNumber()).to.be.greaterThan(1);
    });
  });

  describe('transferProofCount', async () => {
    beforeEach(async () => {
      // TODO: We need to find a way to be able to call this functions.
      // // Add a bunch of transfer proofs.
      // await Promise.all(['One', 'Two', 'Three'].map((value, index) => {
      //   return history.transfered(alice.address, bob.address, john.address, (index + 1) * 100, value);
      // }));
    });

    // it('counts how many transfer proofs have been stored', async () => {
    //   const subject = await history.transferProofCount();
    //   expect(subject).to.eq(3);
    // });
  });

  describe('paginateTransferProofs', async () => {
    beforeEach(async () => {
      // TODO: We need to find a way to be able to call this functions.
      // // Add a bunch of transfer proofs.
      // await Promise.all(['One', 'Two', 'Three'].map((value, index) => {
      //   return history.transfered(alice.address, bob.address, john.address, (index + 1) * 100, value);
      // }));
    });

    // it('returns the cursor to the next page', async () => {
    //   // We're testing the pagination library here... Not too good. But hey, we're in a rush.
    //   const [, cursor] = await history.paginateTransferProofs(0, 3);
    //   expect(cursor).to.eq(3);
    // });

    // it('does not crash when overflowing and returns the correct cursor', async () => {
    //   // We're testing the pagination library here... Not too good. But hey, we're in a rush.
    //   const [, cursor] = await history.paginateTransferProofs(1, 10);
    //   expect(cursor).to.eq(3);
    // });

    // it('returns the transfer proofs in the order they were added', async () => {
    //   // We're testing the pagination library here... Not too good. But hey, we're in a rush.
    //   const [[proof1, proof2, proof3],] = await history.paginateTransferProofs(0, 3);
    //   // Check all proofs in order.
    //   expect(proof1.amount).to.eq(100);
    //   expect(proof1.ref).to.eq('One');
    //   expect(proof2.amount).to.eq(200);
    //   expect(proof2.ref).to.eq('Two');
    //   expect(proof3.amount).to.eq(300);
    //   expect(proof3.ref).to.eq('Three');
    // });
  });

  describe('paginateTransferProofsByInvolvee', async () => {
    beforeEach(async () => {
      // TODO: We need to find a way to be able to call this functions.
      // // Add three transfers from bob to john performed by alice.
      // await Promise.all(['A1', 'A2', 'A3'].map((value, index) => {
      //   return history.transfered(alice.address, bob.address, john.address, (index + 1) * 100, value);
      // }));
      // // Add three transfers from john to rob performed by bob.
      // await Promise.all(['B1', 'B2'].map((value, index) => {
      //   return history.transfered(bob.address, john.address, rob.address, (index + 1) * 100, value);
      // }));
    });

    // it('returns the cursor to the next page', async () => {
    //   // We're testing the pagination library here... Not too good. But hey, we're in a rush.
    //   const [, cursor] = await history.paginateTransferProofsByInvolvee(bob.address, 0, 3);
    //   expect(cursor).to.eq(3);
    // });

    // it('does not crash when overflowing and returns the correct cursor', async () => {
    //   // We're testing the pagination library here... Not too good. But hey, we're in a rush.
    //   const [, cursor] = await history.paginateTransferProofsByInvolvee(bob.address, 1, 10);
    //   expect(cursor).to.eq(3);
    // });

    // it('counts the proofs regardless of the involvement (sender and recipient)', async () => {
    //   it('does not crash when overflowing and returns the correct cursor', async () => {
    //     const [, cursor] = await history.paginateTransferProofsByInvolvee(john.address, 1, 10);
    //     expect(cursor).to.eq(5);
    //   });
    // });

    // it('categorizes the proofs for the senders', async () => {
    //   const [proofs,] = await history.paginateTransferProofsByInvolvee(bob.address, 0, 3);
    //   // Check all proofs in order.
    //   expect(proofs[0]).to.eq(0);
    //   expect(proofs[1]).to.eq(1);
    //   expect(proofs[2]).to.eq(2);
    // });

    // it('categorizes the proofs for the recipients', async () => {
    //   const [proofs,] = await history.paginateTransferProofsByInvolvee(john.address, 0, 5);
    //   // Check all proofs in order.
    //   expect(proofs[0]).to.eq(0);
    //   expect(proofs[1]).to.eq(1);
    //   expect(proofs[2]).to.eq(2);
    //   expect(proofs[3]).to.eq(3);
    //   expect(proofs[4]).to.eq(4);
    // });
  });
});
