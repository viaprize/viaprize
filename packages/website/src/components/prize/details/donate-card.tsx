"use client";

import { Button } from "@viaprize/ui/button";
import { Card } from "@viaprize/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@viaprize/ui/dialog";
import { Input } from "@viaprize/ui/input";
import { useState } from "react";

// Define the props type
interface DonateCardProps {
  title: string;
}

export default function DonateCard({ title }: DonateCardProps) {
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

  return (
    <>
      <Card className="w-full p-4 lg:flex items-center space-y-3 lg:space-y-0">
        <div className="w-full lg:w-[60%]">
          <div className="text-2xl text-primary font-medium">$1000</div>
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
                <DialogTitle>
                  Donate ${amount} to {title}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Button
                  onClick={() => {
                    console.log("Donating with card:", amount);
                    // Handle donation logic here
                  }}
                >
                  Donate with Card
                </Button>
                <Button
                  onClick={() => {
                    console.log("Donating with crypto:", amount);
                    // Handle donation logic here
                  }}
                >
                  Donate with Crypto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </>
  );
}
