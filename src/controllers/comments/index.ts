import createComment from './create-comment.js';
import deleteComment from './delete-comment.js';
import dislikeComment from './dislike.comment.js';
import findComment from './find-comment.js';
import likeComment from './like-comment.js';
import updateComment from './update-comment.js';

const commentController = {
  create: createComment,
  delete: deleteComment,
  update: updateComment,
  find: findComment,
  like: likeComment,
  dislike: dislikeComment,
};

export default commentController;
