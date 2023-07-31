import Button from '~/components/Bases/Button';
import style from './Aside.module.scss';
import classNames from 'classnames/bind';
import { DatePicker } from 'antd';
import { memo, useEffect, useRef, useState } from 'react';
import useScrollWaitingElement from '~/hooks/useScrollWaitingElement';
import { useSelector } from 'react-redux';

const cx = classNames.bind(style);
const Aside = ({ search, setSearch, actionSearch, setShowKeySearch }) => {
  //redux data
  const { listing } = useSelector((state) => state);
  const { facilities, types, cities } = listing;

  //
  //sử lý scroll của aside
  const asideRef = useRef(null);
  const parrentAsideRef = useRef(null);
  let headerHeight = 110;
  let space = 40;

  const [isFixed, isAbsolute, asideWidth] = useScrollWaitingElement(
    asideRef,
    parrentAsideRef,
    headerHeight,
    space,
  );
  //

  const handleSearch = () => {
    setShowKeySearch(true);
    const updatedSearch = {
      ...search,
      page: 1,
    };
    setFilterMobileOpen(false);
    actionSearch(updatedSearch);
  };

  // handleclick on filter item
  const [activeFilter, setActiveFilter] = useState({
    location: false,
    type: false,
    date: false,
  });

  const [filterMobileOpen, setFilterMobileOpen] = useState(false);
  //

  //handle choose date
  const { RangePicker } = DatePicker;
  const disabledDate = (current) => {
    return current && current < new Date();
  };
  const onChange = (value, dateString) => {
    const date_start = dateString[0];
    const date_end = dateString[1];
    setSearch({
      ...search,
      date: {
        in: date_start,
        out: date_end,
      },
    });
  };
  //

  //handle search key filter
  const [searchItemFilter, setSearchItemFilter] = useState({
    location: {
      key_search: '',
      data: cities,
    },
    type: {
      key_search: '',
      data: types,
    },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateSearchData = (key) => {
    return (value) => {
      const filteredData =
        key === 'location'
          ? cities?.filter((city) =>
              city.name.toLowerCase().includes(value.toLowerCase()),
            )
          : types?.filter((type) =>
              type.name.toLowerCase().includes(value.toLowerCase()),
            );

      setSearchItemFilter((prevState) => ({
        ...prevState,
        [key]: {
          ...prevState[key],
          data: filteredData,
        },
      }));
    };
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateSearchData('location')(searchItemFilter?.location?.key_search);
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities, searchItemFilter?.location?.key_search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateSearchData('type')(searchItemFilter?.type?.key_search);
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [types, searchItemFilter?.type?.key_search]);

  return (
    <>
      <div ref={parrentAsideRef} className="col-lg-4 col-md-12">
        <div className={cx('mobile-filter-control')}>
          <Button
            onClick={() => setFilterMobileOpen(!filterMobileOpen)}
            icon_left
            full
            primary
          >
            {' '}
            <i className="ri-filter-2-fill"></i>Filter{' '}
          </Button>
        </div>
        <div
          style={
            isFixed && !filterMobileOpen
              ? {
                  position: 'fixed',
                  top: `${headerHeight + space}px`,
                  width: `${asideWidth}px`,
                }
              : isAbsolute && !filterMobileOpen
              ? {
                  position: 'absolute',
                  bottom: 80 + 'px',
                  width: `${asideWidth}px`,
                }
              : {}
          }
          ref={asideRef}
          className={cx('side-filter-wrap', filterMobileOpen && 'show')}
        >
          <div className={cx('filter-inner')}>
            <div
              onClick={() => {
                setActiveFilter({
                  location: !activeFilter.location,
                });
                setShowKeySearch(false);
              }}
              className={cx('filter-items', 'location')}
            >
              <label>City/Category</label>
              <div className={cx('item')}>
                <span className={cx('current')}>
                  {search.location.name || 'all location'}
                </span>
              </div>
              <div
                style={
                  activeFilter.location
                    ? {
                        visibility: 'visible',
                        border: '.1rem solid #eee',
                        height:
                          searchItemFilter?.location?.data?.length <= 4
                            ? searchItemFilter?.location?.data?.length * 4 +
                              6 +
                              'rem'
                            : '22rem',
                        maxHeight:
                          searchItemFilter?.location?.data?.length > 4
                            ? 22 + 'rem'
                            : 'unset',
                      }
                    : {}
                }
                className={cx('list-wrap')}
              >
                <div
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  className={cx('search')}
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchItemFilter.location.key_search}
                    onChange={(event) =>
                      setSearchItemFilter({
                        ...searchItemFilter,
                        location: {
                          ...searchItemFilter.location,
                          key_search: event.target.value,
                        },
                      })
                    }
                  />
                </div>

                <ul className={cx('list-select')}>
                  {search.location.name &&
                    !searchItemFilter.location.key_search && (
                      <li
                        onClick={() => {
                          setSearch({
                            ...search,
                            location: {
                              id: '',
                              name: '',
                            },
                          });
                        }}
                        className={cx('option')}
                      >
                        All location
                      </li>
                    )}
                  {searchItemFilter?.location?.data?.map((item, index) => {
                    return (
                      <li
                        onClick={() => {
                          setSearch({
                            ...search,
                            location: {
                              id: Number(item.id),
                              name: item.name,
                            },
                          });
                          setSearchItemFilter({
                            ...searchItemFilter,
                            location: {
                              ...searchItemFilter.location,
                              key_search: '',
                            },
                          });
                        }}
                        key={index}
                        className={cx('option')}
                      >
                        {item.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div
              onClick={() => {
                setActiveFilter({
                  type: !activeFilter.type,
                });
                setShowKeySearch(false);
              }}
              className={cx('filter-items', 'hotel-type')}
            >
              <label>Property Type</label>
              <div className={cx('item')}>
                <span className={cx('current')}>
                  {search.type.name || 'all type'}
                </span>
              </div>
              <div
                style={
                  activeFilter?.type
                    ? {
                        visibility: 'visible',
                        border: '.1rem solid #eee',
                        height:
                          searchItemFilter?.type?.data?.length <= 4
                            ? searchItemFilter.type?.data?.length * 4 +
                              6 +
                              'rem'
                            : '22rem',
                        maxHeight:
                          searchItemFilter?.type?.data?.length > 4
                            ? 22 + 'rem'
                            : 'unset',
                      }
                    : {}
                }
                className={cx('list-wrap')}
              >
                <div
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  className={cx('search')}
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchItemFilter.type.key_search}
                    onChange={(event) =>
                      setSearchItemFilter({
                        ...searchItemFilter,
                        type: {
                          ...searchItemFilter.type,
                          key_search: event.target.value,
                        },
                      })
                    }
                  />
                </div>
                <ul className={cx('list-select')}>
                  {search?.type?.name && !searchItemFilter.type.key_search && (
                    <li
                      onClick={() => {
                        setSearch({
                          ...search,
                          type: {
                            id: '',
                            name: '',
                          },
                        });
                      }}
                      className={cx('option')}
                    >
                      All type
                    </li>
                  )}
                  {searchItemFilter?.type?.data?.map((item, index) => {
                    return (
                      <li
                        onClick={() => {
                          setSearch({
                            ...search,
                            type: {
                              id: Number(item.id),
                              name: item.name,
                            },
                          });
                          setSearchItemFilter({
                            ...searchItemFilter,
                            type: {
                              ...searchItemFilter.type,
                              key_search: '',
                            },
                          });
                        }}
                        className={cx('option')}
                        key={index}
                      >
                        {item.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className={cx('filter-items', ['date'])}>
              <label>Date In-Out</label>
              <div>
                <RangePicker disabledDate={disabledDate} onChange={onChange} />
              </div>
            </div>

            <div className={cx('filter-items', ['star-rating'])}>
              <label>Star Rating</label>
              <div className="rating">
                <input
                  onChange={(e) => {
                    setShowKeySearch(false);
                    setSearch({
                      ...search,
                      star_rating: e.target.value,
                    });
                  }}
                  value="5"
                  name="star-radio"
                  id="star-1"
                  type="radio"
                  checked={search.star_rating === '5'}
                />
                <label htmlFor="star-1">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                      pathLength="360"
                    ></path>
                  </svg>
                </label>
                <input
                  onChange={(e) => {
                    setShowKeySearch(false);
                    setSearch({
                      ...search,
                      star_rating: e.target.value,
                    });
                  }}
                  value="4"
                  name="star-radio"
                  id="star-2"
                  type="radio"
                  checked={search.star_rating === '4'}
                />
                <label htmlFor="star-2">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                      pathLength="360"
                    ></path>
                  </svg>
                </label>
                <input
                  onChange={(e) => {
                    setShowKeySearch(false);
                    setSearch({
                      ...search,
                      star_rating: e.target.value,
                    });
                  }}
                  value="3"
                  name="star-radio"
                  id="star-3"
                  type="radio"
                  checked={search.star_rating === '3'}
                />
                <label htmlFor="star-3">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                      pathLength="360"
                    ></path>
                  </svg>
                </label>
                <input
                  onChange={(e) => {
                    setShowKeySearch(false);
                    setSearch({
                      ...search,
                      star_rating: e.target.value,
                    });
                  }}
                  value="2"
                  name="star-radio"
                  id="star-4"
                  type="radio"
                  checked={search.star_rating === '2'}
                />
                <label htmlFor="star-4">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                      pathLength="360"
                    ></path>
                  </svg>
                </label>
                <input
                  onChange={(e) => {
                    setShowKeySearch(false);
                    setSearch({
                      ...search,
                      star_rating: e.target.value,
                    });
                  }}
                  value="1"
                  name="star-radio"
                  id="star-5"
                  type="radio"
                  checked={search.star_rating === '1'}
                />
                <label htmlFor="star-5">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                      pathLength="360"
                    ></path>
                  </svg>
                </label>
              </div>
            </div>

            <div className={cx('filter-items', ['facilities'])}>
              <label>Facility</label>
              <div className={cx('facility-wrap')}>
                <ul className={cx('list-item')}>
                  {facilities &&
                    facilities.map((item, index) => {
                      return (
                        <li key={index}>
                          <input
                            onChange={(e) => {
                              setShowKeySearch(false);
                              if (e.target.checked) {
                                setSearch((prevSearch) => ({
                                  ...prevSearch,
                                  facilities: [
                                    ...prevSearch.facilities,
                                    item.name,
                                  ],
                                }));
                              } else {
                                setSearch((prevSearch) => ({
                                  ...prevSearch,
                                  facilities:
                                    prevSearch &&
                                    prevSearch?.facilities?.filter(
                                      (facility) => facility !== item.name,
                                    ),
                                }));
                              }
                            }}
                            data-facility={item.name}
                            type="checkbox"
                            checked={search.facilities.includes(item.name)}
                          />
                          <label htmlFor={`check-${index}`}>{item.name}</label>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
            <div className={cx('filter-items')}>
              <Button
                onClick={() => {
                  handleSearch();
                }}
                secondary
                full
              >
                Search
                <i className="ms-3 far fa-search"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(Aside);
