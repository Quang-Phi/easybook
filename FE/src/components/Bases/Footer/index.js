import Button from '~/components/Bases/Button';
import style from './Footer.module.scss';
import classNames from 'classnames/bind';
import { memo, useContext } from 'react';
import MyContext from '~/components/Context';

const cx = classNames.bind(style);

const Footer = () => {
  const m = useContext(MyContext);
  const { contacts } = m;
  const posts = [
    {
      img: `${process.env.PUBLIC_URL} /imgs/base/7.jpg`,
      title: 'Vivamus dapibus rutrum',
      date: '21 Mar 09.05',
    },
    {
      img: `${process.env.PUBLIC_URL} /imgs/base/8.jpg`,
      title: 'In hac habitasse platea',
      date: '7 Mar 18.21',
    },
    {
      img: `${process.env.PUBLIC_URL} /imgs/base/9.jpg`,
      title: 'Tortor tempor in porta',
      date: '7 Mar 16.42',
    },
  ];

  const socials = [
    {
      icon: 'ri-facebook-fill',
      title: 'Facebook',
      link: '#',
    },
    {
      icon: 'ri-twitter-fill',
      title: 'Twitter',
      link: '#',
    },
    {
      icon: 'ri-instagram-fill',
      title: 'Instagram',
      link: '#',
    },
    {
      icon: 'ri-linkedin-fill',
      title: 'Linkedin',
      link: '#',
    },
  ];
  return (
    <>
      <footer className="bg-primary">
        <div className={cx('subscribe-wrap', ['bg-sub-primary'])}>
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-12 col-12">
                <div className={cx('subscribe-text')}>
                  <h3 className="title">Subscribe</h3>
                  <p className="desc">
                    Want to be notified when we launch a new template or an
                    udpate. Just sign up and we'll send you a notification by
                    email.
                  </p>
                </div>
              </div>
              <div className="col-md-1 col-12"></div>
              <div className="col-lg 6 col-md-12 col-12">
                <div className={cx('form-wrap')}>
                  <form id={cx('subscribe')}>
                    <input
                      onChange={(e) => {}}
                      className="email"
                      name="email"
                      placeholder="Enter Your Email"
                      type="text"
                    />
                    <Button primary type="submit">
                      Subscribe
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="bg wave-bg"></div>
        </div>
        <div className={cx('footer-content')}>
          <div className="container">
            {/* <div className={cx('widget')}>
              <div className="row">
                <div className="col-md-3">
                  <div className="footer-caro usel-title">Our partners</div>
                </div>
                <div className="col-md-9">
                  <div className="footer-carousel-wrap ">
                    <div className="footer-carousel ">
                      <div className="footer-carousel-item">
                        <a href="#">
                          <img src="images/partners/1.png" alt="" />
                        </a>
                      </div>
                      <div className="footer-carousel-item">
                        <a href="#">
                          <img src="images/partners/2.png" alt="" />
                        </a>
                      </div>
                      <div className="footer-carousel-item">
                        <a href="#">
                          <img src="images/partners/3.png" alt="" />
                        </a>
                      </div>
                      <div className="footer-carousel-item">
                        <a href="#">
                          <img src="images/partners/4.png" alt="" />
                        </a>
                      </div>
                      <div className="footer-carousel-item">
                        <a href="#">
                          <img src="images/partners/5.png" alt="" />
                        </a>
                      </div>
                      <div className="footer-carousel-item">
                        <a href="#">
                          <img src="images/partners/6.png" alt="" />
                        </a>
                      </div>
                    </div>
                    <div className="fc-cont  fc-cont-prev">
                      <i className="fal fa-angle-left"></i>
                    </div>
                    <div className="fc-cont  fc-cont-next">
                      <i className="fal fa-angle-right"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            <div className={cx('main-footer')}>
              <div className="row">
                <div className="col-lg-4 col-12">
                  <div className={cx('footer-item')}>
                    <h3 className="title">About Us</h3>
                    <div className={cx('contact')}>
                      <p className="desc">
                        In ut odio libero, at vulputate urna. Nulla tristique mi
                        a massa convallis cursus. Nulla eu mi magna. Etiam
                        suscipit commodo gravida. Lorem ipsum dolor sit amet,
                        consectetuer adipiscing elit, sed diam.{' '}
                      </p>
                      <ul className={cx('contact-list')}>
                        {contacts.map((item, index) => {
                          return (
                            <li key={index}>
                              <span>
                                <i className={item.icon}></i> {item.title} :
                              </span>
                              <a className="desc" href="#">
                                {item.desc}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                      {/* <div className="footer-social">
                        <span>Find us : </span>
                        <ul>
                          <li>
                            <a href="#" target="_blank">
                              <i className="fab fa-facebook-f"></i>
                            </a>
                          </li>
                          <li>
                            <a href="#" target="_blank">
                              <i className="fab fa-twitter"></i>
                            </a>
                          </li>
                          <li>
                            <a href="#" target="_blank">
                              <i className="fab fa-instagram"></i>
                            </a>
                          </li>
                          <li>
                            <a href="#" target="_blank">
                              <i className="fab fa-vk"></i>
                            </a>
                          </li>
                        </ul>
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-12">
                  <div className={cx('footer-item')}>
                    <h3 className="title">Our Last News</h3>
                    <div className={cx('posts')}>
                      <ul className={cx('post-list')}>
                        {posts.map((item, index) => {
                          return (
                            <li key={index} className={cx('post-item')}>
                              <a href="#" className={cx('post-img')}>
                                <img src={item.img} alt="" />
                              </a>
                              <div className={cx('post-title')}>
                                <a href="#" className="desc">
                                  {item.title}
                                </a>
                                <span className="desc">{item.date}</span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-12">
                  <div className={cx('footer-item')}>
                    <h3 className="title">Follow Us</h3>
                    <div className={cx('socials')}>
                      <ul className="d-flex">
                        {socials.map((item, index) => {
                          return (
                            <li key={index}>
                              <a href={item.link} target="_blank">
                                <i className={item.icon}></i>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={cx('support')}>
              <div className="row">
                <div className="col-md-4 col-12">
                  <div className={cx('cs-contact-wrap')}>
                    <Button sub_primary>Contact Us</Button>
                  </div>
                </div>
                <div className="col-md-8 col-12">
                  <div className={cx('cs-number-wrap')}>
                    <div className={cx('bg-icon')}>
                      <i className="ri-user-settings-line"></i>{' '}
                    </div>
                    <div className={cx('cs-number')}>
                      <h4 className="desc">Customer support : </h4>
                      <p>+123 456 789</p>
                    </div>
                    <Button href="tel:+123456789" secondary>
                      Call Now
                      <i className="ri-customer-service-2-fill"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={cx('end', ['bg-sub-primary'])}>
          <div className="container d-flex justify-content-between align-items-center">
            <div className={cx('copyright', ['desc'])}>
              {' '}
              &#169; EasyBook 2018 . All rights reserved.
            </div>

            <div className={cx('end-nav')}>
              <ul>
                <li>
                  <a href="#">Terms of use</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
export default memo(Footer);
