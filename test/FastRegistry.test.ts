import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Spc, FastRegistry__factory, FastRegistry } from '../typechain-types';
import { FakeContract, smock } from '@defi-wonderland/smock';
import { toHexString } from '../src/utils';
import { negNinety, negOneHundred, negTwo, ninety, oneHundred, ten, two } from './utils';

// TODO: Test events.

describe('FastRegistry', () => {
  let
    deployer: SignerWithAddress,
    spcMember: SignerWithAddress,
    alice: SignerWithAddress;
  let spc: FakeContract<Spc>;
  let regFactory: FastRegistry__factory;
  let reg: FastRegistry;
  let spcMemberReg: FastRegistry;

  before(async () => {
    // Keep track of a few signers.
    [deployer, spcMember, alice] = await ethers.getSigners();
    // Deploy the libraries.
    const helpersLib = await (await ethers.getContractFactory('HelpersLib')).deploy();

    spc = await smock.fake('Spc');
    spc.isMember.returns(false);
    spc.isMember.whenCalledWith(spcMember.address).returns(true);

    // Cache our Registry factory.
    const regLibs = { HelpersLib: helpersLib.address };
    regFactory = await ethers.getContractFactory('FastRegistry', { libraries: regLibs });
  });

  beforeEach(async () => {
    reg = await upgrades.deployProxy(regFactory, [spc.address]) as FastRegistry;
    spcMemberReg = reg.connect(spcMember);
  });

  /// Public stuff.

  describe('initialize', async () => {
    it('keeps track of the SPC address', async () => {
      const subject = await reg.spc();
      expect(subject).to.eq(spc.address);
    });
  });

  /// Public member getters.

  describe('spc', async () => {
    it('NEEDS MORE TESTS');
  });

  describe('access', async () => {
    it('NEEDS MORE TESTS');
  });

  describe('history', async () => {
    it('NEEDS MORE TESTS');
  });

  describe('token', async () => {
    it('NEEDS MORE TESTS');
  });

  /// Eth provisioning stuff.

  describe('provisionWithEth', async () => {
    it('reverts when no Eth is attached', async () => {
      const subject = reg.provisionWithEth();
      await expect(subject).to.be.revertedWith('Missing attached ETH');
    });

    it('is payable and keeps the attached Eth', async () => {
      const subject = async () => await reg.provisionWithEth({ value: ninety });
      await expect(subject).to.have.changeEtherBalance(reg, ninety);
    });
  });

  describe('drainEth', async () => {
    it('requires SPC membership', async () => {
      const subject = reg.drainEth();
      await expect(subject).to.be.revertedWith('Missing SPC membership');
    });

    it('transfers all the locked Eth to the caller', async () => {
      // Provision the SPC account with 1_000_000 Eth.
      await ethers.provider.send("hardhat_setBalance", [reg.address, toHexString(oneHundred)]);
      // Do it!
      const subject = async () => await spcMemberReg.drainEth();
      await expect(subject).to.changeEtherBalances([reg, spcMember], [negOneHundred, oneHundred]);
    });
  });

  describe('payUpTo', async () => {
    it('only tops-up the member if they already have eth', async () => {
      // Set alice's wallet to just one eth.
      await ethers.provider.send("hardhat_setBalance", [reg.address, toHexString(oneHundred)]);
      await ethers.provider.send("hardhat_setBalance", [alice.address, toHexString(ten)]);
      // Do it!
      await spcMemberReg.setAccessAddress(deployer.address);
      const subject = async () => await reg.payUpTo(alice.address, oneHundred);
      // Check balances.
      await expect(subject).to.changeEtherBalances([reg, alice], [negNinety, ninety]);
    });

    it('only provisions the member up to the available balance', async () => {
      // Put 200 wei in the SPC contract, 500 wei in alice's wallet.
      await ethers.provider.send("hardhat_setBalance", [reg.address, toHexString(two)]);
      await ethers.provider.send("hardhat_setBalance", [alice.address, '0x0']);
      // Do it!
      await spcMemberReg.setAccessAddress(deployer.address);
      const subject = async () => await reg.payUpTo(alice.address, ten);
      // Check balances.
      await expect(subject).to.changeEtherBalances([reg, alice], [negTwo, two]);
    });
  });

  /// Contract setters.

  describe('setAccessAddress', async () => {
    it('requires SPC membership', async () => {
      const subject = reg.setAccessAddress(alice.address);
      await expect(subject).to.be.revertedWith('Missing SPC membership');
    });

    it('keeps track of the FastAccess address', async () => {
      await spcMemberReg.setAccessAddress(alice.address);
      const subject = await reg.access();
      expect(subject).to.eq(alice.address);
    });
  });

  describe('setTokenAddress', async () => {
    it('requires SPC membership', async () => {
      const subject = reg.setTokenAddress(alice.address);
      await expect(subject).to.be.revertedWith('Missing SPC membership');
    });

    it('keeps track of the FastToken address', async () => {
      await spcMemberReg.setTokenAddress(alice.address);
      const subject = await reg.token();
      expect(subject).to.eq(alice.address);
    });
  });

  describe('setHistoryAddress', async () => {
    it('requires SPC membership', async () => {
      const subject = reg.setHistoryAddress(alice.address);
      await expect(subject).to.be.revertedWith('Missing SPC membership');
    });

    it('keeps track of the FastHistory address', async () => {
      await spcMemberReg.setHistoryAddress(alice.address);
      const subject = await reg.history();
      expect(subject).to.eq(alice.address);
    });
  });
});
