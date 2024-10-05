"use client";

import { env } from "@/env";
import { useAuth } from "@/hooks/useAuth";
import { wagmiConfig } from "@/lib/wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  ERC20_PERMIT_SIGN_TYPE,
  NONCE_TOKEN_ABI,
} from "@viaprize/core/lib/abi";
import {
  CONTRACT_CONSTANTS_PER_CHAIN,
  type ValidChainIDs,
} from "@viaprize/core/lib/constants";

import { Badge } from "@viaprize/ui/badge";
import { Button } from "@viaprize/ui/button";
import { Card } from "@viaprize/ui/card";
import { parseSignature } from "viem";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@viaprize/ui/dialog";

import { usdcSignTypeHash } from "@/lib/utils";
import { Input } from "@viaprize/ui/input";
import Image from "next/image";
import { useState } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import { readContract } from "wagmi/actions";
// Define the props type
interface DonateCardProps {
  projectName: string;
  funds: number;
  projectImage: string;
  contractAddress: string;
}

export default function DonateCard({
  projectName,
  funds,
  contractAddress,
  projectImage,
}: DonateCardProps) {
  const [amount, setAmount] = useState("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string, non-negative numbers, and decimals
    if (
      value === "" ||
      (/^\d*\.?\d*$/.test(value) && !Number.isNaN(Number.parseFloat(value)))
    ) {
      setAmount(value);
    }
  };
  const { openConnectModal } = useConnectModal();
  const { address, isReconnecting, isConnected, isConnecting } = useAccount();
  console.log(address, "addressss");
  console.log(isReconnecting, "isReconnecting");
  console.log(isConnected, "isConnected");
  console.log(isConnecting, "isConnecting");
  const { hasUserOnBoarded, session } = useAuth();
  const { signTypedDataAsync } = useSignTypedData();
  const handleCryptoDonation = async () => {
    console.log("Donation with wallet");
    try {
      if (!address) {
        throw new Error("No wallet connected found");
      }
      const chainId = Number.parseInt(
        env.NEXT_PUBLIC_CHAIN_ID
      ) as ValidChainIDs;
      const constants = CONTRACT_CONSTANTS_PER_CHAIN[chainId];

      const amountInUSDC = BigInt(Number.parseFloat(amount) * 1000000);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 100_000);
      const nonce = await readContract(wagmiConfig, {
        abi: NONCE_TOKEN_ABI,
        address: constants.USDC,
        functionName: "nonces",
        args: [address],
      });
      const signData = {
        owner: address,
        spender: contractAddress,
        value: amount,
        nonce: BigInt(nonce),
        deadline: deadline,
      };
      const { hash, usdcSign } = usdcSignTypeHash({
        chainId,
        deadline,
        nonce: BigInt(nonce),
        owner: address,
        spender: contractAddress,
        value: amountInUSDC,
        usdcContract: constants.USDC,
      });
      const signature = await signTypedDataAsync({
        types: ERC20_PERMIT_SIGN_TYPE,
        primaryType: "Permit",
        domain: usdcSign.domain,
        message: usdcSign.message,
      });
      const rsv = parseSignature(signature);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Card className="w-full p-4 lg:flex items-center space-y-3 lg:space-y-0">
        <div className="w-full lg:w-[60%]">
          <div className="text-2xl text-primary font-medium">{funds}</div>
          <div>Total Raised</div>
        </div>
        <div className="w-full space-y-2">
          <div className="relative w-full">
            <Input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter Amount"
              className="w-full"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="w-full"
                disabled={!amount || Number.parseFloat(amount) <= 0}
              >
                Donate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-normal text-xl">
                  {projectName}
                </DialogTitle>
              </DialogHeader>
              <div className="">
                <Image
                  alt={projectName}
                  src={projectImage}
                  quality={100}
                  width={100}
                  height={100}
                  className="w-full max-h-[200px] "
                />
              </div>
              <div className="grid gap-4 py-4">
                {session?.user ? (
                  <>
                    <Button>Donate ${amount} with Card</Button>

                    {session?.user?.wallet?.key ? (
                      <Button>Donate ${amount} with custodial wallet</Button>
                    ) : null}

                    {address ? (
                      <Button>Donate ${amount}</Button>
                    ) : (
                      <Button onClick={openConnectModal}>Connect Wallet</Button>
                    )}
                  </>
                ) : (
                  <>
                    <Badge className="text-sm">
                      Anonymous Donation without voting rights
                    </Badge>
                    <Button>Donate ${amount} with Card Anonymously</Button>

                    {address ? (
                      <Button onClick={handleCryptoDonation}>
                        Donate ${amount} with Wallet Anonymously
                      </Button>
                    ) : (
                      <Button onClick={openConnectModal}>Connect Wallet</Button>
                    )}
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </>
  );
}
