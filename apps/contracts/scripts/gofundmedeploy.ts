import { ethers, upgrades } from "hardhat";
async function main() {
    console.log("wait starting");
    const GoFundMe = await ethers.getContractFactory('Gofundme');
    console.log("wait deploying");
    // await GoFundMe.deployed();
    console.log('GoFundMe is deployed...')
    try {
        // const gofundme = await upgrades.deployProxy(
        //     GoFundMe, [['0x18E1f76217D05F1FfBC3129a035ca29304706774'], ['0x18E1f76217D05F1FfBC3129a035ca29304706774'], 10], { initializer: 'initialize' }
        // );
        const gofundme = await upgrades.deployProxy(
            GoFundMe,
            [['0x18E1f76217D05F1FfBC3129a035ca29304706774'], ['0x18E1f76217D05F1FfBC3129a035ca29304706774'], 10],
            { initializer: 'initialize' }
        );
        await gofundme.deployed();
        console.log('deployed to: ', gofundme.address);
    } catch (error) {
        console.log('this is the error ', error);
    }
}

main();