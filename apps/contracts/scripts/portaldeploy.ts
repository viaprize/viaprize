
async function main() {

    try {
        console.log("getting contract factory...");
        const portalFactory = await ethers.getContractFactory("portalFactory");
        console.log("got contract factory, now deploying")
        const PortalFactory = await portalFactory.deploy()
        await PortalFactory.deployed();
        console.log("deployed portal contract successfully with the contract address: ", PortalFactory.address)
    } catch (error) {
        console.log("portal contract not deployed due to this error: ", error)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });