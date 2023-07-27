import { memo, useContext, useEffect, useState } from 'react';
import style from './Reviews.module.scss';
import classNames from 'classnames/bind';
import { addComment } from '~/redux/Reducer/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import MyContext from '~/components/Context';
import { getHotel } from '~/redux/Reducer/listingSlice';
import Button from '~/components/Bases/Button';

const cx = classNames.bind(style);
const Reviews = ({ hotelId }) => {
  const dispatch = useDispatch();
  const { user_id: userId } = useSelector((state) => state.user.user);
  //props context
  const m = useContext(MyContext);
  const { token, setIsAuthFormOpen } = m;
  //

  //state
  const [userRates, setUserRates] = useState({
    cleanliness: 5,
    comfortality: 5,
    service: 5,
    facilities: 5,
  });
  const [avg, setAvg] = useState(0);
  //

  //

  //handle add comment
  const handleAddcComment = (e) => {
    e.preventDefault();
    if (token) {
      const formData = new FormData(e.target);
      const review = formData.get('review');
      if (!review) return;
      const data = {
        userId,
        hotelId,
        review,
        rating: avg,
      };
      dispatch(addComment(data));
      dispatch(getHotel(hotelId));
      e.target.reset();
      setUserRates({
        cleanliness: 5,
        comfortality: 5,
        service: 5,
        facilities: 5,
      });
    } else {
      setIsAuthFormOpen(true);
    }
  };
  //
  useEffect(() => {
    setAvg(
      (userRates.comfortality +
        userRates.service +
        userRates.facilities +
        userRates.cleanliness) /
        4,
      ``,
    );
  }, [userRates]);

  //
  //handle range review

  const handleRangeSlide = (e) => {
    const fieldset = e.target.id;
    const value = Number(e.target.value);
    setUserRates({
      ...userRates,
      [fieldset]: value,
    });
  };
  //
  return (
    <div className={cx('reviews-wrap', ['bg-white', 'border'])}>
      <h3 className={cx('title')}>Add Review</h3>
      <div className={cx('reviews-form')}>
        <form onSubmit={(e) => handleAddcComment(e)}>
          <div className={cx('range-wrap')}>
            <div className={cx('range-content')}>
              <div className={cx('range-item')}>
                <label>CLEANLINESS</label>
                <div className={cx('range-slider')}>
                  <span
                    className={cx('range-thump')}
                    style={{
                      width: `calc((25% * ${userRates.cleanliness - 1}) - (${
                        userRates.cleanliness - 1
                      } * .4rem))`,
                    }}
                  ></span>
                  <span
                    style={{
                      left: `calc((25% * ${userRates.cleanliness - 1}) - (${
                        userRates.cleanliness - 1
                      } * .5rem))`,
                    }}
                    className={cx('range-point')}
                  >
                    {userRates.cleanliness}
                  </span>
                  <input
                    type="range"
                    id="cleanliness"
                    onChange={(e) => handleRangeSlide(e)}
                    value={userRates.cleanliness}
                    min={1}
                    max={5}
                    step={1}
                  />
                </div>
              </div>
              <div className={cx('range-item')}>
                <label>comfortality</label>
                <div className={cx('range-slider')}>
                  <span
                    className={cx('range-thump')}
                    style={{
                      width: `calc((25% * ${userRates.comfortality - 1}) - (${
                        userRates.comfortality - 1
                      } * .4rem))`,
                    }}
                  ></span>
                  <span
                    style={{
                      left: `calc((25% * ${userRates.comfortality - 1}) - (${
                        userRates.comfortality - 1
                      } * .5rem))`,
                    }}
                    className={cx('range-point')}
                  >
                    {userRates.comfortality}
                  </span>
                  <input
                    type="range"
                    id="comfortality"
                    onChange={(e) => handleRangeSlide(e)}
                    value={userRates.comfortality}
                    min={1}
                    max={5}
                    step={1}
                  />
                </div>
              </div>
              <div className={cx('range-item')}>
                <label>Service</label>
                <div className={cx('range-slider')}>
                  <span
                    className={cx('range-thump')}
                    style={{
                      width: `calc((25% * ${userRates.service - 1}) - (${
                        userRates.service - 1
                      } * .4rem))`,
                    }}
                  ></span>
                  <span
                    style={{
                      left: `calc((25% * ${userRates.service - 1}) - (${
                        userRates.service - 1
                      } * .5rem))`,
                    }}
                    className={cx('range-point')}
                  >
                    {userRates.service}
                  </span>
                  <input
                    type="range"
                    id="service"
                    onChange={(e) => handleRangeSlide(e)}
                    value={userRates.service}
                    min={1}
                    max={5}
                    step={1}
                  />
                </div>{' '}
              </div>
              <div className={cx('range-item')}>
                <label>facilities</label>
                <div className={cx('range-slider')}>
                  <span
                    className={cx('range-thump')}
                    style={{
                      width: `calc((25% * ${userRates.facilities - 1}) - (${
                        userRates.facilities - 1
                      } * .4rem))`,
                    }}
                  ></span>
                  <span
                    style={{
                      left: `calc((25% * ${userRates.facilities - 1}) - (${
                        userRates.facilities - 1
                      } * .5rem))`,
                    }}
                    className={cx('range-point')}
                  >
                    {userRates.facilities}
                  </span>
                  <input
                    type="range"
                    id="facilities"
                    onChange={(e) => handleRangeSlide(e)}
                    value={userRates.facilities}
                    min={1}
                    max={5}
                    step={1}
                  />
                </div>{' '}
              </div>
            </div>
            <div className={cx('total-score', ['bg-grey-2', 'border'])}>
              <span>{avg}</span>
              <strong>Your Score</strong>
            </div>
          </div>
          <textarea
            name="review"
            className="bg-grey-2 border"
            placeholder="Your Review:"
          ></textarea>
          <Button type="submit" icon_right secondary>
            Submit Review <i className="fal fa-paper-plane"></i>
          </Button>
        </form>
      </div>
    </div>
  );
};
export default memo(Reviews);
