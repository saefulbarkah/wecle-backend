import signIn from './sign-in.js';
import signUp from './sign-up.js';
import signOut from './sign-out.js';
import Me from './me.js';
import verifyUser from './verify.js';

const authController = {
  signIn,
  signUp,
  Me,
  signOut,
  verifyUser,
};

export default authController;
