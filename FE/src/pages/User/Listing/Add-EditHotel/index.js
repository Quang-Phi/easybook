import { useForm } from 'react-hook-form';
import style from './AddEditHotel.module.scss';
import classNames from 'classnames/bind';
import { memo, useContext, useEffect, useRef, useState } from 'react';
import {
  addEditHotel,
  getHotel,
  getSubData,
} from '~/redux/Reducer/listingSlice';
import { useDispatch, useSelector } from 'react-redux';
import Button from '~/components/Bases/Button';
import MyContext from '~/components/Context';
import UploadImg from '~/components/Bases/UploadImg';
import { useLocation, useNavigate } from 'react-router-dom';

const cx = classNames.bind(style);
const AddEditHotel = () => {
  const { listings, cities, facilities, types, status } = useSelector(
    (state) => state.listing,
  );

  let { hotel } = listings || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation().search;
  const formRef = useRef(null);
  //take id if edit
  const editId = new URLSearchParams(location).get('id');
  //

  const m = useContext(MyContext);
  const { userId } = m;
  //handle add new hotel
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  let quantityImage = 6;
  const [addHotelFields, setAddHotelFields] = useState({
    hotel_id: null,
    user_id: userId,
    name: null,
    type: {
      id: '',
      value: 'Choose Type',
      show: false,
    },
    address: null,
    longitude: null,
    latitude: null,

    city: {
      id: '',
      value: 'Choose City',
      show: false,
    },
    email: null,
    phone: null,
    description: null,
    facilities: [],
  });
  const [hotelImgs, setHotelImgs] = useState([]);

  useEffect(() => {
    dispatch(getSubData());
    if (editId) {
      dispatch(getHotel(editId));
    }
  }, [dispatch, editId]);

  useEffect(() => {
    if (editId) {
      setAddHotelFields({
        ...addHotelFields,
        hotel_id: editId,
        user_id: userId,
        name: hotel?.name,
        type: {
          id: types?.find((item) => {
            return item.id === hotel?.type_id;
          })?.id,
          value:
            types?.find((item) => {
              return item.id === hotel?.type_id;
            })?.name || 'Choose Type',
          show: false,
        },
        address: hotel?.addresses[0]?.address,
        longitude: hotel?.addresses[0]?.longitude,
        latitude: hotel?.addresses[0]?.latitude,
        city: {
          id: cities?.find((item) => {
            return item.id === hotel?.addresses[0]?.city_id;
          })?.id,
          value:
            cities?.find((item) => {
              return item.id === hotel?.addresses[0]?.city_id;
            })?.name || 'Choose City',
          show: false,
        },
        email: hotel?.email,
        phone: hotel?.phone,
        description: hotel?.description,
        facilities: hotel?.facilities.map((item) => item.id),
      });
      reset();
      return;
    }
    // setAddHotelFields({
    //   hotel_id: null,
    //   user_id: userId,
    //   name: null,
    //   type: {
    //     id: '',
    //     value: 'Choose Type',
    //     show: false,
    //   },
    //   address: null,
    //   longitude: null,
    //   latitude: null,

    //   city: {
    //     id: '',
    //     value: 'Choose City',
    //     show: false,
    //   },
    //   email: null,
    //   phone: null,
    //   description: null,
    //   facilities: [],
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, types, userId, cities, hotel]);

  const onSubmit = () => {
    let fileHotel = hotelImgs.map((obj) => {
      return obj.originFileObj;
    });
    const formData = new FormData();
    formData.append('hotel_id', addHotelFields.hotel_id);
    formData.append('user_id', addHotelFields.user_id);
    formData.append('name', addHotelFields.name);
    formData.append('type_id', addHotelFields.type.id);
    formData.append('address', addHotelFields.address);
    formData.append('longitude', addHotelFields.longitude);
    formData.append('latitude', addHotelFields.latitude);
    formData.append('city_id', addHotelFields.city.id);
    formData.append('email', addHotelFields.email);
    formData.append('phone', addHotelFields.phone);
    formData.append('description', addHotelFields.description);
    formData.append('facilities', JSON.stringify(addHotelFields.facilities));
    for (let i = 0; i < fileHotel.length; i++) {
      formData.append(`hotel_images[${i}]`, fileHotel[i]);
    }
    dispatch(addEditHotel(formData));
  };

  console.log(addHotelFields);

  useEffect(() => {
    if (!status) return;
    navigate('/user/listings');
  }, [navigate, status]);
  //

  return (
    <>
      <div className={cx('main-user-listing')}>
        <div className={cx('title', ['bg-sub-primary'])}>
          <h3>{editId ? 'Edit Hotel' : 'Add New Hotel'}</h3>
        </div>
        <div className={cx('content', 'add-listing')}>
          <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
            <div className={cx('header-title')}>
              <h3> Basic Informations</h3>
            </div>
            <div className={cx('item-wrap', 'hotel-title')}>
              <div className={cx('form-group')}>
                <label>Hotel name</label>
                <span className={cx('form-icon')}>
                  <i className="ri-hotel-line"></i>
                </span>
                <input
                  {...register('hotel_name', {
                    required: 'Field name is required',
                  })}
                  type="text"
                  placeholder="Name of your Hotel..."
                  onChange={(e) => {
                    setAddHotelFields({
                      ...addHotelFields,
                      name: e.target.value,
                    });
                  }}
                  defaultValue={editId ? hotel?.name : null}
                />
                {errors?.hotel_name && (
                  <span className={cx('form-massage', ['text-danger'])}>
                    {errors?.hotel_name.message}
                  </span>
                )}
              </div>
              <div className={cx('form-group')}>
                <label>Type / Category</label>
                <div
                  onClick={() => {
                    setAddHotelFields({
                      ...addHotelFields,
                      type: {
                        ...addHotelFields?.type,
                        show: !addHotelFields?.type?.show,
                      },
                    });
                  }}
                  className={cx('select-text')}
                >
                  <span className={cx('current')}>
                    {addHotelFields?.type?.value}
                  </span>
                </div>
                <div
                  style={
                    addHotelFields?.type?.show
                      ? {
                          display: 'block',
                        }
                      : {}
                  }
                  className={cx('select-content')}
                >
                  <ul>
                    {types &&
                      Array.isArray(types) &&
                      types.map((type) => {
                        return (
                          <li
                            onClick={() => {
                              setAddHotelFields({
                                ...addHotelFields,
                                type: {
                                  id: type.id,
                                  value: type.name,
                                  show: !addHotelFields?.type?.show,
                                },
                              });
                            }}
                            key={type.id}
                          >
                            {type.name}
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
              <div className={cx('gallery')}>
                <UploadImg
                  images={quantityImage}
                  fileList={hotelImgs}
                  setFileList={setHotelImgs}
                />
              </div>
            </div>

            <div className={cx('header-title')}>
              <h3> Location / Contacts</h3>
            </div>
            <div className={cx('item-wrap', 'hotel-location')}>
              <div className={cx('form-group')}>
                <label>Address</label>
                <span className={cx('form-icon')}>
                  <i className="ri-map-pin-line"></i>
                </span>
                <input
                  {...register('address', {
                    required: 'Field address is required',
                  })}
                  type="text"
                  placeholder="Address of your Hotel..."
                  onChange={(e) => {
                    setAddHotelFields({
                      ...addHotelFields,
                      address: e.target.value,
                    });
                  }}
                  defaultValue={editId ? hotel?.addresses[0]?.address : null}
                />
                {errors?.address && (
                  <span className={cx('form-massage', ['text-danger'])}>
                    {errors?.address?.message}
                  </span>
                )}
              </div>

              <div className={cx('form-group')}>
                <label>City / Location</label>
                <div
                  onClick={() => {
                    setAddHotelFields({
                      ...addHotelFields,
                      city: {
                        ...addHotelFields?.city,
                        show: !addHotelFields?.city?.show,
                      },
                    });
                  }}
                  className={cx('select-text')}
                >
                  <span className={cx('current')}>
                    {addHotelFields?.city?.value}
                  </span>
                </div>
                <div
                  style={
                    addHotelFields?.city?.show
                      ? {
                          display: 'block',
                        }
                      : {}
                  }
                  className={cx('select-content')}
                >
                  <ul>
                    {cities &&
                      Array.isArray(cities) &&
                      cities.map((city) => {
                        return (
                          <li
                            onClick={() => {
                              setAddHotelFields({
                                ...addHotelFields,
                                city: {
                                  id: city.id,
                                  value: city.name,
                                  show: !addHotelFields?.city?.show,
                                },
                              });
                            }}
                            key={city.id}
                          >
                            {city.name}
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
              <div className={cx('form-group')}>
                <label>Longitude (Drag marker on the map)</label>
                <span className={cx('form-icon')}>
                  <i className="ri-arrow-right-fill"></i>
                </span>
                <input
                  {...register('longitude', {
                    required: 'Field longitude is required',
                  })}
                  type="text"
                  placeholder="Map Longitude..."
                  onChange={(e) => {
                    setAddHotelFields({
                      ...addHotelFields,
                      longitude: e.target.value,
                    });
                  }}
                  defaultValue={editId ? hotel?.addresses[0]?.longitude : null}
                />
                {errors?.longitude && (
                  <span className={cx('form-massage', ['text-danger'])}>
                    {errors?.longitude?.message}
                  </span>
                )}
              </div>
              <div className={cx('form-group')}>
                <label>Latitude (Drag marker on the map) </label>
                <span className={cx('form-icon')}>
                  <i className="ri-arrow-down-fill"></i>
                </span>
                <input
                  {...register('latitude', {
                    required: 'Field latitude is required',
                  })}
                  type="text"
                  placeholder="Map Latitude..."
                  onChange={(e) => {
                    setAddHotelFields({
                      ...addHotelFields,
                      latitude: e.target.value,
                    });
                  }}
                  defaultValue={editId ? hotel?.addresses[0].latitude : null}
                />
                {errors.latitude && (
                  <span className={cx('form-massage', ['text-danger'])}>
                    {errors.latitude.message}
                  </span>
                )}
              </div>
              <div className={cx('form-group')}>
                <label>Email Address</label>
                <span className={cx('form-icon')}>
                  <i className="ri-mail-line"></i>
                </span>
                <input
                  {...register('email', {
                    required: 'Field email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="text"
                  placeholder="example@example.com"
                  onChange={(e) => {
                    setAddHotelFields({
                      ...addHotelFields,
                      email: e.target.value,
                    });
                  }}
                  defaultValue={editId ? hotel?.email : null}
                />
                {errors.email && (
                  <span className={cx('form-massage', ['text-danger'])}>
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className={cx('form-group')}>
                <label>Phone</label>
                <span className={cx('form-icon')}>
                  <i className="ri-phone-line"></i>
                </span>
                <input
                  {...register('phone', {
                    required: 'Field phone is required',
                  })}
                  type="text"
                  placeholder="+(123)456789"
                  onChange={(e) => {
                    setAddHotelFields({
                      ...addHotelFields,
                      phone: e.target.value,
                    });
                  }}
                  defaultValue={editId ? hotel?.phone : null}
                />
                {errors.phone && (
                  <span className={cx('form-massage', ['text-danger'])}>
                    {errors.phone.message}
                  </span>
                )}
              </div>
            </div>

            <div className={cx('header-title')}>
              <h3>Description</h3>
            </div>
            <div className={cx('item-wrap', 'hotel-desc')}>
              <div className={cx('form-group')}>
                <label>Text</label>
                <textarea
                  {...register('hotel_desc', {
                    required: 'Field description is required',
                  })}
                  type="text"
                  cols="40"
                  rows="3"
                  placeholder="Hotel Description ..."
                  onChange={(e) => {
                    setAddHotelFields({
                      ...addHotelFields,
                      description: e.target.value,
                    });
                  }}
                  defaultValue={editId ? hotel?.description : null}
                ></textarea>
                {errors?.hotel_desc && (
                  <span className={cx('form-massage', ['text-danger'])}>
                    {errors?.hotel_desc?.message}
                  </span>
                )}
              </div>
            </div>

            <div className={cx('header-title')}>
              <h3>Facilities</h3>
            </div>
            <div className={cx('item-wrap', 'hotel-facilities')}>
              <div className={cx('form-group')}>
                <ul>
                  {facilities &&
                    Array.isArray(facilities) &&
                    facilities.map((item) => {
                      return (
                        <li key={item.id}>
                          <input
                            onChange={() => {
                              setAddHotelFields((prevState) => {
                                const isChecked = prevState.facilities.includes(
                                  item.id,
                                );
                                const updatedFacilities = isChecked
                                  ? prevState.facilities.filter((item) => {
                                      return item !== item.id;
                                    })
                                  : [...prevState.facilities, item.id];
                                return {
                                  ...prevState,
                                  facilities: updatedFacilities,
                                };
                              });
                            }}
                            type="checkbox"
                            defaultChecked={
                              editId
                                ? hotel?.facilities.find((fac) => {
                                    return fac.id === item.id;
                                  })
                                : false
                            }
                          />
                          <label htmlFor="check-aaa5">{item.name}</label>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>

            <div className={cx('header-title')}>
              <h3>Your Socials</h3>
            </div>
            <div className={cx('item-wrap')}>
              <div className={cx('form-group')}>
                <label>Facebook</label>
                <span className={cx('form-icon')}>
                  <i className="ri-facebook-box-line"></i>
                </span>
                <input
                  type="text"
                  placeholder="https://www.facebook.com/"
                  defaultValue=""
                />
              </div>
              <div className={cx('form-group')}>
                <label>Twitter</label>
                <span className={cx('form-icon')}>
                  <i className="ri-twitter-line"></i>
                </span>
                <input
                  type="text"
                  placeholder="https://twitter.com/"
                  defaultValue=""
                />
              </div>

              <div className={cx('form-group')}>
                <label>Instagram</label>
                <span className={cx('form-icon')}>
                  <i className="ri-instagram-line"></i>
                </span>
                <input
                  type="text"
                  placeholder="https://www.instagram.com/"
                  defaultValue=""
                />
              </div>
            </div>

            <Button secondary icon>
              {editId ? 'Update' : 'Submit'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};
export default memo(AddEditHotel);
