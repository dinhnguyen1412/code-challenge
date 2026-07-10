import type { Token, TokenResponse } from "../types/token";

const TOKEN_ICON_URL = "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens";
const API_URL = "https://interview.switcheo.com/prices.json";

export async function getTokens(): Promise<Token[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch tokens");
  }
  const data: TokenResponse[] = await response.json();
  const tokens = Array.from(
    new Map<string, Token>(
      data
        .filter(
          (item) =>
            item.currency &&
            Number.isFinite(item.price) &&
            item.price > 0,
        )
        .map((item) => [
          item.currency,
          {
            currency: item.currency,
            price: item.price,
            icon: `${TOKEN_ICON_URL}/${item.currency}.svg`,
          },
        ]),
    ).values(),
  );
  return tokens.sort((a, b) =>
    a.currency.localeCompare(b.currency),
  );
}