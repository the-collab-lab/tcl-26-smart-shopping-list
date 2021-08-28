import { useHistory } from 'react-router-dom';
import { useState, useRef } from 'react';
import './Home.css';

import JoinListForm from '../../components/JoinListForm/JoinListForm.js';

function Home({ createList, joinList }) {
  let history = useHistory();

  const [showJoinButton, setShowJoinButton] = useState(true);
  const [showJoinForm, setShowJoinForm] = useState(false);

  const [createListError, setCreateListError] = useState(''); // error for the create list form

  const toggleJoinBtnClass = showJoinButton ? 'join-btn-show' : 'join-btn-hide';

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

  const handleJoinClick = () => {
    setShowJoinButton(false);
    setShowJoinForm(true);
  };

  return (
    <>
      <main>
        <h1 className="header__welcome">
          Get started with your Smart Shopping List
        </h1>

        {/* Div for displaying message if there is error with creating list */}
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
            Create List
          </button>

          <button
            type="button"
            className={`button ${toggleJoinBtnClass}`}
            onClick={handleJoinClick}
          >
            Join List
          </button>
          <JoinListForm showJoinForm={showJoinForm} joinList={joinList} />
        </div>
      </main>
    </>
  );
}

export default Home;
