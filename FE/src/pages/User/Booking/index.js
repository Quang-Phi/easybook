import { memo, useContext, useEffect, useState } from 'react';
import style from './UserBooking.module.scss';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBookings } from '~/redux/Reducer/listingSlice';
import MyContext from '~/components/Context';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import Paginate from '~/components/Bases/Pagination';
import { API_SERVER_URL, checkLinkImg } from '~/services/Utils';
import Button from '~/components/Bases/Button';
const cx = classNames.bind(style);

const Booking = ({ tabRef }) => {
  const m = useContext(MyContext);
  const { listings } = useSelector((state) => state.listing);
  const { userId } = m;
  const dispatch = useDispatch();
  let per_page = 10;

  //paginate
  const [currPage, setCurrPage] = useState(1);
  const handleChangePaginate = (e, value) => {
    const offset = tabRef.current.offsetTop - 130;
    if (window.innerWidth > 992) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, offset);
    }
    setCurrPage(value);
  };

  useEffect(() => {
    userId &&
      dispatch(
        getUserBookings({
          userId,
          page: currPage,
          per_page,
        }),
      );
  }, [dispatch, per_page, userId, currPage]);
  //
  return (
    <>
      <div className={cx('main-user-listing', ['active'])}>
        <div className={cx('title', ['bg-sub-primary'])}>
          <h3>My Bookings</h3>
        </div>
        <div className={cx('content', 'booking')}>
          {listings?.data?.length ? (
            <>
              {Array.isArray(listings.data) &&
                listings.data?.map((hotel, i) => {
                  const encodedName = encodeURIComponent(hotel.hotel_name)
                    .replace(/%2C|%20/g, ' ')
                    .replace(/\s+/g, '+');
                  return (
                    <div key={i} className={cx('booking-item')}>
                      <div className={cx('avatar')}>
                        <img
                          src={
                            checkLinkImg(hotel.user_avatar)
                              ? hotel.user_avatar
                              : `${API_SERVER_URL}${hotel.user_avatar}`
                          }
                          alt=""
                        />
                      </div>
                      <div className={cx('content')}>
                        <h3 className={cx('name')}>
                          {hotel?.user_name}
                          {' - '}
                          <span style={{ fontWeight: 500, fontSize: '1.2rem' }}>
                            {dayjs(hotel?.date_in).format('DD MMMM YYYY')}
                          </span>
                        </h3>
                        <ul>
                          <li>
                            Hotel:{' '}
                            <Link
                              to={`/listings/${encodedName}?id=${hotel.hotel_id}`}
                            >
                              {hotel?.hotel_name}
                            </Link>
                          </li>
                          <li>
                            Room:{' '}
                            <span>
                              {hotel?.category_name} - {hotel?.room_name}
                            </span>
                          </li>

                          <li>
                            Booking Date:{' '}
                            <span>
                              {dayjs(hotel?.date_in).format('DD.MM.YYYY')} -{' '}
                              {dayjs(hotel?.date_out).format('DD.MM.YYYY')}
                            </span>
                          </li>
                          <li>
                            Email: <span>1eJXv@example.com</span>
                          </li>
                          <li>
                            Phone: <span>+84 123 456 789</span>
                          </li>
                          <li>
                            Payment:{' '}
                            <span>
                              {hotel?.payment_status ? 'Paid' : 'Unpaid'}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  );
                })}
              <div className={cx('pagination')}>
                <Paginate
                  page={currPage}
                  onChange={handleChangePaginate}
                  count={listings?.last_page}
                />
              </div>
            </>
          ) : (
            <div style={{ flexDirection: 'column' }} className="no-data">
              <img src="/imgs/base/notfound.avif" alt="" />
              <Button to={'/listings'} secondary icon>
                Book Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default memo(Booking);
