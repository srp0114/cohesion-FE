import { createTheme } from "@mui/material/styles";
import Button from '@mui/material/Button';

//전체 프로젝트에서 사용할 theme을 지정.
export const theme = createTheme({
    palette: {
      primary: {
        main: "#008CFF",
        light: "#a9a9a9",
        dark: "#999999"
      },
      secondary: {
        main: "#dfe6ba",
        light: "#eeeeee",
        dark: "#777777"
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
        fontSize: "2rem" //32px
      },
      h2: {
        fontSize: "1.5rem" //24px
      },
      h3: {
        fontSize: "1.25rem" //20px
      },
      h4: {
        fontSize: "1.125rem" //18px
      },
      h5: {
        fontSize: "1rem" //16px
      },
      h6: {
        fontSize: "0.75rem" //12px
      },
      subtitle1: {
        fontSize: "1.124rem"
      },
      subtitle2: {
        fontSize: "1rem"
      }
    },

    //MUI 컴포넌트 커스텀
    components: {    
      MuiLink: {
        styleOverrides: {
          root: {
            '&:hover': {
              fontSize: '1.125rem',
            },
          }
        }
      },
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
      },
      MuiButton: {
        defaultProps: {
          disableRipple: true,
          disableTouchRipple: true,
          disableElevation: true,
          disableFocusRipple: true,
        },
        styleOverrides: {
          root: {
            '&.navButton': {
              width: '6rem',
              padding: '0.2rem',
              color: 'black',
              fontSize: '0.9rem',
              outline: 'none',
              backgroundColor: 'transparent',
              '&:hover': {
                fontSize: '1rem',
              },
              '&:active': {
                fontSize: '1rem',
              },
              '&:focus' : {
              }
            },
            '&.profile': {
              padding:0,
              backgroundColor: 'transparent',
              minHeight: 0,
              minWidth: 0,
              marginRight:"1rem"
            },
            '&.loginButton': {
              backgroundColor: 'transparent',
              color: '#008CFF',
              fontSize: '0.9rem',
              disableRipple: true,
              disableTouchRipple: true,
              outline: 'none',
            },
            '&. startButton': {
              width:600,
              height: 80,
              "&:hover, &.Mui-focusVisible": {
                zIndex: 2,
                backgroundColor: '#f7f7f7',
                transform: 'translateY(-7%)',
              },
              borderRadius: 20,
              border: '2px solid #777777'

            },
            '&.bookmark': {              
              padding:0,
              backgroundColor: 'transparent',
              minHeight: 0,
              minWidth: 0,
              marginRight: "0.3rem",
            },
          }
        }
      },
    },
  });