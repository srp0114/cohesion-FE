import React, { useState } from "react";
import {
  Grid,
  Typography,
  Rating,
  Box
} from "@mui/material";
import { styled } from '@mui/material/styles';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import axios from "axios";

/*포인트 아이콘 커스텀*/
const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
      color: '#ffcf40',
    },
    '& .MuiRating-iconHover': {
      color: '#ffcf40',
    },
  });
  
  /* 포인트 값 레이블*/
  const labels: { [index: string]: string } = {
    0.5: '5',
    1: '10',
    1.5: '15',
    2: '20',
    2.5: '25',
    3: '30',
    3.5: '35',
    4: '40',
    4.5: '45',
    5: '50',
  };

  type Props = {
    getPoint: any;
  }
  
  /*Q&A 게시판 작성 시 추가될 컴포넌트 */
  const Point :React.FC<Props>= ({getPoint}) => {
    const [PointValue, setPointValue] = React.useState<number | null>(2);

    return (
      <>
        <Grid item>
          <Typography variant="h6">포인트 지정하기
          {PointValue !== null && (
          <Box sx={{ ml: 1 }}>{labels[PointValue]}</Box>
          )}
          </Typography>
          <StyledRating
            name="pointRating"
            defaultValue={2}
            getLabelText={(value: number) => `${value} Point${value !== 1 ? 's' : ''}`}
            precision={0.5}
            icon={<MonetizationOnIcon sx={{fontSize: 35}}/>}
            emptyIcon={<MonetizationOnOutlinedIcon sx={{fontSize: 35}}/>}
            onChange={(event, point) => {
              setPointValue(point);
              getPoint(point);
            }}
          />
        </Grid>
      </>
    )
  }

  export default Point;
