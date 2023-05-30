import { Modal, Stack, Typography, ButtonBase, styled } from "@mui/material";
import hansung from "../asset/image/hansung.png";
import pingpong from "../asset/logo/pingpong.png";

interface LoginModalProps {
  open: boolean;
  handleClose: () => void;
  handleLogin: () => void;
}

const LoginModal = ({ open, handleClose, handleLogin } : LoginModalProps) => {

  const infoLoginModal = {
    borderRadius: 5,
    p: 4,
    bgcolor: 'background.paper',  
    "&:focus": {
      outline: "none"
    },
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute' as 'absolute',
  };

  const StartButton = styled(ButtonBase)(({ theme }) => ({
    width:400,
    height: 80,
    "&:hover, &.Mui-focusVisible": {
      zIndex: 2,
      backgroundColor: '#f7f7f7',
      transform: 'translateY(-7%)',
    },
    borderRadius: 20,
  }));

  return (
    <>
    <Modal
      open={open}
      onClose={handleClose}>
      <Stack sx={infoLoginModal} direction={"column"}  alignItems={"center"}>
        <Stack direction={"row"} alignItems={"center"} mt={2}>
          <img src={`${pingpong}`}  style={{width: "8rem"}}/>
          <Typography variant="h3" sx={{ fontWeight: 600}}>에 오신 것을 환영합니다!</Typography>
        </Stack>

        <Typography variant="h3" sx={{ mt: 3, mb: 5, fontWeight: 600 }}>한성대학교 통합 로그인 페이지로 이동합니다</Typography>
        <StartButton onClick={handleLogin}>
          <img src={hansung} width="30" style={{ marginRight: 10 }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>한성대학교 통합 로그인</Typography>
        </StartButton>
      </Stack>
    </Modal>
  </>
  )
}

export default LoginModal;