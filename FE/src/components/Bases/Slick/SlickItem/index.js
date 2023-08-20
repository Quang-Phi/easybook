import Button from '~/components/Bases/Button';
import style from './SlickItem.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { memo, useContext } from 'react';
import MyContext from '~/components/Context';
import { useDispatch } from 'react-redux';
import { addFavorites } from '~/redux/Reducer/userSlice';
import { API_SERVER_URL, checkLinkImg } from '~/services/Utils';

const cx = classNames.bind(style);
const SlickItem = ({ item, custom, card_list, layoutGrid }) => {
  const m = useContext(MyContext);
  const dispatch = useDispatch();
  //context
  const { userId, setIsAuthFormOpen } = m;
  //

  const classes = cx('slide-item', {
    custom,
    card_list,
    [layoutGrid === 2 ? 'has-2' : 'has-1']: true,
  });

  //xu li url
  const encodedName = encodeURIComponent(item.name)
    .replace(/%2C|%20/g, ' ')
    .replace(/\s+/g, '+');
  //

  //add to fvr
  const handleAddFavorite = (id, userId) => {
    if (userId) {
      dispatch(addFavorites({ id, userId }));
    } else {
      setIsAuthFormOpen(true);
    }
  };
  //

  const icon = {
    'free wifi': 'fa-solid fa-wifi',
    restaurant: 'ri-restaurant-line',
    gym: 'fa-solid fa-dumbbell',
    'free parking': 'ri-parking-fill',
    'swimming pool': 'fa-solid fa-water-ladder',
  };
  return (
    <>
      {item && (
        <div className={classes}>
          <article className={cx('item-wrap')}>
            <div className={cx('item-img')}>
              <Link
                className={cx('img-link')}
                to={`/listings/${encodedName}?id=${item.id}`}
              >
                <img
                  src={
                    item?.images !== undefined &&
                    item?.images[0]?.image_link &&
                    checkLinkImg(item?.images[0]?.image_link)
                      ? item?.images[0]?.image_link
                      : `${API_SERVER_URL}${item?.images[0]?.image_link}`
                  }
                  alt="hotel-img"
                />
              </Link>
              <div className={cx('owner-avatar')}>
                <a href="#">
                  <img
                    src={
                      checkLinkImg(item.owner.user_info.avatar)
                        ? item.owner.user_info.avatar
                        : `${API_SERVER_URL}${item.owner.user_info.avatar}`
                    }
                    alt="owner-avatar"
                  />
                </a>
                <span className={cx('owner-name')}>
                  Added By <strong>{item.owner.name}</strong>
                </span>
              </div>
              {/* <div className="sale-window">Sale 20%</div> */}
              <div className={cx('rating')}>
                <div className={cx('rating-wrap')}>
                  <span className={cx('star')}>
                    {Array.from({ length: item.avgRating }).map(
                      (rating, index) => (
                        <i key={index} className="fas fa-star"></i>
                      ),
                    )}
                  </span>
                  {custom && (
                    <>
                      <Link
                        className={cx('title')}
                        to={`/listings/${encodedName}?id=${item.id}`}
                      >
                        {item.name} - {item.type.name}
                      </Link>
                      <div className={cx('location')}>
                        <a href="#">
                          <i className="fas fa-map-marker-alt"></i>
                          {item.addresses[0].address || 'Unknown'}
                        </a>
                      </div>
                    </>
                  )}
                </div>
                <div className={cx('rate-info')}>
                  <div className={cx('rate')}>
                    <strong>
                      {item.avgRating < 2 && item.reviews.length
                        ? 'bad'
                        : item.avgRating < 3 && item.reviews.length
                        ? 'average'
                        : item.avgRating < 4 && item.reviews.length
                        ? 'good'
                        : item.avgRating < 5 && item.reviews.length
                        ? 'very good'
                        : 'excellent'}
                    </strong>
                    {item.reviews.length} Reviews{' '}
                  </div>
                  <span>{isNaN(item.avgRating) ? '0' : item.avgRating}</span>
                </div>
              </div>
            </div>
            <div className={cx('item-content')}>
              <div className={cx('title-wrap')}>
                <Link
                  className={cx('title-link')}
                  to={`/listings/${encodedName}?id=${item.id}`}
                >
                  {item.name} - {item.type.name}
                </Link>
                <div className={cx('location')}>
                  <Link to={`/listings/${item.name}`}>
                    <i className="fas fa-map-marker-alt"></i>{' '}
                    {item.addresses[0].address || 'Unknown'}, &nbsp;
                    {item.addresses[0].city_name || ''}
                  </Link>
                </div>
              </div>

              <p className={cx('description')}>{item.description}</p>

              <ul className={cx('facilities-list')}>
                {item.facilities &&
                  item.facilities
                    .filter((item, index, self) => {
                      return (
                        self.findIndex((elem) => elem.name === item.name) ===
                        index
                      );
                    })
                    .map((item, index) => {
                      return (
                        <li key={index}>
                          <i className={icon[item.name]}></i>
                          <span>{item.name}</span>
                        </li>
                      );
                    })}
              </ul>

              <div className={cx('action')}>
                <div className={cx('price')}>
                  Awg/Night <span>$ {item.avgPrice.toFixed(0)}</span>
                </div>
                <div className={cx('btn-wrap')}>
                  <Button
                    onClick={() => handleAddFavorite(item.id, userId)}
                    btn_default
                  >
                    <i className="ri-heart-2-line"></i>
                    {/* <span className="geodir-opt-tooltip">Save</span> */}
                  </Button>

                  <Button href={'#'} btn_default>
                    <i className="ri-road-map-line"></i>
                    {/* <span className="geodir-opt-tooltip">Find Directions</span> */}
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </div>
      )}
    </>
  );
};
export default memo(SlickItem);
