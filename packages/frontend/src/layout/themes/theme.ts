/*
 * Copyright © 2025 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { Color, SimplePaletteColorOptions } from "@mui/material";
import { grey, teal } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

import { roboto } from "@/pages/_app";

import { ChipStyles } from "./Chip";

declare module "@mui/material/styles" {
  interface PaletteOptions {
    teal: Partial<Color>;
    neutral: SimplePaletteColorOptions;
  }

  interface Palette {
    teal: Color;
    neutral: Palette["primary"];
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    disabled: true;
    enabled: true;
    title: true;
    role: true;
    inbox: true;
    test: true;
    available: true;
    unavailable: true;
    text: true;
  }
}

const defaultTheme = createTheme({});
const COLOR_PALETTE = {
  black: "#000",
  oceanGreen: "#1AA089",
  oliveGreen: "#96D445",
  lightGray: "#F5F6FA",
  lighterGray: "#f9fafc",
  borderGray: "#E0E0E0",
  gray: "#dcdfe6",
  darkCyanBlue: "#303133",
  disabledGray: "#f5f7fa",
  requiredRed: "#f56c6c",
  buttonBorder: "#c0c4cc",
  buttonBorderHover: "#afdb3d",
  buttonBorderFocus: " #04bade",
  buttonOutlinedColor: "#606266",
  buttonOutlinedBorder: "#dcdfe6",
  buttonOutlinedHover: "#eaf4f3",
};
const COLORS = {
  primary: {
    main: "#1AA089",
    light: "#4DD0B8",
    dark: "#0E7A68",
  },
  secondary: {
    main: "#B23A49",
  },
  error: {
    main: "#cc0000",
  },
  warning: {
    main: "#deb100",
  },
};

export const borderLine = `1.5px solid ${COLOR_PALETTE.borderGray}`;

export const glassEffect = {
  background: "rgba(255, 255, 255, 0.72)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
};

export const glassCard = {
  background: "rgba(255, 255, 255, 0.65)",
  backdropFilter: "blur(16px) saturate(160%)",
  WebkitBackdropFilter: "blur(16px) saturate(160%)",
  border: "1px solid rgba(255, 255, 255, 0.6)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
};

export const theme = createTheme({
  typography: {
    fontFamily: [roboto.style.fontFamily, "sans-serif"].join(","),
    fontSize: 14,
  },
  palette: {
    ...COLORS,
    mode: "light",
    neutral: defaultTheme.palette.augmentColor({
      color: { main: "#838383" },
    }),
    background: {
      default: "#F5F6FA",
    },
    text: {
      secondary: "#71839B",
    },
    teal,
    grey,
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "column",
          borderRadius: "20px",
          ...glassCard,
          [defaultTheme.breakpoints.up("sm")]: {
            flex: "auto",
          },
          [defaultTheme.breakpoints.up("md")]: {
            flex: "1",
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          marginBottom: "25px",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "0.5rem",
          borderTop: "1px solid rgba(0, 0, 0, 0.06)",
          backgroundColor: "rgba(245, 246, 250, 0.5)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          backgroundColor: "rgba(245, 246, 250, 0.5)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          color: COLOR_PALETTE.darkCyanBlue,
          fontSize: "18px",
          lineHeight: "1",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          "& .MuiDialog-paper": {
            ...glassCard,
            borderRadius: "20px",
          },
          "& .MuiDialogTitle-root .MuiIconButton-root": {
            top: "10px",
            right: "10px",
            position: "absolute",
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: { paddingTop: "15px!important" },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "14px",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              border: "1px solid rgba(0, 0, 0, 0.12)",
            },
            "&.Mui-focused": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "1px solid rgba(26, 160, 137, 0.4)",
              boxShadow: "0 0 0 3px rgba(26, 160, 137, 0.1)",
            },
            "& fieldset": {
              border: "none",
            },
          },
          "& .MuiInputBase-multiline ": {
            borderRadius: "14px",
          },
          "& .MuiInputBase-input.Mui-disabled": {
            borderRadius: "14px",
            backgroundColor: COLOR_PALETTE.disabledGray,
          },
          "& .MuiInputLabel-root.Mui-required": {
            "& .MuiFormLabel-asterisk": {
              color: COLOR_PALETTE.requiredRed,
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "10px 24px",
          borderRadius: "14px",
          textTransform: "none",
          fontSize: "15px",
          fontWeight: 600,
          letterSpacing: "0.02em",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
            transform: "translateY(-1px)",
          },
        },
        contained: {
          boxShadow: "0 4px 12px rgba(26, 160, 137, 0.3)",
          "&:hover": {
            boxShadow: "0 6px 20px rgba(26, 160, 137, 0.4)",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
      body {
        background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 50%, #f0f4f8 100%);
        background-attachment: fixed;
      }
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0.9) inset !important;
        -webkit-backdrop-filter: blur(10px);
      }`,
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          ...glassCard,
        },
        elevation1: {
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiChip: {
      variants: [
        ...Array.from(Object.entries(ChipStyles)).map(([key, value]) => ({
          props: { variant: key as keyof typeof ChipStyles },
          style: value,
        })),
        {
          props: {
            variant: "text",
          },
          style: {
            padding: "0 !important",
            color: "inherit",
            background: "transparent",
            "& .MuiChip-label": {
              lineHeight: 1,
              padding: "0 !important",
            },
          },
        },
      ],
    },
    MuiAlert: {
      styleOverrides: {
        standardError: {
          "&.custom-alert": {
            color: COLORS.error.main,
            svg: {
              fill: COLORS.error.main,
            },
          },
        },
        root: {
          "&.custom-alert": {
            textAlign: "center",
            background: "transparent",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "300px",
            position: "relative",
            color: COLOR_PALETTE.buttonOutlinedColor,
            svg: {
              fill: COLOR_PALETTE.buttonOutlinedColor,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          ...glassEffect,
          borderRight: "1px solid rgba(255, 255, 255, 0.5)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          margin: "2px 8px",
          transition: "all 0.15s ease",
        },
      },
    },
  },
});
