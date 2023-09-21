import type { NextPage } from 'next';
import useWeb3Context from '@/context/hooks/useWeb3Context';
import AppHeader from '@/components/layout/switchWallet';
import axios from '../../lib/axios';
import usePactFactory from '../../contract/usePactFactory';

import cn from 'classnames';
import { useEffect, useState } from 'react';
import HistoryItem from '@/components/HistoryItem';
import { Loader } from '@mantine/core';
import { DatePicker, DateValue } from '@mantine/dates';

const tabs = ['about', 'create', 'preview'];

const Home: NextPage = () => {
  const [amount, setAmount] = useState('');
  const [terms, setTerms] = useState('');
  const [projectName, setProjectName] = useState('');
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(['']);
  const [rawEndDate, setRawEndDate] = useState<Date>();
  const [historyList, setHistoryList] = useState([]);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [endDate, setEndDate] = useState<number>(0);
  const { account, connectWallet, web3 }: any = useWeb3Context();
  const pactFactory = usePactFactory();

  const doCreate = async () => {
    console.log('creating...................');
    setCreating(true);
    try {
      const res: any = await pactFactory.createPact(terms, endDate, amount, address);
      if (res.status) {
        await axios.post('/pact', {
          name: projectName,
          terms: terms,
          address: res.events.Create.returnValues[0],
          transactionHash: res.transactionHash,
          blockHash: res.blockHash,
        });
        setActiveTab(tabs[2]);
      }
    } catch (err) {
      console.log('err create', err);
    } finally {
      setCreating(false);
    }
  };

  const onAddressChange = (index: number, value: string) => {
    setAddress((prev: any) => {
      prev[index] = value;
      return [...prev];
    });
  };

  const addAddress = () => {
    setAddress((prev: string[]) => {
      return [...prev, ''];
    });
  };

  const removeAddress = (index: number) => {
    setAddress((prev) => {
      const arr = JSON.parse(JSON.stringify(prev));
      arr.splice(index, 1);
      return [...arr];
    });
  };

  const dateChange = (val: DateValue) => {
    if (!val) return;
    setRawEndDate(val);
    const timestamp = val.getDate() / 1000;
    setEndDate(timestamp);
  };

  useEffect(() => {
    if (!account) {
      return;
    }
  }, [account]);

  const getHistoryList = async (skipLoading = false) => {
    if (!skipLoading) {
      setLoading(true);
    }
    const res: any = await axios.get('/pacts');
    // get balances
    // for (let i = 0; i < res.length; i++) {
    //   const pactAddress = res[i].address;

    //   res[i] = {
    //     ...res[i],
    //     // ...await pactContract.getPactInfo(pactAddress)
    //   };
    // }
    setHistoryList(res);
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === tabs[2] && account && getHistoryList) {
      getHistoryList();
    }
  }, [activeTab, account]);

  return (
    <div>
      <div className="pb-32">
        <AppHeader />
        <div className="flex flex-col items-center justify-center h-full max-w-[90%] mx-auto">
          <div className="tabs tabs-boxed mb-6">
            {tabs.map((item: string) => (
              <a
                key={item}
                className={cn(
                  'tab tab-boxed tab-lg capitalize',
                  activeTab === item && 'tab-active',
                )}
                onClick={() => setActiveTab(item)}
              >
                {item}
              </a>
            ))}
          </div>

          {activeTab === tabs[0] && (
            <div className="max-w-[90%] mx-auto text-xl  p-8 card bg-base-100 shadow-xl text-gray-500">
              <p className="font-bold">
                Pactsmith.com is a platform to deploy{' '}
                <a
                  target="_blank"
                  className="underline"
                  rel="noreferrer"
                  href="https://en.wikipedia.org/wiki/Assurance_contract"
                >
                  assurance contracts
                </a>
                .
              </p>
              <p>To create a pact:</p>
              <p>1. Name your pact</p>
              <p>2. Write the terms of your pact</p>
              <p>3. Set the target funding goal</p>
              <p>4. Determine a deadline</p>
              <p>5. Add the wallet addresses of admins</p>
              <p>
                If the target goal is met before the deadline, the funds will immediately
                transfer into a Gnosis wallet which admins control. Admins are responsible
                to enact the transactions defined in the terms. If the target goal is not
                met when the deadline is reached, then funds will automatically be
                refunded to contributors.
              </p>
            </div>
          )}

          {activeTab === tabs[1] && (
            <>
              <div className="flex flex-col gap-4 mb-4 dark:text-white">
                <div className="mb-4">
                  <h1 className="text-xl mb-2 font-medium dark:text-gray-900">Name</h1>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Name"
                      className="input input-bordered w-full "
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <h1 className="text-xl mb-1 font-medium dark:text-gray-900">Terms</h1>
                  <textarea
                    className="textarea w-full input-bordered"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    placeholder="Terms"
                  />
                </div>

                <div className="mb-4 flex gap-3 ">
                  <div>
                    <h1 className="text-xl mb-2 font-medium dark:text-gray-900">
                      Funding Goal (in ETH)
                    </h1>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        placeholder="Funding Goal"
                        className="input input-bordered"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl mb-2 font-medium dark:text-gray-900">
                      Deadline
                    </h1>
                    <div className="flex items-center gap-4">
                      {/*@ts-ignore */}

                      <DatePicker
                        defaultDate={new Date(2015, 1)}
                        value={rawEndDate}
                        onChange={(val: DateValue) => dateChange(val)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h1 className="text-xl mb-2 font-medium dark:text-gray-900">
                    Admin Addresses
                  </h1>

                  <div className="flex items-center gap-4 flex-col">
                    {address.map((item, index) => (
                      <div className="flex w-full gap-2" key={index}>
                        <input
                          type="text"
                          placeholder="Address"
                          className="input input-bordered w-full"
                          value={item}
                          onChange={(e) => onAddressChange(index, e.target.value)}
                        />
                        {address.length > 1 && (
                          <button
                            className="btn btn-square"
                            onClick={() => removeAddress(index)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button className="btn btn-square mt-4" onClick={addAddress}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mb-4">
                  {account ? (
                    <a
                      className={cn('btn w-full', creating && 'loading')}
                      onClick={doCreate}
                    >
                      Create
                    </a>
                  ) : (
                    <a className={cn('btn w-full')} onClick={connectWallet}>
                      Connect Wallet
                    </a>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === tabs[2] && (
            <div className="max-w-[90%] mx-auto">
              {account ? (
                <>
                  {loading ? (
                    <div className="text-4xl mt-8">
                      <Loader color="cyan" />
                    </div>
                  ) : historyList.length > 0 ? (
                    <>
                      {historyList.map((item: any, index) => (
                        <HistoryItem
                          pictureVisible={false}
                          key={index}
                          item={item}
                          address={item.address}
                        />
                      ))}
                    </>
                  ) : (
                    <>Empty.</>
                  )}
                </>
              ) : (
                <a className={cn('btn w-full mt-8')} onClick={connectWallet}>
                  Connect Wallet
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
