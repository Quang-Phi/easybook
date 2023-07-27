import { useDispatch, useSelector } from 'react-redux';
import style from '../Profile.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { getInfoUser, updateUser } from '~/redux/Reducer/userSlice';
import Button from '~/components/Bases/Button';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(style);

const EditProfile = ({
  userId,
  setEditUser,
  tabRef,
  //   inputNameRef,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //redux
  const { userInfo, status } = useSelector((state) => state.user);
  //

  const [data, setData] = useState({
    gender: parseInt(userInfo?.user_info?.gender),
    file: null,
  });
  //

  const form = useForm({
    defaultValues: {
      name: userInfo?.name,
      email: userInfo?.email,
      phone: userInfo?.user_info?.phone,
      address: userInfo?.user_info?.address,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  //
  //
  useEffect(() => {
    setEditUser(true);
    dispatch(getInfoUser(userId));
    const offset = tabRef.current.offsetTop - 130;
    if (window.innerWidth > 992) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, offset);
    }
  }, [dispatch, setEditUser, tabRef, userId]);

  const onSubmit = (res) => {
    const formData = new FormData();
    formData.append('id', userId);
    formData.append('name', res.name);
    formData.append('email', res.email);
    formData.append('phone', res.phone);
    formData.append('address', res.address);
    formData.append('gender', data.gender);
    formData.append('avatar', data.file);

    dispatch(updateUser(formData));
  };

  useEffect(() => {
    if (status) {
      setTimeout(() => {
        navigate('/user/profile');
      }, 50);
    }
  }, [navigate, status]);

  return (
    <>
      <div className={cx('main-user-profile')}>
        <div className={cx('title', ['bg-sub-primary'])}>
          <h3> Your Profile</h3>
        </div>
        <div className={cx('content')}>
          <form
            encType="multipart/form-data"
            onSubmit={handleSubmit(onSubmit)}
            className={cx('edit')}
            method="POST"
          >
            <div className={cx('form-group', 'name')}>
              <label>Your Name</label>
              <span className={cx('form-icon')}>
                <i className="ri-user-line"></i>
              </span>
              <input
                // ref={inputNameRef}
                {...register('name', {
                  required: 'Field Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                type="text"
              />
              {errors.name && (
                <span className={cx('form-massage', ['text-danger'])}>
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className={cx('form-group', 'email')}>
              {' '}
              <label>Email Address</label>
              <span className={cx('form-icon')}>
                <i className="ri-mail-send-line"></i>
              </span>
              <input
                {...register('email', {
                  required: 'Field Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                type="text"
                placeholder=""
              />
              {errors.email && (
                <span className={cx('form-massage', ['text-danger'])}>
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className={cx('form-group', 'phone')}>
              <label>Phone</label>
              <span className={cx('form-icon')}>
                <i className="ri-phone-line"></i>
              </span>

              <input
                {...register('phone', {
                  required: 'Field Phone is required',
                  minLength: {
                    value: 10,
                    message: 'Phone must be at least 10 characters',
                  },
                  pattern: {
                    value: /^[0-9]+$/i,
                    message: 'Invalid phone number',
                  },
                })}
                type="text"
                placeholder=""
              />
              {errors.phone && (
                <span className={cx('form-massage', ['text-danger'])}>
                  {errors.phone.message}
                </span>
              )}
            </div>
            <div className={cx('form-group', 'gender')}>
              <label> Gender</label>
              <span style={{ top: '2.5rem' }} className={cx('form-icon')}>
                <i className="ri-newspaper-line"></i>
              </span>
              <div className={cx('group-radio')}>
                <input
                  onChange={(e) => {
                    setData({
                      ...data,
                      gender: parseInt(e.target.value),
                    });
                  }}
                  type="radio"
                  value="1"
                  id="radio-1"
                  name="gender"
                  defaultChecked={data.gender === 1}
                />
                <label className="tab" htmlFor="radio-1">
                  Male
                </label>
                <input
                  onChange={(e) => {
                    setData({
                      ...data,
                      gender: parseInt(e.target.value),
                    });
                  }}
                  type="radio"
                  value="2"
                  id="radio-2"
                  name="gender"
                  defaultChecked={data.gender === 2}
                />
                <label className="tab" htmlFor="radio-2">
                  Female
                </label>
                <input
                  onChange={(e) => {
                    setData({
                      ...data,
                      gender: parseInt(e.target.value),
                    });
                  }}
                  type="radio"
                  value="0"
                  id="radio-3"
                  name="gender"
                  defaultChecked={data.gender === 0}
                />
                <label className="tab" htmlFor="radio-3">
                  Other
                </label>
                <span className={cx('glider')}></span>
              </div>
            </div>
            <div
              style={{ gridColumnEnd: '4' }}
              className={cx('form-group', 'address')}
            >
              {' '}
              <label> Adress</label>
              <span className={cx('form-icon')}>
                <i className="ri-map-pin-user-fill"></i>
              </span>
              <input
                {...register('address', {
                  required: 'Field Address is required',
                })}
                type="text"
                placeholder=""
              />
              {errors.address && (
                <span className={cx('form-massage', ['text-danger'])}>
                  {errors.address.message}
                </span>
              )}
            </div>

            <div className={cx('form-group')}>
              {' '}
              <label> Change avatar</label>
              <span className={cx('form-icon')}>
                <i className="ri-upload-cloud-2-line"></i>
              </span>
              <div className={cx('drop-zone')}>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setData({
                      ...data,
                      file: e.target.files[0],
                    })
                  }
                />
                <label htmlFor="avatar">
                  {data.file ? (
                    <span className={cx('file-name')}>{data.file.name}</span>
                  ) : (
                    <span className={cx('text')}>Upload</span>
                  )}
                </label>
              </div>
            </div>
            <Button type="submit" icon secondary>
              Save
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};
export default EditProfile;
