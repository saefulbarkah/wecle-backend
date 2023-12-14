import createArticle from './create-article.js';
import deleteArticle from './delete-article.js';
import draftLists from './draft-list.js';
import findArticle from './find-article.js';
import findDraft from './find-draft.js';
import listArticle from './list-article.js';
import saveToDraft from './save-to-draft.js';
import updateArticle from './update-article.js';

const articleController = {
  create: createArticle,
  list: listArticle,
  delete: deleteArticle,
  update: updateArticle,
  saveDraft: saveToDraft,
  draftLists: draftLists,
  findDraft: findDraft,
  findArticle: findArticle,
};

export default articleController;
