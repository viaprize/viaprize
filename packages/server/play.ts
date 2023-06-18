import {ethers} from 'ethers'

const pacts = [
    {
        "name": "Buy bananas",
        "terms": "Anyone who is interested in buying bananas can contribute.",
        "address": "0x4f83392B8929D92FaF7fA4472721d95f0FcFaED7",
        "transactionHash": "0xd108b633bbdda193860a4e8da8d4ffa31a629c4e43bc0ee555f635ae2762bf76",
        "blockHash": "0xaf1be82865eb2cac20dc2fc5a1cbbe45ba1dcc934e4a0ce6ef2c972531df463e"
    },
    {
        "name": "Buy guitar",
        "terms": "at a very low price: 0.00000001 ETH",
        "address": "0xBA517ADd7FB7eC630087b121489a0E3f80d9BDaE",
        "transactionHash": "0x3905745ff9bad0beff008bdd7ac092bf8e67132f258ca96cc5c91fafd47f4d47",
        "blockHash": "0xbd1336575edec902749f2791b86c72a52f341f26b2bfae903f438a00afbc4444"
    },
    {
        "name": "Test endtime",
        "terms": "it should be correct this time",
        "address": "0x84b136a9B359Bf0749e5e6B3c2daB8931e68a02c",
        "transactionHash": "0x942d14e2d17910d3a1f140e3b247462ebdb03faf72e0797ac8f3a06279e54f5e",
        "blockHash": "0x2397d6421a4f9d3322e899c1008a0318c8877a58e22ad96f0fe70c482582afbc"
    },
    {
        "name": "Funding goal 0.000001",
        "terms": "Testing out gnosis safe appearing",
        "address": "0x068Ee2fd2881cf9cD86CCaF29bEfcef22a71C17B",
        "transactionHash": "0xab19ff68705d039eaf51ec61ac7d922dd3b7162b1cd8a5842f0c77ad7ba5a7c6",
        "blockHash": "0x19e3f43f85421718b1b2a53c4cb196f7ac93eb91f7b0ea4c34c1bdeeef6d7818"
    },
    {
        "name": "buy lunch ",
        "terms": "Testing to see if someone wants to buy me lunch ",
        "address": "0xeB3B8ECa88f124d2a564cd1ddC522260d743E4b6",
        "transactionHash": "0xdc7998afef8eaae5f9a82eca00cdea19de9646eecae8c25c911122d0f873d11d",
        "blockHash": "0x52734febcc3bb9c33a3eb9a4440aa5ad2e5c5d46268ba8aab4887927cea0b6ae"
    }
]


  for(let i=0; i<pacts.length ; i++){
    const pactAddress = pacts[i].address;
    console.log('ready ', pactAddress)
    const ethersProvider = new ethers.JsonRpcProvider('https://optimism.meowrpc.com')
    // const ethersProvider = new ethers.JsonRpcProvider('https://opt-mainnet.g.alchemy.com/v2/224qz7e8XHRyAkY6AXLYHhGB9cPxeuYG')
    const pact = new ethers.Contract(pactAddress, PactAbi, ethersProvider);
    const safe = await pact.safe();
    const resolved = await pact.resolved();
    const resolvable = await pact.resolvable();
    const balance = await ethersProvider.getBalance(pactAddress);
    console.log(`data: ${i}`, safe, resolved, resolvable, balance)
  }