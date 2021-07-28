import { useHistory } from 'react-router-dom';
import { useState } from 'react';

function Home({ createList, joinList }) {
  let history = useHistory();

  const [shareToken, setShareToken] = useState('');
  const [joinListError, setJoinListError] = useState('');

  const handleTokenChange = (event) => {
    setJoinListError('');
    setShareToken(event.target.value);
  };

  function handleCreateList() {
    createList()
      .then((success) => {
        history.push('/list');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleJoinList(event) {
    event.preventDefault();
    setJoinListError(''); // remove message to ensure repeated error is read again by screen reader
    joinList(shareToken)
      .then((success) => {
        history.push('/list');
      })
      .catch((err) => {
        if (err.message === 'Invalid token')
          setJoinListError(
            'Sorry, that token is invalid. Please try again or create a new list.',
          );
        else
          setJoinListError(
            'Sorry, there was a problem connecting to the database. Please try again.',
          );
      });
  }

  return (
    <>
      <header className="container__header header">
        <h1 className="header__welcome">Welcome To Your Smart Shopping List</h1>
      </header>

      <main>
        <div className="new-list">
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
            aria-live="assertive"
            className={`join-list-form__error error ${
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
            className="join-list-form__text-field text-field"
            type="text"
            id="shareToken"
            name="shareToken"
            value={shareToken}
            onChange={handleTokenChange}
            maxLength="100"
            required
          />

          <button type="submit" className="join-list-form__submit button">
            Join an existing list
          </button>
        </form>
      </main>
    </>
  );
}

export default Home;
