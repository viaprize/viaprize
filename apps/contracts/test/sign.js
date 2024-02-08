const { expect } = require("chai");
const { ethers } = require("hardhat");

async function getPermitSignature(signer, token, spender, value, deadline) {
  const [nonce, name, version, chainId] = await Promise.all([
    token.nonces(signer.address),
    token.name(),
    "2",
    signer.getChainId(),
  ]);

  return ethers.utils.splitSignature(
    await signer._signTypedData(
      {
        name,
        version,
        chainId,
        verifyingContract: token.address,
      },
      {
        Permit: [
          {
            name: "owner",
            type: "address",
          },
          {
            name: "spender",
            type: "address",
          },
          {
            name: "value",
            type: "uint256",
          },
          {
            name: "nonce",
            type: "uint256",
          },
          {
            name: "deadline",
            type: "uint256",
          },
        ],
      },
      {
        owner: signer.address,
        spender,
        value,
        nonce,
        deadline,
      }
    )
  );
}

describe("ERC20Permit", function () {
  it("ERC20 permit", async function () {
    this.timeout(220000);
    const accounts = await ethers.getSigners(1);
    const signer = accounts[0];

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    await token.deployed();
    console.log(token.address);

    const proposers = ["0x657bB607086679EC3223e4Cdd18485c14CaC1e36"];
    const admins = ["0x5923203a92ABa3Eb92940F42f6eB5267BA377D5f"];
    const goal = 10000;
    const deadline = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
    const allowDonationAboveGoalAmount = true;
    const platformFee = 10;

    const Vault = await ethers.getContractFactory("Kickstarter");
    const vault = await Vault.deploy(
      proposers,
      admins,
      token.address,
      goal,
      deadline,
      allowDonationAboveGoalAmount,
      platformFee
    );
    await vault.deployed();
    console.log(vault.address);

    const amount = 1000;
    await token.mint(signer.address, amount);

    const txDeadline = ethers.constants.MaxUint256;

    const { v, r, s } = await getPermitSignature(
      signer,
      token,
      vault.address,
      amount,
      txDeadline
    );

    // const gas = await vault.estimateGas.addUsdcFunds(signer.address, vault.address, amount, deadline, v, r, s)
    // console.log(gas)
    await vault.addUsdcFunds(
      signer.address,
      vault.address,
      amount,
      txDeadline,
      v,
      r,
      s,
      {
        gasLimit: 100000,
      }
    );
    console.log(v, r, s);

    expect(await token.balanceOf(vault.address)).to.equal(amount);
  });
});
