import Button from '~/components/Bases/Button';
import style from './Booking.module.scss';
import classNames from 'classnames/bind';
import { memo, useContext, useState } from 'react';
import MyContext from '~/components/Context';
import { componentUnmount } from '~/services/Utils';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import PaymentForm from '~/components/Bases/PaymentForm';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '~/services/Stripe';

const cx = classNames.bind(style);
const Booking = () => {
  //context
  const m = useContext(MyContext);
  const { isBookModalOpen, setIsBookModalOpen, dataBook } = m;
  //
  //redux data
  const { userInfo } = useSelector((state) => state.user);
  //

  //handle form
  const formInfo = useForm({
    defaultValues: {
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
    },
  });
  const {
    register,
    formState: { errors },
    trigger,
  } = formInfo;

  //handle modal book
  const step = ['personal info', 'payment method', 'confirm'];
  const [stepBook, setStepBook] = useState(step[0]);
  const [acceptPayment, setAcceptPayment] = useState({
    acceptPayment: false,
    count: 0,
  });

  const onPrev = () => {
    const currentIndex = step.indexOf(stepBook);
    if (currentIndex > 0) {
      setStepBook(step[currentIndex - 1]);
    }
  };

  const onSubmitTab = async (e) => {
    e.preventDefault();
    if (stepBook === step[0]) {
      try {
        const step1Valid = await trigger(['name', 'email', 'phone']);
        if (step1Valid && Object.keys(errors).length === 0) {
          const currentIndex = step.indexOf(stepBook);
          if (currentIndex < step.length - 1) {
            setStepBook(step[currentIndex + 1]);

            return;
          }
        } else {
          console.log('Error occurred during validation:', errors);
        }
      } catch (error) {
        console.log('Error occurred during validation:', error);
      }
    } else if (stepBook === step[1]) {
      const currentIndex = step.indexOf(stepBook);
      if (acceptPayment.acceptPayment) {
        if (currentIndex < step.length - 1) {
          setStepBook(step[currentIndex + 1]);
          return;
        }
      } else {
        setAcceptPayment({
          acceptPayment: false,
          count: acceptPayment.count + 1,
        });
      }
    }
  };
  return (
    <div
      className={cx('booking', ['m-modal', isBookModalOpen ? 'active' : ''])}
    >
      <div className="container">
        <div className="overlay"></div>
        <div className={cx('booking-wrap', ['modal-wrap'])}>
          <div className={cx('booking-inner')}>
            <div
              onClick={() => {
                setIsBookModalOpen(false);
                setStepBook(step[0]);
                componentUnmount();
              }}
              className="close"
            >
              <i className="ri-close-line"></i>
            </div>
            <div className={cx('booking-content')}>
              <ul id={cx('progress-bar')}>
                <li className={cx(stepBook === step[0] && 'active')}>
                  <span>01.</span>Personal Info
                </li>
                <li className={cx(stepBook === step[1] && 'active')}>
                  <span>02.</span>Payment Method
                </li>

                <li className={cx(stepBook === step[2] && 'active')}>
                  <span>03.</span>Confirm
                </li>
              </ul>
              <div className={cx('form-wrap')}>
                <form>
                  <fieldset
                    className={cx(
                      'book-field',
                      stepBook === step[0] && 'active',
                    )}
                  >
                    <h3 className={cx('title')}>Your personal Information</h3>
                    <div className={cx('group-input')}>
                      <div className={cx('form-group')}>
                        <label>Full Name</label>
                        <span className={cx('form-icon')}>
                          <i className="ri-user-line"></i>
                        </span>
                        <input
                          {...register('name', {
                            required: 'Full Name is required',
                          })}
                          type="text"
                          placeholder="Full Name"
                        />
                        {errors.name && (
                          <span className={cx('form-massage', ['text-danger'])}>
                            {errors ? errors.name.message : ''}
                          </span>
                        )}
                      </div>

                      <div className={cx('form-group')}>
                        <label>Email Address</label>
                        <span className={cx('form-icon')}>
                          <i className="ri-mail-send-line"></i>
                        </span>
                        <input
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address',
                            },
                          })}
                          type="email"
                          placeholder="Email"
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
                            required: 'Phone is required',
                            min: {
                              value: 10,
                              message: 'Invalid phone number',
                            },
                            pattern: {
                              value:
                                /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/,
                              message: 'Invalid phone number',
                            },
                          })}
                          type="text"
                          placeholder="+123 456 789"
                        />
                        {errors.phone && (
                          <span className={cx('form-massage', ['text-danger'])}>
                            {errors.phone.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </fieldset>

                  <fieldset
                    className={cx(
                      'book-field',
                      stepBook === step[1] && 'active',
                    )}
                  >
                    <Elements stripe={stripePromise}>
                      <PaymentForm
                        stepBook={stepBook}
                        acceptPayment={acceptPayment}
                        setAcceptPayment={setAcceptPayment}
                      />
                    </Elements>
                  </fieldset>

                  <fieldset
                    className={cx(
                      'book-field',
                      'result-field',
                      stepBook === step[2] && 'active',
                    )}
                  >
                    <h3 className={cx('title')}>Confirmation</h3>
                    <div className={cx('result-wrap')}>
                      <div className={cx('success')}>
                        <div className={cx('icon')}>
                          <i className="ri-calendar-check-fill"></i>{' '}
                        </div>
                        <div className={cx('text')}>
                          <h4>
                            Thank you. Your reservation has been received.
                          </h4>
                          <div className="clearfix"></div>
                          <p>Your payment has been processed successfully.</p>
                        </div>
                      </div>
                      <Button to={'#'} target="_blank" sub_primary>
                        View Invoice
                      </Button>
                    </div>
                  </fieldset>

                  <span className="separator"></span>
                  <div className={cx('group-button')}>
                    {stepBook === step[0] || stepBook === step[2] ? (
                      <div></div>
                    ) : (
                      <Button
                        id="prev"
                        sub_primary
                        icon_left
                        type="button"
                        onClick={onPrev}
                      >
                        Back
                      </Button>
                    )}
                    {stepBook === step[2] ? (
                      ''
                    ) : (
                      <Button
                        id="next"
                        icon_right
                        sub_primary
                        type="button"
                        onClick={(e) => onSubmitTab(e)}
                      >
                        Next Step
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div className={cx('booking-info')}>
              <img
                className="bg"
                src={process.env.PUBLIC_URL + '/imgs/base/8.jpg'}
                alt="bg"
              />
              <div className={cx('title')}>
                <h3>{dataBook.hotelName}</h3>
                <span>{dataBook.roomName}</span>
              </div>
              <div className={cx('info-wrap')}>
                <div className={cx('info-item')}>
                  <span>Check In: </span>
                  <p>{dataBook.dateIn}</p>
                </div>
                <div className={cx('info-item')}>
                  <span>Check Out:</span>
                  <p>{dataBook.dateOut}</p>
                </div>
              </div>
              <div className={cx('sub-total')}>
                sub total: <span>${dataBook.bill || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(Booking);
