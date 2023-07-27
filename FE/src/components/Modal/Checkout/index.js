import { memo } from 'react';

const { default: Modal } = require('antd/es/modal/Modal');

const Checkout = ({ children, open, onOk, onCancel }) => {
  return (
    <Modal open={open} onOk={onOk} onCancel={onCancel}>
      {children}
    </Modal>
  );
};
export default memo(Checkout);
