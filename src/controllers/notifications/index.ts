import getNotif from './get-notif.js';
import readAllNotification from './read-all-notif.js';
import readOneNotification from './read-one-notif.js';

const notificationController = {
  get: getNotif,
  readOne: readOneNotification,
  readAll: readAllNotification,
};

export default notificationController;
