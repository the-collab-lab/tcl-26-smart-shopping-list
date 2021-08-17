import { db } from '../../lib/firebase.js';

const Modal = ({ showModal, handleModalClose, listId, itemId }) => {
  const toggleModalClassName = showModal ? 'display-block' : 'display-none';

  const deleteItem = () => {
    db.collection(`lists/${listId}/items`)
      .doc(itemId)
      .delete()
      .then(() => {
        console.log('Document successfully deleted');
      })
      .catch((err) => {
        console.error('Error removing document: ', err);
      });
  };

  return (
    <div className={toggleModalClassName}>
      <h2>Are you sure you want to delete this item?</h2>
      <button onClick={handleModalClose}>No, Cancel</button>
      <button onClick={deleteItem}>Yes, Delete</button>
    </div>
  );
};

export default Modal;
