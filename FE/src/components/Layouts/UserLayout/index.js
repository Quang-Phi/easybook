import classNames from 'classnames/bind';
import style from './User.module.scss';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInfoUser, logOut } from '~/redux/Reducer/userSlice';
import MyContext from '~/components/Context';
import useScrollWaitingElement from '~/hooks/useScrollWaitingElement';
import { NavLink } from 'react-router-dom';
import Button from '~/components/Bases/Button';
import Loader from '~/components/Bases/Loader';
import Header from '~/components/Bases/Header';
import Booking from '~/components/Modal/Booking';
import Auth from '~/components/Modal/Auth';
import { ToastContainer } from 'react-toastify';
import Footer from '~/components/Bases/Footer';
import { API_SERVER_URL, checkLinkImg } from '~/services/Utils';

const cx = classNames.bind(style);
const UserLayout = ({ children }) => {
  const [editUser, setEditUser] = useState(false);
  //base
  const dispatch = useDispatch();
  const m = useContext(MyContext);
  const { userId } = m;
  const tabRef = useRef(null);

  //
  // const inputNameRef = useRef(null);
  //

  //redux
  const { userInfo } = useSelector((state) => state.user);

  //

  useEffect(() => {
    dispatch(getInfoUser(userId));
  }, [dispatch, userId]);
  //

  //handle when scroll
  const div1ref = useRef(null);
  const parrentRef = useRef(null);
  let headerHeight = 110;
  let space = 40;
  let diff = -80;

  let [isFixed, isAbsolute] = useScrollWaitingElement(
    div1ref,
    parrentRef,
    headerHeight,
    space,
    diff,
  );

  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <>
      <Loader />
      <Header />
      <div id={cx('main-wraper')}>
        <div className={cx('content')}>
          <section className={cx('top-user', ['bg-sub-primary'])}>
            <div className={cx('top-user-wrap')}>
              <div className="wave-bg2 bg"></div>
              <div className="container">
                <div className={cx('sidebar-wrap')}>
                  <div className={cx('sidebar-content', ['bg-primary'])}>
                    <div className={cx('user-avatar')}>
                      <img
                        src={
                          userInfo?.user_info?.avatar
                            ? checkLinkImg(userInfo.user_info.avatar)
                              ? userInfo.user_info.avatar
                              : `${API_SERVER_URL}${userInfo.user_info.avatar}`
                            : ''
                        }
                        alt="user"
                      />
                    </div>
                    <div className={cx('user-info')}>
                      <h3>
                        <span>Welcome </span>
                        {userInfo.name}
                      </h3>
                      <span className={cx('icon')}>
                        {' '}
                        <i className="ri-user-settings-line"></i>
                      </span>
                    </div>

                    {!editUser && (
                      <Button to={'/user/profile/change-info'} small secondary>
                        Edit
                      </Button>
                    )}

                    <Button
                      onClick={() => {
                        handleLogout();
                      }}
                      secondary
                      full
                      icon_right
                    >
                      Log Out <i className="ri-logout-circle-r-line"></i>
                    </Button>
                  </div>
                </div>
                <div ref={tabRef} className={cx('top-user-inner')}>
                  <div className={cx('user-menu')}>
                    <ul>
                      <li>
                        <NavLink to={'/user/profile'}>
                          <i className="far fa-user"></i>Profile
                        </NavLink>
                      </li>

                      <li>
                        <NavLink to={'/user/listings'}>
                          <i className="ri-list-check-2"></i>Listings
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to={'/user/bookings'}>
                          <i className="far fa-calendar-check"></i> Bookings
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section ref={parrentRef} className={cx('main-user')}>
            <div className="container">
              <div className={cx('main-user-wrap')}>
                <div
                  style={
                    isFixed
                      ? {
                          position: 'fixed',
                          top: `${(headerHeight + space) / 10}rem`,
                          maxHeight: 'calc(100vh - 19rem)',
                          overflowY: 'auto',
                        }
                      : isAbsolute
                      ? {
                          top: 'unset',
                          bottom: '8rem',
                          maxHeight: 'calc(100vh - 19rem)',
                          overflowY: 'auto',
                        }
                      : {}
                  }
                  ref={div1ref}
                  className={cx('sidebar-wrap')}
                >
                  <div className={cx('sidebar-content', ['bg-primary'])}>
                    <div className={cx('user-avatar')}>
                      <img
                        src={
                          userInfo?.user_info?.avatar
                            ? checkLinkImg(userInfo.user_info.avatar)
                              ? userInfo.user_info.avatar
                              : `${API_SERVER_URL}${userInfo.user_info.avatar}`
                            : ''
                        }
                        alt="user"
                      />
                    </div>
                    <div className={cx('user-info')}>
                      <h3>
                        <span>Welcome </span>
                        {userInfo.name}
                      </h3>
                    </div>
                    <div className={cx('group-btn')}>
                      {!editUser && (
                        <Button
                          to={'/user/profile/change-info'}
                          small
                          secondary
                        >
                          Edit
                        </Button>
                      )}

                      <Button
                        onClick={() => {
                          handleLogout();
                        }}
                        sub_primary
                        full
                        icon_right
                      >
                        Log Out <i className="ri-logout-circle-r-line"></i>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className={cx('main-user-inner')}>
                  {React.Children.map(children, (child) => {
                    return React.cloneElement(child, {
                      userId,
                      setEditUser,
                      tabRef,
                      // inputNameRef,
                    });
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
      <Auth />
      <Booking />
      <ToastContainer />
    </>
  );
};
export default memo(UserLayout);
