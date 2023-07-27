import Slider from 'react-slick';
import './Slick.scss';
import { memo } from 'react';

const Slick = ({ children, config, ...clx }) => {
  const classes = {
    ...clx,
  };
  return (
    <>
      <Slider {...config} className={classes}>
        {children}
      </Slider>
    </>
  );
};
export default memo(Slick);
