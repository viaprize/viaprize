import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const submissionTree = await ethers.getContractFactory("SubmissionLibrary");
  const submission_tree = await submissionTree.deploy();
  await submission_tree.deployed();

  console.log("SubmissionAVLTree Contract Address:", submission_tree.address);

  const viaPrize = await ethers.getContractFactory("ViaPrize", {
    libraries: {
      SubmissionLibrary: submission_tree.address,
    }
  });
  const viaPrize_contract = await viaPrize.deploy(
    ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"],
    ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"],
    10,
    10,
    "0x17F6AD8Ef982297579C203069C1DbfFE4348c372",
  );
  await viaPrize_contract.deployed();

  console.log("ViaPrize Contract Address:", viaPrize_contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
