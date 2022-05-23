import * as chai from 'chai';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers, upgrades } from 'hardhat';
import { FakeContract, smock } from '@defi-wonderland/smock';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { FastRegistry, FastAccess, FastToken, FastToken__factory, FastHistory } from '../typechain-types';
import { toHexString, ZERO_ADDRESS, ZERO_ACCOUNT_MOCK } from '../src/utils';
import { oneMilion } from './utils';

chai.use(smock.matchers);

const ERC20_TOKEN_NAME = 'Random FAST Token';
const ERC20_TOKEN_SYMBOL = 'RFT';
const ERC20_TOKEN_DECIMALS = 18;

// Restriction codes.
const INSUFICIENT_TRANSFER_CREDITS = 1;
const SENDER_NOT_MEMBER = 2;
const RECIPIENT_NOT_MEMBER = 3;
const SENDER_SAME_AS_RECIPIENT = 4;
// Restriction messages.
const INSUFICIENT_TRANSFER_CREDITS_MESSAGE = 'Insuficient transfer credits';
const SENDER_NOT_MEMBER_MESSAGE = 'Missing sender membership';
const RECIPIENT_NOT_MEMBER_MESSAGE = 'Missing recipient membership';
const SENDER_SAME_AS_RECIPIENT_MESSAGE = 'Identical sender and recipient';


