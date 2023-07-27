import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import styles from './PaymentForm.module.scss';
import classNames from 'classnames/bind';
import { memo, useEffect, useState } from 'react';
const cx = classNames.bind(styles);
const { default: Button } = require('../Button');

const PaymentForm = ({ stepBook, acceptPayment, setAcceptPayment }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errors, setErrors] = useState({
    name: {
      value: '',
      message: '',
    },
    number: {
      complete: false,
      message: '',
    },
    expiry: {
      complete: false,
      message: '',
    },
    cvc: {
      complete: false,
      message: '',
    },
  });

  const handleInputChange = (field, event) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: {
        ...prevErrors[field],
        complete: event.complete || false,
        value: event?.target?.value || '',
        message: '',
      },
    }));
  };

  useEffect(() => {
    const checkStripePayment = async () => {
      if (stepBook === 'payment method' && stripe && elements) {
        const cardElement = elements.getElement(CardNumberElement);
        if (cardElement) {
          const { error: cardError } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
              name: 'Cardholder Name',
            },
          });
          if (cardError) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              number: {
                complete: false,
                message:
                  cardError.message === 'Số thẻ của quý vị không hợp lệ.'
                    ? 'Your card number is invalid'
                    : 'Your card number is incomplete',
              },
            }));
          }
          if (!errors.name.value) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              name: {
                ...prevErrors.name,
                message: 'Your card name is invalid',
              },
            }));
          }
          if (!errors.cvc.complete) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              cvc: {
                complete: false,
                message: 'Your card cvc is invalid',
              },
            }));
          }
          if (!errors.expiry.complete) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              expiry: {
                complete: false,
                message: 'Your card expiry is invalid',
              },
            }));
          } else {
            setAcceptPayment(true);
          }
        }
      }
    };

    checkStripePayment();
  }, [acceptPayment.count]);

  return (
    <>
      <h3 className={cx('title')}>Payment method</h3>
      <div className={cx('group-input')}>
        <div className={cx('form-group')}>
          <label>Cardholder's Name</label>
          <span className={cx('form-icon')}>
            <i className="ri-user-line"></i>
          </span>
          <input
            onChange={(e) => handleInputChange('name', e)}
            type="text"
            placeholder="Card Name"
          />
          {errors.name.message && (
            <span className={cx('form-massage', ['text-danger'])}>
              {errors.name.message}
            </span>
          )}
        </div>

        <div className={cx('form-group')}>
          <label>Card Number</label>
          <span className={cx('form-icon')}>
            <i className="ri-bank-card-2-line"></i>
          </span>
          <CardNumberElement
            className={cx('form-control')}
            options={{
              placeholder: 'xxxx-xxxx-xxxx-xxxx',
            }}
            onChange={(e) => handleInputChange('number', e)}
          />
          {errors.number.message && (
            <span className={cx('form-massage', ['text-danger'])}>
              {errors.number.message}
            </span>
          )}
        </div>

        <div className={cx('form-group')}>
          <label>Expiry</label>
          <span className={cx('form-icon')}>
            <i className="ri-calendar-check-line"></i>
          </span>
          <CardExpiryElement
            className={cx('form-control')}
            onChange={(e) => handleInputChange('expiry', e)}
          />
          {errors.expiry.message && (
            <span className={cx('form-massage', ['text-danger'])}>
              {errors.expiry.message}
            </span>
          )}
        </div>

        <div className={cx('form-group')}>
          <label>CVV / CVC *</label>
          <span className={cx('form-icon')}>
            <i className="ri-bank-card-line"></i>
          </span>
          <CardCvcElement
            className={cx('form-control')}
            options={{
              placeholder: '****', // Thêm placeholder tại đây
            }}
            onChange={(e) => handleInputChange('cvc', e)}
          />
          {errors.cvc.message && (
            <span className={cx('form-massage', ['text-danger'])}>
              {errors.cvc.message}
            </span>
          )}
        </div>
      </div>

      <div className={cx('separator')}>
        <span>or</span>
      </div>
      <div className={cx('paypal')}>
        <p>Select Other Payment Method</p>
        <Button icon_left primary>
          <i className="ri-paypal-fill"></i> Pay With Paypal
        </Button>
      </div>
    </>
  );
};
export default memo(PaymentForm);
