import React, { useRef, useCallback } from "react";
import { FindIcon } from "../data/IconData";
import { IconButton, Stack } from "@mui/material";
import Slider from "react-slick";
import banner_1 from "../asset/banner/banner_1.png";
import banner_2 from "../asset/banner/banner_2.png";
import banner_3 from "../asset/banner/banner_3.png";
import banner_4 from "../asset/banner/banner_4.png";
import banner_5 from "../asset/banner/banner_5.png";

const feUrl = process.env.REACT_APP_FRONT_URL;

const banners = [
  { imgUrl: banner_1, }, //학교사진
  { imgUrl: banner_2, url: `${feUrl}/notice/21` }, //핑퐁 소개
  { imgUrl: banner_3, url: `http://cse.hansung.ac.kr/` }, //컴공학부 관련
  { imgUrl: banner_4, }, //토막상식
  { imgUrl: banner_5, url: `https://www.ponggame.org/` }, //pong
];

const BannerSlider = () => {
  const slider = useRef<Slider | null>(null);

  const previous = useCallback(() => {
    if (slider.current) {
      slider.current.slickPrev();
    }
  }, []);
  const next = useCallback(() => {
    if (slider.current) {
      slider.current.slickNext();
    }
  }, []);

  const handleClickedSlide = (url: string) => {
    window.open(url, '_blank');
  }

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    variableWidth: true,
    draggable: true,
    pauseOnDotsHover: true,
    pauseOnHover: true,
    pauseOnFocus: true,
    swipe: true,
    arrows: false,
  };

  return (
    <Stack direction="row" 
        sx={{"&:hover": {
          cursor: "pointer"
        }}}>
      <IconButton disableRipple onClick={previous} ><FindIcon name="previous" iconProps={{ fontSize: "large", color: "#777" }} /></IconButton>
      <div
        style={{
          width: 900,
          height: 340,
        }} >
        <Slider ref={slider} {...settings}>
          {banners.map((banner, idx) => <div
            key={idx}
            onClick={() => handleClickedSlide(`${banner.url}`)}
          >
            <img src={banner.imgUrl}
              alt={`Banner ${idx + 1}`}
            />
          </div>)}
        </Slider>
      </div>
      <IconButton disableRipple onClick={next} ><FindIcon name="next" iconProps={{ fontSize: "large", color: "#777" }} /></IconButton>
    </Stack>
  );
};

export default function Banner() {
  return <BannerSlider />;
}