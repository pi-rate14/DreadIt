import { createTheme } from "@material-ui/core";

export const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#242627",
      dark: "#242627",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#2C2D31",
      dark: "#ba000d",
      contrastText: "#000",
    },
    text: {
      primary: "#333333",
      disabled: "#A9A9A9",
      secondary: "#A9A9A9",
    },
  },
  menuPaper: {
    backgroundColor: "#A9A9A9",
  },
  typography: {
    fontFamily: ["poppins"].join(","),
  },
});
