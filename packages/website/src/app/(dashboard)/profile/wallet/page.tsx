"use client"
import { api } from '@/trpc/react';
import { Button } from '@viaprize/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@viaprize/ui/card';
import { Input } from '@viaprize/ui/input';
import { Label } from "@viaprize/ui/label";
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatUnits, isAddress } from 'viem';

const WalletPage: React.FC = () => {
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [balance, balanceQuery] = api.users.usdcBalance.useSuspenseQuery();
    const { mutateAsync: sendTokens, isPending } = api.users.sendToken.useMutation();

    const handleSendAmount = async () => {
        try {

            // Validate address using isAddress from viem
            if (!isAddress(address)) {
                throw new Error('Invalid address provided.');
            }

            const amountNumber = Number.parseFloat(amount) * 1e6;
            if (Number.isNaN(amountNumber) || amountNumber <= 0) {
                throw new Error('Please enter a valid amount greater than zero.');
            }

            // Ensure the amount does not exceed the balance
            if (amountNumber > Number.parseInt(balance)) {
                throw new Error('Insufficient balance for this transaction.');
            }
            const hash = await sendTokens({ to: address, amount: amountNumber });

            await balanceQuery.refetch();






            toast.success('Amount sent successfully!');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address
                            </Label>
                            <Input
                                id="address"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter wallet address"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount"
                                className="mt-1"
                            />
                        </div>
                        <Button disabled={isPending} onClick={handleSendAmount} className="w-full">
                            {isPending ? "Loading..." : "Send Amount"}
                        </Button>
                        <div className="text-center mt-4">
                            <span className="text-lg font-semibold">
                                Balance: ${formatUnits(BigInt(balance), 6)} USD
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default WalletPage;
