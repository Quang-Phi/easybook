/* eslint-disable react-hooks/exhaustive-deps */
import style from './Listings.module.scss';
import classNames from 'classnames/bind';
import SlickItem from '~/components/Bases/Slick/SlickItem';
import { memo, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getListing, getSubData } from '~/redux/Reducer/listingSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import Paginate from '~/components/Bases/Pagination';
import { scrollToTop } from '~/services/Utils';
import 'react-datepicker/dist/react-datepicker.css';
import MyContext from '~/components/Context';
import Aside from './Aside';

const cx = classNames.bind(style);
const Listing = () => {
  //base
  const dispatch = useDispatch();
  const locationURL = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getSubData());
  }, [dispatch]);

  const [layoutGrid, setLayoutGrid] = useState(1);
  //

  //context
  const m = useContext(MyContext);
  const { setDataBook, dataBook } = m;
  //

  //redux && data in redux
  const { listing } = useSelector((state) => state);
  const list = {
    hotels: listing?.listings?.data,
    facilities: listing?.facilities,
  };
  const { hotels, facilities } = list;
  //

  //get param tu URL va xu ly khi search
  const searchParams = new URLSearchParams(locationURL.search);
  //get location
  const resLocationName = searchParams.get('location.name');
  const resLocationId = searchParams.get('location.id');
  //get type
  const resTypeName = searchParams.get('type.name');
  const resTypeId = searchParams.get('type.id');
  //get rate
  const resStarRating = searchParams.get('star_rating');
  //get facilities
  const resFacilities = searchParams.getAll('facilities');
  //get pagecurrent
  const resCurrPage = searchParams.get('page');
  const [currPage, setCurrPage] = useState(Number(resCurrPage) || 1);
  //get date
  let resDateStart = searchParams.get('date.in');
  let resDateEnd = searchParams.get('date.out');

  const [search, setSearch] = useState({
    location: {
      id: resLocationId || '',
      name: resLocationName || '',
    },
    type: {
      id: resTypeId || '',
      name: resTypeName || '',
    },
    date: {
      in: resDateStart || '',
      out: resDateEnd || '',
    },
    star_rating: resStarRating || '',
    facilities: resFacilities || [],
    page: 1,
    per_page: 20,
  });

  const actionSearch = (obj = null) => {
    scrollToTop();
    flattenObject(obj ? obj : search);
    navigate({ search: searchParams.toString() });
    dispatch(getListing(obj ? obj : search));
  };

  useEffect(() => {
    actionSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.page]);

  useEffect(() => {
    if (!search.date.in || !search.date.out) return;
    setDataBook({
      ...dataBook,
      dateIn: search.date.in,
      dateOut: search.date.out,
    });
  }, [search.date]);
  //
  const flattenObject = (obj, prefix = '') => {
    searchParams.delete('page');
    searchParams.delete('per_page');
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && !Array.isArray(value)) {
        flattenObject(value, `${prefix}${key}.`);
      } else if (Array.isArray(value)) {
        const validValues = value.filter((item) => item !== '');
        if (validValues.length > 0) {
          searchParams.delete(`${prefix}${key}`);
          validValues.forEach((item) => {
            searchParams.append(`${prefix}${key}`, item);
          });
        } else {
          searchParams.delete(`${prefix}${key}`);
        }
      } else if (value || value === 0 || value === false) {
        if (!searchParams.getAll(`${prefix}${key}`).includes(value)) {
          searchParams.set(`${prefix}${key}`, value);
        }
      } else {
        searchParams.delete(`${prefix}${key}`);
      }
    });
  };

  //xu ly handle
  const handleChangePaginate = (e, value) => {
    setCurrPage(value);
    setSearch({
      ...search,
      page: value,
    });
  };

  const [showKeySearch, setShowKeySearch] = useState(false);
  const handleDeleteKeySearch = (field, value) => {
    setSearch({
      ...search,
      [field]: value,
    });
    const updatedSearch = {
      ...search,
      [field]: value,
    };
    actionSearch(updatedSearch);
  };
  //

  //handle short result
  const [keyShort, setKeyShort] = useState('');
  const [shortedHotels, setShortedHotels] = useState([]);
  useEffect(() => {
    setShortedHotels(hotels);
  }, [hotels]);
  useEffect(() => {
    if (keyShort === 'price-asc') {
      let shortArrs = [...shortedHotels].sort(
        (a, b) => a.avgPrice - b.avgPrice,
      );
      setShortedHotels(shortArrs);
    } else if (keyShort === 'price-desc') {
      let shortArrs = [...shortedHotels].sort(
        (a, b) => b.avgPrice - a.avgPrice,
      );
      setShortedHotels(shortArrs);
    } else if (keyShort === 'rate-desc') {
      let shortArrs = [...shortedHotels].sort(
        (a, b) => b.avgRating - a.avgRating,
      );
      setShortedHotels(shortArrs);
    } else {
      setShortedHotels(hotels);
    }
  }, [keyShort]);

  return (
    <div id={cx('listings')}>
      <div className={cx('listings-wrapper')}>
        <section className={cx('listings-content', ['bg-grey-blue'])}>
          <div className="container">
            <div className="row">
              <Aside
                search={search}
                setSearch={setSearch}
                setShowKeySearch={setShowKeySearch}
                actionSearch={actionSearch}
              />
              <div className="col-lg-8 col-md-12">
                <div className={cx('listings-inner')}>
                  <div className={cx('card-listing-wrap')}>
                    {showKeySearch ? (
                      search.location.name ||
                      search.type.name ||
                      search.star_rating ||
                      search.facilities.length ? (
                        <div className={cx('search-key')}>
                          <h3 className={cx('search-key-title')}>
                            Results for:{' '}
                          </h3>
                          <ul>
                            {search.location.name && (
                              <li>
                                <span>
                                  <i className="ri-map-pin-line"></i>
                                </span>
                                {search.location.name}
                                <span
                                  onClick={() => {
                                    handleDeleteKeySearch('location', {
                                      id: '',
                                      name: '',
                                    });
                                  }}
                                  className={cx('delete')}
                                >
                                  <i className="ri-close-line"></i>
                                </span>
                              </li>
                            )}

                            {search.type.name && (
                              <li>
                                <span>
                                  <i className="ri-hotel-line"></i>
                                </span>
                                {search.type.name}
                                <span
                                  onClick={() =>
                                    handleDeleteKeySearch('type', {
                                      id: '',
                                      name: '',
                                    })
                                  }
                                  className={cx('delete')}
                                >
                                  <i className="ri-close-line"></i>
                                </span>
                              </li>
                            )}
                            {search.star_rating && (
                              <li>
                                <span>
                                  <i className="ri-star-half-line"></i>
                                </span>
                                {search.star_rating}
                                <span
                                  onClick={() =>
                                    handleDeleteKeySearch('star_rating', '')
                                  }
                                  className={cx('delete')}
                                >
                                  <i className="ri-close-line"></i>
                                </span>
                              </li>
                            )}
                            {search.facilities &&
                              search.facilities.map((item, index) => (
                                <li key={index}>
                                  <span>
                                    <i className="ri-list-check-3"></i>
                                  </span>
                                  {item}
                                  <span
                                    onClick={() => {
                                      const list = search.facilities.filter(
                                        (facility) => facility !== item,
                                      );
                                      handleDeleteKeySearch('facilities', list);
                                    }}
                                    className={cx('delete')}
                                  >
                                    <i className="ri-close-line"></i>
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      ) : (
                        ''
                      )
                    ) : (
                      ''
                    )}
                    <div
                      style={
                        showKeySearch &&
                        (search.location.name ||
                          search.type.name ||
                          search.star_rating ||
                          search.facilities.length)
                          ? {
                              marginTop: 1.2 + 'rem',
                            }
                          : {}
                      }
                      className={cx('action')}
                    >
                      <div className={cx('sort-by', ['d-flex'])}>
                        <span className="desc text-dark">Sort results by:</span>
                        <div className={cx('select-sort')}>
                          <select onChange={(e) => setKeyShort(e.target.value)}>
                            <option value=""> Normal</option>
                            <option value="rate-desc">
                              {' '}
                              Rating: high to low
                            </option>
                            <option value={'price-asc'}>
                              Price: low to high
                            </option>
                            <option value={'price-desc'}>
                              Price: high to low
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className={cx('layout')}>
                        <ul className="d-flex">
                          <li
                            onClick={() => setLayoutGrid(1)}
                            className={cx(
                              'one-col-grid',
                              layoutGrid === 1 && ['current'],
                            )}
                          >
                            <span>
                              <i className="ri-layout-row-line"></i>
                            </span>
                          </li>
                          <li
                            onClick={() => setLayoutGrid(2)}
                            className={cx(
                              'two-col-grid',
                              layoutGrid === 2 && ['current'],
                            )}
                          >
                            <span>
                              <i className="ri-layout-grid-line"></i>
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {shortedHotels && (
                      <>
                        <div
                          style={
                            shortedHotels.length ? {} : { display: 'block' }
                          }
                          className={cx(
                            'card-list-content',
                            layoutGrid === 1 && ['one-col'],
                          )}
                        >
                          {shortedHotels.length ? (
                            Array.isArray(shortedHotels) &&
                            shortedHotels.map((item, index) => {
                              return (
                                <SlickItem
                                  key={index}
                                  item={item}
                                  facilities={facilities}
                                  card_list
                                  layoutGrid={layoutGrid}
                                />
                              );
                            })
                          ) : (
                            <div className="no-data">
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  '/imgs/base/notfound.avif'
                                }
                                alt="no data"
                              />
                            </div>
                          )}
                        </div>
                        {shortedHotels?.length >= search.per_page ? (
                          <div className={cx('pagination')}>
                            <Paginate
                              page={currPage}
                              onChange={handleChangePaginate}
                              count={listing?.listings?.last_page}
                            />
                          </div>
                        ) : (
                          ''
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="limit-box "></div>
        </section>
      </div>
    </div>
  );
};
export default memo(Listing);
