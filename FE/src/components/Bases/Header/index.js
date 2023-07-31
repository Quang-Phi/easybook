import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import Tippy from '@tippyjs/react/headless';
import { memo, useContext, useEffect, useState } from 'react';
import MyContext from '~/components/Context';
import {
  API_SERVER_URL,
  checkLinkImg,
  componentDidMount,
} from '~/services/Utils';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteFavorites,
  getFavorites,
  logOut,
} from '~/redux/Reducer/userSlice';

const cx = classNames.bind(styles);

function Header() {
  //context
  const m = useContext(MyContext);
  const location = useLocation();
  const pathName = location.pathname;
  const { userId, setIsAuthFormOpen, isDetailOpen, token } = m;
  const dispatch = useDispatch();

  //redux
  const favorites = useSelector((state) => state.user.listFavorite);
  const { userInfo } = useSelector((state) => state.user);
  //
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);

  useEffect(() => {
    setMenuMobileOpen(false);
  }, [pathName]);

  //logout
  const handleLogout = () => {
    dispatch(logOut());
  };
  //

  const userActions = [
    {
      name: 'Profile',
      link: '/user/profile',
    },
    {
      name: 'Listings',
      link: '/user/listings',
    },
    {
      name: 'Bookings',
      link: '/user/bookings',
    },
    {
      name: 'Log Out',
      link: '#',
      event: handleLogout,
    },
  ];

  //handle favorite
  const handleGetFavorite = () => {
    dispatch(getFavorites(userId));
  };
  const handleDeleteFavorite = (favId) => {
    dispatch(deleteFavorites({ favId }));
    dispatch(getFavorites(userId));
  };
  //

  //  fake data
  const mainMenu = [
    {
      name: 'Home',
      linkHref: '/',
      // item: ["Item1", "Item2", "Item3", "Item4"],
    },

    {
      name: 'Listings',
      linkHref: `/listings`,
    },
    {
      name: 'Contact',
      linkHref: '/contact',
    },
    {
      name: 'Pages',
      linkHref: '',
      item: [
        {
          name: 'About',
          linkHref: '/about',
        },
        {
          name: 'FAQs',
          linkHref: '#',
        },
        {
          name: 'Err404',
          linkHref: '/404',
        },
      ],
    },
  ];

  return (
    <>
      <header
        style={isDetailOpen ? { zIndex: -1 } : {}}
        className={cx('wrapper')}
      >
        <div className={cx('header-top')}>
          <div className="container d-flex justify-content-between">
            <div className={cx('logo-holder')}>
              <Link to="/">
                <img src={process.env.PUBLIC_URL + '/imgs/logo.png'} alt="" />
              </Link>
            </div>

            <div className={cx('user-area')}>
              {!token && (
                <div
                  onClick={() => {
                    setIsAuthFormOpen(true);
                    componentDidMount();
                  }}
                  className={cx('show-reg-form')}
                >
                  <i className="fa fa-sign-in"></i>Sign In
                </div>
              )}
              {token && (
                <Link
                  to={'/user/listings/add-hotel'}
                  className={cx('add-hotel')}
                >
                  Add Your Hotel{' '}
                  <span>
                    <i className="far fa-plus"></i>
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className={cx('header-inner')}>
          <div className="container h-100 d-flex justify-content-between">
            <div className={cx('left-side')}>
              <div className={cx('home-btn')}>
                <Link to="/">
                  <i className="fas fa-home"></i>
                </Link>
              </div>
              <div className={cx('menu-mobile')}>
                <input
                  onChange={() => {
                    setMenuMobileOpen(!menuMobileOpen);
                  }}
                  id="checkbox"
                  type="checkbox"
                  checked={menuMobileOpen}
                />
                <label htmlFor="checkbox">
                  <div className={cx('bar', 'bar--top')}></div>
                  <div className={cx('bar', 'bar--middle')}></div>
                  <div className={cx('bar', 'bar--bottom')}></div>
                </label>
              </div>
              <div
                className={cx(
                  'navbar',
                  'main-menu',
                  menuMobileOpen && 'mobile-menu',
                )}
              >
                <nav>
                  <ul className="d-flex">
                    {mainMenu.map((menu, index) => {
                      const lastItem = index === mainMenu.length - 1;
                      return lastItem ? (
                        <Tippy
                          key={index}
                          interactive
                          placement="bottom"
                          render={() =>
                            menu.item && (
                              <ul>
                                {menu.item.map((item, index) => (
                                  <li key={index}>
                                    <a href={item.linkHref || '#'}>
                                      {item.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )
                          }
                        >
                          <li key={index}>
                            <Link to="#">
                              {menu.name}{' '}
                              {menu.item && (
                                <i className="fas fa-caret-down"></i>
                              )}
                            </Link>
                          </li>
                        </Tippy>
                      ) : (
                        <li key={index}>
                          {menu.linkHref ? (
                            <NavLink to={menu.linkHref}>
                              {menu.name}{' '}
                              {menu.item && (
                                <i className="fas fa-caret-down"></i>
                              )}
                            </NavLink>
                          ) : (
                            <Link to="#">
                              {menu.name}{' '}
                              {menu.item && (
                                <i className="fas fa-caret-down"></i>
                              )}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </div>
            <div className={cx('right-side')}>
              {token && (
                <>
                  <div className={cx('header-user')}>
                    <Tippy
                      interactive
                      placement="bottom"
                      trigger="click"
                      render={() => (
                        <ul>
                          {userActions.map((action, index) => {
                            return (
                              <li key={index}>
                                <Link onClick={action.event} to={action.link}>
                                  {action.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    >
                      <div className={cx('user-name')}>
                        <span>
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
                        </span>
                        My account
                      </div>
                    </Tippy>
                  </div>
                  <Tippy
                    interactive
                    placement="bottom"
                    trigger="click"
                    render={() => {
                      return (
                        <div className={cx('wishlist-content')}>
                          <div className={cx('wishlist-inner')}>
                            {favorites?.length ? (
                              <ul>
                                {favorites.map((favorite, index) => {
                                  return (
                                    <li key={index} className={cx('item')}>
                                      <div
                                        onClick={() =>
                                          handleDeleteFavorite(favorite.id)
                                        }
                                        className={cx('close')}
                                      >
                                        <i className="fa fa-times"></i>
                                      </div>
                                      <Link
                                        to={
                                          `/listings/` +
                                          encodeURIComponent(
                                            favorite?.hotel?.name,
                                          )
                                            .replace(/%2C|%20/g, ' ')
                                            .replace(/\s+/g, '+')
                                        }
                                        className={cx('image')}
                                      >
                                        <img
                                          src={
                                            favorite?.hotel?.images[0]
                                              ?.image_link
                                              ? checkLinkImg(
                                                  favorite?.hotel?.images[0]
                                                    ?.image_link,
                                                )
                                                ? favorite?.hotel?.images[0]
                                                    ?.image_link
                                                : `${API_SERVER_URL}${favorite?.hotel?.images[0]?.image_link}`
                                              : ''
                                          }
                                          alt="user"
                                        />
                                      </Link>
                                      <div className={cx('content')}>
                                        <div className={cx('title')}>
                                          <Link
                                            to={
                                              `/listings/` +
                                              encodeURIComponent(
                                                favorite?.hotel?.name,
                                              )
                                                .replace(/%2C|%20/g, ' ')
                                                .replace(/\s+/g, '+')
                                            }
                                          >
                                            {favorite.hotel.name}
                                          </Link>
                                          <span>
                                            $200 <strong>/awg</strong>
                                          </span>
                                        </div>
                                        <div className={cx('rating')}>
                                          {Array.from({
                                            length:
                                              favorite?.hotel?.reviews?.length >
                                              0
                                                ? (
                                                    favorite?.hotel?.reviews?.reduce(
                                                      (total, review) =>
                                                        total +
                                                        Number(review.rating),
                                                      0,
                                                    ) /
                                                    favorite.hotel.reviews
                                                      .length
                                                  ).toFixed(0)
                                                : 0,
                                          }).map((_, index) => {
                                            return (
                                              <i
                                                key={index}
                                                className="fas fa-star"
                                              ></i>
                                            );
                                          })}
                                        </div>

                                        <a href="#" className={cx('location')}>
                                          <i className="fas fa-map-marker-alt"></i>
                                          {
                                            favorite?.hotel?.addresses[0]
                                              ?.address
                                          }
                                        </a>
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <div className={cx('no-favorite')}>
                                <img
                                  src="images/no-favorite.png"
                                  alt="no favorite"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }}
                  >
                    <div
                      onClick={() => {
                        handleGetFavorite();
                      }}
                      className={cx('wishlist')}
                    >
                      <i className="fa fas fa-heart"></i>
                      <span className={cx('counter')}>{favorites.length}</span>
                    </div>
                  </Tippy>
                </>
              )}
              {/* <div className={cx('search-button')}>
                <span>Search</span> <i className="fas fa-search"></i>
              </div> */}
            </div>
          </div>
        </div>
        <div className={cx('header-search')}></div>
      </header>
    </>
  );
}

export default memo(Header);
