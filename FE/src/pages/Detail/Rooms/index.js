import style from './Rooms.module.scss';
import classNames from 'classnames/bind';
import Slick from '~/components/Bases/Slick';
import dayjs from 'dayjs';

import { memo, useContext, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '~/components/Bases/Button';
import MyContext from '~/components/Context';
import {
  API_SERVER_URL,
  checkLinkImg,
  componentUnmount,
} from '~/services/Utils';
import { DatePicker } from 'antd';

const cx = classNames.bind(style);

const Rooms = () => {
  const { rooms } = useSelector((state) => state.listing);
  const hotel = useSelector((state) => state.listing.listings);
  const hotelCategories = hotel?.categories || [];
  const refPicker = useRef(null);
  const m = useContext(MyContext);

  //
  //props context
  const {
    dataBook,
    setIsBookModalOpen,
    setDataBook,
    token,
    setIsAuthFormOpen,
  } = m;

  //handle open detail room
  const [cateDetail, setCateDetail] = useState({
    show: false,
    rooms: [],
    cate: {},
  });
  //

  //handle booking room
  const handleBookRoom = (room) => {
    const hotelBook = hotel?.hotel;
    setCateDetail({
      show: false,
      rooms: [],
      cate: {},
    });
    if (token) {
      setIsBookModalOpen(true);
      const bill =
        ((new Date(dataBook.dateOut) - new Date(dataBook.dateIn)) /
          (1000 * 60 * 60 * 24)) *
        room.price;

      setDataBook({
        ...dataBook,
        hotelId: hotelBook.id,
        hotelName: hotelBook.name,
        roomId: room.id,
        roomName: room.name,
        price: room.price,
        bill,
      });
    } else {
      setIsAuthFormOpen(true);
    }
  };
  //

  //handle choose date
  const { RangePicker } = DatePicker;
  const disabledDate = (current) => {
    return current && current < new Date();
  };

  const onChange = (value, dateString) => {
    const dateIn = dateString[0];
    console.log(dateIn); //2023-09-12
    const dateOut = dateString[1]; //2023-09-13
    setDataBook({
      ...dataBook,
      dateIn,
      dateOut,
    });
  };
  //

  const amenityIcons = {
    'air conditioned': 'fa-solid fa-snowflake',
    television: 'ri-tv-2-line',
    phone: 'ri-cellphone-fill',
    'hair dryer': 'fa-solid fa-wind',
    balcony: 'ri-home-smile-fill',
  };
  //
  return (
    <>
      <div className={cx('rooms-wrap', ['bg-white', 'border'])}>
        <div
          style={
            dataBook.dateIn && dataBook.dateOut
              ? {
                  paddingBottom: '2.4rem',
                  marginBottom: '2.4rem',
                  borderBottom: '1px solid #eee',
                }
              : {}
          }
          className={cx('title-wrap')}
        >
          <h3 className={cx('title')}>Available Rooms</h3>
          <div ref={refPicker}>
            <RangePicker
              disabledDate={disabledDate}
              onChange={onChange}
              defaultValue={[
                dayjs(dataBook.dateIn, 'YYYY/MM/DD'),
                dayjs(dataBook.dateOut, 'YYYY/MM/DD'),
              ]}
            />
          </div>
        </div>
        {dataBook.dateIn && dataBook.dateOut ? (
          <>
            <div className={cx('rooms-inner')}>
              {hotelCategories?.map((cate, index) => {
                const maxPrice = rooms
                  ?.filter((room) => room.category_id === cate.id)
                  .reduce((maxPriceRoom, currentRoom) => {
                    return Math.max(maxPriceRoom, currentRoom.price);
                  }, -Infinity);
                const minPrice = rooms
                  ?.filter((room) => room.category_id === cate.id)
                  .reduce((minPriceRoom, currentRoom) => {
                    return Math.min(minPriceRoom, currentRoom.price);
                  }, Infinity);
                const availabelRooms = rooms?.filter(
                  (room) => room.category_id === cate.id,
                );
                return (
                  <div key={index} className={cx('rooms-item')}>
                    <div className={cx('rooms-img')}>
                      <img
                        src={
                          checkLinkImg(cate.image)
                            ? cate.image
                            : `${API_SERVER_URL}${cate.image}`
                        }
                        alt="cate-img"
                      />
                      <span className={cx('availabel')}>
                        {availabelRooms?.length > 0
                          ? `only ${availabelRooms.length} rooms left`
                          : 'out of availabel rooms'}
                      </span>
                    </div>
                    <div className={cx('rooms-details')}>
                      <div className={cx('rooms-info')}>
                        <div className={cx('info-text')}>
                          {' '}
                          <h3 className={cx('name')}>{cate.name}</h3>
                          <h5 className={cx('guest')}>
                            Max Guests: <span>{cate.max_guests}</span>
                          </h5>
                        </div>
                        {availabelRooms?.length > 0 && (
                          <span className={cx('price')}>
                            {maxPrice === minPrice
                              ? '$' + maxPrice
                              : '$' + minPrice + ' - $' + maxPrice}
                            <strong> / night</strong>
                          </span>
                        )}
                      </div>
                      <p className="desc text-dark">{cate.description}</p>
                      <div className={cx('facilities')}>
                        <ul>
                          <li>
                            <i className="ri-wifi-line"></i>
                          </li>
                          {cate.amenities.map((item, index) => {
                            return (
                              <li key={index}>
                                <i className={amenityIcons[item]} />
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <Button
                        disabled={!availabelRooms?.length}
                        sub_primary
                        icon
                        onClick={(e) => {
                          setCateDetail({
                            show: true,
                            rooms: availabelRooms || [],
                            cate,
                          });
                        }}
                      >
                        Detail
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          ''
        )}
      </div>
      <div className={cx('modal-aside')}>
        <div
          style={
            cateDetail.show
              ? { visibility: 'visible' }
              : { visibility: 'hidden' }
          }
          className="overlay"
        ></div>
        <div
          style={
            cateDetail.show
              ? {
                  transform: 'translateY(0)',
                  opacity: 1,
                }
              : {}
          }
          className={cx('modal-aside-wrap')}
        >
          <div
            onClick={() => {
              setCateDetail({ ...cateDetail, show: false });
              componentUnmount();
            }}
            className={cx('close')}
          >
            <i className="ri-close-line"></i>
          </div>
          <Slick modal_aside>
            {cateDetail.rooms?.map((room, roomIndex) => {
              return (
                <div key={roomIndex} className={cx('modal-aside-inner')}>
                  <div className={cx('image')}>
                    <Slick
                      config={{
                        infinite: true,
                        autoplay: true,
                        autoplaySpeed: 3000,
                        pauseOnHover: true,
                        fade: true,
                        arrows: false,
                      }}
                    >
                      {room.images.map((img, imgIndex) => {
                        return (
                          <div key={imgIndex} className={cx('item')}>
                            <img
                              src={
                                checkLinkImg(img.image_link)
                                  ? img.image_link
                                  : `${API_SERVER_URL}${img.image_link}`
                              }
                              alt="detail-img"
                            />
                          </div>
                        );
                      })}
                    </Slick>
                    <h3 className={cx('title')}>
                      {cateDetail?.cate?.name}
                      <span>{room.name}</span>
                    </h3>
                  </div>
                  <div className={cx('list-info')}>
                    <ul
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(4, 1fr)`,
                      }}
                    >
                      <li>
                        <i className="ri-hand-coin-line"></i>
                        <h5>
                          {room.price}
                          <span>/ per night</span>
                        </h5>
                      </li>
                      <li>
                        <i className="ri-group-fill"></i>
                        <h5>
                          {cateDetail?.cate?.max_guests}
                          <span>persions</span>
                        </h5>
                      </li>
                      <li>
                        <i className="ri-tv-2-line"></i>
                        <h5>
                          55
                          <span>Inch</span>
                        </h5>
                      </li>
                      <li>
                        <i className="ri-24-hours-line"></i>
                        <h5>
                          hour
                          <span> short rental</span>
                        </h5>
                      </li>
                    </ul>
                  </div>
                  <div className={cx('details')}>
                    <div className={cx('text')}>
                      <h3>Room Details</h3>
                      <p>{cateDetail?.cate?.description}</p>
                    </div>
                    <div className={cx('amenities')}>
                      <h3>Amenities</h3>
                      <ul>
                        <li>
                          <i className="ri-wifi-line" />
                          Free WiFi
                        </li>
                        {cateDetail?.cate?.amenities.map((item, index) => {
                          return (
                            <li key={index}>
                              <i className={amenityIcons[item]} />
                              {item}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <Button
                      onClick={(e) => {
                        handleBookRoom(room);
                      }}
                      secondary
                      icon
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              );
            })}
          </Slick>
        </div>
      </div>
    </>
  );
};
export default memo(Rooms);
