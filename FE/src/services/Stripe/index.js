import { loadStripe } from '@stripe/stripe-js';

// Load Stripe with your publishable API key
const stripePromise = loadStripe(
  'pk_test_51NQJm4DCqdmv6gI3Gwls8MH83hA14qNh2KnGzwAfLGpzfwHH7ZMYeLLfpZAbuoRHwxCy38D5kmId90rpQFnxqrWz00IWVmhkLV',
);

export default stripePromise;
