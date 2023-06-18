export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const switchChain = async (chainId) => {
  await ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: `0x${chainId.toString(16)}` }],
  });
};

export const shortenAddress = (address, unit) => {
  const unitLength = unit || 3;
  return `${address.slice(0, unitLength)}...${address.slice(-unitLength)}`;
};

export function copyToClipboard(text) {
  const copied = document.createElement("input");
  copied.setAttribute("value", text);
  document.body.appendChild(copied);
  copied.select();
  document.execCommand("copy");
  document.body.removeChild(copied);
}

export const formatIPFS = (url) => {
  return url.replace("ipfs://", "https://ipfs.io/ipfs/");
};
