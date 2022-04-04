import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import fonts from "./fonts";
import SquareWOFF from "src/assets/fonts/EuclidSquare-Regular.woff";

const lightTheme = {
  color: "#253449",
  gold: "#F8CC82",
  gray: "#A3A3A3",
  blueish_gray: "#768299",
  textHighlightColor: "#3BA04B", // "#F4D092",
  backgroundColor: "#ffffff",
  // background:
  // "radial-gradient(circle at 25% 0%, rgba(227,255,240,.5), rgba(227,255,240,0) 50%), radial-gradient(circle at 80% 80%, rgba(131,165,203,.5), rgba(131,165,203,0) 50%)",
  background: "linear-gradient(180deg, #EEF7F2 1%, #F7FBE7 100%)",
  paperBg: "#FFFFFF",
  modalBg: "#FAFAFAEF",
  popoverBg: "rgba(255, 255, 255, 0.95)",
  menuBg: "rgba(255, 255, 255, 0.5)",
  backdropBg: "rgba(200, 200, 200, 0.4)",
  largeTextColor: "#08971e",
  activeLinkColor: "#222222",
  activeLinkSvgColor: "invert(64%) sepia(11%) saturate(934%) hue-rotate(157deg) brightness(90%) contrast(86%)",
  // primaryButtonBG: "#08971e",
  primaryButtonBG: "#3BA04B",
  primaryButtonHoverBG: "#08971e",
  // these need fixing
  primaryButtonHoverColor: "#FCFCFC",
  secondaryButtonHoverBG: "rgba(54, 56, 64, 1)",
  outlinedPrimaryButtonHoverBG: "#F8CC82",
  outlinedPrimaryButtonHoverColor: "#FCFCFC",
  outlinedSecondaryButtonHoverBG: "#FCFCFC",
  outlinedSecondaryButtonHoverColor: "#FCFCFC",
  containedSecondaryButtonHoverBG: "#FCFCFC33",
  graphStrokeColor: "rgba(37, 52, 73, .2)",
};

export const light = responsiveFontSizes(
  createTheme({
    palette: {
      type: "light",
    },
    typography: {
      fontFamily: "'Square', sans-serif",
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: lightTheme.backgroundColor,
            boxShadow: "none",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: lightTheme.backgroundColor,
            boxShadow: "none",
            width: 280,
            padding: 30,
            color: "#ffffff",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            padding: "0!important",
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            fontSize: "0.75rem",
            lineHeight: 1,
            borderRadius: 4,
          },
          filledError: {
            backgroundColor: "#f44336",
            fontWeight: 500,
          },
        },
      },
      MuiAlertTitle: {
        styleOverrides: {
          root: {
            fontSize: "0.875rem",
            marginBottom: "0.35em",
            marginTop: -2,
            lineHeight: 1,
            fontWeight: 500,
          },
        },
      },
    },
  }),
);
