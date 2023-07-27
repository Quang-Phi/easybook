import Button from '~/components/Bases/Button';
import styles from '../AddRoom/AddRoom.module.scss';
import classNames from 'classnames/bind';
import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRoom, getSubData } from '~/redux/Reducer/listingSlice';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UploadImg from '~/components/Bases/UploadImg';

const cx = classNames.bind(styles);
const AddRoom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //
  //query param url
  const params = new URLSearchParams(useLocation().search);
  const hotelId = params.get('id');
  //
  //redux
  const { status, amenities, categories } = useSelector(
    (state) => state.listing,
  );
  //
  //handle form
  const cateForm = useForm();
  const {
    register: registerAddCate,
    handleSubmit: handleSubmitAddRoom,
    formState: { errors: errorsAddCate },
  } = cateForm;

  useEffect(() => {
    dispatch(getSubData());
  }, [dispatch]);

  const [addCate, setAddCate] = useState(false);
  const [quantityRoom, setQuantityRoom] = useState(1);

  const [newRoomImg, setNewRoomImg] = useState([]);
  const [newCateImg, setNewCateImg] = useState([]);

  const [addRoomFields, setAddRoomFields] = useState({
    hotel_id: hotelId,
    room: {
      name: [],
      price: [],
      desc: [],
      quantity: null,
    },
    categories: {
      choose: {
        id: null,
        value: 'Choose cate',
      },
      create: {
        name: null,
        guest: null,
        desc: null,
        amenities: [],
      },
      show: false,
    },
  });

  const onSubmit = () => {
    if (addRoomFields.room.quantity == null) {
      toast('Please choose quantity', {
        pauseOnHover: true,
        closeOnClick: true,
        type: 'info',
      });
      return;
    }
    const formData = new FormData();
    formData.append('hotel_id', hotelId);
    formData.append('room', JSON.stringify(addRoomFields.room));
    formData.append('categories', JSON.stringify(addRoomFields.categories));
    let fileCate = newCateImg.map((obj) => {
      return obj.originFileObj;
    });
    let fileRoom = newRoomImg.map((arr) => {
      return arr.map((obj) => {
        return obj.originFileObj;
      });
    });
    formData.append('cate_image', fileCate[0]);
    for (let i = 0; i < fileRoom.length; i++) {
      const fileArray = fileRoom[i];
      for (let j = 0; j < fileArray.length; j++) {
        formData.append(`room_images[${i}][${j}]`, fileArray[j]);
      }
    }

    dispatch(addRoom(formData));
  };

  useEffect(() => {
    if (!status) return;
    navigate('/user/listings');
  }, [navigate, status]);
  //
  return (
    <>
      <div className={cx('main-user-listing', ['active'])}>
        <div className={cx('title', ['bg-sub-primary'])}>
          <h3>Add Room</h3>
        </div>
        <div className={cx('content', 'add-room')}>
          <form
            onSubmit={handleSubmitAddRoom(onSubmit)}
            encType="multipart/form-data"
          >
            <div className={cx('header-title')}>
              <h3>Rooms type</h3>
            </div>
            <div className={cx('item-wrap', 'room-type')}>
              <div className={cx('room-type-inner')}>
                {!addCate ? (
                  <>
                    <div
                      style={{ gridColumnEnd: '4' }}
                      className={cx('form-group')}
                    >
                      <label>Choose Type</label>
                      <div
                        onClick={() => {
                          setAddRoomFields((prevState) => {
                            const updatedCategories = {
                              ...prevState.categories,
                              show: !prevState.categories.show,
                            };
                            return {
                              ...prevState,
                              categories: updatedCategories,
                            };
                          });
                        }}
                        className={cx('select-text')}
                      >
                        <span className={cx('current')}>
                          {addRoomFields.categories?.choose?.value ||
                            'Choose Category'}
                        </span>
                      </div>
                      <div
                        style={
                          addRoomFields.categories.show
                            ? {
                                display: 'block',
                              }
                            : {}
                        }
                        className={cx('select-content')}
                      >
                        <ul>
                          {categories?.map((cate) => (
                            <li
                              key={cate.id}
                              onClick={() => {
                                setAddRoomFields((prevState) => {
                                  const updatedCategories = {
                                    ...prevState.categories,
                                    choose: {
                                      id: cate.id,
                                      value: cate.name,
                                    },
                                    show: !prevState.categories.show,
                                  };
                                  return {
                                    ...prevState,
                                    categories: updatedCategories,
                                  };
                                });
                              }}
                            >
                              {cate.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={cx('form-group')}>
                      <label>
                        type name <i className="fal fa-warehouse-alt"></i>
                      </label>
                      <span className={cx('form-icon')}>
                        <i className="ri-profile-line"></i>
                      </span>
                      <input
                        {...registerAddCate('category_name', {
                          required: 'Field name is required',
                        })}
                        type="text"
                        placeholder="Type name..."
                        onChange={(e) => {
                          setAddRoomFields((prevState) => {
                            const updatedCategories = {
                              ...prevState.categories,
                              create: {
                                ...prevState.categories.create,
                                name: e.target.value,
                              },
                            };
                            return {
                              ...prevState,
                              categories: updatedCategories,
                            };
                          });
                        }}
                      />
                      {errorsAddCate.category_name &&
                        errorsAddCate.category_name && (
                          <span className={cx('form-massage', ['text-danger'])}>
                            {errorsAddCate.category_name.message}
                          </span>
                        )}
                    </div>
                    <div className={cx('form-group')}>
                      <label>Guest</label>
                      <span className={cx('form-icon')}>
                        <i className="ri-group-2-line"></i>
                      </span>
                      <input
                        {...registerAddCate('guest', {
                          required: 'Field guest is required',
                        })}
                        type="text"
                        placeholder="**"
                        onChange={(e) => {
                          setAddRoomFields((prevState) => {
                            const updatedCategories = {
                              ...prevState.categories,
                              create: {
                                ...prevState.categories.create,
                                guest: e.target.value,
                              },
                            };
                            return {
                              ...prevState,
                              categories: updatedCategories,
                            };
                          });
                        }}
                      />
                      {errorsAddCate.guest && errorsAddCate.guest && (
                        <span className={cx('form-massage', ['text-danger'])}>
                          {errorsAddCate.guest.message}
                        </span>
                      )}
                    </div>
                    <div className={cx('form-group', 'desc')}>
                      <label>Room type description</label>
                      <textarea
                        {...registerAddCate('cate_desc', {
                          required: 'Field description is required',
                        })}
                        type="text"
                        cols="40"
                        rows="3"
                        placeholder="Room type description ..."
                        onChange={(e) => {
                          setAddRoomFields((prevState) => {
                            const updatedCategories = {
                              ...prevState.categories,
                              create: {
                                ...prevState.categories.create,
                                desc: e.target.value,
                              },
                            };
                            return {
                              ...prevState,
                              categories: updatedCategories,
                            };
                          });
                        }}
                      ></textarea>
                      {errorsAddCate.cate_desc && errorsAddCate.cate_desc && (
                        <span className={cx('form-massage', ['text-danger'])}>
                          {errorsAddCate.cate_desc.message}
                        </span>
                      )}
                    </div>
                    <div className={cx('form-group', 'gallery')}>
                      <label>Gallery</label>
                      <div className={cx('gallery-content')}>
                        <UploadImg
                          images={1}
                          fileList={newCateImg}
                          setFileList={setNewCateImg}
                        />
                        <ul className={cx('amenities')}>
                          {amenities &&
                            Array.isArray(amenities) &&
                            amenities.map((item) => {
                              return (
                                <li key={item.id}>
                                  <input
                                    onChange={() => {
                                      setAddRoomFields((prevState) => {
                                        const isChecked =
                                          prevState.categories.create.amenities.includes(
                                            item.id,
                                          );
                                        const updatedAmenities = isChecked
                                          ? prevState.categories.create?.amenities?.filter(
                                              (id) => id !== item.id,
                                            )
                                          : [
                                              ...prevState.categories.create
                                                .amenities,
                                              item.id,
                                            ];

                                        const updatedCategories = {
                                          ...prevState.categories,
                                          create: {
                                            ...prevState.categories.create,
                                            amenities: updatedAmenities,
                                          },
                                        };

                                        return {
                                          ...prevState,
                                          categories: updatedCategories,
                                        };
                                      });
                                    }}
                                    type="checkbox"
                                  />
                                  <label htmlFor={`check-${item.id}`}>
                                    {item.name}
                                  </label>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
                <span className={cx('form-separator')}>
                  <span>or</span>
                </span>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setAddCate(!addCate);
                    setAddRoomFields({
                      ...addRoomFields,
                      categories: {
                        ...addRoomFields.categories,
                        choose: {
                          id: null,
                          name: 'Choose Category',
                        },
                      },
                    });
                  }}
                  sub_primary
                  small
                  icon_right
                >
                  {!addCate ? 'Add New +' : 'Choose Type '}
                </Button>
              </div>
            </div>

            <div className={cx('header-title')}>
              <h3> Add Room</h3>
            </div>

            <div className={cx('quantity-wrap')}>
              <div className={cx('form-group')}>
                <label>quantity rooms</label>
                <input
                  type="number"
                  value={quantityRoom}
                  max={50}
                  onChange={(e) => {
                    setQuantityRoom(e.target.value);
                  }}
                />
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setAddRoomFields((prevState) => {
                      const updatedRoom = {
                        ...prevState.room,
                        quantity: Number(quantityRoom),
                      };
                      return {
                        ...prevState,
                        room: updatedRoom,
                      };
                    });
                    setNewRoomImg(
                      Array.from({ length: quantityRoom }, () => []),
                    );
                  }}
                  small
                  secondary
                >
                  Submit
                </Button>
              </div>
            </div>

            <div className={cx('rooms')}>
              {addRoomFields.room.quantity &&
                Array.from({ length: addRoomFields.room.quantity }).map(
                  (_, index) => {
                    return (
                      <div className={cx('room-item')} key={index}>
                        <div
                          key={index}
                          className={cx('header-title', 'custom')}
                        >
                          <h3>Room {index + 1} - Basic Informations</h3>
                          <span
                            onClick={() => {
                              setQuantityRoom((prev) => {
                                return prev - 1;
                              });
                            }}
                            className={cx('close')}
                          >
                            <i className="ri-close-line"></i>
                          </span>
                        </div>

                        <div className={cx('item-wrap', 'room-title')}>
                          <div className={cx('form-group')}>
                            <label>Room Name</label>
                            <span className={cx('form-icon')}>
                              <i className="ri-hotel-line"></i>
                            </span>
                            <input
                              {...registerAddCate(`room_name_${index}`, {
                                required: 'Field name is required',
                              })}
                              onChange={(e) => {
                                setAddRoomFields((prevState) => {
                                  const updatedRoom = [...prevState.room.name];
                                  updatedRoom[index] = e.target.value;
                                  return {
                                    ...prevState,
                                    room: {
                                      ...prevState.room,
                                      name: updatedRoom,
                                    },
                                  };
                                });
                              }}
                              type="text"
                              placeholder="Name of room..."
                            />
                            {errorsAddCate[`room_name_${index}`] && (
                              <span
                                className={cx('form-message', ['text-danger'])}
                              >
                                {errorsAddCate[`room_name_${index}`].message}
                              </span>
                            )}
                          </div>
                          <div className={cx('form-group', 'price')}>
                            <label>Room Price</label>
                            <span className={cx('form-icon')}>
                              <i className="ri-money-dollar-circle-line"></i>
                            </span>
                            <input
                              {...registerAddCate(`price_${index}`, {
                                required: 'Field price is required',
                              })}
                              type="number"
                              placeholder="$"
                              onChange={(e) => {
                                setAddRoomFields((prevState) => {
                                  const updatedRoom = [...prevState.room.price];
                                  updatedRoom[index] = e.target.value;
                                  return {
                                    ...prevState,
                                    room: {
                                      ...prevState.room,
                                      price: updatedRoom,
                                    },
                                  };
                                });
                              }}
                            />
                            {errorsAddCate[`price_${index}`] && (
                              <span
                                className={cx('form-massage', ['text-danger'])}
                              >
                                {errorsAddCate[`price_${index}`].message}
                              </span>
                            )}
                          </div>
                          <div className={cx('gallery')}>
                            <UploadImg
                              images={6}
                              fileList={newRoomImg[index]}
                              fileLists={newRoomImg}
                              setFileList={setNewRoomImg}
                              index={index}
                            />
                          </div>
                          <div className={cx('form-group')}>
                            <label>Room description </label>
                            <textarea
                              {...registerAddCate(`room_desc_${index}`, {
                                required: 'Field description is required',
                              })}
                              type="text"
                              cols="40"
                              rows="3"
                              placeholder="Description ..."
                              onChange={(e) => {
                                setAddRoomFields((prevState) => {
                                  const updatedRoom = [...prevState.room.desc];
                                  updatedRoom[index] = e.target.value;
                                  return {
                                    ...prevState,
                                    room: {
                                      ...prevState.room,
                                      desc: updatedRoom,
                                    },
                                  };
                                });
                              }}
                            ></textarea>
                            {errorsAddCate[`room_desc_${index}`] && (
                              <span
                                className={cx('form-massage', ['text-danger'])}
                              >
                                {errorsAddCate[`room_desc_${index}`].message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
            </div>

            <Button secondary icon>
              Submit
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};
export default memo(AddRoom);
