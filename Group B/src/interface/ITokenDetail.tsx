export interface ITokenDetail {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

// export interface ITokenInteraction {
//   balanceOf: (account: string) => Promise<string>;
//   allowance: (owner: string, spender: string) => Promise<string>;
//   transfer: (to: string, amount: string) => Promise<void>;
//   approve: (spender: string, amount: string) => Promise<void>;
//   transferFrom: (from: string, to: string, amount: string) => Promise<void>;
// }