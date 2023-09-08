import {useLogout, usePrivy, useWallets} from '@privy-io/react-auth';
import {usePrivyWagmi} from '@privy-io/wagmi-connector';

const TestPrivyAndWagmi = () => {
    const {login, ready, logout, authenticated} = usePrivy();
    const {wallets} = useWallets();
    const {wallet: activeWallet, setActiveWallet} = usePrivyWagmi();
  
    if (!ready) return null;
  
    if (!authenticated) {
      return <button onClick={() => login()}>login</button>;
    }
  
    return (
      <div>
        {authenticated && (
          <>
            <h2>Active Wallet: {activeWallet?.address}</h2>
            <button onClick={() => logout()}>logout</button>
          </>
        )}
        <ul>
          {wallets.map((wallet) => (
            <li key={wallet.address}>
              <button onClick={() => setActiveWallet(wallet)}>Activate {wallet.address}</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  

export default TestPrivyAndWagmi;