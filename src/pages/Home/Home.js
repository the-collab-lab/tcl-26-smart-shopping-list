import { NavLink, useHistory } from 'react-router-dom';
import { useState, useRef } from 'react';

import './Home.css';
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
    <div className="page-view">
      <LogoHeader isHome={true} />

      <main className="page-view__main home-intro">
        <h2 className="home-intro__tagline">
          Your <strong className="home-intro__tagline-keyword">smart</strong>{' '}
          shopping list.
        </h2>

        <form
          name="getStartedForm"
          onSubmit={handleJoinList}
          className="home-intro__form get-started-form"
        >
          <div className="get-started-form__join-section">
            <h3 className="get-started-form__heading">
              Want to join an existing list?
            </h3>
            <p className="get-started-form__directions">
              Enter the list’s three word token below and click the{' '}
              <strong className="strong">Join List</strong> button.
            </p>

            <label
              className="get-started-form__label visually-hidden"
              htmlFor="shareToken"
            >
              Your Token:
            </label>

            <input
              ref={shareTokenRef}
              className={`get-started-form__text-field text-field ${
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
              className={`error error_type_field get-started-form__field-error ${
                shareTokenError ? 'error_on' : ''
              }`}
            >
              {shareTokenError}
            </div>

            <div
              role="alert"
              className={`error error_type_summary get-started-form__join-errors ${
                joinListError ? 'error_on' : ''
              }`}
            >
              {joinListError}
            </div>
          </div>

          <div
            role="alert"
            className={`error error_type_summary get-started-form__create-errors ${
              createListError ? 'error_on' : ''
            }`}
          >
            {createListError}
          </div>

          <button
            type="button"
            className="button button_type_primary get-started-form__button get-started-form__button_create"
            onClick={handleCreateList}
          >
            Create List
          </button>

          <button
            type="submit"
            className="button get-started-form__button get-started-form__button_join"
          >
            Join List
          </button>
        </form>
      </main>

      <footer className="page-view__footer">
        <NavLink to="/" className="link help-link page-view__footer-link">
          Learn how Peasy works &raquo;
        </NavLink>
      </footer>
    </div>
  );
}

export default Home;
