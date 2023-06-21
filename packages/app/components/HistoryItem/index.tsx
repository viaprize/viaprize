import React, { useEffect, useState } from "react";
import Contribute from "../Contribute";
import Link from "next/link";
import usePactContract from "contract/usePactContract";
import config from "@/config";

export default function HistoryItem({ item, address, pictureVisible }: any) {
  const [loaded, setLoaded] = useState(false);
  const [detail, setDetail] = useState<any>({});
  const pactContract = usePactContract();

  const getDetail = async () => {
    try {
      const res = await pactContract.getPactInfo(address);
      setDetail(res);
      setLoaded(true);
    } catch (err) {
      // if error, recall
      setTimeout(() => {
        getDetail();
      }, 1000);
    }
  };

  const doResolve = async () => {
    await pactContract.resolve(item.address);
    getDetail();
    // onRefresh();
  };

  useEffect(() => {
    if (!address || loaded) {
      return;
    }
    getDetail();
  }, [address]);

  return (
    <div className="card bg-base-100 shadow-xl mb-4">
      <div className="card-body break-words">
        {pictureVisible && config.pictures[item.address] && (
          <img
            src={config.pictures[item.address]}
            className="rounded-xl mb-3"
          />
        )}
        <Link href={`/pact/${item.address}`}>
          <a className="card-title break-words inline-block hover:underline">
            {item.name}
          </a>
        </Link>
        <div className="mt-1">Terms: {item.terms}</div>
        <div className="mt-1">Balance: {detail.balance} ETH</div>
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

        {detail.resolved && detail.safe && (
          <div>
            <div className="font-bold mb-1">Safe Address: </div>
            <a
              href={`${config.scanUrl}/address/${detail.safe}`}
              rel="noreferrer"
              className="font-mono mt-1 underline"
              target="_blank"
            >
              {detail.safe}
            </a>{" "}
          </div>
        )}

        {detail.resolvable && !detail.resolved && (
          <button className="btn" onClick={() => doResolve()}>
            Resolve
          </button>
        )}

        {detail.resolved && (
          <button className="btn btn-success text-white mt-2">Resolved</button>
        )}

        {!detail.resolvable && !detail.resolved && (
          <div>
            <Contribute address={item.address} onContributed={getDetail} />
          </div>
        )}
      </div>
    </div>
  );
}
