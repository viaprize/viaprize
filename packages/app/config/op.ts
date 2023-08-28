export default {
  // provider: "https://rpc.ankr.com/optimism",
  provider:
    "https://opt-mainnet.g.alchemy.com/v2/224qz7e8XHRyAkY6AXLYHhGB9cPxeuYG",
  // provider: "https://optimism.meowrpc.com",
  chainId: 10,
  chainName: "Optimism",
  scanUrl: "https://optimistic.etherscan.io",
  contracts: {
    multicall3: "0xcA11bde05977b3631167028862bE2a173976CA11",
    pactFactory: "0x642a7864cBe44ED24D408Cbc38117Cfd6E6D1a95",
  },
  pictures: { "0x4f83392B8929D92FaF7fA4472721d95f0FcFaED7": "/pictures/0.jpg" },
  eventSignatures: {
    create:
      "0xe3758539c1bd6726422843471b2886c2d2cefd3b4aead6778386283e20a32a80",
  },
};
