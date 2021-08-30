import { useHistory } from 'react-router-dom';
import { useState, useRef } from 'react';
import './JoinListForm.css';

const JoinListForm = ({ createList, joinList }) => {
  let history = useHistory();

  const [showJoinForm, setShowJoinForm] = useState(false);

  const toggleJoinClass = showJoinForm ? 'join-list-open' : 'join-list-close';

  const [createListError, setCreateListError] = useState(''); // error for the create list form
  const [joinListError, setJoinListError] = useState(''); // error for the entire join list form

  const [shareToken, setShareToken] = useState(''); // value for the shareToken field
  const shareTokenRef = useRef(); // ref for the shareToken field
  const [shareTokenError, setShareTokenError] = useState(''); // error hint for the shareToken field

  function handleCreateList() {
    setCreateListError('');
    createList()
      .then((success) => {
        history.push('/list');
      })
      .catch((err) => {
        setCreateListError(
          'Sorry, there was a problem creating your list. Please check your connection and try again.',
        );
      });
  }

  const handleTokenChange = (event) => {
    setJoinListError('');
    setShareTokenError('');
    setShareToken(event.target.value);
  };

  function handleJoinList(event) {
    event.preventDefault();

    // reset messages to ensure repeated error is read again by screen reader
    setJoinListError('');
    setShareTokenError('');

    joinList(shareToken)
      .then((success) => {
        history.push('/list');
      })
      .catch((err) => {
        if (err.message === 'Invalid token') {
          setShareTokenError('Token is invalid.');
          setJoinListError(
            'Sorry, there was a problem with your token. Please try again or create a new list.',
          );
          shareTokenRef.current.focus();
        } else {
          setJoinListError(
            'Sorry, there was a problem connecting to the database. Please try again.',
          );
          shareTokenRef.current.focus();
        }
      });
  }

  return (
    <form
      name="joinListForm"
      className="join-list-form"
      onSubmit={handleJoinList}
    >
      <div className={toggleJoinClass}>
        <h3>Want to join an existing list?</h3>
        <p>
          Enter your list's three-word token to join an existing shopping list.
        </p>
        <label
          className="label join-list-form__label join-list-form__label_type_text"
          htmlFor="shareToken"
        >
          Your token:
        </label>
        <input
          ref={shareTokenRef}
          className={`join-list-form__text-field text-field ${
            shareTokenError ? 'text-field_has-error' : ''
          }`}
          type="text"
          id="shareToken"
          name="shareToken"
          value={shareToken}
          onChange={handleTokenChange}
          aria-describedby="shareTokenHint"
          aria-invalid={Boolean(shareTokenError)}
          maxLength="100"
          required
        />
        <div
          id="shareTokenHint"
          className={`error error_type_field ${
            shareTokenError ? 'error_on' : ''
          }`}
        >
          {shareTokenError}
        </div>
      </div>

      {/* error for overall form, role makes screenreader read this first */}
      <div
        role="alert"
        className={`error error_type_summary ${
          createListError ? 'error_on' : ''
        }`}
      >
        {createListError}
      </div>

      <div
        role="alert"
        className={`error error_type_summary ${
          joinListError ? 'error_on' : ''
        }`}
      >
        {joinListError}
      </div>

      <div className="join-list-form__cta">
        {/* make Create primary if not showJoinForm */}
        <button
          type="button"
          className={`button join-list-form__button ${
            !showJoinForm ? 'button_type_primary' : ''
          }`}
          onClick={handleCreateList}
        >
          Create List
        </button>

        {/* make Join primary if showJoinForm */}
        <button
          type="submit"
          className={`button join-list-form__submit ${
            showJoinForm ? 'button_type_primary' : ''
          }`}
          onClick={(e) => {
            if (!showJoinForm) {
              e.preventDefault(); // stop form submission
              setShowJoinForm(true); // change state to show token field
            }
          }}
        >
          {!showJoinForm ? 'Join List' : 'Join This List'}
        </button>
      </div>
    </form>
  );
};

export default JoinListForm;
