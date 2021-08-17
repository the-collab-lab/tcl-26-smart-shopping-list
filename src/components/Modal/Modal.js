import { db } from '../../lib/firebase.js';
import './Modal.css';

const Modal = ({ showModal, handleModalClose, listId, itemId }) => {
  const toggleModalClassName = showModal ? 'display-block' : 'display-none';

  const deleteItem = () => {
    db.collection(`lists/${listId}/items`)
      .doc(itemId)
      .delete()
      .then(() => {
        console.log(`Document ${itemId} successfully deleted`);
        handleModalClose();
      })
      .catch((err) => {
        console.error('Error removing document: ', err);
      });
  };

  return (
    <div className={`dialog-backdrop ${toggleModalClassName}`}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog_label"
        aria-describedby="dialog_desc"
      >
        <h2 id="dialog_label">Confirmation</h2>
        <h3 id="dialog_desc">Are you sure you want to delete this item?</h3>
        <button type="button" onClick={handleModalClose}>
          No, Cancel
        </button>
        <button
          type="button"
          onClick={deleteItem}
          aria-controls={`item-${itemId}`}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  );
};

export default Modal;
