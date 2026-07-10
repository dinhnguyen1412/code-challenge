import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import CurrencyAmountInput from "./CurrencyAmountInput";
import { getTokens } from "../services/token.service";
import type { Token } from "../types/token";

export default function CurrencySwap() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  /**
   * Fetch tokens
   */
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const processedTokens = await getTokens();
        setTokens(processedTokens);
        setFromToken(
          processedTokens.find((item) => item.currency === "ETH") ??
            processedTokens[0],
        );
        setToToken(
          processedTokens.find((item) => item.currency === "USDC") ??
            processedTokens[1] ??
            null,
        );
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to load currencies",
        );
      } finally {
        setFetchLoading(false);
      }
    };
    fetchTokens();
  }, []);

  /**
   * Calculate received amount
   */

  const numericAmount = Number(amount);

  const receiveAmount =
    fromToken && toToken && numericAmount > 0
      ? (numericAmount * fromToken.price) / toToken.price
      : 0;

  /**
   * Check disable button
   */
  const canSwap = Boolean(
    fromToken &&
    toToken &&
    amount &&
    numericAmount > 0 &&
    fromToken.currency !== toToken.currency &&
    !loading,
  );

  /**
   * Swap selected token
   */
  const handleSwapSelected = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  /**
   * Submit swap
   */
  const handleSwap = async () => {
    if (!canSwap) {
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setSuccessMessage(true);
    setAmount("");
  };

  if (fetchLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 460,
        mx: "auto",
        mt: 8,
        p: 4,
        background: "linear-gradient(145deg,#111827,#0B0F19)",
        border: "1px solid #1f2937",
        boxShadow: "0 20px 50px rgba(0,0,0,.4)",
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight={700} textAlign="center">
          Currency Swap
        </Typography>
        <Box>
          <Typography mb={1}>Amount to send</Typography>
          <Stack spacing={2}>
            <CurrencyAmountInput
              amount={amount}
              token={fromToken}
              tokens={tokens}
              disabledToken={toToken}
              onAmountChange={setAmount}
              onTokenChange={setFromToken}
            />
          </Stack>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <Tooltip title="Swap tokens" placement="right" arrow>
            <IconButton
              onClick={handleSwapSelected}
              sx={{
                width: 44,
                height: 44,
                background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                color: "#fff",
                border: "4px solid #0B0F19",
                boxShadow: "0 8px 20px rgba(0,0,0,.4)",
                transition: "all .25s ease",
                "&:hover": {
                  background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
                  transform: "rotate(180deg)",
                },
              }}
            >
              <SwapVertIcon
                sx={{
                  fontSize: 26,
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>
        <Box>
          <Typography mb={1}>Amount to receive</Typography>
          <CurrencyAmountInput
            amount={receiveAmount > 0 ? receiveAmount.toFixed(6) : ""}
            token={toToken}
            tokens={tokens}
            disabledToken={fromToken}
            readOnly
            onAmountChange={() => {}}
            onTokenChange={setToToken}
          />
        </Box>
        {receiveAmount > 0 && (
          <Alert severity="info">
            Estimated receive:
            <strong>
              {" "}
              {receiveAmount.toFixed(6)} {toToken?.currency}
            </strong>
          </Alert>
        )}
        <Button
          variant="contained"
          size="large"
          disabled={!canSwap}
          onClick={handleSwap}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "CONFIRM SWAP"
          )}
        </Button>
      </Stack>
      <Snackbar
        open={successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(false)}
      >
        <Alert severity="success" variant="filled">
          Swap successful!
        </Alert>
      </Snackbar>
      {error && (
        <Snackbar open>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </Paper>
  );
}
