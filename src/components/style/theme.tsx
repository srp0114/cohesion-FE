import { createTheme } from "@mui/material/styles";

//전체 프로젝트에서 사용할 theme을 지정.
export const theme = createTheme({
    palette: {
      primary: {
        main: "#008CFF",
      },
      secondary: {
        main: "#dfe6ba",
      },
      background: {
        default: "#ffffff",
      },
      error: {
        main: "#b71c1c",
      },
      warning: {
        main: "#ffd740",
      },
      success: {
        main: "#43a047",
      },
      info: {
        main: "#2a46e4",
      },
    },

    //Typography 글자크기 커스텀.
    typography: {
      h1: {
        fontSize: "4.5rem" //72px
      },
      h2: {
        fontSize: "3.75rem" //60px
      },
      h3: {
        fontSize: "3rem" //48px
      },
      h4: {
        fontSize: "2.25rem" //36px
      },
      h5: {
        fontSize: "1.5rem" //24px
      },
      h6: {
        fontSize: "1.125rem" //18px
      },
    },

    //MUI TextField 커스텀
    components: {    
      MuiTextField: {      
        defaultProps: {        
          variant: "outlined",        
          fullWidth: true,      
          sx: { mt: 2 },
        },
      },
      MuiTypography: { 
        styleOverrides: { 
          root: {
            wordWrap: "break-word"
          }
        }
      }
      
    }
  });