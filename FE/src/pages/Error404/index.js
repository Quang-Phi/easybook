import Button from '~/components/Bases/Button';
import styles from './Error404.module.scss';
import classNames from 'classnames/bind';
import { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearSliceListing } from '~/redux/Reducer/listingSlice';
import { clearSliceUser } from '~/redux/Reducer/userSlice';

const cx = classNames.bind(styles);
const Error404 = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearSliceListing());
    dispatch(clearSliceUser());
  }, [dispatch]);
  return (
    <div className={cx('err-wrapper')}>
      <div className={cx('err-bg')}></div>
      <div className={cx('err-cloud', 'one')}>
        <i className="ri-cloud-line"></i>
      </div>
      <div className={cx('err-cloud', 'two')}>
        <i className="fa-solid fa-cloud-bolt"></i>{' '}
      </div>
      <div className={cx('overlay')}></div>
      <div className={cx('err-content')}>
        <div className="container">
          <div className={cx('err-text')}>
            <h2>404</h2>
            <p>
              We're sorry, but the Page you were looking for, couldn't be found.
            </p>
            <Button secondary icon to={'/'}>
              Back to Home Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(Error404);
