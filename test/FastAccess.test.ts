import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Spc, FastRegistry, FastAccess__factory, FastAccess } from '../typechain-types';

describe('FastAccess', () => {
  let
    deployer: SignerWithAddress,
    spcMember: SignerWithAddress,
    governor: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    rob: SignerWithAddress,
    john: SignerWithAddress;
  let reg: FastRegistry;
  let accessFactory: FastAccess__factory;
  let access: FastAccess;
  let governedAccess: FastAccess;
  let spcMemberAccess: FastAccess;

  before(async () => {
    // Keep track of a few signers.
    [deployer, spcMember, governor, alice, bob, rob, john] = await ethers.getSigners();
    // Deploy the libraries.
    const addressSetLib = await (await ethers.getContractFactory('AddressSetLib')).deploy();
    const paginationLib = await (await ethers.getContractFactory('PaginationLib')).deploy();
    // Deploy an SPC.
    const spcLibs = { AddressSetLib: addressSetLib.address, PaginationLib: paginationLib.address };
    const spcFactory = await ethers.getContractFactory('Spc', { libraries: spcLibs });
    const spc = await upgrades.deployProxy(spcFactory, [spcMember.address]) as Spc;
    // Create our Registry.
    const regFactory = await ethers.getContractFactory('FastRegistry');
    reg = await upgrades.deployProxy(regFactory, [spc.address]) as FastRegistry;
    // Finally create and cache our access factory.
    const accessLibs = { AddressSetLib: addressSetLib.address, PaginationLib: paginationLib.address };
    accessFactory = await ethers.getContractFactory('FastAccess', { libraries: accessLibs });
  });

  beforeEach(async () => {
    access = await upgrades.deployProxy(accessFactory, [reg.address, governor.address]) as FastAccess;
    await Promise.all([

    ]);
    governedAccess = access.connect(governor);
    spcMemberAccess = access.connect(spcMember);
    // Add our access contract to our registry.
    await reg.connect(spcMember).setAccessAddress(access.address);
  });

  /// Public stuff.

  describe('initialize', async () => {
    it('keeps track of the Registry address', async () => {
      const subject = await access.reg();
      expect(subject).to.eq(reg.address);
    });

    it('adds the governor parameter as a member', async () => {
      const subject = await access.isMember(governor.address);
      expect(subject).to.eq(true);
    });

    it('adds the governor parameter as a governor', async () => {
      const subject = await access.isGovernor(governor.address);
      expect(subject).to.eq(true);
    });
  });

  /// Governorship related stuff.

  describe('addGovernor', async () => {
    it('requires SPC governance (anonymous)', async () => {
      const subject = access.addGovernor(alice.address);
      // Check that the registry
      await expect(subject).to.revertedWith('Missing SPC membership');
    });

    it('requires SPC governance (governor)', async () => {
      const subject = governedAccess.addGovernor(alice.address);
      await expect(subject).to.revertedWith('Missing SPC membership');
    });

    it('requires that the address is not a governor yet', async () => {
      await spcMemberAccess.addGovernor(alice.address)
      const subject = spcMemberAccess.addGovernor(alice.address);
      await expect(subject).to.revertedWith('Address already in set');
    });

    it('adds the given address as a governor', async () => {
      await spcMemberAccess.addGovernor(alice.address);
      const subject = await access.isGovernor(alice.address);
      expect(subject).to.eq(true);
    });
  });

  describe('removeGovernor', async () => {
    beforeEach(async () => {
      await spcMemberAccess.addGovernor(alice.address);
    });

    it('requires SPC governance (anonymous)', async () => {
      const subject = access.removeGovernor(alice.address);
      await expect(subject).to.revertedWith('Missing SPC membership');
    });

    it('requires SPC governance (governor)', async () => {
      const subject = governedAccess.removeGovernor(alice.address);
      await expect(subject).to.revertedWith('Missing SPC membership');
    });

    it('requires that the address is an existing governor', async () => {
      const subject = spcMemberAccess.removeGovernor(bob.address);
      await expect(subject).to.revertedWith('Address does not exist in set');
    });

    it('removes the given address as a governor', async () => {
      await spcMemberAccess.removeGovernor(alice.address);
      const subject = await access.isGovernor(alice.address);
      expect(subject).to.eq(false);
    });
  });

  describe('isGovernor', async () => {
    beforeEach(async () => {
      await spcMemberAccess.addGovernor(alice.address);
    });

    it('returns true when the address is a governor', async () => {
      const subject = await access.isGovernor(alice.address);
      expect(subject).to.eq(true);
    });

    it('returns false when the address is not a governor', async () => {
      const subject = await access.isGovernor(bob.address);
      expect(subject).to.eq(false);
    });
  });

  describe('governorCount', async () => {
    beforeEach(async () => {
      await spcMemberAccess.addGovernor(alice.address);
    });

    it('returns the current count of governors', async () => {
      const subject = await access.governorCount();
      expect(subject).to.eq(2);
    });
  });

  describe('paginateGovernors', async () => {
    beforeEach(async () => {
      // Add 4 governors - so there is a total of 5.
      await spcMemberAccess.addGovernor(alice.address);
      await spcMemberAccess.addGovernor(bob.address);
      await spcMemberAccess.addGovernor(john.address);
      await spcMemberAccess.addGovernor(rob.address);
    });

    it('returns the cursor to the next page', async () => {
      // We're testing the pagination library here... Not too good. But hey, we're in a rush.
      const [, cursor] = await access.paginateGovernors(0, 3);
      expect(cursor).to.eq(3);
    });

    it('does not crash when overflowing and returns the correct cursor', async () => {
      // We're testing the pagination library here... Not too good. But hey, we're in a rush.
      const [, cursor] = await access.paginateGovernors(1, 10);
      expect(cursor).to.eq(5);
    });

    it('returns the governors in the order they were added', async () => {
      // We're testing the pagination library here... Not too good. But hey, we're in a rush.
      const [values,] = await access.paginateGovernors(0, 5);
      expect(values).to.have.ordered.members([
        governor.address,
        alice.address,
        bob.address,
        john.address,
        rob.address
      ]);
    });
  });

  /// Membership related stuff.

  describe('addMember', async () => {
    it('requires governance (anonymous)', async () => {
      const subject = access.addMember(alice.address);
      await expect(subject).to.revertedWith('Missing governorship');
    });

    it('requires governance (SPC governor)', async () => {
      const subject = spcMemberAccess.addMember(alice.address);
      await expect(subject).to.revertedWith('Missing governorship');
    });

    it('requires that the address is not a member yet', async () => {
      await governedAccess.addMember(alice.address)
      const subject = governedAccess.addMember(alice.address);
      await expect(subject).to.revertedWith('Address already in set');
    });

    it('adds the given address as a member', async () => {
      await governedAccess.addMember(alice.address);
      const subject = await access.isMember(alice.address);
      expect(subject).to.eq(true);
    });
  });

  describe('removeMember', async () => {
    beforeEach(async () => {
      await governedAccess.addMember(alice.address);
    });

    it('requires governance (anonymous)', async () => {
      const subject = access.removeMember(alice.address);
      await expect(subject).to.revertedWith('Missing governorship');
    });

    it('requires governance (SPC governor)', async () => {
      const subject = spcMemberAccess.removeMember(alice.address);
      await expect(subject).to.revertedWith('Missing governorship');
    });

    it('requires that the address is an existing member', async () => {
      const subject = governedAccess.removeMember(bob.address);
      await expect(subject).to.revertedWith('Address does not exist in set');
    });

    it('removes the given address as a member', async () => {
      await governedAccess.removeMember(alice.address);
      const subject = await access.isMember(alice.address);
      expect(subject).to.eq(false);
    });
  });

  describe('isMember', async () => {
    beforeEach(async () => {
      await governedAccess.addMember(alice.address);
    });

    it('returns true when the address is a member', async () => {
      const subject = await access.isMember(alice.address);
      expect(subject).to.eq(true);
    });

    it('returns false when the address is not a member', async () => {
      const subject = await access.isMember(bob.address);
      expect(subject).to.eq(false);
    });
  });

  describe('memberCount', async () => {
    beforeEach(async () => {
      await governedAccess.addMember(alice.address);
    });

    it('returns the current count of members', async () => {
      const subject = await access.memberCount();
      expect(subject).to.eq(2);
    });
  });

  describe('paginateMembers', async () => {
    beforeEach(async () => {
      // Add 4 governors - so there is a total of 5.
      await governedAccess.addMember(alice.address);
      await governedAccess.addMember(bob.address);
      await governedAccess.addMember(john.address);
      await governedAccess.addMember(rob.address);
    });

    it('returns the cursor to the next page', async () => {
      // We're testing the pagination library here... Not too good. But hey, we're in a rush.
      const [, cursor] = await access.paginateMembers(0, 3);
      expect(cursor).to.eq(3);
    });

    it('does not crash when overflowing and returns the correct cursor', async () => {
      // We're testing the pagination library here... Not too good. But hey, we're in a rush.
      const [, cursor] = await access.paginateMembers(1, 10);
      expect(cursor).to.eq(5);
    });

    it('returns the governors in the order they were added', async () => {
      // We're testing the pagination library here... Not too good. But hey, we're in a rush.
      const [values,] = await access.paginateMembers(0, 5);
      expect(values).to.have.ordered.members([
        governor.address,
        alice.address,
        bob.address,
        john.address,
        rob.address
      ]);
    });
  });

  /// Flags.

  describe('flags', async () => {
    it('is accurate when all flags set', async () => {
      const { isGovernor, isMember } = await access.flags(governor.address);
      expect(isGovernor).to.eq(true);
      expect(isMember).to.eq(true);
    });

    it('is accurate when only isGovernor is set', async () => {
      await spcMemberAccess.addGovernor(alice.address);
      const { isGovernor, isMember } = await access.flags(alice.address);
      expect(isGovernor).to.eq(true);
      expect(isMember).to.eq(false);
    });

    it('is accurate when only isMember is set', async () => {
      await governedAccess.addMember(alice.address);
      const { isGovernor, isMember } = await access.flags(alice.address);
      expect(isGovernor).to.eq(false);
      expect(isMember).to.eq(true);
    });

    it('is accurate when no flags are set', async () => {
      const { isGovernor, isMember } = await access.flags(alice.address);
      expect(isGovernor).to.eq(false);
      expect(isMember).to.eq(false);
    });
  });
});
