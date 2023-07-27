import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import style from './Detail.module.scss';
import classNames from 'classnames/bind';
import MyContext from '~/components/Context';
import {
  API_SERVER_URL,
  checkLinkImg,
  componentDidMount,
  componentUnmount,
  debounce,
} from '~/services/Utils';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAvailableRooms, getHotel } from '~/redux/Reducer/listingSlice';
import Button from '~/components/Bases/Button';
import CountDown from '~/components/Bases/CountDown';
import { Link as LinkScroll } from 'react-scroll';
import ScrollNav from './ScrollNav';
import Rooms from './Rooms';
import Reviews from './Reviews';
import Slick from '~/components/Bases/Slick';

const cx = classNames.bind(style);
const Detail = () => {
  //base
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const hotelId = params.get('id');
  const dispatch = useDispatch();
  const m = useContext(MyContext);
  const articleRef = useRef(null);

  //
  //props context
  const { dataBook, setIsDetailOpen } = m;
  //

  //redux
  const hotel = useSelector((state) => state.listing.listings.hotel);
  const {
    reviews: hotelReviews,
    images: hotelImages,
    avgRating,
  } = hotel || {
    reviews: [],
    images: [],
    avgRating: 0,
  };

  const contacts = [
    {
      icon: 'ri-map-pin-fill',
      title: 'Address',
      desc: hotel?.addresses[0]?.address || '',
      link: '#',
    },
    {
      icon: 'ri-phone-fill',
      title: 'Hotline',
      desc: hotel?.phone || '',
      link: '#',
    },
    {
      icon: 'ri-mail-send-fill',
      title: 'Email',
      desc: hotel?.email || '',
      link: '#',
    },
    {
      icon: ' ri-user-location-line',
      title: 'Website',
      desc: 'www.example.com',
      link: '#',
    },
  ];
  //

  useEffect(() => {
    dispatch(getHotel(hotelId));
    if ((dataBook.dateIn, dataBook.dateOut)) {
      dispatch(
        getAvailableRooms({
          hotelId,
          dateIn: dataBook.dateIn,
          dateOut: dataBook.dateOut,
        }),
      );
    }
  }, [dataBook.dateIn, dataBook.dateOut, dispatch, hotelId]);
  //

  //calculator when scroll
  let heightHeader = 110;
  let heiNavScroll = 84;
  let totalHeight = heightHeader + heiNavScroll;
  //

  //handle nav active when scroll
  const refBanner = useRef(null);
  const refImg = useRef(null);
  const refRoom = useRef(null);
  const refAbout = useRef(null);
  const refReview = useRef(null);

  const [navActive, setNavActive] = useState({
    banner: true,
    img: false,
    room: false,
    about: false,
    review: false,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateNavScroll = useCallback(
    debounce(() => {
      const scrollY = window.scrollY;
      const topBanner = refBanner?.current?.offsetTop || 0;
      const bottomBanner =
        refBanner?.current?.offsetTop + refBanner?.current?.clientHeight || 0;
      const topImg = refImg?.current?.offsetTop || 0;
      const bottomImg =
        refImg?.current?.offsetTop + refImg?.current?.clientHeight || 0;
      const topRoom = refRoom?.current?.offsetTop || 0;
      const bottomRoom =
        refRoom?.current?.offsetTop + refRoom?.current?.clientHeight || 0;
      const topAbout = refAbout?.current?.offsetTop || 0;
      const bottomAbout =
        refAbout?.current?.offsetTop + refAbout?.current?.clientHeight || 0;
      const topReview = refReview?.current?.offsetTop || 0;
      const bottomReview =
        refReview?.current?.offsetTop + refReview?.current?.clientHeight || 0;

      if (scrollY > topBanner && scrollY < bottomBanner) {
        setNavActive({
          banner: true,
        });
      } else if (scrollY > topImg - 110 && scrollY < bottomImg - 110) {
        setNavActive({
          img: true,
        });
      } else if (scrollY > topRoom - 110 && scrollY < bottomRoom - 110) {
        setNavActive({
          room: true,
        });
      } else if (scrollY > topAbout - 110 && scrollY < bottomAbout - 110) {
        setNavActive({
          about: true,
        });
      } else if (scrollY > topReview - 110 && scrollY < bottomReview - 110) {
        setNavActive({
          review: true,
        });
      }
    }, 50),
  );

  useEffect(() => {
    const windownScroll = () => {
      updateNavScroll();
    };
    window.addEventListener('scroll', windownScroll);
    return () => {
      window.removeEventListener('scroll', windownScroll);
    };
  }, [updateNavScroll]);
  //

  const [articalFixed, setArticalFixed] = useState(false);
  const onFixedChange = (value) => {
    setArticalFixed(value);
  };

  //handle modal slide image
  const [showSlideImg, setShowSlideImg] = useState({
    hotel: {
      show: false,
      img_index: 1,
    },
    room: {
      show: false,
      img_index: 1,
    },
  });

  const handleShowSlideImg = (type, index) => {
    setIsDetailOpen(true);
    setShowSlideImg({
      ...showSlideImg,
      [type]: {
        show: true,
        img_index: index,
      },
    });
    componentDidMount();
  };

  const handleCloseSlideImg = (type) => {
    setIsDetailOpen(false);
    setShowSlideImg({
      ...showSlideImg,
      [type]: {
        show: false,
        img_index: 1,
      },
    });
    componentUnmount();
  };
  //

  return (
    <>
      {hotel && (
        <>
          <section ref={refBanner} id="sec-hero" className={cx('hero-section')}>
            <img
              className="bg"
              src={process.env.PUBLIC_URL + '/imgs/bg/4.jpg'}
              alt=""
            />
            <div className={cx('hero-content')}>
              <div className="container">
                <div className="row">
                  <div className="col-lg-7 col-12">
                    <div className={cx('rating-left-wrap')}>
                      <div className={cx('rate-star')}>
                        {avgRating
                          ? Array.from({ length: avgRating }).map(
                              (_, index) => {
                                return (
                                  <i className="fas fa-star" key={index}></i>
                                );
                              },
                            )
                          : ''}
                      </div>
                      <h2 className="title">{hotel?.name}</h2>
                      <span className="separator"></span>
                      <div className={cx('contact')}>
                        <ul className={cx('contact-list')}>
                          {contacts &&
                            contacts.map((contact, index) => {
                              return (
                                <li key={index}>
                                  <i className={contact.icon}></i>
                                  <span>{contact.desc}</span>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 col-12">
                    <div className={cx('rating-right-wrap')}>
                      <div className={cx('rate-score')}>
                        <div className={cx('score')}>
                          <strong>
                            {' '}
                            {avgRating < 2 && hotel.reviews.length
                              ? 'bad'
                              : avgRating < 3 && hotel.reviews.length
                              ? 'average'
                              : avgRating < 4 && hotel.reviews.length
                              ? 'good'
                              : avgRating < 5 && hotel.reviews.length
                              ? 'very good'
                              : 'excellent'}
                          </strong>
                          {hotel?.reviews?.length || 0} Reviews
                        </div>
                        <span className="bg-primary">
                          {avgRating === 'NaN' ? 0 : avgRating}
                        </span>
                      </div>
                      <div className={cx('group-link')}>
                        <Button icon_left trans>
                          <LinkScroll
                            to="sec-room"
                            smooth="true"
                            offset={-totalHeight}
                            duration={200}
                          >
                            <i className="ri-bookmark-3-line"></i>Book Now
                          </LinkScroll>
                        </Button>

                        <Button icon_left trans>
                          <LinkScroll
                            to="sec-review"
                            smooth="true"
                            offset={-totalHeight}
                            duration={200}
                          >
                            <i className="ri-question-answer-line"></i>Add
                            review{' '}
                          </LinkScroll>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ScrollNav
            navActive={navActive}
            articleRef={articleRef}
            onFixedChange={onFixedChange}
          />

          <article
            ref={articleRef}
            style={{
              paddingTop: articalFixed ? '12.4rem' : '4rem',
            }}
            className={cx('main-section', ['bg-grey-blue'])}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-8 col-md-12">
                  <div className={cx('main-detail')}>
                    <section
                      ref={refImg}
                      id="sec-imgs"
                      className={cx('images')}
                    >
                      <div className={cx('images-wrap', ['p-0'])}>
                        {hotelImages.map((item, index) => {
                          return (
                            <div
                              key={index}
                              className={cx('image-item', 'full')}
                            >
                              <img
                                src={
                                  checkLinkImg(item.image_link)
                                    ? item.image_link
                                    : `${API_SERVER_URL}${item.image_link}`
                                }
                                alt="detail-img"
                              />
                              <div
                                onClick={() =>
                                  handleShowSlideImg('hotel', index)
                                }
                                className={cx('popup-image')}
                              >
                                <i className="fa fa-search"></i>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {showSlideImg.hotel.show && (
                        <div className={cx('images-slide')}>
                          <div
                            onClick={() => handleCloseSlideImg('hotel')}
                            className="close"
                          >
                            <i className="fa fa-times"></i>
                          </div>
                          <div className="overlay"></div>
                          <div className={cx('slick-wrap', ['container'])}>
                            <Slick
                              detail_img
                              config={{
                                infinite: false,
                                initialSlide: showSlideImg.hotel.img_index,
                              }}
                            >
                              {hotelImages.map((item, index) => {
                                return (
                                  <div
                                    key={index}
                                    className={cx('item', 'full')}
                                  >
                                    <img
                                      src={
                                        checkLinkImg(item.image_link)
                                          ? item.image_link
                                          : `${API_SERVER_URL}${item.image_link}`
                                      }
                                      alt="detail-img"
                                    />
                                  </div>
                                );
                              })}
                            </Slick>
                          </div>
                        </div>
                      )}
                    </section>

                    <section className={cx('facts')}>
                      <div className={cx('facts-wrap', ['p-0'])}>
                        <div className={cx('fact-item')}>
                          <div className={cx('fact-inner')}>
                            <i className="ri-building-4-line"></i>
                            <div className={cx('count')}>
                              {hotel?.hotel?.rooms?.length}
                              <h6>Hotel Rooms</h6>
                            </div>
                          </div>
                        </div>
                        <div className={cx('fact-item')}>
                          <div className={cx('fact-inner')}>
                            <i className="ri-team-line"></i>{' '}
                            <div className={cx('count')}>
                              2557
                              <h6>Customers Every Year</h6>
                            </div>
                          </div>
                        </div>
                        <div className={cx('fact-item')}>
                          <div className={cx('fact-inner')}>
                            <i className="ri-riding-line"></i>{' '}
                            <div className={cx('count')}>
                              15
                              <h6>Distance to Center</h6>
                            </div>
                          </div>
                        </div>
                        <div className={cx('fact-item')}>
                          <div className={cx('fact-inner')}>
                            <i className="ri-restaurant-line"></i>
                            <div className={cx('count')}>
                              4<h6>Restaurant Inside</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section
                      ref={refRoom}
                      id="sec-room"
                      className={cx('rooms')}
                    >
                      <Rooms
                        showSlideImg={showSlideImg}
                        handleShowSlideImg={handleShowSlideImg}
                        handleCloseSlideImg={handleCloseSlideImg}
                      />
                    </section>

                    <section
                      ref={refAbout}
                      id="sec-about"
                      className={cx('about')}
                    >
                      <div className={cx('about-wrap', ['bg-white', 'border'])}>
                        <div className={cx('about-text')}>
                          <h3 className={cx('title')}>About Hotel</h3>
                          <p className="desc  text-dark">
                            {hotel?.hotel?.description}
                          </p>
                        </div>

                        <Button to={'#'} icon primary>
                          Video Presentation
                        </Button>
                      </div>
                    </section>

                    <section
                      ref={refReview}
                      id="sec-review"
                      className={cx('reviews')}
                    >
                      <Reviews hotelId={hotelId} />
                    </section>
                  </div>
                </div>

                <div className="col-lg-4 col-md-12">
                  <div className={cx('side-detail')}>
                    <section className={cx('contact')}>
                      <div
                        className={cx('contact-wrap', ['bg-white', 'border'])}
                      >
                        <div className={cx('main-contact')}>
                          <h3 className={cx('title')}>Contact Information</h3>
                          <ul>
                            {contacts &&
                              contacts.map((item, index) => {
                                return (
                                  <li key={index}>
                                    <span>
                                      <i className={item.icon}></i> {item.title}{' '}
                                      :
                                    </span>
                                    <a href="#">{item.desc}</a>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                        <div className={cx('socials')}>
                          {/* <ul>
                            {hotelDetails.socials.map((item, index) => {
                              return (
                                <li key={index}>
                                  <a href="#">
                                    <i className={item.icon}></i>
                                  </a>
                                </li>
                              );
                            })}
                          </ul> */}
                        </div>
                      </div>
                    </section>

                    <section className={cx('banner')}>
                      <div
                        className={cx('banner-wrap', ['bg-white', 'border'])}
                      >
                        <img
                          className="bg"
                          src={process.env.PUBLIC_URL + '/imgs/cities/5.jpg'}
                          alt=""
                        />
                        <div className={cx('banner-content')}>
                          <h4>
                            Get a discount <span>20%</span> when ordering a room
                            from three days.
                          </h4>
                          <CountDown countdownDays={2} />
                        </div>
                      </div>
                    </section>

                    <section className={cx('comments')}>
                      <div
                        className={cx('comments-wrap', ['bg-white', 'border'])}
                      >
                        <h3 className={cx('title')}>
                          Reviews - <span> {hotelReviews.length} </span>
                        </h3>
                        <div className={cx('comments-inner')}>
                          {hotelReviews.slice(0, 5).map((item, index) => {
                            return (
                              <div key={index} className={cx('comments-item')}>
                                <div className={cx('owner-avatar')}>
                                  <img src={item.owner_avatar} alt="" />
                                </div>
                                <div
                                  className={cx('comments-info', ['bg-grey-2'])}
                                >
                                  <h4>{item.owner_name}</h4>
                                  <div className={cx('rate')}>
                                    <span className="bg-primary">
                                      {item.rating}
                                    </span>
                                  </div>
                                  <p className="desc mb-3">{item.review}</p>
                                  <div className={cx('date')}>
                                    <span>
                                      <i className="far fa-calendar-check"></i>
                                      {new Date(
                                        item.created_at,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </>
      )}
    </>
  );
};

export default memo(Detail);
