import className from 'classnames/bind';
import styles from './Default.module.scss';
import Header from '~/components/Bases/Header';
import Footer from '~/components/Bases/Footer';
import Auth from '~/components/Modal/Auth';
import Booking from '~/components/Modal/Booking';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '~/components/Bases/Loader';
import { useEffect, useState } from 'react';
import { debounce } from '~/services/Utils';

const cx = className.bind(styles);

function DefaultLayout({ children }) {
  const [isToTopOpen, setIsToTopOpen] = useState(0);
  useEffect(() => {
    const handleScroll = debounce(() => {
      setIsToTopOpen(window.scrollY);
    }, 0);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isToTopOpen]);
  return (
    <>
      <Loader />
      <Header />
      <div id={cx('main-wraper')}>
        <div className={cx('content')}>{children}</div>
        <span
          style={isToTopOpen > 200 ? { visibility: 'visible', opacity: 1 } : {}}
          onClick={() => {
            window.scrollTo(0, 0);
          }}
          className={cx('go-top')}
        >
          <i className="ri-skip-up-fill"></i>
        </span>
      </div>
      <Footer />
      <Auth />
      <Booking />
      <ToastContainer />
    </>
  );
}
export default DefaultLayout;
