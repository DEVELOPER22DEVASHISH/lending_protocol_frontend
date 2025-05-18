import AssetsLTokenAbi from "../constants/abi/AssetsLToken.json";
import AssetsDebtTokenAbi from "../constants/abi/AssetsDebtToken.json";

export const ASSETS = {
  dai: {
    symbol: "DAI",
    address: import.meta.env.VITE_DAI_ADDRESS as `0x${string}`,
    decimals: 18,
    lToken: {
      address: import.meta.env.VITE_LTOKEN_DAI_ADDRESS as `0x${string}`,
      abi: AssetsLTokenAbi,
    },
    debtToken: {
      address: import.meta.env.VITE_DEBTTOKEN_DAI_ADDRESS as `0x${string}`,
      abi: AssetsDebtTokenAbi,
    },
  },
  usdc: {
    symbol: "USDC",
    address: import.meta.env.VITE_USDC_ADDRESS as `0x${string}`,
    decimals: 6,
    lToken: {
      address: import.meta.env.VITE_LTOKEN_USDC_ADDRESS as `0x${string}`,
      abi: AssetsLTokenAbi,
    },
    debtToken: {
      address: import.meta.env.VITE_DEBTTOKEN_USDC_ADDRESS as `0x${string}`,
      abi: AssetsDebtTokenAbi,
    },
  },
  usdt: {
    symbol: "USDT",
    address: import.meta.env.VITE_USDT_ADDRESS as `0x${string}`,
    decimals: 6,
    lToken: {
      address: import.meta.env.VITE_LTOKEN_USDT_ADDRESS as `0x${string}`,
      abi: AssetsLTokenAbi,
    },
    debtToken: {
      address: import.meta.env.VITE_DEBTTOKEN_USDT_ADDRESS as `0x${string}`,
      abi: AssetsDebtTokenAbi,
    },
  },
};
