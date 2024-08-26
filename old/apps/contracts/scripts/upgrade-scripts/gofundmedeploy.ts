import { ethers, upgrades } from "hardhat";
async function main() {
    console.log("upgrading will start soon...")
    const gofundmev2 = await ethers.getContractFactory('GofundmeV2');
    console.log('Upgrading Campaign...');
    await upgrades.upgradeProxy('0x610178dA211FEF7D417bC0e6FeD39F05609AD788', gofundmev2);
    console.log('Campaign upgraded');
}

main();