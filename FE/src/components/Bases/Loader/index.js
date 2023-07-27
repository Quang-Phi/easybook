import { useSelector } from 'react-redux';
import './Loader.scss';
const Loader = () => {
  const { loading: isLoadingUser } = useSelector((state) => state.user);
  const { loading: isLoadingListing } = useSelector((state) => state.listing);
  return (
    <div
      style={
        isLoadingListing || isLoadingUser
          ? { display: 'flex' }
          : { display: 'none' }
      }
      className="loader-wrap"
    >
      <div className="loader">
        <span className="loader-text">loading</span>
        <span className="load"></span>
      </div>
    </div>
  );
};
export default Loader;
