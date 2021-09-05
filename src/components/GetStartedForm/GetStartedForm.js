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
  const [joinReady, setJoinReady] = useState(false); // error hint for the shareToken field

  // matches a three word token
  const tokenRegex = new RegExp(/^(?:[A-Za-z]{3,} ){2}[A-Za-z]{3,}$/);

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
    setJoinReady(tokenRegex.test(event.target.value.trim()));
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

  // since CSS can't animate between height 0 and height auto, we have to help the animation work
  useEffect(() => {
    if (showJoinForm) {
      // here we are handling slide down, so the height is set to 0 to start
      // get the exact size "auto" height would be with scrollHeight
      const fullHeight = joinSectionRef.current.scrollHeight;
      // change the height to this number instead of auto, since then we get an animation
      joinSectionRef.current.style.height = fullHeight + 'px';

      // add an event listener to set the height back to auto once the transition is complete
      joinSectionRef.current.addEventListener(
        'transitionend',
        removeDefinedHeight,
      );

      function removeDefinedHeight() {
        joinSectionRef.current.removeEventListener(
          'transitionend',
          removeDefinedHeight,
        );
        joinSectionRef.current.style.height = null; // height will go back to auto

        // focus on form field here, once everything is done
        shareTokenRef.current.focus();
      }

      // now add in the class to show our other animations
      joinSectionRef.current.classList.add(
        'get-started-form__join-section_show',
      );
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
        } get-started-form__button get-started-form__button_join ${
          joinReady ? 'get-started-form__button_join-ready' : ''
        }`}
        onClick={(e) => {
          if (!showJoinForm) {
            e.preventDefault(); // stop form submission
            setShowJoinForm(true); // change state to show token field
          }
        }}
      >
        {joinReady ? 'Join Now!' : 'Join List'}
      </button>
    </form>
  );
};

export default GetStartedForm;
