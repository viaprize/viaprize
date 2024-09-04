export class Wallet {
  url: string
  constructor(url: string) {
    this.url = url
  }
  async generateWallet() {
    // Generate a wallet
    const res: { address: string; key: string } = (await (
      await fetch(this.url + '/wallet/generate')
    ).json()) as any
    return res
  }
}
