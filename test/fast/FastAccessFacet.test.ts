import * as chai from "chai";
import { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { deployments, ethers } from "hardhat";
import { FakeContract, MockContract, smock } from "@defi-wonderland/smock";
import { SignerWithAddress } from "hardhat-deploy-ethers/signers";
import {
  FastAccessFacet,
  FastTokenFacet,
  FastFrontendFacet,
} from "../../typechain";
import {
  Issuer,
  Marketplace,
  Fast,
} from "../../typechain/hardhat-diamond-abi/HardhatDiamondABI.sol";
import { fastFixtureFunc } from "../fixtures/fast";
chai.use(solidity);
chai.use(smock.matchers);

// TODO: For some reason, this whole test suite fixture is failing if it runs after another test file.
// This is flaky, and I have no idea why. I tried everything I could but didn't find a solution.

describe("FastAccessFacet", () => {
  let deployer: SignerWithAddress,
    issuerMember: SignerWithAddress,
    governor: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    rob: SignerWithAddress,
    john: SignerWithAddress;
  let issuer: FakeContract<Issuer>,
    marketplace: FakeContract<Marketplace>,
    fast: Fast,
    access: FastAccessFacet,
    governedAccess: FastAccessFacet,
    issuerMemberAccess: FastAccessFacet,
    tokenMock: MockContract<FastTokenFacet>,
    frontendMock: MockContract<FastFrontendFacet>;

  const fastDeployFixture = deployments.createFixture(fastFixtureFunc);

  before(async () => {
    // Keep track of a few signers.
    [deployer, issuerMember, governor, alice, bob, rob, john] =
      await ethers.getSigners();
    // Mock an Issuer and an Marketplace contract.
    issuer = await smock.fake("Issuer");
    marketplace = await smock.fake("Marketplace");
    marketplace.issuerAddress.returns(issuer.address);
  });

  beforeEach(async () => {
    // Set up issuer members.
    issuer.isMember.whenCalledWith(issuerMember.address).returns(true);
    issuer.isMember.returns(false);
    // Set up marketplace members.
    marketplace.isMember.reset();
    [governor, alice, bob, rob, john].forEach(({ address }) => {
      marketplace.isMember.whenCalledWith(address).returns(true);
      marketplace.isActiveMember.whenCalledWith(address).returns(true);
    });
    marketplace.isMember.returns(false);
    marketplace.isActiveMember.returns(false);

    await fastDeployFixture({
      opts: {
        name: "FastAccessFixture",
        deployer: deployer.address,
        afterDeploy: async (args) => {
          ({ fast, tokenMock, frontendMock } = args);
          access = await ethers.getContractAt<FastAccessFacet>(
            "FastAccessFacet",
            fast.address
          );
          issuerMemberAccess = access.connect(issuerMember);
          // Add a governor.
          await issuerMemberAccess.addGovernor(governor.address);
          governedAccess = access.connect(governor);
        },
      },
      initWith: {
        issuer: issuer.address,
        marketplace: marketplace.address,
      },
    });
  });

  /// Governorship related stuff.

  describe("AHasGovernors implementation", () => {
    describe("isGovernor", () => {
      it("returns true when the address is a governor", async () => {
        const subject = await access.isGovernor(governor.address);
        expect(subject).to.eq(true);
      });

      it("returns false when the address is not a governor", async () => {
        const subject = await access.isGovernor(bob.address);
        expect(subject).to.eq(false);
      });
    });

    describe("governorCount", () => {
      beforeEach(async () => {
        await governedAccess.addMember(alice.address);
        await issuerMemberAccess.addGovernor(alice.address);
      });

      it("returns the current count of governors", async () => {
        const subject = await access.governorCount();
        expect(subject).to.eq(2);
      });
    });

    describe("paginateGovernors", () => {
      beforeEach(async () => {
        // Add 4 governors - so there is a total of 5.
        await Promise.all(
          [alice, bob, rob, john].map(async ({ address }) =>
            governedAccess.addMember(address)
          )
        );
        await Promise.all(
          [alice, bob, rob, john].map(async ({ address }) =>
            issuerMemberAccess.addGovernor(address)
          )
        );
      });

      it("returns the cursor to the next page", async () => {
        // We"re testing the pagination library here... Not too good. But hey, we"re in a rush.
        const [, cursor] = await access.paginateGovernors(0, 3);
        expect(cursor).to.eq(3);
      });

      it("does not crash when overflowing and returns the correct cursor", async () => {
        // We"re testing the pagination library here... Not too good. But hey, we"re in a rush.
        const [, cursor] = await access.paginateGovernors(1, 10);
        expect(cursor).to.eq(5);
      });

      it("returns the governors in the order they were added", async () => {
        // We"re testing the pagination library here... Not too good. But hey, we"re in a rush.
        const [values] = await access.paginateGovernors(0, 5);
        expect(values).to.be.ordered.members([
          governor.address,
          alice.address,
          bob.address,
          rob.address,
          john.address,
        ]);
      });
    });

    describe("addGovernor", () => {
      beforeEach(async () => {
        await governedAccess.addMember(alice.address);
      });

      it("requires Issuer membership (anonymous)", async () => {
        const subject = access.addGovernor(alice.address);
        await expect(subject).to.be.revertedWith(`RequiresGovernorsManager`);
      });

      it("requires Issuer membership (governor)", async () => {
        const subject = governedAccess.addGovernor(alice.address);
        await expect(subject).to.be.revertedWith(`RequiresGovernorsManager`);
      });

      it("delegates to the Issuer for permission checking", async () => {
        issuer.isMember.reset();
        issuer.isMember.whenCalledWith(issuerMember.address).returns(true);
        await issuerMemberAccess.addGovernor(alice.address);
        expect(issuer.isMember).to.be.calledOnceWith(issuerMember.address);
      });

      it("requires that the address is an Marketplace member", async () => {
        marketplace.isMember.reset();
        const subject = issuerMemberAccess.addGovernor(alice.address);
        await expect(subject).to.be.revertedWith(`RequiresValidGovernor`);
      });

      it("requires that the address is not a governor yet", async () => {
        await issuerMemberAccess.addGovernor(alice.address);
        const subject = issuerMemberAccess.addGovernor(alice.address);
        await expect(subject).to.be.revertedWith("Address already in set");
      });

      it("adds the given address as a member if needed", async () => {
        await governedAccess.removeMember(alice.address);
        await issuerMemberAccess.addGovernor(alice.address);
        const subject = await access.isGovernor(alice.address);
        expect(subject).to.eq(true);
      });

      it("adds the given address as a governor", async () => {
        await issuerMemberAccess.addGovernor(alice.address);
        const subject = await access.isGovernor(alice.address);
        expect(subject).to.eq(true);
      });

      it("calls FastFrontendFacet.emitDetailsChanged", async () => {
        frontendMock.emitDetailsChanged.reset();
        await issuerMemberAccess.addGovernor(alice.address);
        expect(frontendMock.emitDetailsChanged).to.be.calledOnce;
      });

      it("emits a GovernorAdded event", async () => {
        const subject = await issuerMemberAccess.addGovernor(alice.address);
        await expect(subject)
          .to.emit(access, "GovernorAdded")
          .withArgs(alice.address);
      });

      it("calls back onGovernorAdded");
    });

    describe("removeGovernor", () => {
      beforeEach(async () => {
        // We want alice to be a governor for these tests.
        await governedAccess.addMember(alice.address);
        await issuerMemberAccess.addGovernor(alice.address);
      });

      it("requires Issuer membership (anonymous)", async () => {
        const subject = access.removeGovernor(alice.address);
        await expect(subject).to.be.revertedWith(`RequiresGovernorsManager`);
      });

      it("requires Issuer membership (governor)", async () => {
        const subject = governedAccess.removeGovernor(alice.address);
        await expect(subject).to.be.revertedWith(`RequiresGovernorsManager`);
      });

      it("delegates to the Issuer for permission checking", async () => {
        issuer.isMember.reset();
        issuer.isMember.whenCalledWith(issuerMember.address).returns(true);
        await issuerMemberAccess.removeGovernor(alice.address);
        expect(issuer.isMember).to.be.calledOnceWith(issuerMember.address);
      });

      it("requires that the address is an existing governor", async () => {
        const subject = issuerMemberAccess.removeGovernor(bob.address);
        await expect(subject).to.be.revertedWith(
          "Address does not exist in set"
        );
      });

      it("removes the given address as a governor", async () => {
        await issuerMemberAccess.removeGovernor(alice.address);
        const subject = await access.isGovernor(alice.address);
        expect(subject).to.eq(false);
      });

      it("calls FastFrontendFacet.emitDetailsChanged", async () => {
        frontendMock.emitDetailsChanged.reset();
        await issuerMemberAccess.removeGovernor(alice.address);
        expect(frontendMock.emitDetailsChanged).to.be.calledOnce;
      });

      it("emits a GovernorRemoved event", async () => {
        const subject = await issuerMemberAccess.removeGovernor(alice.address);
        await expect(subject)
          .to.emit(access, "GovernorRemoved")
          .withArgs(alice.address);
      });

      it("calls back onGovernorRemoved");
    });

    describe("onGovernorAdded", () => {
      it("MUST BE TESTED");
    });

    describe("onGovernorRemoved", () => {
      it("MUST BE TESTED");
    });
  });

  /// Membership related stuff.

  describe("AHasMembers", () => {
    describe("isMember", () => {
      beforeEach(async () => {
        await governedAccess.addMember(alice.address);
      });

      it("returns true when the address is a member", async () => {
        const subject = await access.isMember(alice.address);
        expect(subject).to.eq(true);
      });

      it("returns false when the address is not a member", async () => {
        const subject = await access.isMember(bob.address);
        expect(subject).to.eq(false);
      });
    });

    describe("memberCount", () => {
      beforeEach(async () => {
        await governedAccess.addMember(alice.address);
      });

      it("returns the current count of members", async () => {
        const subject = await access.memberCount();
        expect(subject).to.eq(2);
      });
    });

    describe("paginateMembers", () => {
      beforeEach(async () => {
        await Promise.all(
          // Remember - `governor` is already a member.
          [alice, bob, rob, john].map(async ({ address }) =>
            governedAccess.addMember(address)
          )
        );
      });

      it("returns the cursor to the next page", async () => {
        // We"re testing the pagination library here... Not too good. But hey, we"re in a rush.
        const [, /*members*/ cursor] = await access.paginateMembers(0, 3);
        expect(cursor).to.eq(3);
      });

      it("does not crash when overflowing and returns the correct cursor", async () => {
        // We"re testing the pagination library here... Not too good. But hey, we"re in a rush.
        const [, /*members*/ cursor] = await access.paginateMembers(1, 10);
        expect(cursor).to.eq(5);
      });

      it("returns the members in the order they were added", async () => {
        // We"re testing the pagination library here... Not too good. But hey, we"re in a rush.
        const [values] = await access.paginateMembers(0, 5);
        expect(values).to.be.ordered.members([
          governor.address,
          alice.address,
          bob.address,
          rob.address,
          john.address,
        ]);
      });
    });

    describe("addMember", () => {
      it("requires governance (anonymous)", async () => {
        const subject = access.addMember(alice.address);
        await expect(subject).to.be.revertedWith(`RequiresMembersManager`);
      });

      it("requires governance (Issuer governor)", async () => {
        const subject = issuerMemberAccess.addMember(alice.address);
        await expect(subject).to.be.revertedWith(`RequiresMembersManager`);
      });

      it("requires that the address is a Marketplace member", async () => {
        marketplace.isMember.whenCalledWith(alice.address).returns(false);
        const subject = governedAccess.addMember(alice.address);
        await expect(subject).to.be.revertedWith(`RequiresValidMember`);
      });

      it("requires that the address is not a member yet", async () => {
        await governedAccess.addMember(alice.address);
        const subject = governedAccess.addMember(alice.address);
        await expect(subject).to.be.revertedWith("Address already in set");
      });

      it("adds the given address as a member", async () => {
        await governedAccess.addMember(alice.address);
        const subject = await access.isMember(alice.address);
        expect(subject).to.eq(true);
      });

      it("delegates to the Marketplace contract to signal the membership addition", async () => {
        marketplace.memberAddedToFast.reset();
        await governedAccess.addMember(alice.address);
        expect(marketplace.memberAddedToFast).to.be.calledOnceWith(
          alice.address
        );
      });

      it("calls FastFrontendFacet.emitDetailsChanged", async () => {
        frontendMock.emitDetailsChanged.reset();
        await governedAccess.addMember(alice.address);
        expect(frontendMock.emitDetailsChanged).to.be.calledOnce;
      });

      it("emits a MemberAdded event", async () => {
        const subject = await governedAccess.addMember(alice.address);
        await expect(subject)
          .to.emit(access, "MemberAdded")
          .withArgs(alice.address);
      });

      it("calls back onMemberAdded");
    });

    describe("removeMember", () => {
      beforeEach(async () => {
        // We want alice to be a member for these tests.
        await governedAccess.addMember(alice.address);
      });

      it("requires governance (anonymous)", async () => {
        const subject = access.removeMember(alice.address);
        await expect(subject).to.be.revertedWith(`RequiresMembersManager`);
      });

      it("requires governance (Issuer governor)", async () => {
        const subject = issuerMemberAccess.removeMember(alice.address);
        await expect(subject).to.be.revertedWith(`RequiresMembersManager`);
      });

      it("requires that the address is an existing member", async () => {
        const subject = governedAccess.removeMember(bob.address);
        await expect(subject).to.be.revertedWith(
          "Address does not exist in set"
        );
      });

      it("removes the given address as a member", async () => {
        await governedAccess.removeMember(alice.address);
        const subject = await access.isMember(alice.address);
        expect(subject).to.eq(false);
      });

      it("delegates to the token contract", async () => {
        tokenMock.beforeRemovingMember.reset();
        await governedAccess.removeMember(alice.address);
        expect(tokenMock.beforeRemovingMember)
          .to.be.calledOnceWith(alice.address)
          .delegatedFrom(fast.address);
      });

      it("delegates to the Marketplace contract to signal the membership addition", async () => {
        marketplace.memberRemovedFromFast.reset();
        await governedAccess.removeMember(alice.address);
        expect(marketplace.memberRemovedFromFast).to.be.calledOnceWith(
          alice.address
        );
      });

      it("calls FastFrontendFacet.emitDetailsChanged", async () => {
        frontendMock.emitDetailsChanged.reset();
        await governedAccess.removeMember(alice.address);
        expect(frontendMock.emitDetailsChanged).to.be.calledOnce;
      });

      it("emits a MemberRemoved event", async () => {
        const subject = await governedAccess.removeMember(alice.address);
        await expect(subject)
          .to.emit(access, "MemberRemoved")
          .withArgs(alice.address);
      });

      it("calls back onMemberRemoved");
    });

    describe("onMemberAdded", () => {
      it("MUST BE TESTED");
    });

    describe("onMemberRemoved", () => {
      it("MUST BE TESTED");
    });
  });

  /// Flags.

  describe("flags", () => {
    it("is accurate when all flags set", async () => {
      await governedAccess.addMember(alice.address);
      await issuerMemberAccess.addGovernor(alice.address);
      const { isGovernor, isMember } = await access.flags(alice.address);
      expect(isGovernor).to.eq(true);
      expect(isMember).to.eq(true);
    });

    it("is accurate when only isMember is set", async () => {
      await governedAccess.addMember(alice.address);
      const { isGovernor, isMember } = await access.flags(alice.address);
      expect(isGovernor).to.eq(false);
      expect(isMember).to.eq(true);
    });

    it("is accurate when no flags are set", async () => {
      const { isGovernor, isMember } = await access.flags(alice.address);
      expect(isGovernor).to.eq(false);
      expect(isMember).to.eq(false);
    });
  });
});
