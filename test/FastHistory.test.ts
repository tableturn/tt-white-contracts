import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { FastRegistry, FastHistory__factory, FastHistory, Spc } from '../typechain-types';
import { FakeContract, smock } from '@defi-wonderland/smock';

// TODO: Test events.

describe('FastHistory', () => {
  let
    spcMember: SignerWithAddress,
    governor: SignerWithAddress,
    access: SignerWithAddress,
    token: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    john: SignerWithAddress;
  let reg: FakeContract<FastRegistry>;
  let historyFactory: FastHistory__factory;
  let history: FastHistory;
  let governedHistory: FastHistory;

  before(async () => {
    // Keep track of a few signers.
    [/*deployer*/, spcMember, governor, access, token, alice, bob, john] = await ethers.getSigners();

    // Deploy the libraries we need.
    const paginationLib = await (await ethers.getContractFactory('PaginationLib')).deploy();

    // Mock an SPC contract.
    const spc: FakeContract<Spc> = await smock.fake('Spc');
    // Make sure that the SPC contract returns membership flags for an address we control.
    spc.isMember.returns(false);
    spc.isMember.whenCalledWith(spcMember.address).returns(true);

    // Create a registry contract mock.
    reg = await smock.fake('FastRegistry');
    // Register a few addresses here to simulate calls from known contracts addresses.
    reg.access.returns(access.address);
    reg.token.returns(token.address);

    const historyLibs = { PaginationLib: paginationLib.address };
    historyFactory = await ethers.getContractFactory('FastHistory', { libraries: historyLibs });
  });

  beforeEach(async () => {
    history = await upgrades.deployProxy(historyFactory, [reg.address]) as FastHistory;
    governedHistory = history.connect(governor);
  });

  /// Public stuff.

  describe('initializer', async () => {
    it('keeps track of the Registry address', async () => {
      const subject = await history.reg();
      expect(subject).to.eq(reg.address);
    });
  });

  /// Public member getters.

  describe('spc', async () => {
    it('NEEDS MORE TESTS');
  });

  /// Minting proof stuff.

  describe('addMintingProof', async () => {
    it('requires that the caller is the token (anonymous)', async () => {
      const subject = history.addMintingProof(1, 'One');
      await expect(subject).to.revertedWith('Cannot be called directly');
    });

    it('requires that the caller is the token (governor)', async () => {
      const subject = governedHistory.addMintingProof(2, 'Two');
      await expect(subject).to.revertedWith('Cannot be called directly');
    });

    it('adds an entry to the minting proof list', async () => {
      const tokenedHistory = governedHistory.connect(token);
      await tokenedHistory.addMintingProof(3, 'Three');
      const [[{ amount, ref, blockNumber }],] = await history.paginateMintingProofs(0, 1);
      expect(amount).to.eq(3);
      expect(ref).to.eq('Three');
      expect(blockNumber.toNumber()).to.be.greaterThan(1);
    });
  });

  describe('mintingProofCount', async () => {
    beforeEach(async () => {
      // Add a bunch of minting proofs.
      const tokenedHistory = governedHistory.connect(token);
      await Promise.all(['One', 'Two', 'Three'].map((value, index) => {
        return tokenedHistory.addMintingProof(index, value);
      }));
    });

    it('counts how many minting proofs have been stored', async () => {
      const subject = await history.mintingProofCount();
      expect(subject).to.eq(3);
    });
  });

  describe('paginateMintingProofs', async () => {
    beforeEach(async () => {
      // Add a bunch of minting proofs.
      const tokenedHistory = governedHistory.connect(token);
      await Promise.all(['One', 'Two', 'Three'].map((value, index) => {
        return tokenedHistory.addMintingProof((index + 1) * 100, value);
      }));
    });

    it('returns the cursor to the next page', async () => {
      // We're testing the pagination library here... Not too good. But hey, we're in a rush.
      const [, cursor] = await history.paginateMintingProofs(0, 3);
      expect(cursor).to.eq(3);
    });

    it('does not crash when overflowing and returns the correct cursor', async () => {
      // We're testing the pagination library here... Not too good. But hey, we're in a rush.
      const [, cursor] = await history.paginateMintingProofs(1, 10);
      expect(cursor).to.eq(3);
    });

    it('returns the minting proofs in the order they were added', async () => {
      // We're testing the pagination library here... Not too good. But hey, we're in a rush.
      const [[proof1, proof2, proof3],] = await history.paginateMintingProofs(0, 3);
      // Check all proofs in order.
      expect(proof1.amount).to.eq(100);
      expect(proof1.ref).to.eq('One');
      expect(proof2.amount).to.eq(200);
      expect(proof2.ref).to.eq('Two');
      expect(proof3.amount).to.eq(300);
      expect(proof3.ref).to.eq('Three');
    });
  });

  /// Transfer proof stuff.

  describe('addTransferProof', async () => {
    it('requires that the caller is the token (anonymous)', async () => {
      const subject = history.addTransferProof(alice.address, bob.address, john.address, 100, 'Attempt 1');
      await expect(subject).to.revertedWith('Cannot be called directly');
    });

    it('requires that the caller is the token (governor)', async () => {
      const subject = governedHistory.addTransferProof(alice.address, bob.address, john.address, 100, 'Attempt 2');
      await expect(subject).to.revertedWith('Cannot be called directly');
    });

    it('adds an entry to the transfer proof list', async () => {
      const tokenedHistory = governedHistory.connect(token);
      tokenedHistory.addTransferProof(alice.address, bob.address, john.address, 300, 'Attempt 3');
      const [[{ spender, from, to, amount, ref, blockNumber }],] = await history.paginateTransferProofs(0, 1);
      expect(spender).to.eq(alice.address);
      expect(from).to.eq(bob.address);
      expect(to).to.eq(john.address);
      expect(amount).to.eq(300);
      expect(ref).to.eq('Attempt 3');
      expect(blockNumber.toNumber()).to.be.greaterThan(1);
    });
  });

  describe('transferProofCount', async () => {
    beforeEach(async () => {
      // Add a bunch of transfer proofs.
      const tokenedHistory = governedHistory.connect(token);
      await Promise.all(['One', 'Two', 'Three'].map((value, index) => {
        return tokenedHistory.addTransferProof(alice.address, bob.address, john.address, (index + 1) * 100, value);
      }));
    });

    it('counts how many transfer proofs have been stored', async () => {
      const subject = await history.transferProofCount();
      expect(subject).to.eq(3);
    });
  });

  describe('paginateTransferProofs', async () => {
    beforeEach(async () => {
      // Add a bunch of transfer proofs.
      const tokenedHistory = governedHistory.connect(token);
      await Promise.all(['One', 'Two', 'Three'].map((value, index) => {
        return tokenedHistory.addTransferProof(alice.address, bob.address, john.address, (index + 1) * 100, value);
      }));
    });

    it('returns the cursor to the next page', async () => {
      // We're testing the pagination library here... Not too good. But hey, we're in a rush.
      const [, cursor] = await history.paginateTransferProofs(0, 3);
      expect(cursor).to.eq(3);
    });

    it('does not crash when overflowing and returns the correct cursor', async () => {
      // We're testing the pagination library here... Not too good. But hey, we're in a rush.
      const [, cursor] = await history.paginateTransferProofs(1, 10);
      expect(cursor).to.eq(3);
    });

    it('returns the transfer proofs in the order they were added', async () => {
      // We're testing the pagination library here... Not too good. But hey, we're in a rush.
      const [[proof1, proof2, proof3],] = await history.paginateTransferProofs(0, 3);
      // Check all proofs in order.
      expect(proof1.amount).to.eq(100);
      expect(proof1.ref).to.eq('One');
      expect(proof2.amount).to.eq(200);
      expect(proof2.ref).to.eq('Two');
      expect(proof3.amount).to.eq(300);
      expect(proof3.ref).to.eq('Three');
    });
  });

  describe('paginateTransferProofsByInvolvee', async () => {

  });
});
