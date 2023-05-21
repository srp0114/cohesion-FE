import { createTheme } from "@mui/material/styles";
import Button from '@mui/material/Button';

declare module '@mui/material/styles' { //구인게시판 모집완료 표시용
  interface Theme {
    status: {
      recruitCompleted: React.CSSProperties['color'];
    };
  }

  interface Palette {
    neutral: Palette['primary'];
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }

  interface PaletteColor {
    darker?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
  }

  interface ThemeOptions {
    status: {
      recruitCompleted: React.CSSProperties['color'];
    };
  }
}


//전체 프로젝트에서 사용할 theme을 지정.
export const theme = createTheme({
  status: {
    recruitCompleted: '#cc00ff', //핑크
  },
  palette: {
    primary: {
      main: "#008CFF", //파랑
      light: "#a9a9a9", //머쉬룸 베이지(?)
      dark: "#999999" //진한 머쉬룸 베이지(?)
    },
    secondary: {
      main: "#dfe6ba", //누르스름한...
      light: "#eeeeee",
      dark: "#777777"
    },
    background: {
      default: "#ffffff",
    },
    error: {
      main: "#b71c1c", //빨강
    },
    warning: {
      main: "#ffd740", //노란
    },
    success: {
      main: "#43a047", //녹색
    },
    info: {
      main: "#2a46e4", //파랑
      light: "#03a9f4",
      dark: "#01579b",
    },
    neutral: {
      main: '#64748B', //회색
      light: '#758396',
      dark: '#536278',
      contrastText: '#fff',
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
      },
      styleOverrides: {
        root: {
          //공부기록 필드 커스텀
          '&.summaryField': {
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#B5CC6C',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#B5CC6C',
              },
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: '#B5CC6C',
            },
          },
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          wordWrap: "break-word"
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          //공부기록 추가 버튼 커스텀
          '&.summaryButton': {
            width: "3.5rem",
            height: "3.5rem",
            "&:hover, &.Mui-focusVisible": {
              zIndex: 2,
              backgroundColor: "#B5CC6C",
              color: "#000"
            },
            "&:active": {
              backgroundColor: "#B5CC6C",
              color: "#000"
            },
              borderRadius: 15,
              border: "1.5px solid #B5CC6C",
          },
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          '&.mySummaryPaper': {
            borderRadius: "15px",
            padding: "1.5rem 1.7rem 1.7rem 2.5rem",
            transition: 'transform 0.3s ease',
            '&:hover, &:active, &:focus': {
              transform: 'scale(1.01)',
              zIndex: 1,
              /* '& .summaryMenuButton': {
                opacity: 1,
              },
            },
            '& .summaryMenuButton': {
              opacity: 0,
              transition: 'opacity 0.2s ease',

            },
            '&:hover .summaryMenuButton, &:active .summaryMenuButton, &:focus .summaryMenuButton': {
              opacity: 1, */
            },
          },
          '&.mySummaryFixedPaper': {
            borderRadius: "15px",
            //border: "2px solid #B5CC6C",
            padding: "1.2rem 1.7rem 1.2rem 2.5rem",
            transition: 'transform 0.3s ease',
            '&:hover, &:active, &:focus': {
              transform: 'scale(1.01)',
              zIndex: 1,
            }
          },
        },
      },
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
            '&:focus': {
            }
          },
          '&.profile': {
            padding: 0,
            backgroundColor: 'transparent',
            minHeight: 0,
            minWidth: 0,
            marginRight: "1rem"
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
            width: 600,
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
            padding: 0,
            backgroundColor: 'transparent',
            minHeight: 0,
            minWidth: 0,
            marginRight: "0.3rem",
          },
          '&.modalConfirmButton': {
            "&:hover": {
              backgroundColor: "info.dark",
            }
          },
          '&.modalCancelButton': {
            "&:hover": {
              backgroundColor: "info.light",
            }
          },
          '&.applicantListIconButton': {
            "&:hover": {
              backgroundColor: "secondary.dark"
            }
          }
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.applicantsListItem': {
            "&:hover": {
              backgroundColor: "#f2f2f2",
              opacity: [1.0, 0.9, 0.9],
            }
          }
        }
      }
    },
    MuiDivider:{
      styleOverrides: {
        root:{
          color: "#777777",
        }
      }
    }
  }
},
);