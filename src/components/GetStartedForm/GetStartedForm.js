import { useHistory } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import './GetStartedForm.css';

const GetStartedForm = ({ createList, joinList }) => {
  let history = useHistory();

  const [showJoinForm, setShowJoinForm] = useState(false);

  const [createListError, setCreateListError] = useState(''); // error for the create list form
  const [joinListError, setJoinListError] = useState(''); // error for the entire join list form

  const joinSectionRef = useRef();
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

  useEffect(() => {
    if (showJoinForm) {
      // handles animating height of accordion from 0 to auto height
      const fullHeight = joinSectionRef.current.scrollHeight;
      joinSectionRef.current.style.height = fullHeight + 'px';

      joinSectionRef.current.addEventListener(
        'transitionend',
        removeDefinedHeight,
      );

      function removeDefinedHeight(e) {
        joinSectionRef.current.removeEventListener(
          'transitionend',
          removeDefinedHeight,
        );
        joinSectionRef.current.style.height = null;
      }

      joinSectionRef.current.classList.add(
        'get-started-form__join-section_show',
      );

      // focus on form field
      shareTokenRef.current.focus();
    }
  }, [showJoinForm]);

  return (
    <form
      name="getStartedForm"
      onSubmit={handleJoinList}
      className="home-intro__form get-started-form"
    >
      <div ref={joinSectionRef} className="get-started-form__join-section">
        <div className="get-started-form__join-inner">
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
      </div>

      {/* error for create list action, role makes screenreader announce updates */}
      <div
        role="alert"
        className={`error error_type_summary get-started-form__create-errors ${
          createListError ? 'error_on' : ''
        }`}
      >
        {createListError}
      </div>

      {/* make Create primary if not showJoinForm */}
      <button
        type="button"
        className={`button ${
          !showJoinForm ? 'button_type_primary' : ''
        } get-started-form__button get-started-form__button_create`}
        onClick={handleCreateList}
      >
        Create List
      </button>

      {/* make Join primary if showJoinForm */}
      <button
        type="submit"
        className={`button ${
          showJoinForm ? 'button_type_primary' : ''
        } get-started-form__button get-started-form__button_join`}
        onClick={(e) => {
          if (!showJoinForm) {
            e.preventDefault(); // stop form submission
            setShowJoinForm(true); // change state to show token field
          }
        }}
      >
        {!showJoinForm ? 'Join List' : 'Join Now!'}
      </button>
    </form>
  );
};

export default GetStartedForm;
