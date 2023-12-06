import { ethers } from "hardhat";

async function main() {


  console.log("Deploying contracts...");
  // const submissionTree = await ethers.getContractFactory("SubmissionLibrary");
  // const submission_tree = await submissionTree.deploy();
  // await submission_tree.deployed();

  // console.log("SubmissionLibrary deployed to:", submission_tree.address);

  const ViaPrizeFactory = await ethers.getContractFactory("ViaPrizeFactory", {
    libraries: {
      SubmissionLibrary: "0x6FeFff1b32Cb44AA693F9ee8B68c6583F3e1cC3F"
    }
  });
  const viaPrizeFactory = await ViaPrizeFactory.deploy();
  await viaPrizeFactory.deployed();

  console.log("ViaPrizeFactory deployed to:", viaPrizeFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
