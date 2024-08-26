import { ethers } from "hardhat";

async function main() {


    // console.log("Deploying contracts...");
    // const submissionTree = await ethers.getContractFactory("contracts/SubmissionLibrary.sol:SubmissionLibrary");
    // const submission_tree = await submissionTree.deploy();
    // await submission_tree.deployed();

    // console.log("SubmissionLibrary deployed to:", submission_tree.address);


    console.log("loading")
    const ViaPrizeFactory = await ethers.getContractFactory("PrizeJudgesFactory", {
        libraries: {
            SubmissionLibrary: "0xbd69bab950ddbe838dfa6ecd5b157564b3709a5c"
        }
    });
    // const gasEstimate = ethers.estimateGas(ViaPrizeFactory.getDeployTransaction().data)
    // console.log("Estimated gas cost:", gasEstimate.toString());
    const viaPrizeFactory = await ViaPrizeFactory.deploy();
    console.log("deployyinggggggggg  ")
    await viaPrizeFactory.deployed();

    console.log("ViaPrizeFactory deployed to:", viaPrizeFactory.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
