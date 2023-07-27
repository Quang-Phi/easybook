import { memo, useEffect } from 'react';
import style from './Listing.module.scss';
import classNames from 'classnames/bind';
import {
  changeStatus,
  deleteHotel,
  getUserListings,
} from '~/redux/Reducer/listingSlice';
import { useDispatch, useSelector } from 'react-redux';
import Button from '~/components/Bases/Button';
import { Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { API_SERVER_URL, checkLinkImg } from '~/services/Utils';

const cx = classNames.bind(style);
const Listing = ({ userId }) => {
  const dispatch = useDispatch();
  //redux
  const resListing = useSelector((state) => state.listing);
  const listings = resListing?.listings;
  //

  useEffect(() => {
    dispatch(getUserListings(userId));
  }, [dispatch, userId]);

  //change status of hotel
  const handleChangeStatus = (id) => {
    dispatch(changeStatus(id));
    dispatch(getUserListings(userId));
  };
  //
  //
  const handleDeleteHotel = (id) => {
    dispatch(deleteHotel(id));
    dispatch(getUserListings(userId));
  };

  return (
    <>
      <div className={cx('main-user-listing', ['active'])}>
        <div className={cx('title', ['bg-sub-primary'])}>
          <h3>My Listing</h3>
        </div>
        <div className={cx('content', 'listing')}>
          {listings.length ? (
            Array.isArray(listings) &&
            listings.map((hotel) => {
              const encodedName = encodeURIComponent(hotel.name)
                .replace(/%2C|%20/g, ' ')
                .replace(/\s+/g, '+');
              return (
                <div key={hotel.id} className={cx('listing-item')}>
                  <Link
                    to={`/listings/${encodedName}?id=${hotel.id}`}
                    className={cx('item-img')}
                  >
                    <img
                      src={
                        checkLinkImg(hotel?.images[0]?.image_link)
                          ? hotel?.images[0]?.image_link
                          : `${API_SERVER_URL}${hotel?.images[0]?.image_link}`
                      }
                      alt="cate-img"
                    />
                  </Link>
                  <div className={cx('item-content')}>
                    <h3>
                      <Link to={`/listings/${encodedName}?id=${hotel.id}`}>
                        {hotel.name}
                      </Link>
                    </h3>
                    <span className={cx('address')}>
                      <i className="ri-map-pin-line"></i>
                      <Link to={`/listings/${encodedName}?id=${hotel?.id}`}>
                        {hotel?.addresses && hotel?.addresses[0]?.address}
                      </Link>
                    </span>
                    <div className={cx('group-btn')}>
                      <Button
                        to={`/user/${encodedName}/add-room?id=${hotel.id}`}
                        sub_primary
                        small
                        icon_right
                      >
                        Add room
                        <i className="ri-add-line"></i>
                      </Button>

                      <Popconfirm
                        title="Change status"
                        description={`Are you sure to ${
                          !hotel.status ? ' Active ' : ' Inactive'
                        } this hotel?`}
                        okText="Yes"
                        cancelText="Cancel"
                        onConfirm={() => {
                          handleChangeStatus(hotel.id);
                        }}
                      >
                        <Button
                          small
                          primary={!hotel.status}
                          act={hotel.status}
                          icon_right
                        >
                          {hotel.status ? ' Active ' : ' Inactive'}
                          {hotel.status ? (
                            <i className="ri-lock-unlock-line"></i>
                          ) : (
                            <i className="ri-lock-line"></i>
                          )}
                        </Button>
                      </Popconfirm>

                      <Button
                        to={`/user/listings/edit-hotel/${encodedName}?id=${hotel.id}`}
                        secondary
                        small
                        icon_right
                      >
                        Edit
                        <i className="ri-file-edit-line"></i>
                      </Button>
                      <Popconfirm
                        title="Delete the hotel"
                        description="Are you sure to delete this hotel?"
                        okText="Yes"
                        cancelText="Cancel"
                        onConfirm={() => {
                          handleDeleteHotel(hotel.id);
                        }}
                      >
                        <Button small dlt icon_right>
                          Delete
                          <i className="ri-delete-bin-5-line"></i>
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ flexDirection: 'column' }} className="no-data">
              <img src="/imgs/base/notfound.avif" alt="" />
              <Button to={'/user/listings/add-hotel'} secondary icon>
                Add Your Hotel
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default memo(Listing);
