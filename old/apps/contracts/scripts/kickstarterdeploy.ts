import { ethers, upgrades } from "hardhat";
async function main() {
    console.log("wait starting");
    const KickStarter = await ethers.getContractFactory('Kickstarter');
    console.log("wait deploying");
    console.log('Campaign has deployed...')
    try {
        const Kickstarter = await upgrades.deployProxy(
            KickStarter,
            [['0x18E1f76217D05F1FfBC3129a035ca29304706774'], ['0x18E1f76217D05F1FfBC3129a035ca29304706774'], 10000000000000, 123, false, 10],
            { initializer: 'initialize' }
        );
        await Kickstarter.deployed();
        console.log('deployed to: ', Kickstarter.address);
    } catch (error) {
        console.log('this is the error ', error);
    }
}

main();