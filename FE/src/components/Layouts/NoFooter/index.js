import className from 'classnames/bind';
import styles from './NoFooter.module.scss';
import Auth from '~/components/Modal/Auth';
import Booking from '~/components/Modal/Booking';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '~/components/Bases/Loader';
import Header from '~/components/Bases/Header';

const cx = className.bind(styles);
function NoFooter({ children }) {
  return (
    <>
      <Loader />
      <Header />
      <div id={cx('main-wraper')}>
        <div className={cx('content')}>{children}</div>
      </div>
      <Auth />
      <Booking />
      <ToastContainer />
    </>
  );
}
export default NoFooter;
