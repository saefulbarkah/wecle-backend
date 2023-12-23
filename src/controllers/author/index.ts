import findAuthor from './find-author.js';
import followAuthor from './follow-author.js';
import lists from './lists.js';
import unfollowAuthor from './unfollow-author.js';
import updateAuthor from './update.js';

const authorController = {
  lists,
  updateAuthor,
  follow: followAuthor,
  unfollow: unfollowAuthor,
  find: findAuthor,
};

export default authorController;
