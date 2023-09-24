import { Badge, Card, Group, } from "@mantine/core";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";


export default function SwitchAccount() {
  const { login, ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();

  if (!ready) return null;

  if (!authenticated) {
    // Use Privy login instead of wagmi's connect
    return <button onClick={() => { login(); }}>login</button>;
  }
  return (
    <div>
      {wallets.map((wallet) => (
        <Card
          key={wallet.address}
          onClick={() => setActiveWallet(wallet)}
          withBorder
          radius="sm"
          className="cursor-pointer transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Group position="apart">
            {wallet.address}
            {wallet.address === activeWallet?.address && (
              <Badge
                color={
                  wallet.address === activeWallet.address ? "green" : "gray"
                }
                variant="light"
              >
                {wallet.address === activeWallet.address
                  ? "Active"
                  : "Inactive"}
              </Badge>
            )}
          </Group>
        </Card>
      ))}
    </div>
  );
}
