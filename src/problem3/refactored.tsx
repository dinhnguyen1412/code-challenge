import React, { useMemo } from "react";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Fix: Added missing property
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

const PRIORITY: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};
const WalletPage: React.FC<{ Props }> = (props: Props) => {
  const { children, ...rest } = props;
  const balances: WalletBalance[] = [];
  const prices: { [key: string]: number } = {};

  const getPriority = (blockchain: string) => PRIORITY[blockchain] ?? -99;

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // Fix: Corrected filtering logic
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      });
  }, [balances]); // Fix: Removed unnecessary 'prices' dependency

  // Fix: Removed unused 'formattedBalances' variable

  const rows = sortedBalances.map((balance: FormattedWalletBalance) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        key={balance.currency} // Fix: Used unique currency instead of index
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.amount.toFixed()} // Fix: Formatting moved here
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};
