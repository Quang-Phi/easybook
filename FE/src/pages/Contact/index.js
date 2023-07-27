import { memo } from 'react';
import { Navigate } from 'react-router-dom';

const Contact = () => {
  return <Navigate to="/404" />;
};
export default memo(Contact);
