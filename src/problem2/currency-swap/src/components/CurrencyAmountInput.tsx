import {
  Avatar,
  Box,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
  Popper,
  Paper,
  InputBase,
} from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { KeyboardArrowDown, Search, Check } from "@mui/icons-material";
import { useState } from "react";
import type { Token } from "../types/token";

interface Props {
  label?: string;
  amount: string;
  token: Token | null;
  tokens: Token[];
  disabledToken?: Token | null;
  readOnly?: boolean;
  onAmountChange: (value: string) => void;
  onTokenChange: (token: Token) => void;
}

export default function CurrencyAmountInput({
  amount,
  token,
  tokens,
  disabledToken,
  readOnly,
  onAmountChange,
  onTokenChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [search, setSearch] = useState("");
  const filteredTokens = tokens.filter((item) =>
    `${item.currency}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Box position="relative">
      <TextField
        fullWidth
        value={amount}
        type="text"
        placeholder="0.00"
        inputProps={{
          inputMode: "decimal",
        }}
        disabled={readOnly}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*\.?\d*$/.test(value)) {
            onAmountChange(value);
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Box
                ref={(node: HTMLElement | null) => {
                  setAnchor(node);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  component="button"
                  type="button"
                  onClick={() => setOpen(!open)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    border: 0,
                    background: "transparent",
                    color: "#fff",
                    cursor: "pointer",
                    p: 0,
                    fontWeight: 600,
                    fontSize: 16,
                    "&:hover": {
                      opacity: 0.8,
                    },
                  }}
                >
                  {token && (
                    <Avatar
                      src={token.icon}
                      sx={{
                        width: 26,
                        height: 26,
                      }}
                    />
                  )}
                  <span>{token?.currency}</span>
                  <KeyboardArrowDown
                    sx={{
                      transition: "0.2s",
                      transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </Box>
              </Box>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            bgcolor: "#111827",
            borderRadius: "16px",
            color: "#fff",
            "& fieldset": {
              borderColor: "rgba(255,255,255,0.15)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(139,92,246,0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#8b5cf6",
            },
          },
          "& input": {
            textAlign: "right",
            color: "#fff",
            fontSize: "24px",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            paddingRight: "16px",
          },
          "& .MuiInputLabel-root": {
            color: "rgba(255,255,255,0.5)",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#a78bfa",
          },
          "& input[type=number]::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "& input[type=number]::-webkit-outer-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
        }}
      />
      <Popper
        open={open}
        anchorEl={anchor}
        placement="bottom-start"
        sx={{
          zIndex: 9999,
        }}
      >
        <ClickAwayListener
          onClickAway={() => {
            setOpen(false);
            setSearch("");
          }}
        >
          <Paper
            sx={{
              mt: 1,
              width: 300,
              bgcolor: "#111827",
              border: "1px solid #312e81",
              color: "#fff",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                borderBottom: "1px solid rgba(255,255,255,.1)",
              }}
            >
              <Search
                fontSize="small"
                sx={{
                  color: "gray",
                }}
              />
              <InputBase
                placeholder="Search token"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  color: "#fff",
                  width: "100%",
                  fontSize: 14,
                }}
              />
            </Box>
            <Box
              sx={{
                maxHeight: 280,
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: 6,
                },
                "&::-webkit-scrollbar-track": {
                  background: "#111827",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#4c1d95",
                  borderRadius: 10,
                },
              }}
            >
              {filteredTokens.map((option) => (
                <MenuItem
                  key={option.currency}
                  disabled={option.currency === disabledToken?.currency}
                  onClick={() => {
                    onTokenChange(option);
                    setOpen(false);
                    setSearch("");
                  }}
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    py: 1,
                    "&:hover": {
                      bgcolor: "rgba(139,92,246,.15)",
                    },
                  }}
                >
                  <Avatar
                    src={option.icon}
                    sx={{
                      width: 32,
                      height: 32,
                    }}
                  />
                  <Box flex={1}>
                    <Typography fontWeight={600}>{option.currency}</Typography>
                    <Typography variant="caption" color="gray">
                      ${option.price.toFixed(4)}
                    </Typography>
                  </Box>
                  {token?.currency === option.currency && (
                    <Check
                      fontSize="small"
                      sx={{
                        color: "#22c55e",
                      }}
                    />
                  )}
                </MenuItem>
              ))}
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
}
