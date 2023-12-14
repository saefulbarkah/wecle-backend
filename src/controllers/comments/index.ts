import createComment from './create-comment.js';
import deleteComment from './delete-comment.js';
import findComment from './find-comment.js';
import updateComment from './update-comment.js';

const commentController = {
  create: createComment,
  delete: deleteComment,
  update: updateComment,
  find: findComment,
};

export default commentController;
