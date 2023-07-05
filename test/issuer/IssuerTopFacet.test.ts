import * as chai from "chai";
import { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { deployments, ethers } from "hardhat";
import { FakeContract, smock } from "@defi-wonderland/smock";
import { IssuerTopFacet } from "../../typechain";
import { SignerWithAddress } from "hardhat-deploy-ethers/signers";
import { ZERO_ADDRESS } from "../../src/utils";
import { issuerFixtureFunc } from "../fixtures/issuer";
import {
  Fast,
  Issuer,
} from "../../typechain/hardhat-diamond-abi/HardhatDiamondABI.sol";
chai.use(solidity);
chai.use(smock.matchers);

describe("IssuerTopFacet", () => {
  let deployer: SignerWithAddress, issuerMember: SignerWithAddress;
  let issuer: Issuer, issuerMemberIssuer: Issuer, top: IssuerTopFacet;

  const issuerDeployFixture = deployments.createFixture(issuerFixtureFunc);

  before(async () => {
    // Keep track of a few signers.
    [deployer, issuerMember] = await ethers.getSigners();
  });

  beforeEach(async () => {
    await issuerDeployFixture({
      opts: {
        name: "IssuerTopFixture",
        deployer: deployer.address,
        afterDeploy: async (args) => {
          ({ issuer } = args);
          issuerMemberIssuer = issuer.connect(issuerMember);
          top = await ethers.getContractAt<IssuerTopFacet>(
            "IssuerTopFacet",
            issuer.address
          );
        },
      },
      initWith: {
        member: issuerMember.address,
      },
    });
  });

  /// FAST management stuff.

  describe("FAST management", () => {
    let f01: FakeContract<Fast>,
      f02: FakeContract<Fast>,
      f03: FakeContract<Fast>;

    beforeEach(async () => {
      // Two fasts are registered with the Issuer.
      f01 = await smock.fake("Fast");
      f01.symbol.returns("F01");
      await issuerMemberIssuer.registerFast(f01.address);
      f02 = await smock.fake("Fast");
      f02.symbol.returns("F02");
      await issuerMemberIssuer.registerFast(f02.address);
      // Third fast isn"t registered with Issuer.
      f03 = await smock.fake("Fast");
      f03.symbol.returns("F03");
    });

    describe("isFastRegistered", () => {
      it("returns false when the FAST symbol is unknown", async () => {
        const [notAContract] = await ethers.getSigners();
        const subject = await top.isFastRegistered(notAContract.address);
        expect(subject).to.eq(false);
      });

      it("returns true when the FAST symbol is registered", async () => {
        const subject = await top.isFastRegistered(f01.address);
        expect(subject).to.eq(true);
      });
    });

    describe("fastBySymbol", () => {
      it("returns the zero address when the FAST symbol is unknown", async () => {
        const subject = await top.fastBySymbol("UKN");
        expect(subject).to.eq(ZERO_ADDRESS);
      });

      it("returns the FAST address when the FAST symbol is registered", async () => {
        const subject = await top.fastBySymbol("F01");
        expect(subject).to.eq(f01.address);
      });
    });

    describe("registerFast", () => {
      it("requires Issuer membership", async () => {
        const subject = top.registerFast(f01.address);
        await expect(subject).to.have.revertedWith(`RequiresIssuerMembership`);
      });

      it("reverts if trying to add a FAST with an already existing symbol", async () => {
        const duplFast = await smock.fake("Fast");
        duplFast.symbol.returns("F01");
        const subject = issuerMemberIssuer.registerFast(duplFast.address);
        await expect(subject).to.have.revertedWith("DuplicateEntry");
      });

      it("adds the registry address to the list of registries", async () => {
        // Note that this test is already covered by tests for `fastBySymbol`.
        // It would add very little value to add anything to it.
      });

      it("keeps track of the symbol", async () => {
        // Note that this test is already covered by tests for `fastBySymbol`.
        // It would add very little value to add anything to it.
      });

      it("emits a FastRegistered event", async () => {
        const subject = issuerMemberIssuer.registerFast(f03.address);
        await expect(subject)
          .to.emit(issuer, "FastRegistered")
          .withArgs(f03.address);
      });
    });

    describe("unregisterFast", () => {
      it("requires Issuer membership", async () => {
        const subject = top.unregisterFast(f01.address);
        await expect(subject).to.have.revertedWith(`RequiresIssuerMembership`);
      });

      it("delegates to the FAST contract to disable its transfers");
      it("disables transfers for the FAST being unregistered", async () => {
        await issuerMemberIssuer.unregisterFast(f01.address);
        expect(f01.setTransfersDisabled).to.be.calledOnceWith(true);
      });

      it("removes the FAST from the FAST address registry", async () => {
        await issuerMemberIssuer.unregisterFast(f01.address);
        const subject = await top.isFastRegistered(f01.address);
        expect(subject).to.be.false;
      });

      it("removes the FAST from the symbol lookup table", async () => {
        await issuerMemberIssuer.unregisterFast(f01.address);
        const subject = await top.fastBySymbol("F01");
        expect(subject).to.eq(ZERO_ADDRESS);
      });

      it("emits a FastUnregistered event", async () => {
        const subject = issuerMemberIssuer.unregisterFast(f01.address);
        await expect(subject)
          .to.emit(issuer, "FastUnregistered")
          .withArgs(f01.address);
      });
    });

    describe("fastCount", () => {
      it("returns the FAST count", async () => {
        const subject = await issuer.fastCount();
        expect(subject).to.eq(2);
      });
    });

    describe("paginateFasts", () => {
      it("returns pages of FASTs", async () => {
        // We"re testing the pagination library here... Not too good. But hey, we"re in a rush.
        const [[a1, a2]] = await issuer.paginateFasts(0, 10);
        expect(a1).to.eq(f01.address);
        expect(a2).to.eq(f02.address);
      });
    });

    describe("transferERC20Tokens", () => {
      it("MUST BE TESTED");
    });

    describe("setFastGroup", () => {
      it("removes the FAST from the old group");
      it("adds the FAST to the new group");
      it("delegates to the FAST setGroup method");
      it("emits a FastGroupChanged event with the correct parameters");
    });
  });
});
