import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import "./index.css";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0B0F19",
      paper: "#111827",
    },
    primary: {
      main: "#8B5CF6",
    },
    secondary: {
      main: "#06B6D4",
    },
    text: {
      primary: "#F9FAFB",
      secondary: "#94A3B8",
    },
  },
  typography: {
    fontFamily: "Space Grotesk",
    h5: {
      fontFamily: "Space Grotesk",
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
