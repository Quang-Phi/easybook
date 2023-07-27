import Button from '~/components/Bases/Button';
import style from './Auth.module.scss';
import classNames from 'classnames/bind';
import { memo, useContext, useEffect, useRef, useState } from 'react';
import MyContext from '~/components/Context';
import { componentUnmount } from '~/services/Utils';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, logIn } from '~/redux/Reducer/userSlice';

const cx = classNames.bind(style);
const Auth = () => {
  //context
  const m = useContext(MyContext);
  const { isAuthFormOpen, setIsAuthFormOpen } = m;
  //

  //redux
  const { status } = useSelector((state) => state.user);
  //
  //xử lý tab modalauth
  const [tabAuth, setTabAuth] = useState(1);
  //

  //validate form
  const formLogin = useForm();
  const formRegister = useForm();
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin },
    clearErrors: clearErrorsLogin,
    reset: resetLogin,
  } = formLogin;

  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: errorsRegister },
    clearErrors: clearErrorsRegister,
    reset: resetRegister,
  } = formRegister;

  //handle form login + register
  const dispatch = useDispatch();
  const onSubmitLogin = (data) => {
    dispatch(logIn(data));
  };

  const { token } = useSelector((state) => state.user.user);
  useEffect(() => {
    if (token) {
      setIsAuthFormOpen(false);
      componentUnmount();
      localStorage.setItem('token', token);
    }
  }, [setIsAuthFormOpen, token]);

  const onSubmitRegister = (data) => {
    dispatch(addUser(data));
  };

  useEffect(() => {
    if (status) {
      setTabAuth(1);
      componentUnmount();
    }
  }, [status]);

  useEffect(() => {
    if (tabAuth === 1) {
      emailRef?.current?.focus();
      resetLogin();
      clearErrorsLogin();
    } else {
      nameRef?.current?.focus();
      resetRegister();
      clearErrorsRegister();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabAuth]);

  const handleClose = () => {
    setTabAuth(1);
    setIsAuthFormOpen(false);
    clearErrorsLogin();
    clearErrorsRegister();
    resetLogin();
    resetRegister();
    componentUnmount();
  };
  //

  //
  return (
    <>
      <div className={cx('auth', ['m-modal', isAuthFormOpen ? 'active' : ''])}>
        <div className="container">
          <div className="overlay"></div>
          <div className={cx('auth-wrap', ['modal-wrap'])}>
            <div className={cx('auth-content')}>
              <div
                onClick={() => handleClose()}
                className={cx(tabAuth === 2 ? 'text-pri' : '', ['close'])}
              >
                <i className="ri-close-line"></i>
              </div>
              <ul className={cx('tabs-menu')}>
                <li
                  onClick={() => {
                    setTabAuth(1);
                  }}
                  className={`${tabAuth === 1 && 'current'}`}
                >
                  <a href="#tab-1">
                    <i className="ri-login-box-line"></i> Login
                  </a>
                </li>
                <li
                  onClick={() => {
                    setTabAuth(2);
                  }}
                  className={`${tabAuth === 2 && 'current'}`}
                >
                  <a href="#tab-2">
                    <i className="ri-user-add-line"></i> Register
                  </a>
                </li>
              </ul>
              <div className={cx('tabs-content')}>
                <div className={cx('tab-wrap', tabAuth === 1 && ['active'])}>
                  <div className={cx('tab-inner')}>
                    <h3>
                      Sign In{' '}
                      <span>
                        Easy<strong>Book</strong>
                      </span>
                    </h3>
                    <div className={cx('custom-form')}>
                      <form
                        id="login"
                        onSubmit={handleSubmitLogin(onSubmitLogin)}
                        method="POST"
                      >
                        <div className={cx('form-group')}>
                          <label>
                            Email Address <span>*</span>{' '}
                          </label>
                          <span className={cx('form-icon')}>
                            <i className="ri-mail-send-line"></i>
                          </span>
                          <input
                            ref={emailRef}
                            {...registerLogin('email', {
                              required: 'Email is required',
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address',
                              },
                            })}
                            aria-invalid={errorsLogin.email ? 'true' : 'false'}
                            type="text"
                          />
                          {errorsLogin.email && (
                            <span
                              className={cx('form-massage', ['text-danger'])}
                            >
                              {errorsLogin ? errorsLogin.email.message : ''}
                            </span>
                          )}
                        </div>
                        <div className={cx('form-group')}>
                          <label>
                            Password <span>*</span>{' '}
                          </label>
                          <span className={cx('form-icon')}>
                            <i className="ri-lock-2-line"></i>
                          </span>
                          <input
                            {...registerLogin('password', {
                              required: 'Password is required',
                              minLength: {
                                value: 8,
                                message:
                                  'Password must be at least 8 characters',
                              },
                            })}
                            type="password"
                          />
                          {errorsLogin.password && (
                            <span
                              className={cx('form-massage', ['text-danger'])}
                            >
                              {errorsLogin ? errorsLogin.password.message : ''}
                            </span>
                          )}
                        </div>
                        <Button primary type="submit">
                          Log In
                        </Button>
                        <div className={cx('action')}>
                          <div className={cx('remember')}>
                            <input
                              id="check-a"
                              type="checkbox"
                              name="check"
                              value={''}
                            />
                            <label htmlFor="check-a">Remember me</label>
                          </div>
                          <div className={cx('forgot-password')}>
                            <a className="desc text-dark" href="#">
                              Lost Your Password?
                            </a>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className={cx('tab-wrap', tabAuth === 2 && ['active'])}>
                  <div className={cx('tab-inner')}>
                    <h3>
                      Sign Up{' '}
                      <span>
                        Easy<strong>Book</strong>
                      </span>
                    </h3>
                    <div className={cx('custom-form')}>
                      <form
                        id="register"
                        onSubmit={handleSubmitRegister(onSubmitRegister)}
                        method="POST"
                      >
                        <div className={cx('form-group')}>
                          <label>
                            Full Name <span>*</span>{' '}
                          </label>
                          <span className={cx('form-icon')}>
                            <i className="ri-user-line"></i>
                          </span>
                          <input
                            ref={nameRef}
                            {...registerRegister('name', {
                              required: 'Name is required',
                              minLength: {
                                value: 3,
                                message: 'Name must be at least 3 characters',
                              },
                            })}
                            aria-invalid={
                              errorsRegister.name ? 'true' : 'false'
                            }
                            type="text"
                          />
                          {errorsRegister.name && (
                            <span
                              className={cx('form-massage', ['text-danger'])}
                            >
                              {errorsRegister
                                ? errorsRegister.name.message
                                : ''}
                            </span>
                          )}
                        </div>
                        <div className={cx('form-group')}>
                          <label>
                            Email Address <span>*</span>
                          </label>
                          <span className={cx('form-icon')}>
                            <i className="ri-mail-send-line"></i>
                          </span>
                          <input
                            {...registerRegister('email', {
                              required: 'Email is required',
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address',
                              },
                            })}
                            aria-invalid={
                              errorsRegister.email ? 'true' : 'false'
                            }
                            type="text"
                          />
                          {errorsRegister.email && (
                            <span
                              className={cx('form-massage', ['text-danger'])}
                            >
                              {errorsRegister
                                ? errorsRegister.email.message
                                : ''}
                            </span>
                          )}
                        </div>
                        <div className={cx('form-group')}>
                          <label>
                            Password <span>*</span>
                          </label>
                          <span className={cx('form-icon')}>
                            <i className="ri-lock-2-line"></i>
                          </span>
                          <input
                            {...registerRegister('password', {
                              required: 'Password is required',
                              minLength: {
                                value: 8,
                                message:
                                  'Password must be at least 8 characters',
                              },
                            })}
                            aria-invalid={
                              errorsRegister.password ? 'true' : 'false'
                            }
                            type="password"
                          />
                          {errorsRegister.password && (
                            <span
                              className={cx('form-massage', ['text-danger'])}
                            >
                              {errorsRegister
                                ? errorsRegister.password.message
                                : ''}
                            </span>
                          )}
                        </div>
                        <Button primary type="submit">
                          Register
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className={cx('form-separator')}>
                  <span>or</span>
                </div>
                <div className={cx('social-login')}>
                  <p>For faster login or register use your social account.</p>
                  <Button primary href="#" icon>
                    Connect with Facebook
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(Auth);
