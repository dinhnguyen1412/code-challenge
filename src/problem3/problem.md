1. interface `WalletBalance` (line 1) : Missing `blockchain` property that used in line 38, 46, 47, 
    ==> fix: 
    ```tsx
    interface WalletBalance {
        currency: string;
        blockchain: string;
        amount: number;
    }```

2. Incorrect `useMemo` dependencies (line 54): `prices` is not referenced inside the callback.
    ==> fix: `}, [balances]);`

3. Should not use type `any` in typescript (line 19)
    ==> fix: use type `string`

4. `lhsPriority` variable is not defined (line 39) ==> it should be`balancePriority`

5. `formattedBalances`(line 56) variable is never used (line 38), it creates unnecessary work on every render.

6. `switch` statement (line 20) can be used but it is hard to scale 
    ==> fix: use lookup object instead
    ```tsx
    const PRIORITY: Record<string, number> = {
        Osmosis: 100,
        Ethereum: 50,
        Arbitrum: 30,
        Zilliqa: 20,
        Neo: 20
    };

    const getPriority = (blockchain: string) =>
    PRIORITY[blockchain] ?? -99;```

7. `sortedBalances` doesn't contain the `formatted` property(line 71)
    ==> fix: use Use `formattedBalances` instead

8. Avoid using array index as React key (line 68)
    fix: Use an unique and stable identifier, like `balance.currency`

9. Sort function must be reutrn number (line 48 -> 52). Missing case `leftPriority == rightPriority` => return `undefined`
    ```tsx
    if (leftPriority > rightPriority) {
        return -1;
    } else if (rightPriority > leftPriority) {
        return 1;
    }
    ```
    
    ==> fix: `return rightPriority - leftPriority;`
10. `balance.amount <= 0` returns only negative balances (line 40), that's seem wrong → flip to `balance.amount > 0` to display positive balances (line 40) 
    ==> fix:
    `return balancePriority > -99 && balance.amount > 0`