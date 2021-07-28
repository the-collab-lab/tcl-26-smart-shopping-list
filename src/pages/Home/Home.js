import { useHistory } from 'react-router-dom';
import { useState } from 'react';

function Home({ createList, joinList }) {
  let history = useHistory();

  const [shareToken, setShareToken] = useState('');

  const handleTokenChange = (event) => {
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
    joinList(shareToken)
      .then((success) => {
        history.push('/list');
      })
      .catch((err) => {
        console.log(err);
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
            className="join-list-form__error error"
          ></div>
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
