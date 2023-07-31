import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { privateRoutes, publicRoutes } from '~/routes';
import { DefaultLayout } from './components/Layouts';
import { useEffect, useState } from 'react';
import MyContext from './components/Context';
import ScrollTop from './components/Bases/ScrollTop';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearSliceUser, getInfoUser } from './redux/Reducer/userSlice';
import { clearSliceListing } from './redux/Reducer/listingSlice';
import dayjs from 'dayjs';
function App() {
  //redux
  const dispatch = useDispatch();

  const { message: messageUser } = useSelector((state) => state.user);
  const { user_id: userId, token } = useSelector((state) => state.user.user);
  const { message: messageListing, err } = useSelector(
    (state) => state.listing,
  );
  const location = useLocation();
  const pathName = location.pathname;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchParams = new URLSearchParams(location.search);
  searchParams.set('token', token);
  useEffect(() => {
    if (!token) return;
    const urlWithToken = `${pathName}?${searchParams.toString()}`;
    window.history.pushState({}, '', urlWithToken);
  }, [pathName, searchParams, token]);

  const navigate = useNavigate();
  //404
  useEffect(() => {
    if (err) {
      navigate('/404');
    }
  }, [err, navigate]);
  //
  useEffect(() => {
    if (!userId) return;
    dispatch(getInfoUser(userId));
  }, [dispatch, userId]);
  //
  //state modal
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  //

  //booking
  const [dataBook, setDataBook] = useState({
    hotelId: '',
    hotelName: '',
    roomId: '',
    roomName: '',
    price: '',
    dateIn: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    dateOut: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    bill: '',
  });
  //

  useEffect(() => {
    const toastConfig = {
      position: 'top-center',
      pauseOnHover: true,
      closeOnClick: true,
      autoClose: 3000,
      theme: 'colored',
    };
    if (messageListing.content) {
      setTimeout(() => {
        toast(messageListing.content, {
          ...toastConfig,
          type: messageListing.type,
        });
        dispatch(clearSliceListing());
      }, 50);
    } else if (messageUser.content) {
      setTimeout(() => {
        toast(messageUser.content, {
          ...toastConfig,
          type: messageUser.type,
        });
        dispatch(clearSliceUser());
      }, 50);
    }
  }, [
    dispatch,
    messageListing.content,
    messageListing.type,
    messageUser.content,
    messageUser.type,
  ]);

  //user
  //fake data
  const contacts = [
    {
      icon: 'ri-mail-send-fill',
      title: 'Email',
      desc: '6WjGt@example.com',
    },
    {
      icon: 'ri-user-location-line',
      title: 'Address',
      desc: '123 Main St, Anytown, CA 12345',
    },
    {
      icon: 'ri-smartphone-line',
      title: 'Phone',
      desc: '(123) 456-7890',
    },
  ];
  //

  return (
    <MyContext.Provider
      value={{
        userId,
        token,
        isAuthFormOpen,
        setIsAuthFormOpen,
        isBookModalOpen,
        setIsBookModalOpen,
        isDetailOpen,
        setIsDetailOpen,
        contacts,
        dataBook,
        setDataBook,
      }}
    >
      <ScrollTop />
      <Routes>
        {[...publicRoutes, ...privateRoutes].map((route, index) => {
          const Layout = route.layout || DefaultLayout;
          const Page = route.component;
          let blockRoute = false;
          if (index > publicRoutes.length - 1) {
            !token && (blockRoute = true);
          }
          return (
            <Route
              key={index}
              path={route.path}
              element={
                blockRoute ? (
                  <Navigate to="/" />
                ) : (
                  <Layout>
                    <Page />
                  </Layout>
                )
              }
            />
          );
        })}
      </Routes>
    </MyContext.Provider>
  );
}

export default App;
