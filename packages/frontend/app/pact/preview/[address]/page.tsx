
import config from "@/config";
import { PactDetail } from "@/lib/types"
import Eth from "web3-eth";
import Web3 from "web3";
import MulticallABI from "@/contract/abi/Multicall.json";
import PactABI from "@/contract/abi/Pact.json"
import { AbiItem } from "ethereum-multicall/dist/esm/models";
import { FaEthereum } from "react-icons/fa";
import Link from "next/link";
interface PackPreviewProp {
    params: { address: string }
}
function formatEtherValue(weiAmount: number): string {
    const etherAmount = weiAmount / 10 ** 18;

    if (etherAmount >= 0.001) {
        return etherAmount.toFixed(3).replace(/\.?0+$/, '') + " ETH";
    } else if (etherAmount >= 1e-6) {
        const decimalPlaces = Math.max(0, 6 - Math.ceil(Math.log10(etherAmount)));
        return etherAmount.toFixed(decimalPlaces).replace(/\.?0+$/, '') + " ETH";
    }
    else if (etherAmount >= 1e-18) {
        const decimalPlaces = Math.max(0, 18 - Math.ceil(Math.log10(etherAmount)));
        return etherAmount.toFixed(10).replace(/\.?0+$/, '') + " ETH";
    }
    else {
        return etherAmount.toExponential(6).replace(/\.?0+e/, 'e') + " ETH";
    }
}
const getPactInfo = async (pactAddress: string) => {

    const web3 = new Web3(
        new Web3.providers.HttpProvider(config.provider)
    );
    const multicall = new web3.eth.Contract(
        MulticallABI as AbiItem[],
        config.contracts.multicall3
    );

    const pactContract = new web3.eth.Contract(PactABI as AbiItem[], pactAddress);
    const sum = await pactContract.methods.sum().call();
    const calls = [
        [pactAddress, pactContract.methods.safe().encodeABI()],
        [pactAddress, pactContract.methods.resolved().encodeABI()],
        [pactAddress, pactContract.methods.resolvable().encodeABI()],
        [pactAddress, pactContract.methods.end().encodeABI()]
    ];

    const res = await multicall.methods.aggregate(calls).call();


    return {
        safe: web3.eth.abi.decodeParameter("address", res["returnData"][0]),
        resolved: web3.eth.abi.decodeParameter("bool", res["returnData"][1]),
        resolvable: web3.eth.abi.decodeParameter("bool", res["returnData"][2]),
        end: web3.eth.abi.decodeParameter("uint256", res['returnData'][3]),
        sum: sum,
    };
}
async function getPactItem(address: string) {

    if (!address) {
        throw new Error("Pact not found")
    }
    const res = {
        name: 'test-name',
        terms: 'these are my terms',
        address: '0x84b136a9B359Bf0749e5e6B3c2daB8931e68a02c',
        transactionHash: '0x36d15d2a1b3b5880c5724045311cff3ada0b7f9eb2e347367f1ff0b50f6ee992',
        blockHash: '0x957afdfba92a2ddd16c43b89677c8e4efae0c3ab563c3331d2c63944b8016ed7',
    }

    const provider = new Web3.providers.HttpProvider(config.provider)
    const web3 = new Web3(provider)
    const eth = new Eth(
        provider
    );
    return {
        ...res,
        //@ts-ignore
        balance: web3.utils.fromWei(await eth.getBalance(address)),
        ...await getPactInfo(address as string),
    } as unknown as PactDetail
}
export default async function Page({ params: { address } }: PackPreviewProp) {
    const item = await getPactItem(address)


    const inputDate = new Date(item.end * 1000);
    console.log({ item })
    const outputDateString = inputDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });




    return (
        <div className="card bg-base-100 w-72 h-[700px]  shadow-xl dark:text-gray-300">
            <img src={"https://picsum.photos/200"} style={{
                borderRadius: "5px",

                marginTop: "8px",
                marginInline: "auto",

            }} width={"90%"} height={"200px"} />
            <div className="card-body justify-between  break-words">
                <Link href={`https:///pact-ruddy.vercel.app/pact/${item.address}`} className="card-title text-3xl break-words dark:text-white inline-block hover:underline">

                    {item.name}

                </Link>
                <h3 className="mt-1 mb-0 text-xl font-bold dark:text-white">Terms</h3>
                <span className="mt-0 ">{item.terms}</span>
                <div className="flex gap-2 text-lg items-center dark:text-green-400 text-green-500">
                    <span >Balance</span>
                    <span>{item.balance} ETH</span>
                    <FaEthereum />
                </div>


                <div>
                    <div className="font-bold mb-1">Pact Address:</div>
                    <a
                        href={`${config.scanUrl}/address/${item.address}`}
                        rel="noreferrer"
                        className="font-mono mt-1 underline"
                        target="_blank"
                    >
                        <h2>{item.address}</h2>
                    </a>
                </div>


                {item.resolved && item.safe && (
                    <div>
                        <div className="font-bold mb-1">Safe Address: </div>
                        <a
                            href={`${config.scanUrl}/address/${item.safe}`}
                            rel="noreferrer"
                            className="font-mono mt-1 underline"
                            target="_blank"
                        >
                            {item.safe}
                        </a>{" "}
                    </div>
                )}


                {item.resolved && (
                    <button className="btn btn-success text-white mt-2">Resolved</button>
                )}
                {!item.resolved && (<><p className="text-yellow-700 font-bold dark:text-yellow-400 text-md mt-8">Funding Goal: {formatEtherValue(item.sum)}</p>
                    <p className="text-red-700 font-bold dark:text-red-400 text-lg leading-[0px]">Deadline: {outputDateString.toString()}</p></>)}


                {!item.resolvable && !item.resolved && (


                    <div className="w-full flex flex-wrap justify-center items-center">

                        <button className="btn btn-success" onClick={() => window.open(`https://${window.location.host}/pact/${item.address}`, "_blank")}>
                            Contribute
                        </button>
                    </div>

                )}
            </div>
        </div >
    )
}


