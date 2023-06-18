export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const switchChain = async (chainId) => {
  await ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: `0x${chainId.toString(16)}` }],
  });
};

export function copyText(text) {
  const copied = document.createElement("input");
  copied.setAttribute("value", text);
  document.body.appendChild(copied);
  copied.select();
  document.execCommand("copy");
  document.body.removeChild(copied);
}

export const filterDuplicateNodes = (arr) => {
  return arr.filter(
    (v, i, a) => a.findIndex((v2) => v2.address === v.address) === i
  );
};


export const shortenAddr = (address, length = 3) => {
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};