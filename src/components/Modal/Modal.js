import './Modal.css';

const Modal = ({ showModal, handleModalClose, deleteItem, item }) => {
  const toggleModalClassName = showModal ? 'display-block' : 'display-none';

  return (
    <div className={`dialog-backdrop ${toggleModalClassName}`}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="dialog_label">
        <h3 id="dialog_label">{`Are you sure you want to delete ${item.itemName}?`}</h3>
        <button type="button" onClick={handleModalClose}>
          No, Cancel
        </button>
        <button
          type="button"
          onClick={deleteItem}
          aria-controls={`item-${item.id}`}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  );
};

export default Modal;
