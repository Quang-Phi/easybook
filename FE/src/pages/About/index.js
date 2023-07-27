import { memo } from 'react';
import { Navigate } from 'react-router-dom';

const About = () => {
  return <Navigate to="/404" />;
};
export default memo(About);
