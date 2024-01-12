import { expect } from "chai";
import { ethers } from "hardhat";
import { Gofundme } from "../../typechain-types/proxyportals/gofundme.sol";

let gofundme: Gofundme;

beforeEach(async () => {
    const Gofundme = await ethers.getContractFactory("Gofundme");
    gofundme = await Gofundme.deploy() as unknown as Gofundme;
});


describe("initialize", () => {
    it("should correctly initialize the contract", async () => {
        await gofundme.deployed();

        const proposers = ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb"];
        const admins = ["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"];
        const platformFee = 10;

        await gofundme.initialize(proposers, admins, platformFee);

        expect(await gofundme.isProposer(proposers[0])).to.be.true;
        expect(await gofundme.isAdmin(admins[0])).to.be.true;
        expect(await gofundme.platformFee()).to.equal(platformFee);
    });
});

describe("addFunds", () => {
    it("should revert if no funds are sent", async () => {
        await expect(gofundme.addFunds({ value: 0 })).to.be.revertedWith("NotEnoughFunds");
    });

    it("should revert if campaign is ended", async () => {
        await gofundme.endCampaign();
        await expect(gofundme.addFunds({ value: 100 })).to.be.revertedWith("FundingToContractEnded");
    });

    it("should correctly add funds", async () => {
        await gofundme.addFunds({ value: 100 });

        expect(await gofundme.patronAmount((await ethers.provider.getSigner()).getAddress())).to.equal(100);
        expect(await gofundme.totalFunds()).to.equal(100);
    });
});

describe("endCampaign", () => {
    it("should revert if not called by a proposer or admin", async () => {
        await expect(gofundme.connect(await ethers.getSigner("0x1f00DD750aD3A6463F174eD7d63ebE1a7a930d0c")).endCampaign()).to.be.revertedWith("You are not a proposer or admin.");
    });

    it("should correctly end the campaign", async () => {
        await gofundme.endCampaign();
        expect(await gofundme.isActive()).to.be.false;
    });
});


