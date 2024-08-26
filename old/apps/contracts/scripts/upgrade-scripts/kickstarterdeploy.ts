import { ethers, upgrades } from "hardhat";
async function main() {
    console.log("upgrading will start soon...")
    const kickstarterV2 = await ethers.getContractFactory('KickstarterV2');
    console.log('Upgrading Campaign...');
    await upgrades.upgradeProxy('0x3Aa5ebB10DC797CAC828524e59A333d0A371443c', kickstarterV2);
    console.log('Campaign upgraded');
}

main();