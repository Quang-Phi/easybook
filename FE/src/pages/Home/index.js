import Slick from '~/components/Bases/Slick';
import className from 'classnames/bind';
import styles from './HomePage.module.scss';
import './HomePage.module.scss';
import Button from '~/components/Bases/Button';
import SlickItem from '~/components/Bases/Slick/SlickItem';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { memo, useEffect } from 'react';
import { getListing } from '~/redux/Reducer/listingSlice';
import Heading from './Heading';

const cx = className.bind(styles);

function HomePage() {
  //base
  const dispatch = useDispatch();
  const { listings, cities } = useSelector((state) => state.listing);
  //
  const hotels = listings?.data;

  useEffect(() => {
    dispatch(getListing());
  }, [dispatch]);
  //

  const heroSlides = [
    {
      img: 'imgs/bg/4.jpg',
      title: 'Discover London - City is Never Sleeps',
      subtitle: 'availabel',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      img: 'imgs/bg/6.jpg',
      title: 'Premium Plaza Hotels - best hotels in London',
      subtitle: 'availabel',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      img: 'imgs/bg/9.jpg',
      title: 'Dummy Hotels - A list of hotels in Thailand',
      subtitle: 'availabel',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  ];

  const reasonItems = [
    {
      id: 1,
      icon: 'ri-customer-service-2-line',
      title: 'Best service guarantee',
      desc: 'Proin dapibus nisl ornare diam varius tempus. Aenean a quam luctus, finibus tellus ut, convallis eros sollicitudin turpis.',
    },
    {
      id: 2,
      icon: 'ri-gift-line',
      title: 'Exclusive gifts',
      desc: 'Proin dapibus nisl ornare diam varius tempus. Aenean a quam luctus, finibus tellus ut, convallis eros sollicitudin turpis.',
    },
    {
      id: 3,
      icon: 'ri-bank-card-2-line',
      title: 'Get more from your card',
      desc: 'Proin dapibus nisl ornare diam varius tempus. Aenean a quam luctus, finibus tellus ut, convallis eros sollicitudin turpis.',
    },
  ];

  const testimonialItems = [
    {
      id: 1,
      img: 'imgs/avatars/1.jpg',
      name: 'James Bond',
      desc: 'In ut odio libero, at vulputate urna. Nulla tristique mi a massa convallis cursus. Nulla eu mi magna. Etiam suscipit commodo gravida. Lorem ipsum dolor sit amet, conse ctetuer adipiscing elit, sed diam nonu mmy nibh euismod tincidunt ut laoreet dolore magna aliquam erat.',
      rate: '4',
    },
    {
      id: 2,
      img: 'imgs/avatars/2.jpg',
      name: 'James Bond',
      desc: 'In ut odio libero, at vulputate urna. Nulla tristique mi a massa convallis cursus. Nulla eu mi magna. Etiam suscipit commodo gravida. Lorem ipsum dolor sit amet, conse ctetuer adipiscing elit, sed diam nonu mmy nibh euismod tincidunt ut laoreet dolore magna aliquam erat.',
      rate: '3',
    },
    {
      id: 3,
      img: 'imgs/avatars/3.jpg',
      name: 'James Bond',
      desc: 'In ut odio libero, at vulputate urna. Nulla tristique mi a massa convallis cursus. Nulla eu mi magna. Etiam suscipit commodo gravida. Lorem ipsum dolor sit amet, conse ctetuer adipiscing elit, sed diam nonu mmy nibh euismod tincidunt ut laoreet dolore magna aliquam erat.',
      rate: '5',
    },
    {
      id: 4,
      img: 'imgs/avatars/4.jpg',
      name: 'James Bond',
      desc: 'In ut odio libero, at vulputate urna. Nulla tristique mi a massa convallis cursus. Nulla eu mi magna. Etiam suscipit commodo gravida. Lorem ipsum dolor sit amet, conse ctetuer adipiscing elit, sed diam nonu mmy nibh euismod tincidunt ut laoreet dolore magna aliquam erat.',
      rate: '4',
    },
  ];

  return (
    <>
      <section className={cx('hero-section', ['mw-100', 'p-0'])}>
        <ul>
          <Slick
            config={{
              dots: true,
              infinite: true,
              speed: 1000,
              slidesToShow: 1,
              slidesToScroll: 1,
              autoplay: false,
              autoplaySpeed: 4000,
              pauseOnHover: true,
            }}
            hero_slide
          >
            {heroSlides.map((slide, index) => {
              return (
                <div key={index} className={cx('slider-item')}>
                  <div className={cx('hero-bg')}>
                    <img src={slide.img} alt="" />
                  </div>
                  <div className={cx('hero-content')}>
                    <div className={cx('intro')}>
                      <div className={cx('rating')}>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <h3 className="title">{slide.title}</h3>
                      <div className={cx('sub-title')}>{slide.subtitle}</div>
                      <h5 className="desc">{slide.desc}</h5>
                      <Button to={'/listings'} secondary icon={true}>
                        View All Hotels
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slick>
        </ul>
      </section>

      <section id={cx('popular-location')}>
        <div className="container">
          <Heading
            title="Popular Destination"
            description="Explore some of the best tips from around the city from our partners and friends."
          />
          <div className={cx('gallery-wrapper')}>
            {cities &&
              cities.slice(0, 5).map((item, index) => {
                return (
                  <div key={index} className={cx('gallery-item')}>
                    <div className={cx('gallery-inner')}>
                      <div className={cx('quantity')}>
                        <span>{item.hotel_count} </span> Hotels
                      </div>
                      <img src={item.image} alt={item.name} />
                      <div className={cx('gallery-location')}>
                        <h3 className={cx('location-name')}>
                          <a
                            href={`/listings?location.id=${encodeURIComponent(
                              item.id,
                            )}&location.name=${encodeURIComponent(item.name)}`}
                          >
                            {item.name}
                          </a>
                        </h3>
                        <p className={cx('location-desc')}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <Button to={'/listings'} primary icon={true}>
            explore all cities
          </Button>
        </div>
      </section>

      <section id={cx('recently')}>
        <div className="container-fluid">
          <Heading
            title="Recently Added Hotels"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque. Nulla finibus lobortis pulvinar."
          />
          <div className={cx('recently-wrapper')}>
            <Slick
              config={{
                dots: false,
                infinite: true,
                autoplay: false,
                pauseOnHover: true,
                className: 'center',
                centerMode: true,
                slidesToShow: hotels?.length > 3 ? 3 : 1,
                centerPadding: '60px',
                speed: 500,
                responsive: [
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 2,
                    },
                  },
                  {
                    breakpoint: 768,
                    settings: {
                      slidesToShow: 1,
                    },
                  },
                  {
                    breakpoint: 576,
                    settings: {
                      slidesToShow: 1,
                      centerMode: false,
                    },
                  },
                ],
              }}
              recently
            >
              {hotels &&
                Array.isArray(hotels) &&
                hotels.map((item, index) => {
                  return <SlickItem key={index} item={item} />;
                })}
            </Slick>
          </div>
        </div>
      </section>

      <section id={cx('popular')} className={cx('bg-grey-blue')}>
        <img className="bg" src="imgs/bg/10.jpg" alt="" />
        <div className={cx('overlay')}></div>
        <div className={cx('container')}>
          <div className="row">
            <div className="col-xl-4 col-12">
              <div className={cx('popular-text')}>
                <div className={cx('text-wrap')}>
                  <h3 className="title">Most Popular Hotels</h3>
                  <p className="desc">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Maecenas in pulvinar neque. Nulla finibus lobortis pulvinar.
                  </p>
                  <Button to={'/listings'} secondary icon={true}>
                    View All Hotels
                  </Button>
                </div>
              </div>
            </div>
            <div className="col-xl-8 col-12">
              <div className={cx('popular-gallery')}>
                <Slick
                  config={{
                    dots: false,
                    infinite: true,
                    slidesToShow: hotels?.length > 2 ? 2 : 1,
                    slidesToScroll: hotels?.length > 2 ? 2 : 1,
                    autoplay: false,
                    autoplaySpeed: 4000,
                    pauseOnHover: true,
                    responsive: [
                      {
                        breakpoint: 768,
                        settings: {
                          slidesToShow: 1,
                        },
                      },
                    ],
                  }}
                  popular
                >
                  {hotels &&
                    Array.isArray(hotels) &&
                    hotels.map((item, index) => {
                      return <SlickItem key={index} item={item} custom />;
                    })}
                </Slick>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id={cx('reason')}>
        <div className="container">
          <Heading
            title="Why Choose Us"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque. Nulla finibus lobortis pulvinar."
          />
          <div className={cx('reason-wrapper')}>
            <div className="row">
              {reasonItems.map((item, index) => {
                return (
                  <div key={index} className="col-lg-4 col-md-12 col-sm-12">
                    <div className={cx('content')}>
                      <div className={cx('icon')}>
                        <i className={item.icon}></i>
                      </div>
                      <h4 className={cx('title')}>
                        <a href="#"> {item.title}</a>
                      </h4>
                      <p className="desc text-dark">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={cx('counter')}>
            <div className="container">
              <div className="row mt-5">
                <div className="col col-lg-3 col-md-6 col-12">
                  <div className={cx('count-item')}>
                    <div className={cx('count-inner')}>
                      <div className={cx('count-icon')}>
                        <i className="ri-group-line"></i>
                      </div>
                      <div className={cx('count-title')}>
                        <h2>
                          <CountUp
                            start={0}
                            end={254}
                            duration={2}
                            enableScrollSpy={true}
                          />
                          K
                        </h2>
                        <span className="desc text-dark">
                          New Visiters Every Week
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col col-lg-3 col-md-6 col-12">
                  <div className={cx('count-item')}>
                    <div className={cx('count-inner')}>
                      <div className={cx('count-icon')}>
                        <i className="ri-thumb-up-line"></i>
                      </div>
                      <div className={cx('count-title')}>
                        <h2>
                          {' '}
                          <CountUp
                            start={0}
                            end={79}
                            duration={2}
                            enableScrollSpy={true}
                          />
                          M
                        </h2>
                        <span className="desc text-dark">
                          Happy customers every year
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col col-lg-3 col-md-6 col-12">
                  <div className={cx('count-item')}>
                    <div className={cx('count-inner')}>
                      <div className={cx('count-icon')}>
                        <i className="ri-medal-line"></i>
                      </div>
                      <div className={cx('count-title')}>
                        <h2>
                          {' '}
                          <CountUp
                            start={0}
                            end={34}
                            duration={2}
                            enableScrollSpy={true}
                          />
                        </h2>
                        <span className="desc text-dark">Won Awards</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col col-lg-3 col-md-6 col-12">
                  <div className={cx('count-item')}>
                    <div className={cx('count-inner')}>
                      <div className={cx('count-icon')}>
                        <i className="ri-hotel-line"></i>
                      </div>
                      <div className={cx('count-title')}>
                        <h2>
                          {' '}
                          <CountUp
                            start={0}
                            end={700}
                            duration={2}
                            enableScrollSpy={true}
                          />
                        </h2>
                        <span className="desc text-dark">
                          New Listing Every Week
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id={cx('download')} className="bg-sub-primary">
        <div className="container h-100">
          <div className="bg wave-bg2"></div>
          <div className="row h-100">
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className={cx('text-wrap', ['h-100'])}>
                <div className={cx('text-inner')}>
                  <h3 className="title">Our App Available Now</h3>
                  <p className="desc">
                    In ut odio libero, at vulputate urna. Nulla tristique mi a
                    massa convallis cursus. Nulla eu mi magna. Etiam suscipit
                    commodo gravida. Lorem ipsum dolor sit amet, conse ctetuer
                    adipiscing elit, sed diam nonu mmy nibh euismod tincidunt ut
                    laoreet dolore magna aliquam erat.
                  </p>
                </div>
                <div className={cx('btn-wrap')}>
                  <Button href="#" primary>
                    <i className="pe-4 ri-apple-line"></i>
                    Download for iPhone
                  </Button>
                  <Button href="#" primary>
                    <i className="pe-4 ri-android-line"></i>
                    Download for Android
                  </Button>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 h-100">
              <div className={cx('collage-wrap', ['h-100'])}>
                <img
                  className={cx('main-collage-img')}
                  src="imgs/base/2.png"
                  alt=""
                />
                <div className={cx('item-collage-title')}>
                  <Button primary>
                    easy <span>book</span>
                  </Button>
                </div>
                <div className={cx('group-item')}>
                  <div className={cx('item-collage-check')}>
                    <img src="imgs/base/3.jpg" alt="" />
                  </div>
                  <div className={cx('item-collage-check')}>
                    <img src="imgs/base/4.jpg" alt="" />
                  </div>
                  <div className={cx('item-collage-check')}>
                    <img src="imgs/base/5.jpg" alt="" />
                  </div>
                </div>
                <div className={cx('collage-search')}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id={cx('testimonial')}>
        <div className="container-fluid">
          <Heading
            title="Testimonials "
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque. Nulla finibus lobortis pulvinar."
          />
          <div className={cx('testimonial-wrapper')}>
            <Slick
              config={{
                dots: true,
                infinite: true,
                autoplay: false,
                pauseOnHover: true,
                className: 'center',
                centerMode: true,
                centerPadding: '60px',
                slidesToShow: 3,
                speed: 500,
                responsive: [
                  {
                    breakpoint: 1200,
                    settings: {
                      slidesToShow: 2,
                    },
                  },
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 2,
                    },
                  },
                  {
                    breakpoint: 768,
                    settings: {
                      slidesToShow: 1,
                    },
                  },
                  {
                    breakpoint: 576,
                    settings: {
                      slidesToShow: 1,
                      centerMode: false,
                    },
                  },
                ],
              }}
              testimonial
            >
              {testimonialItems.map((item, index) => {
                return (
                  <div key={index} className={cx('testimonial-item-wrap')}>
                    <div className={cx('item-inner')}>
                      <div className={cx('popup-avatar')}>
                        <img src={item.img} alt="" />
                      </div>
                      <div className={cx('rate-star')}>
                        {Array.from({ length: item.rate }).map((_, index) => {
                          return <i key={index} className="ri-star-fill"></i>;
                        })}
                      </div>
                      <div className={cx('review-owner')}>
                        <strong>{item.name}</strong> - <span>Happy Client</span>
                      </div>
                      <p className="desc"> {item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </Slick>
          </div>
        </div>
      </section>
    </>
  );
}
export default memo(HomePage);
