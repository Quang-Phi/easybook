import { Link } from 'react-router-dom';
import styles from './Button.module.scss';
import className from 'classnames/bind';
import { memo } from 'react';

let cx = className.bind(styles);
function Button({
  onClick,
  children,
  to,
  href,
  primary = false,
  sub_primary = false,
  secondary = false,
  dlt = false,
  act = false,
  trans = false,
  small = false,
  larger = false,
  full = false,
  icon = false,
  icon_left = false,
  icon_right = false,
  btn_default = false,
  ...allProps
}) {
  let Btn = 'button';
  const props = {
    onClick,
    ...allProps,
  };
  if (to) {
    props.to = to;
    Btn = Link;
  } else if (href) {
    props.href = href;
    Btn = 'a';
  }

  const classes = cx('btn', {
    primary,
    sub_primary,
    secondary,
    dlt,
    act,
    trans,
    small,
    larger,
    btn_default,
    icon,
    icon_left,
    icon_right,
    full,
  });

  return (
    <Btn className={classes} {...props}>
      {children}
      {icon && (
        <span>
          <i className="fas fa-caret-right"></i>
        </span>
      )}
    </Btn>
  );
}
export default memo(Button);
