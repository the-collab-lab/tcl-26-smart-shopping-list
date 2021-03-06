import { useEffect, useRef } from 'react';
import './Modal.css';

const Modal = ({ showModal, handleModalClose, deleteItem, item }) => {
  const toggleModalClassName = showModal ? 'dialog_open' : '';

  const cancelRef = useRef();
  const deleteRef = useRef();

  useEffect(() => {
    const handleKeyEvents = (e) => {
      // close modal if user hits Escape (27)
      if (e.keyCode === 27) {
        handleModalClose();
      }

      // this keeps keyboard focus within modal. if user hits Tab (9)
      if (e.keyCode === 9) {
        // ...and NOT shift while on Delete, put focus on Cancel
        if (!e.shiftKey && document.activeElement === deleteRef.current) {
          cancelRef.current.focus();
          return e.preventDefault();
        }

        // ...and shift while on Cancel, put focus on Delete
        if (e.shiftKey && document.activeElement === cancelRef.current) {
          deleteRef.current.focus();
          return e.preventDefault();
        }
      }
    };

    const closeOnClickOutside = (e) => {
      if (e.target.classList.contains('dialog')) {
        handleModalClose();
      }
    };

    if (showModal) {
      // when modal opens, add eventListeners and put initial focus on "No, Cancel"
      document.addEventListener('keydown', handleKeyEvents);
      document.addEventListener('click', closeOnClickOutside);
      cancelRef.current.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyEvents);
      document.removeEventListener('click', closeOnClickOutside);
    };
  }, [handleModalClose, showModal]);

  return (
    <div className={`dialog ${toggleModalClassName}`} aria-hidden={!showModal}>
      <div
        className="dialog__modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-label"
      >
        <h3 className="dialog__heading" id="dialog-label">
          Are you sure you want to delete{' '}
          <strong className="dialog__item-name">{item.itemName}</strong>?
        </h3>
        <button
          className="dialog__button button"
          type="button"
          onClick={handleModalClose}
          ref={cancelRef}
        >
          No, Cancel
        </button>
        <button
          className="dialog__button button button_type_delete"
          type="button"
          onClick={deleteItem}
          aria-controls={`item-${item.id}`} // destructive delete controls shopping list item id
          ref={deleteRef}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  );
};

export default Modal;
