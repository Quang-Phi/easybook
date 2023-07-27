import { memo, useEffect, useRef, useState } from 'react';
import style from './ScrollNav.module.scss';
import classNames from 'classnames/bind';
import { Link as LinkScroll } from 'react-scroll';
import useScrollElementFixed from '~/hooks/useScrollElementFixed';
import Button from '~/components/Bases/Button';
const cx = classNames.bind(style);

const ScrollNav = ({ navActive, articleRef, onFixedChange }) => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  //calculator when scroll
  let heightHeader = 110;
  let heiNavScroll = 84;
  let totalHeight = heightHeader + heiNavScroll;
  //

  //handle position nav scroll
  const scrollNavRef = useRef(null);
  const [isFixed] = useScrollElementFixed(scrollNavRef, articleRef);
  //

  useEffect(() => {
    onFixedChange(isFixed);
  }, [isFixed, onFixedChange]);

  return (
    <div
      style={
        isFixed
          ? {
              position: 'fixed',
              top: heightHeader + 'px',
              left: '0',
              zIndex: '999',
              right: '0',
            }
          : {}
      }
      ref={scrollNavRef}
      className={cx('scroll-nav-wrapper')}
    >
      <div style={!isMapOpen ? { height: '0' } : {}} className={cx('map-wrap')}>
        <iframe
          title="map"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3918.915963382895!2d106.694871!3d10.817743!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529fdece5694f%3A0xbf86b6d9051c6b70!2sNox%20Hostel!5e0!3m2!1svi!2sus!4v1687908895620!5m2!1svi!2sus"
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div className="container">
        <div className={cx('scroll-nav-inner')}>
          <nav className={cx('scroll-nav')}>
            <ul>
              <li>
                <LinkScroll
                  to="sec-hero"
                  smooth="true"
                  offset={-heightHeader}
                  duration={200}
                  style={
                    navActive.banner
                      ? {
                          background: '#3aaced',
                          color: '#fff',
                        }
                      : {}
                  }
                >
                  Top
                </LinkScroll>
              </li>
              <li>
                <LinkScroll
                  to="sec-imgs"
                  smooth="true"
                  offset={-totalHeight}
                  duration={200}
                  style={
                    navActive.img
                      ? {
                          background: '#3aaced',
                          color: '#fff',
                        }
                      : {}
                  }
                >
                  Details
                </LinkScroll>
              </li>
              <li>
                <LinkScroll
                  to="sec-room"
                  smooth="true"
                  offset={-totalHeight}
                  duration={200}
                  style={
                    navActive.room
                      ? {
                          background: '#3aaced',
                          color: '#fff',
                        }
                      : {}
                  }
                >
                  Rooms
                </LinkScroll>
              </li>
              <li>
                <LinkScroll
                  to="sec-about"
                  smooth="true"
                  offset={-totalHeight}
                  duration={200}
                  style={
                    navActive.about
                      ? {
                          background: '#3aaced',
                          color: '#fff',
                        }
                      : {}
                  }
                >
                  about
                </LinkScroll>
              </li>
              <li>
                <LinkScroll
                  to="sec-review"
                  smooth="true"
                  offset={-totalHeight}
                  duration={200}
                  style={
                    navActive.review
                      ? {
                          background: '#3aaced',
                          color: '#fff',
                        }
                      : {}
                  }
                >
                  Reviews
                </LinkScroll>
              </li>
            </ul>
          </nav>
          <Button onClick={() => setIsMapOpen(!isMapOpen)} secondary icon_right>
            {isMapOpen ? 'close' : 'On The Map'}{' '}
            <i className="ri-road-map-line"></i>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default memo(ScrollNav);
