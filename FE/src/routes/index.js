import { DefaultLayout } from '~/components/Layouts';
import NoFooter from '~/components/Layouts/NoFooter';
import UserLayout from '~/components/Layouts/UserLayout';
import { Detail, HomePage, Listing } from '~/pages';
import Error404 from '~/pages/Error404';
import Profile from '~/pages/User/Profile';
import UserListing from '~/pages/User/Listing';
import AddRoom from '~/pages/User/Listing/AddRoom';
import EditProfile from '~/pages/User/Profile/Edit';
import AddEditHotel from '~/pages/User/Listing/Add-EditHotel';
import Booking from '~/pages/User/Booking';
import Contact from '~/pages/Contact';
import About from '~/pages/About';

const publicRoutes = [
  {
    path: '/',
    component: HomePage,
    layout: DefaultLayout,
  },
  {
    path: '/listings',
    component: Listing,
  },
  {
    path: `/listings/:name`,
    component: Detail,
  },
  {
    path: `/contact`,
    component: Contact,
  },
  {
    path: `/about`,
    component: About,
  },
  {
    path: `/404`,
    component: Error404,
    layout: NoFooter,
  },
];

const privateRoutes = [
  {
    path: '/user/profile',
    component: Profile,
    layout: UserLayout,
  },
  {
    path: '/user/profile/change-info',
    component: EditProfile,
    layout: UserLayout,
  },
  {
    path: '/user/listings',
    component: UserListing,
    layout: UserLayout,
  },
  {
    path: '/user/bookings',
    component: Booking,
    layout: UserLayout,
  },
  {
    path: '/user/listings/add-hotel',
    component: AddEditHotel,
    layout: UserLayout,
  },
  {
    path: '/user/listings/edit-hotel/:name',
    component: AddEditHotel,
    layout: UserLayout,
  },
  {
    path: '/user/:hotel/add-room',
    component: AddRoom,
    layout: UserLayout,
  },
];
export { publicRoutes, privateRoutes };
