import { memo } from 'react';
import style from './Heading.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);
const Heading = ({ title, description }) => {
  return (
    <>
      <div className={cx('section-title')}>
        <div className={cx('star-separator')}>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
        </div>
        <h2 className={cx('title')}>{title}</h2>
        <span className={cx('separator')}></span>
        <p className={cx('description')}>{description}</p>
      </div>
    </>
  );
};
export default memo(Heading);
