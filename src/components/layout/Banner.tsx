import React, { useRef } from "react";
import Slider from "react-slick";
import banner_1 from "../asset/banner/banner_1.png";
import banner_2 from "../asset/banner/banner_2.png";
import banner_3 from "../asset/banner/banner_3.png";
import banner_4 from "../asset/banner/banner_4.png";
import banner_5 from "../asset/banner/banner_5.png";

const banners = [
  banner_1,
  banner_2,
  banner_3,
  banner_4,
  banner_5,
];

const BannerSlider = () => {
  const slider = useRef<Slider | null>(null);

  const play = () => {
    if (slider.current)
      slider.current.slickPlay();
  };

  const pause = () => {
    if (slider.current)
      slider.current.slickPause();
  };

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    //variableWidth: true,
    //adaptiveHeight: true
  };

  return (
    <div>
      <Slider ref={slider} {...settings}>
        {banners.map((banner, idx) => <div key={idx}><img src={banner} alt={`Banner ${idx + 1}`} /></div>)}
      </Slider>
    </div>
  );
};

export default function Banner() {
  return <BannerSlider />;
}