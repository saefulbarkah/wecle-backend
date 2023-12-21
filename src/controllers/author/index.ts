import followAuthor from './follow-author.js';
import lists from './lists.js';
import updateAuthor from './update.js';

const authorController = {
  lists,
  updateAuthor,
  follow: followAuthor,
};

export default authorController;
