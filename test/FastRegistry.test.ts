import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract, ContractFactory } from 'ethers';
import { ethers, upgrades } from 'hardhat';
import { FastRegistry, FastRegistry__factory, Spc, Spc__factory } from '../typechain-types';

describe('FastRegistry', () => {
  let governor: SignerWithAddress, bob: SignerWithAddress, alice: SignerWithAddress;
  let spc: Spc;
  let regFactory: FastRegistry__factory;
  let reg: FastRegistry;
  let governedReg: FastRegistry;

  before(async () => {
    // Keep track of a few signers.
    [/*deployer*/, governor, bob, alice] = await ethers.getSigners();
    // Deploy the libraries.
    const addressSetLib = await (await ethers.getContractFactory('AddressSetLib')).deploy();
    const paginationLib = await (await ethers.getContractFactory('PaginationLib')).deploy();
    // Deploy an SPC.
    const spcLibs = { AddressSetLib: addressSetLib.address, PaginationLib: paginationLib.address };
    const spcFactory = await ethers.getContractFactory('Spc', { libraries: spcLibs });
    spc = await upgrades.deployProxy(spcFactory, [governor.address]) as Spc;
    // Cache our Registry factory.
    regFactory = await ethers.getContractFactory('FastRegistry');
  });

  beforeEach(async () => {
    reg = await upgrades.deployProxy(regFactory, [spc.address]) as FastRegistry;
    governedReg = await reg.connect(governor);
  });

  describe('initializer', async () => {
    it('keeps track of the SPC address', async () => {
      const subject = await reg.spc();
      expect(subject).to.eq(spc.address);
    });
  });

  describe('setAccessAddress', async () => {
    it('requires SPC governance', async () => {
      const subject = reg.setAccessAddress(alice.address);
      await expect(subject).to.be.revertedWith('Missing SPC governorship');
    });

    it('keeps track of the FastAccess address', async () => {
      await governedReg.setAccessAddress(alice.address);
      const subject = await reg.access();
      expect(subject).to.eq(alice.address);
    });
  });

  describe('setTokenAddress', async () => {
    it('requires SPC governance', async () => {
      const subject = reg.setTokenAddress(alice.address);
      await expect(subject).to.be.revertedWith('Missing SPC governorship');
    });

    it('keeps track of the FastToken address', async () => {
      await governedReg.setTokenAddress(alice.address);
      const subject = await reg.token();
      expect(subject).to.eq(alice.address);
    });
  });

  describe('setHistoryAddress', async () => {
    it('requires SPC governance', async () => {
      const subject = reg.setHistoryAddress(alice.address);
      await expect(subject).to.be.revertedWith('Missing SPC governorship');
    });

    it('keeps track of the FastHistory address', async () => {
      await governedReg.setHistoryAddress(alice.address);
      const subject = await reg.history();
      expect(subject).to.eq(alice.address);
    });
  });
});
