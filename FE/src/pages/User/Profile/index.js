import { useDispatch, useSelector } from 'react-redux';
import style from './Profile.module.scss';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { clearSliceUser, getInfoUser } from '~/redux/Reducer/userSlice';

const cx = classNames.bind(style);

const Profile = ({
  userId,
  setEditUser,
  //   inputNameRef,
}) => {
  //redux
  const { userInfo } = useSelector((state) => state.user);
  //
  //
  const dispatch = useDispatch();
  useEffect(() => {
    setEditUser(false);
    dispatch(clearSliceUser());
    dispatch(getInfoUser(userId));
  }, [dispatch, setEditUser, userId]);
  //

  return (
    <>
      <div className={cx('main-user-profile')}>
        <div className={cx('title', ['bg-sub-primary'])}>
          <h3> Your Profile</h3>
        </div>
        <div className={cx('content')}>
          <form>
            <div className={cx('form-group', 'name')}>
              <label>Your Name</label>
              <span className={cx('form-icon')}>
                <i className="ri-user-line"></i>
              </span>
              <input
                // ref={inputNameRef}
                disabled
                type="text"
                value={userInfo.name}
              />
            </div>
            <div className={cx('form-group', 'email')}>
              {' '}
              <label>Email Address</label>
              <span className={cx('form-icon')}>
                <i className="ri-mail-send-line"></i>
              </span>
              <input disabled type="text" value={userInfo?.email} />
            </div>
            <div className={cx('form-group', 'phone')}>
              <label>Phone</label>
              <span className={cx('form-icon')}>
                <i className="ri-phone-line"></i>
              </span>

              <input type="text" value={userInfo?.user_info?.phone} disabled />
            </div>
            <div className={cx('form-group', 'gender')}>
              <label> Gender</label>
              <span style={{ top: '2.5rem' }} className={cx('form-icon')}>
                <i className="ri-newspaper-line"></i>
              </span>
              <div className={cx('group-radio')}>
                <input
                  type="radio"
                  id="radio-1"
                  name="gender"
                  defaultChecked={userInfo?.user_info?.gender === 1}
                  disabled
                />
                <label className="tab" htmlFor="radio-1">
                  Male
                </label>
                <input
                  type="radio"
                  id="radio-2"
                  name="gender"
                  defaultChecked={userInfo?.user_info?.gender === 2}
                />
                <label className="tab" htmlFor="radio-2">
                  Female
                </label>
                <input
                  type="radio"
                  id="radio-3"
                  name="gender"
                  defaultChecked={userInfo?.user_info?.gender === 0}
                />
                <label className="tab" htmlFor="radio-3">
                  Other
                </label>
                <span className={cx('glider')}></span>
              </div>
            </div>
            <div className={cx('form-group', 'address')}>
              {' '}
              <label> Adress</label>
              <span className={cx('form-icon')}>
                <i className="ri-map-pin-user-fill"></i>
              </span>
              <input
                type="text"
                value={userInfo?.user_info?.address}
                disabled
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default Profile;
