import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const submissionTree = await ethers.getContractFactory("SubmissionAVLTree");
  const submission_tree = await submissionTree.deploy();
  await submission_tree.deployed();

  console.log("submission AVL Tree Contract: ", submission_tree.address);

  const viaPrize = await ethers.getContractFactory("ViaPrize");
  const viaPrize_contract = await viaPrize.deploy(
    submission_tree.address,
    10,
    10,
  );
  await viaPrize_contract.deployed();

  console.log("ViaPrize address:", viaPrize_contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
