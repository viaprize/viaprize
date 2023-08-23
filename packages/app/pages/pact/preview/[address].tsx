import Contribute from "@/components/Contribute";
import config from "@/config";
import { PactDetail } from "@/lib/types"
import axios from "../../../lib/axios";
import usePactContract from "contract/usePactContract";
import { useState } from "react";
import web3 from "web3";
import Eth from "web3-eth";
import Web3 from "web3";
import MulticallABI from "../../../contract/abi/Multicall.json";
import PactABI from "../../../contract/abi/Pact.json"
import { AbiItem } from "ethereum-multicall/dist/esm/models";
import { GetServerSidePropsContext } from "next";
interface PackPreviewProp {
    item: PactDetail;


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

    const calls = [
        [pactAddress, pactContract.methods.safe().encodeABI()],
        [pactAddress, pactContract.methods.resolved().encodeABI()],
        [pactAddress, pactContract.methods.resolvable().encodeABI()],
    ];

    const res = await multicall.methods.aggregate(calls).call();

    return {
        safe: web3.eth.abi.decodeParameter("address", res["returnData"][0]),
        resolved: web3.eth.abi.decodeParameter("bool", res["returnData"][1]),
        resolvable: web3.eth.abi.decodeParameter("bool", res["returnData"][2]),
    };
}
export default function PackPreview({ item }: PackPreviewProp) {



    return (
        <div className="card  bg-gray-300 w-72 h-[650px]  shadow-xl">



            <img src={"https://picsum.photos/200"} style={{
                borderRadius: "5px",

                marginTop: "8px",
                marginInline: "auto",

            }} width={"90%"} height={"200px"} />
            <div className="card-body justify-between  break-words">

                <div className="card-title break-words">{item.name}</div>
                <div className="mt-1">Terms: {item.terms}</div>
                <div className="mt-1">Balance: {item.balance} ETH</div>
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

                {!item.resolvable && !item.resolved && (
                    <div>
                        {/* <Contribute address={item.address} onContributed={onRefresh} /> */}
                        <div className="w-full flex flex-wrap justify-center items-center">

                            <button className="btn" onClick={() => window.open("https://pact-ruddy.vercel.app", "_blank")}>
                                Contribute
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const address = context.params?.address;
    if (!address) {
        return {
            notFound: true,
        }
    }
    const res = await axios.get("/pact", {
        params: {
            address,
        },
    });

    const provider = new Web3.providers.HttpProvider(config.provider)
    const web3 = new Web3(provider)
    const eth = new Eth(
        provider
    );


    return {
        props: {
            item: {
                ...res,
                //@ts-ignore
                balance: web3.utils.fromWei(await eth.getBalance(address)),
                ...await getPactInfo(address as string),
            }
        }
    }
}
