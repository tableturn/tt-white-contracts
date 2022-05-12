import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Spc__factory, Spc, FastRegistry__factory, FastRegistry } from '../typechain-types';

// TODO: Test events.

describe('FastRegistry', () => {
  let spcMember: SignerWithAddress, governor: SignerWithAddress, bob: SignerWithAddress, alice: SignerWithAddress;
  let spc: Spc;
  let regFactory: FastRegistry__factory;
  let reg: FastRegistry;
  let spcMemberReg: FastRegistry;

  before(async () => {
    // TODO: Replace most of this setup with mocks if possible.
    // Keep track of a few signers.
    [/*deployer*/, spcMember, governor, bob, alice] = await ethers.getSigners();
    // Deploy the libraries.
    const addressSetLib = await (await ethers.getContractFactory('AddressSetLib')).deploy();
    const paginationLib = await (await ethers.getContractFactory('PaginationLib')).deploy();
    const helpersLib = await (await ethers.getContractFactory('HelpersLib')).deploy();
    // Deploy an SPC.
    const spcLibs = { AddressSetLib: addressSetLib.address, PaginationLib: paginationLib.address, HelpersLib: helpersLib.address };
    const spcFactory = await ethers.getContractFactory('Spc', { libraries: spcLibs }) as Spc__factory;
    spc = await upgrades.deployProxy(spcFactory, [spcMember.address]) as Spc;
    // Cache our Registry factory.
    const regLibs = { HelpersLib: helpersLib.address };
    regFactory = await ethers.getContractFactory('FastRegistry', { libraries: regLibs });
  });

  beforeEach(async () => {
    reg = await upgrades.deployProxy(regFactory, [spc.address]) as FastRegistry;
    spcMemberReg = reg.connect(spcMember);
  });

  describe('initialize', async () => {
    it('keeps track of the SPC address', async () => {
      const subject = await reg.spc();
      expect(subject).to.eq(spc.address);
    });
  });

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
