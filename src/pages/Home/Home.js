import { useHistory } from 'react-router-dom';
import { useState, useRef } from 'react';

import LogoHeader from '../../components/LogoHeader/LogoHeader';

function Home({ createList, joinList }) {
  let history = useHistory();

  const [createListError, setCreateListError] = useState(''); // error for the create list form

  const [joinListError, setJoinListError] = useState(''); // error for the entire join list form

  const [shareToken, setShareToken] = useState(''); // value for the shareToken field
  const shareTokenRef = useRef(); // ref for the shareToken field
  const [shareTokenError, setShareTokenError] = useState(''); // error hint for the shareToken field

  const handleTokenChange = (event) => {
    setJoinListError('');
    setShareTokenError('');
    setShareToken(event.target.value);
  };

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
    <>
      <LogoHeader />

      <main>
        <div className="new-list">
          <div
            role="alert"
            className={`error error_type_summary ${
              createListError ? 'error_on' : ''
            }`}
          >
            {createListError}
          </div>
          <button
            type="button"
            className="new-list__button button"
            onClick={handleCreateList}
          >
            Create a new list
          </button>
        </div>

        <div className="container__separator">- or -</div>

        <form
          name="joinListForm"
          onSubmit={handleJoinList}
          className="join-list-form"
        >
          <p>Join an existing shopping list by entering a three word token.</p>
          <div
            role="alert" // error for overall form, role makes screenreader read this first
            className={`error error_type_summary ${
              joinListError ? 'error_on' : ''
            }`}
          >
            {joinListError}
          </div>
          <label
            className="join-list-form__label join-list-form__label_type_text label"
            htmlFor="shareToken"
          >
            Share Token:
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

          <button type="submit" className="join-list-form__submit button">
            Join an existing list
          </button>
        </form>
      </main>
    </>
  );
}

export default Home;