describe('FastToken', () => {
  let
    spcMember: SignerWithAddress,
    governor: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    john: SignerWithAddress,
    anonymous: SignerWithAddress;
  let
    reg: FakeContract<FastRegistry>,
    access: FakeContract<FastAccess>,
    history: FakeContract<FastHistory>,
    tokenFactory: FastToken__factory,
    token: FastToken,
    governedToken: FastToken,
    spcMemberToken: FastToken;

  before(async () => {
    // Keep track of a few signers.
    [/*deployer*/, spcMember, governor, alice, bob, john, anonymous] = await ethers.getSigners();
    // Deploy the libraries.
    const addressSetLib = await (await ethers.getContractFactory('AddressSetLib')).deploy();
    const paginationLib = await (await ethers.getContractFactory('PaginationLib')).deploy();

    reg = await smock.fake('FastRegistry');

    // Create an SPC mock.
    const spc = await smock.fake('Spc');
    // Configure SPC memberships with our SPC mock.
    spc.isMember.returns(false);
    spc.isMember.whenCalledWith(spcMember.address).returns(true);
    // Make sure our registry mock keeps track of the SPC mock address.
    reg.spc.returns(spc.address);

    // Create an access contract mock.
    access = await smock.fake('FastAccess');
    // Make sure the access mock can return the address of our registry.
    access.reg.returns(reg.address);
    // Configure governorship in our access mock.
    access.isGovernor.returns(false);
    access.isGovernor.whenCalledWith(governor.address).returns(true);
    // Configure membbership into our access contract.
    access.isMember.returns(false);
    [alice, bob, john].forEach(
      ({ address }) => access.isMember.whenCalledWith(address).returns(true)
    );
    // Make sure that our registry mock keeps track of the access mock address.
    reg.access.returns(access.address);

    // Create a history contract mock.
    history = await smock.fake('FastHistory');
    // Make sure that our registry mock is tracking the history mock address.
    reg.history.returns(history.address);

    // Finally, create our token factory.
    const tokenLibs = { AddressSetLib: addressSetLib.address, PaginationLib: paginationLib.address };
    tokenFactory = await ethers.getContractFactory('FastToken', { libraries: tokenLibs });
  });

  beforeEach(async () => {
    const tokenParams = [reg.address, ERC20_TOKEN_NAME, ERC20_TOKEN_SYMBOL, ERC20_TOKEN_DECIMALS, true];
    token = await upgrades.deployProxy(tokenFactory, tokenParams) as FastToken;
    governedToken = token.connect(governor);
    spcMemberToken = token.connect(spcMember);
    await reg.connect(spcMember).setTokenAddress(token.address);
  });

  /// Public stuff.

  describe('initialize', async () => {
    it('keeps track of the Registry address', async () => {
      const subject = await token.reg();
      expect(subject).to.eq(reg.address);
    });

    it('keeps track of the ERC20 parameters and extra ones', async () => {
      const name = await token.name();
      expect(name).to.eq(ERC20_TOKEN_NAME);

      const symbol = await token.symbol();
      expect(symbol).to.eq(ERC20_TOKEN_SYMBOL);

      const decimals = await token.decimals();
      expect(decimals).to.eq(ERC20_TOKEN_DECIMALS);

      const transferCredits = await token.transferCredits();
      expect(transferCredits).to.eq(0);
    });
  });

  /// Public member getters.

  describe('reg', async () => {
    it('returns the registry address', async () => {
      const subject = await token.reg();
      expect(subject).to.eq(reg.address);
    });
  });

  describe('name', async () => {
    it('returns the name', async () => {
      const subject = await token.name();
      expect(subject).to.eq(ERC20_TOKEN_NAME);
    });
  });

  describe('symbol', async () => {
    it('returns the symbol', async () => {
      const subject = await token.symbol();
      expect(subject).to.eq(ERC20_TOKEN_SYMBOL);
    });
  });

  describe('decimals', async () => {
    it('returns the decimals', async () => {
      const subject = await token.decimals();
      expect(subject).to.eq(ERC20_TOKEN_DECIMALS);
    });
  });

  describe('totalSupply', async () => {
    it('returns the total supply', async () => {
      const subject = await token.totalSupply();
      expect(subject).to.eq(0);
    });
  });

  describe('transferCredits', async () => {
    it('returns the remaining transfer credits', async () => {
      const subject = await token.transferCredits();
      expect(subject).to.eq(0);
    });
  });

  describe('hasFixedSupply', async () => {
    it('returns the token fixed supply parameter', async () => {
      const subject = await token.hasFixedSupply();
      expect(subject).to.eq(true);
    });
  });

  /// Other stuff.

  describe('setHasFixedSupply', async () => {
    it('requires SPC membership (anonymous)', async () => {
      const subject = token.setHasFixedSupply(true);
      await expect(subject).to.be.revertedWith('Missing SPC membership');
    });

    it('requires SPC membership (member)', async () => {
      const subject = token.connect(alice).setHasFixedSupply(true);
      await expect(subject).to.be.revertedWith('Missing SPC membership');
    });

    it('requires SPC membership (governor)', async () => {
      const subject = governedToken.setHasFixedSupply(true);
      await expect(subject).to.be.revertedWith('Missing SPC membership');
    });

    it('toggles the status flag', async () => {
      // Toggle to true.
      await spcMemberToken.setHasFixedSupply(true);
      expect(await token.hasFixedSupply()).to.be.true;
      // Toggle to false.
      await spcMemberToken.setHasFixedSupply(false);
      expect(await token.hasFixedSupply()).to.be.false;
      // Toggle to true.
      await spcMemberToken.setHasFixedSupply(true);
      expect(await token.hasFixedSupply()).to.be.true;
    });
  });

  describe('mint', async () => {
    beforeEach(async () => {
      history.minted.reset();
    });

    it('requires SPC membership (anonymous)', async () => {
      const subject = token.mint(5_000, 'Attempt 1');
      await expect(subject).to.have
        .revertedWith('Missing SPC membership');
    });

    it('requires SPC membership (member)', async () => {
      const subject = token.connect(alice).mint(5_000, 'Attempt 1');
      await expect(subject).to.have
        .revertedWith('Missing SPC membership');
    });

    it('requires SPC membership (governor)', async () => {
      const subject = governedToken.mint(5_000, 'Attempt 1');
      await expect(subject).to.have
        .revertedWith('Missing SPC membership');
    });

    describe('with fixed supply', async () => {
      it('is allowed only once', async () => {
        await spcMemberToken.mint(1_000_000, 'Attempt 1');
        const subject = spcMemberToken.mint(1_000_000, 'Attempt 2');
        await expect(subject).to.have
          .revertedWith('Minting not possible at this time');
      });
    });

    describe('with continuous supply', async () => {
      beforeEach(async () => {
        await token.connect(spcMember).setHasFixedSupply(false);
        history.minted.reset();
      });

      it('is allowed more than once', async () => {
        const subject = () => Promise.all([
          spcMemberToken.mint(1_000_000, 'Attempt 1'),
          spcMemberToken.mint(1_000_000, 'Attempt 2')
        ]);
        await expect(subject).to
          .changeTokenBalance(token, ZERO_ACCOUNT_MOCK, 2_000_000);
      });
    });

    it('delegates to the history contract', async () => {
      await spcMemberToken.mint(5_000, 'Attempt 1');
      const args = history.minted.getCall(0).args as any;
      expect(args.amount).to.eq(5_000);
      expect(args.ref).to.eq('Attempt 1');
    });

    it('adds the minted tokens to the zero address', async () => {
      await spcMemberToken.mint(3_000, 'Attempt 1');
      const subject = await token.balanceOf(ZERO_ADDRESS);
      expect(subject).to.eq(3_000);
    });

    it('does not impact total supply', async () => {
      await spcMemberToken.mint(3_000, 'Attempt 1');
      const subject = await token.totalSupply();
      expect(subject).to.eq(0);
    });

    it('emits a Minted event', async () => {
      const subject = spcMemberToken.mint(3_000, 'Attempt 1');
      await expect(subject).to
        .emit(token, 'Minted')
        .withArgs(3_000, 'Attempt 1');
    });
  });

  describe('burn', async () => {
    beforeEach(async () => {
      history.burnt.reset();
      await spcMemberToken.setHasFixedSupply(false);
      await spcMemberToken.mint(100, 'A hundred mints');
    });

    it('requires SPC membership (anonymous)', async () => {
      const subject = token.burn(5, 'Burn baby burn');
      await expect(subject).to.have
        .revertedWith('Missing SPC membership');
    });

    it('requires SPC membership (member)', async () => {
      const subject = token.connect(alice).burn(5, 'Burn baby burn');
      await expect(subject).to.have
        .revertedWith('Missing SPC membership');
    });

    it('requires SPC membership (governor)', async () => {
      const subject = governedToken.burn(5, 'Burn baby burn');
      await expect(subject).to.have
        .revertedWith('Missing SPC membership');
    });

    it('requires that the supply is continuous', async () => {
      await spcMemberToken.setHasFixedSupply(true);
      const subject = spcMemberToken.burn(5, 'Burn baby burn')
      await expect(subject).to.have
        .revertedWith('Burning not possible at this time');
    });

    it('requires that the zero address has enough funds', async () => {
      const subject = spcMemberToken.burn(101, 'Burn baby burn')
      await expect(subject).to.have
        .revertedWith('Insuficient funds');
    });

    it('removes tokens from the zero address', async () => {
      const subject = async () => spcMemberToken.burn(30, 'Burn baby burn')
      await expect(subject).to
        .changeTokenBalance(token, ZERO_ACCOUNT_MOCK, -30)
    });

    it('does not impact total supply', async () => {
      const totalSupplyBefore = await token.totalSupply();
      await spcMemberToken.burn(100, 'Burnidy burn');
      const subject = await token.totalSupply();
      expect(subject).to.eq(totalSupplyBefore);
    });

    it('delegates to the history contract', async () => {
      await spcMemberToken.burn(50, 'It is hot');
      const args = history.burnt.getCall(0).args as any;
      expect(args.amount).to.eq(50);
      expect(args.ref).to.eq('It is hot');
    });

    it('emits a Burnt event', async () => {
      const subject = spcMemberToken.burn(50, 'Feel the burn');
      await expect(subject).to
        .emit(token, 'Burnt')
        .withArgs(50, 'Feel the burn');
    });
  });

  /// Tranfer Credit management.

  describe('addTransferCredits', async () => {
    it('requires SPC membership (anonymous)', async () => {
      const subject = token.addTransferCredits(10);
      await expect(subject).to.have
        .revertedWith('Missing SPC membership');
    });

    it('requires SPC membership (member)', async () => {
      const subject = token.connect(alice).addTransferCredits(10);
      await expect(subject).to.have
        .revertedWith('Missing SPC membership');
    });

    it('requires SPC membership (governor)', async () => {
      const subject = governedToken.addTransferCredits(10);
      await expect(subject).to.have
        .revertedWith('Missing SPC membership');
    });

    it('accumulates the credits to the existing transfer credits', async () => {
      await Promise.all([10, 20, 30, 40].map(async (value) =>
        spcMemberToken.addTransferCredits(value)
      ));
      expect(await token.transferCredits()).to.eq(100);
    });

    it('emits a TransferCreditsAdded event', async () => {
      const subject = spcMemberToken.addTransferCredits(50);
      await expect(subject).to
        .emit(token, 'TransferCreditsAdded')
        .withArgs(spcMember.address, 50);
    });
  });

  describe('drainTransferCredits', async () => {
    it('requires SPC membership (anonymous)', async () => {
      const subject = token.drainTransferCredits();
      await expect(subject).to.have
        .revertedWith('Missing SPC membership');
    });

    it('requires SPC membership (member)', async () => {
      const subject = token.connect(alice).drainTransferCredits();
      await expect(subject).to.have
        .revertedWith('Missing SPC membership');
    });

    it('requires SPC membership (governor)', async () => {
      const subject = governedToken.drainTransferCredits();
      await expect(subject).to.have
        .revertedWith('Missing SPC membership');
    });

    it('sets the credit amount to zero', async () => {
      await spcMemberToken.addTransferCredits(100);
      await spcMemberToken.drainTransferCredits();
      expect(await token.transferCredits()).to.eq(0);
    });

    it('emits a TransferCreditsDrained event', async () => {
      const creditsBefore = await token.transferCredits();
      const subject = spcMemberToken.drainTransferCredits();
      await expect(subject).to
        .emit(token, 'TransferCreditsDrained')
        .withArgs(spcMember.address, creditsBefore);
    });
  });

  /// ERC20 implementation.

  describe('ERC20', async () => {
    beforeEach(async () => {
      // Mint a few tokens and raise the transfer credits.
      await Promise.all([
        spcMemberToken.mint(1_000_000, 'ERC20 Tests'),
        spcMemberToken.addTransferCredits(1_000_000)
      ]);
      // Transfer tokens from address zero to alice and bob.
      await Promise.all([alice, bob].map(
        async ({ address }) => governedToken.transferFrom(ZERO_ADDRESS, address, 100)
      ));
    });

    describe('balanceOf', async () => {
      it('returns the amount of tokens at a given address', async () => {
        const subject = await token.balanceOf(alice.address);
        expect(subject).to.eq(100);
      });
    });

    describe('transfer', async () => {
      beforeEach(async () => {
        // Reset our history mock.
        history.transfered.reset();
      });

      // `transfer` specific.

      it('requires sender membership', async () => {
        const subject = token.transfer(bob.address, 100);
        await expect(subject).to.have
          .revertedWith(SENDER_NOT_MEMBER_MESSAGE);
      });

      it('requires recipient membership', async () => {
        const subject = token.connect(alice).transfer(anonymous.address, 100);
        await expect(subject).to.have
          .revertedWith(RECIPIENT_NOT_MEMBER_MESSAGE);
      });

      it('requires that the sender and recipient are different', async () => {
        const subject = token.connect(bob).transfer(bob.address, 101);
        await expect(subject).to.have
          .revertedWith(SENDER_SAME_AS_RECIPIENT_MESSAGE);
      });

      it('requires sufficient funds', async () => {
        const subject = token.connect(bob).transfer(alice.address, 101);
        await expect(subject).to.have
          .revertedWith('Insuficient funds');
      });

      it('requires sufficient transfer credits', async () => {
        // Drain all credits, and provision some more.
        await spcMemberToken.drainTransferCredits();
        await spcMemberToken.addTransferCredits(90);
        // Do it!
        const subject = token.connect(alice).transfer(bob.address, 100);
        await expect(subject).to.be.revertedWith(INSUFICIENT_TRANSFER_CREDITS_MESSAGE);
      });

      it('transfers from / to the given wallet address', async () => {
        const subject = () => token.connect(alice).transfer(bob.address, 100);
        await expect(subject).to
          .changeTokenBalances(token, [alice, bob], [-100, 100]);
      });

      it('delegates to the history contract', async () => {
        await token.connect(alice).transfer(bob.address, 12)
        const args = history.transfered.getCall(0).args as any;
        expect(args.spender).to.eq(alice.address);
        expect(args.from).to.eq(alice.address);
        expect(args.to).to.eq(bob.address);
        expect(args.amount).to.eq(12);
        expect(args.ref).to.eq('Unspecified - via ERC20');
      });

      it('decreases total supply when transferring to the zero address', async () => {
        // Keep total supply.
        const supplyBefore = await token.totalSupply();
        // Do it!
        await token.connect(alice).transfer(ZERO_ADDRESS, 100);
        // Check that total supply decreased.
        expect(await token.totalSupply()).to.eql(supplyBefore.add(-100));
      });

      it('emits a IERC20.Transfer event', async () => {
        const subject = token.connect(alice).transfer(bob.address, 98);
        await expect(subject).to
          .emit(token, 'Transfer')
          .withArgs(alice.address, bob.address, 98);
      });
    });

    describe('transferWithRef', async () => {
      beforeEach(async () => {
        history.transfered.reset();
      });

      // IMPORTANT:
      // All these tests have the exact same rules as for `transfer`, same
      // order, same everything **please**.

      it('requires sender membership', async () => {
        const subject = token.transferWithRef(bob.address, 100, 'One');
        await expect(subject).to.have
          .revertedWith(SENDER_NOT_MEMBER_MESSAGE);
      });

      it('requires recipient membership', async () => {
        const subject = token.connect(alice).transferWithRef(anonymous.address, 100, 'Two');
        await expect(subject).to.have
          .revertedWith(RECIPIENT_NOT_MEMBER_MESSAGE);
      });

      it('requires that the sender and recipient are different', async () => {
        const subject = token.connect(bob).transferWithRef(bob.address, 101, 'No!');
        await expect(subject).to.have
          .revertedWith(SENDER_SAME_AS_RECIPIENT_MESSAGE);
      });

      it('requires sufficient funds', async () => {
        const subject = token.connect(bob).transferWithRef(alice.address, 101, 'Three');
        await expect(subject).to.have
          .revertedWith('Insuficient funds');
      });

      it('requires sufficient transfer credits', async () => {
        // Drain all credits, and provision some more.
        await spcMemberToken.drainTransferCredits();
        await spcMemberToken.addTransferCredits(90);
        // Do it!
        const subject = token.connect(alice).transferWithRef(bob.address, 100, 'Four');
        await expect(subject).to.be.revertedWith(INSUFICIENT_TRANSFER_CREDITS_MESSAGE);
      });

      it('transfers from / to the given wallet address', async () => {
        const subject = () => token.connect(alice).transferWithRef(bob.address, 100, 'Five');
        await expect(subject).to
          .changeTokenBalances(token, [alice, bob], [-100, 100]);
      });

      it('delegates to the history contract', async () => {
        await token.connect(alice).transferWithRef(bob.address, 12, 'Six')
        const args = history.transfered.getCall(0).args as any;
        expect(args.spender).to.eq(alice.address);
        expect(args.from).to.eq(alice.address);
        expect(args.to).to.eq(bob.address);
        expect(args.amount).to.eq(12);
        expect(args.ref).to.eq('Six');
      });

      it('decreases total supply when transferring to the zero address', async () => {
        // Keep total supply.
        const supplyBefore = await token.totalSupply();
        // Do it!
        await token.connect(alice).transferWithRef(ZERO_ADDRESS, 100, 'Six and a half?');
        // Check that total supply decreased.
        expect(await token.totalSupply()).to.eql(supplyBefore.add(-100));
      });

      it('emits a IERC20.Transfer event', async () => {
        const subject = token.connect(alice).transferWithRef(bob.address, 98, 'Seven');
        await expect(subject).to
          .emit(token, 'Transfer')
          .withArgs(alice.address, bob.address, 98);
      });
    });

    describe('allowance', async () => {
      it('returns the allowance for a given member', async () => {
        // Let bob give allowance to alice.
        await token.connect(bob).approve(alice.address, 50);
        // Do it!
        const subject = await token.allowance(bob.address, alice.address);
        expect(subject).to.eq(50);
      });

      it('follows value at zero address for governors', async () => {
        let subject: BigNumber;
        // Make the token continuous supply.
        await spcMemberToken.setHasFixedSupply(false);
        // Check the balance.
        const allocated = await token.balanceOf(ZERO_ADDRESS);
        subject = await token.allowance(ZERO_ADDRESS, governor.address);
        expect(subject).to.eq(allocated);

        // Mint some more.
        spcMemberToken.mint(50, 'Adding some more');
        subject = await token.allowance(ZERO_ADDRESS, governor.address);
        expect(subject).to.eq(allocated.add(50));

      });
    });

    describe('approve', async () => {
      it('requires that the sender is a member', async () => {
        const subject = token.approve(bob.address, 40);
        await expect(subject).to.have
          .revertedWith(SENDER_NOT_MEMBER_MESSAGE);
      });

      it('adds an allowance with the correct parameters', async () => {
        // Let alice give allowance to bob.
        await token.connect(alice).approve(bob.address, 50);
        // Do it!
        const subject = await token.allowance(alice.address, bob.address);
        expect(subject).to.eq(50);
      });

      it('stacks up new allowances', async () => {
        // Let alice give allowance to bob. twice
        await token.connect(alice).approve(bob.address, 10);
        await token.connect(alice).approve(bob.address, 20);
        const subject = await token.allowance(alice.address, bob.address);
        expect(subject).to.eq(30);
      });

      it('keeps track of given allowances', async () => {
        await token.connect(alice).approve(bob.address, 10);
        const [[a1], /*cursor*/] = await token.paginateAllowancesByOwner(alice.address, 0, 5);
        expect(a1).to.eq(bob.address);
      });

      it('keeps track of received allowances', async () => {
        await token.connect(alice).approve(bob.address, 10);
        const [[a1], /*cursor*/] = await token.paginateAllowancesBySpender(bob.address, 0, 5);
        expect(a1).to.eq(alice.address);
      });

      it('emits a Approval event', async () => {
        // Let alice give allowance to bob.
        const subject = token.connect(alice).approve(bob.address, 60);
        // Do it!
        await expect(subject).to
          .emit(token, 'Approval')
          .withArgs(alice.address, bob.address, 60)
      });
    });

    describe('disapprove', async () => {
      beforeEach(async () => {
        // Let bob give john an allowance.
        await token.connect(bob).approve(john.address, 15);
      });

      it('requires that the sender is a member', async () => {
        const subject = token.disapprove(bob.address);
        await expect(subject).to.have
          .revertedWith(SENDER_NOT_MEMBER_MESSAGE)
      });

      it('sets the allowance to zero', async () => {
        await token.connect(bob).disapprove(john.address);
        const subject = await token.allowance(bob.address, john.address);
        expect(subject).to.eq(0);
      });

      it('removes the spender received allowance');

      it('removes the original given allowance');

      it('emits a Disapproval event', async () => {
        const subject = token.connect(bob).disapprove(john.address);
        await expect(subject).to
          .emit(token, 'Disapproval')
          .withArgs(bob.address, john.address);
      });
    });

    describe('transferFrom', async () => {
      beforeEach(async () => {
        // Reset history calls.
        history.transfered.reset();
        // Let bob give allowance to john.
        await token.connect(bob).approve(john.address, 150);
      });

      // IMPORTANT:
      // All these tests have the exact same rules as for `transfer`, same
      // order, same everything **please**.

      it('requires sender membership', async () => {
        // NOTE: We could test that the contract reverts when the sender isn't a
        // member, but given that you have to be a member to give allowance to
        // someone in the first place, this test has very little value. 
      });

      it('requires recipient membership', async () => {
        const subject = token.connect(john).transferFrom(bob.address, anonymous.address, 100);
        await expect(subject).to.have
          .revertedWith(RECIPIENT_NOT_MEMBER_MESSAGE);
      });

      it('requires that the sender and recipient are different', async () => {
        const subject = token.connect(john).transferFrom(bob.address, bob.address, 100)
        await expect(subject).to.have
          .revertedWith(SENDER_SAME_AS_RECIPIENT_MESSAGE);
      });

      it('requires sufficient funds', async () => {
        const subject = token.connect(john).transferFrom(bob.address, alice.address, 101);
        await expect(subject).to.have
          .revertedWith('Insuficient funds');
      });

      it('requires sufficient transfer credits', async () => {
        // Drain all credits, and provision some more.
        await spcMemberToken.drainTransferCredits();
        await spcMemberToken.addTransferCredits(90);
        // Do it!
        const subject = token.connect(john).transferFrom(bob.address, alice.address, 100);
        await expect(subject).to.be.revertedWith(INSUFICIENT_TRANSFER_CREDITS_MESSAGE);
      });

      it('transfers from / to the given wallet address', async () => {
        const subject = () => token.connect(john).transferFrom(bob.address, alice.address, 100);
        await expect(subject).to
          .changeTokenBalances(token, [bob, alice], [-100, 100]);
      });

      it('delegates to the history contract', async () => {
        await token.connect(john).transferFrom(bob.address, alice.address, 12)
        const args = history.transfered.getCall(0).args as any;
        expect(args.spender).to.eq(john.address);
        expect(args.from).to.eq(bob.address);
        expect(args.to).to.eq(alice.address);
        expect(args.amount).to.eq(12);
        expect(args.ref).to.eq('Unspecified - via ERC20');
      });

      it('decreases total supply when transferring to the zero address', async () => {
        // Keep total supply.
        const supplyBefore = await token.totalSupply();
        // Do it!
        await token.connect(john).transferFrom(bob.address, ZERO_ADDRESS, 100);
        // Check that total supply decreased.
        expect(await token.totalSupply()).to.eql(supplyBefore.add(-100));
      });

      it('emits a IERC20.Transfer event', async () => {
        const subject = token.connect(john).transferFrom(bob.address, alice.address, 98);
        await expect(subject).to
          .emit(token, 'Transfer')
          .withArgs(bob.address, alice.address, 98);
      });

      // `transferFrom` specific!

      it('requires that there is enough allowance', async () => {
        const subject = token.connect(bob).transferFrom(alice.address, john.address, 100);
        await expect(subject).to.have
          .revertedWith('Insuficient allowance');
      });

      it('allows non-members to transact on behalf of members', async () => {
        // Let bob give allowance to anonymous.
        await token.connect(bob).approve(anonymous.address, 150);
        // Do it!
        const subject = () => token.connect(anonymous).transferFrom(bob.address, alice.address, 100);
        await expect(subject).to
          .changeTokenBalances(token, [bob, alice], [-100, 100]);
      });

      it('increases total supply when transferring from the zero address', async () => {
        // Keep track of total supply.
        const supplyBefore = await token.totalSupply();
        // Do it!
        await governedToken.transferFrom(ZERO_ADDRESS, alice.address, 100);
        // Check that total supply increased.
        expect(await token.totalSupply()).to.eql(supplyBefore.add(100));
      });

      it('requires that zero address can only be spent from as a governor (SPC member)', async () => {
        const subject = spcMemberToken.transferFrom(ZERO_ADDRESS, alice.address, 100);
        await expect(subject).to.have
          .revertedWith('Missing governorship')
      });

      it('requires that zero address can only be spent from as a governor (member)', async () => {
        const subject = token.connect(bob).transferFrom(ZERO_ADDRESS, alice.address, 100);
        await expect(subject).to.have
          .revertedWith('Missing governorship')
      });

      it('requires that zero address can only be spent from as a governor (anonymous)', async () => {
        const subject = token.transferFrom(ZERO_ADDRESS, alice.address, 100);
        await expect(subject).to.have
          .revertedWith('Missing governorship')
      });

      it('allows governors to transfer from the zero address', async () => {
        const subject = () => governedToken.transferFrom(ZERO_ADDRESS, alice.address, 100);
        await expect(subject).to
          .changeTokenBalances(token, [ZERO_ACCOUNT_MOCK, alice], [-100, 100]);
      });

      it('does not require transfer credits when drawing from the zero address', async () => {
        await spcMemberToken.drainTransferCredits();
        const subject = () => governedToken.transferFrom(ZERO_ADDRESS, alice.address, 100);
        await expect(subject).to
          .changeTokenBalances(token, [ZERO_ACCOUNT_MOCK, alice], [-100, 100]);
      });

      it('does not impact transfer credits when drawing from the zero address', async () => {
        await spcMemberToken.addTransferCredits(1000);
        const creditsBefore = await token.transferCredits();
        await governedToken.transferFrom(ZERO_ADDRESS, alice.address, 100);
        const subject = await token.transferCredits();
        expect(subject).to.eq(creditsBefore);
      });
    });

    describe('transferFromWithRef', async () => {
      beforeEach(async () => {
        // Reset history calls.
        history.transfered.reset();
        // Let bob give allowance to john.
        await token.connect(bob).approve(john.address, 150);
      });

      // IMPORTANT:
      // All these tests have the exact same rules as for `transfer` and `transferFrom`, same
      // order, same everything **please**.

      it('requires sender membership', async () => {
        // NOTE: We could test that the contract reverts when the sender isn't a
        // member, but given that you have to be a member to give allowance to
        // someone in the first place, this test has very little value. 
      });

      it('requires recipient membership', async () => {
        const subject = token.connect(john).transferFromWithRef(bob.address, anonymous.address, 100, 'One');
        await expect(subject).to.have
          .revertedWith(RECIPIENT_NOT_MEMBER_MESSAGE);
      });

      it('requires that the sender and recipient are different', async () => {
        const subject = token.connect(john).transferFromWithRef(bob.address, bob.address, 100, 'No!')
        await expect(subject).to.have
          .revertedWith(SENDER_SAME_AS_RECIPIENT_MESSAGE);
      });

      it('requires sufficient funds', async () => {
        const subject = token.connect(john).transferFromWithRef(bob.address, alice.address, 101, 'Two');
        await expect(subject).to.have
          .revertedWith('Insuficient funds');
      });

      it('requires sufficient transfer credits', async () => {
        // Drain all credits, and provision some more.
        await spcMemberToken.drainTransferCredits();
        await spcMemberToken.addTransferCredits(90);
        // Do it!
        const subject = token.connect(john).transferFromWithRef(bob.address, alice.address, 100, 'Three');
        await expect(subject).to.be.revertedWith(INSUFICIENT_TRANSFER_CREDITS_MESSAGE);
      });

      it('transfers from / to the given wallet address', async () => {
        const subject = () => token.connect(john).transferFromWithRef(bob.address, alice.address, 100, 'Four');
        await expect(subject).to
          .changeTokenBalances(token, [bob, alice], [-100, 100]);
      });

      it('delegates to the history contract', async () => {
        await token.connect(john).transferFromWithRef(bob.address, alice.address, 12, 'Five')
        const args = history.transfered.getCall(0).args as any;
        expect(args.spender).to.eq(john.address);
        expect(args.from).to.eq(bob.address);
        expect(args.to).to.eq(alice.address);
        expect(args.amount).to.eq(12);
        expect(args.ref).to.eq('Five');
      });

      it('decreases total supply when transferring to the zero address', async () => {
        // Keep total supply.
        const supplyBefore = await token.totalSupply();
        // Do it!
        await token.connect(john).transferFromWithRef(bob.address, ZERO_ADDRESS, 100, 'Five and a half?');
        // Check that total supply decreased.
        expect(await token.totalSupply()).to.eql(supplyBefore.add(-100));
      });

      it('emits a IERC20.Transfer event', async () => {
        const subject = token.connect(john).transferFromWithRef(bob.address, alice.address, 98, 'Six');
        await expect(subject).to
          .emit(token, 'Transfer')
          .withArgs(bob.address, alice.address, 98);
      });

      // `transferFrom` specific!

      it('requires that there is enough allowance', async () => {
        const subject = token.connect(bob).transferFromWithRef(alice.address, john.address, 100, 'Seven');
        await expect(subject).to.have
          .revertedWith('Insuficient allowance');
      });

      it('allows non-members to transact on behalf of members', async () => {
        // Let bob give allowance to anonymous.
        await token.connect(bob).approve(anonymous.address, 150);
        // Do it!
        const subject = () => token.connect(anonymous).transferFromWithRef(bob.address, alice.address, 100, 'Eight');
        await expect(subject).to
          .changeTokenBalances(token, [bob, alice], [-100, 100]);
      });

      it('increases total supply when transferring from the zero address', async () => {
        // Keep track of total supply.
        const supplyBefore = await token.totalSupply();
        // Do it!
        await governedToken.transferFromWithRef(ZERO_ADDRESS, alice.address, 100, 'Eight and a half?');
        // Check that total supply increased.
        expect(await token.totalSupply()).to.eql(supplyBefore.add(100));
      });

      it('requires that zero address can only be spent from as a governor (SPC member)', async () => {
        const subject = spcMemberToken.transferFromWithRef(ZERO_ADDRESS, alice.address, 100, 'Nine');
        await expect(subject).to.have
          .revertedWith('Missing governorship');
      });

      it('requires that zero address can only be spent from as a governor (member)', async () => {
        const subject = token.connect(bob).transferFromWithRef(ZERO_ADDRESS, alice.address, 100, 'Cat');
        await expect(subject).to.have
          .revertedWith('Missing governorship');
      });

      it('requires that zero address can only be spent from as a governor (anonymous)', async () => {
        const subject = token.transferFromWithRef(ZERO_ADDRESS, alice.address, 100, 'Dog');
        await expect(subject).to.have
          .revertedWith('Missing governorship');
      });

      it('allows governors to transfer from the zero address', async () => {
        const subject = () => governedToken.transferFromWithRef(ZERO_ADDRESS, alice.address, 100, 'Spider');
        await expect(subject).to
          .changeTokenBalances(token, [ZERO_ACCOUNT_MOCK, alice], [-100, 100]);
      });

      it('does not require transfer credits when drawing from the zero address', async () => {
        await spcMemberToken.drainTransferCredits();
        const subject = () => governedToken.transferFromWithRef(ZERO_ADDRESS, alice.address, 100, 'Ten');
        await expect(subject).to
          .changeTokenBalances(token, [ZERO_ACCOUNT_MOCK, alice], [-100, 100]);
      });

      it('does not impact transfer credits when drawing from the zero address', async () => {
        await spcMemberToken.addTransferCredits(1000);
        const creditsBefore = await token.transferCredits();
        await governedToken.transferFromWithRef(ZERO_ADDRESS, alice.address, 100, 'Eleven');
        const subject = await token.transferCredits();
        expect(subject).to.eq(creditsBefore);
      });
    });
  });

  /// Allowance querying.

  describe('givenAllowanceCount', async () => {
    it('NEEDS MORE TESTS');
  });

  describe('paginateAllowancesByOwner', async () => {
    beforeEach(async () => {
      // Let alice give allowance to bob and john, let bob give allowance to john.
      await token.connect(alice).approve(bob.address, 5);
      await token.connect(alice).approve(john.address, 10);
      await token.connect(bob).approve(john.address, 15);
    });

    it('returns the list of addresses to which the caller gave allowances to', async () => {
      const [[a1, a2], /*cursor*/] = await token.paginateAllowancesByOwner(alice.address, 0, 5);
      expect(a1).to.eq(bob.address);
      expect(a2).to.eq(john.address);
    });

    it('does not list addresses from which the caller has received allowances', async () => {
      const [allowances, /*cursor*/] = await token.paginateAllowancesByOwner(john.address, 0, 5);
      expect(allowances).to.be.empty;
    });
  });

  describe('receivedAllowanceCount', async () => {
    it('NEEDS MORE TESTS');
  });

  describe('paginateAllowancesBySpender', async () => {
    beforeEach(async () => {
      // Let alice give allowance to bob and john, let bob give allowance to john.
      await token.connect(alice).approve(bob.address, 5);
      await token.connect(alice).approve(john.address, 10);
      await token.connect(bob).approve(john.address, 15);
    });

    it('returns the list of addresses to which the caller gave allowances to', async () => {
      const [[a1, a2], /*cursor*/] = await token.paginateAllowancesBySpender(john.address, 0, 5);
      expect(a1).to.eq(alice.address);
      expect(a2).to.eq(bob.address);
    });

    it('does not list addresses to which the caller has given allowances', async () => {
      const [allowances, /*cursor*/] = await token.paginateAllowancesBySpender(alice.address, 0, 5);
      expect(allowances).to.be.empty;
    });
  });

  /// ERC1404 implementation.
  describe('ERC1404', async () => {
    describe('detectTransferRestriction has codes for', async () => {
      it('the lack of transfer credits', async () => {
        const subject = await token.detectTransferRestriction(bob.address, alice.address, 1);
        expect(subject).to.eq(INSUFICIENT_TRANSFER_CREDITS);
      });

      it('the lack of sender membership', async () => {
        await spcMemberToken.addTransferCredits(1);
        const subject = await token.detectTransferRestriction(anonymous.address, alice.address, 1);
        expect(subject).to.eq(SENDER_NOT_MEMBER);
      });

      it('the lack of recipient membership', async () => {
        await spcMemberToken.addTransferCredits(1);
        const subject = await token.detectTransferRestriction(bob.address, anonymous.address, 1);
        expect(subject).to.eq(RECIPIENT_NOT_MEMBER);
      });

      it('sender and recipient being identical', async () => {
        await spcMemberToken.addTransferCredits(1);
        const subject = await token.detectTransferRestriction(bob.address, bob.address, 1);
        expect(subject).to.eq(SENDER_SAME_AS_RECIPIENT);
      });

      it('returns zero when the transfer is possible', async () => {
        await spcMemberToken.addTransferCredits(1);
        const subject = await token.detectTransferRestriction(bob.address, alice.address, 1);
        expect(subject).to.eq(0);
      });
    });

    describe('messageForTransferRestriction has a message for', async () => {
      it('the lack of transfer credits', async () => {
        const subject = await token.messageForTransferRestriction(INSUFICIENT_TRANSFER_CREDITS);
        expect(subject).to.eq(INSUFICIENT_TRANSFER_CREDITS_MESSAGE);
      });

      it('the lack of sender membership', async () => {
        const subject = await token.messageForTransferRestriction(SENDER_NOT_MEMBER);
        expect(subject).to.eq(SENDER_NOT_MEMBER_MESSAGE);
      });

      it('the lack of recipient membership', async () => {
        const subject = await token.messageForTransferRestriction(RECIPIENT_NOT_MEMBER);
        expect(subject).to.eq(RECIPIENT_NOT_MEMBER_MESSAGE);
      });

      it('sender and recipient being identical', async () => {
        const subject = await token.messageForTransferRestriction(SENDER_SAME_AS_RECIPIENT);
        expect(subject).to.eq(SENDER_SAME_AS_RECIPIENT_MESSAGE);
      });

      it('errors when the restriction code is unknown', async () => {
        const subject = token.messageForTransferRestriction(5);
        await expect(subject).to.have
          .revertedWith('Unknown restriction code');
      })
    });
  });

  describe('beforeRemovingMember', async () => {
    beforeEach(async () => {
      await spcMemberToken.mint(1_000, 'Give me the money');
    });

    it('cannot be called directly', async () => {
      const subject = token.beforeRemovingMember(alice.address);
      await expect(subject).to.have
        .revertedWith('Cannot be called directly');
    });

    describe('when successful', async () => {
      before(async () => {
        // Make sure our access contract can pay for its gas fees.
        await ethers.provider.send("hardhat_setBalance", [access.address, toHexString(oneMilion)])
      });

      beforeEach(async () => {
        // Give alice some tokens.
        await governedToken.transferFrom(ZERO_ADDRESS, alice.address, 500);
        // Add transfer credits to the token contract.
        await spcMemberToken.addTransferCredits(1_000);
        // Let alice give allowance to bob, and john give allowance to alice.
        await Promise.all([
          token.connect(alice).approve(bob.address, 500),
          token.connect(john).approve(alice.address, 500)
        ]);

        history.transfered.reset();
      });

      it('transfers the member tokens back to the zero address', async () => {
        const subject = () => token.connect(access.wallet).beforeRemovingMember(alice.address);
        await expect(subject).to
          .changeTokenBalances(token, [ZERO_ACCOUNT_MOCK, alice], [500, -500]);
      });

      it('delegates to the history contract', async () => {
        await token.connect(access.wallet).beforeRemovingMember(alice.address);
        const args = history.transfered.getCall(0).args as any;
        expect(args.spender).to.eq(ZERO_ADDRESS);
        expect(args.from).to.eq(alice.address);
        expect(args.to).to.eq(ZERO_ADDRESS);
        expect(args.amount).to.eq(500);
        expect(args.ref).to.eq('Member removal');
      });

      it('emits a Transfer event when a transfer is performed', async () => {
        const subject = token.connect(access.wallet).beforeRemovingMember(alice.address);
        await expect(subject).to
          .emit(token, 'Transfer')
          .withArgs(alice.address, ZERO_ADDRESS, 500);
      });

      it('sets allowances to / from the removed members to zero', async () => {
        await token.connect(access.wallet).beforeRemovingMember(alice.address);
        expect(await token.allowance(alice.address, bob.address)).to.eq(0);
        expect(await token.allowance(john.address, alice.address)).to.eq(0);
      });

      it('removes given and received allowances', async () => {
        await token.connect(access.wallet).beforeRemovingMember(alice.address);
        // Check that allowances received by the members are gone.
        const [ra, /*cursor*/] = await token.paginateAllowancesBySpender(bob.address, 0, 5);
        expect(ra).to.be.empty
        // Check that allowances given by the member are gone.
        const [ga, /*cursor*/] = await token.paginateAllowancesByOwner(alice.address, 0, 5);
        expect(ga).to.be.empty
      });

      it('emits a Disapproval event as many times as it removed allowance', async () => {
        const subject = token.connect(access.wallet).beforeRemovingMember(alice.address);
        await expect(subject).to
          .emit(token, 'Disapproval')
          .withArgs(alice.address, bob.address);

        await expect(subject).to
          .emit(token, 'Disapproval')
          .withArgs(john.address, alice.address);
      });
    });
  })
});
