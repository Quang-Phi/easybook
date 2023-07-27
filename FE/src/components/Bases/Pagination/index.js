import { Pagination } from '@mui/material';
import './Pagination.scss';

const Paginate = ({ page, onChange, count }) => {
  return <Pagination page={page} onChange={onChange} count={count} />;
};
export default Paginate;
