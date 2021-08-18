import { useEffect, useRef } from 'react';
import './Modal.css';

const Modal = ({ showModal, handleModalClose, deleteItem, item }) => {
  const toggleModalClassName = showModal ? 'display-block' : 'display-none';

  const cancelRef = useRef();
  const deleteRef = useRef();

  useEffect(() => {
    if (showModal) {
      // when modal opens, add eventListeners and put initial focus on "No, Cancel"
      document.addEventListener('keydown', handleKeyEvents);
      cancelRef.current.focus();
    } else {
      document.removeEventListener('keydown', handleKeyEvents);
    }
  }, [showModal]);

  const handleKeyEvents = (e) => {
    // close modal if user hits Escape (27)
    if (e.keyCode === 27) {
      handleModalClose();
    }

    // keep keyboard focus in modal
    if (e.keyCode === 9) {
      // if user hits Tab (9)...
      // and NOT shift while on Delete, put focus on Cancel
      if (!e.shiftKey && document.activeElement === deleteRef.current) {
        cancelRef.current.focus();
        return e.preventDefault();
      }

      // and shift while on Cancel, put focus on Delete
      if (e.shiftKey && document.activeElement === cancelRef.current) {
        deleteRef.current.focus();
        e.preventDefault();
      }
    }
  };

  return (
    <div className={`dialog-backdrop ${toggleModalClassName}`}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="dialog_label">
        <h3 id="dialog_label">{`Are you sure you want to delete ${item.itemName}?`}</h3>
        <button type="button" onClick={handleModalClose} ref={cancelRef}>
          No, Cancel
        </button>
        <button
          type="button"
          onClick={deleteItem}
          aria-controls={`item-${item.id}`}
          ref={deleteRef}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  );
};

export default Modal;
