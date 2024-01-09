import { ethers, upgrades } from "hardhat";

async function main() {
    console.log("wait starting");
    const GoFundMe = await ethers.getContractFactory('gofundmeFactory');
    console.log("wait deploying");
    const gofundme = await upgrades.deployProxy(
        GoFundMe, { initializer: 'initialize' }
    );
    await gofundme.deployed();
    console.log('deployed to: ', gofundme.address);
}

main();