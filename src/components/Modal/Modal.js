const Modal = ({ showModal, handleModalClose }) => {
  const showHideClassName = showModal ? 'display-block' : 'display-none';

  return (
    <div className={showHideClassName}>
      <h2>Are you sure you want to delete this item?</h2>
      <button onClick={handleModalClose}>No, Cancel</button>
      <button>Yes, Delete</button>
    </div>
  );
};

export default Modal;
