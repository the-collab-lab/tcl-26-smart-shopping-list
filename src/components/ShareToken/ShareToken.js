import { useState, useRef, useEffect } from 'react';

import './ShareToken.css';

import { ReactComponent as ShareIcon } from '../../images/icon-share.svg';

const ShareToken = ({ token }) => {
  const [showShare, setShowShare] = useState(false);
  const shareAreaRef = useRef();
  const shareTokenRef = useRef();

  function copyToken() {
    try {
      navigator.clipboard.writeText(token);
    } catch (err) {
      document.execCommand(token); // possible fallback for older browsers
    }
  }

  const handleTokenShare = () => {
    setShowShare(!showShare);
    copyToken();
  };

  // since CSS can't animate between height 0 and height auto, we have to help the animation work
  useEffect(() => {
    if (showShare) {
      // here we are handling slide down, so the height is set to 0 to start
      // get the exact size "auto" height would be with scrollHeight
      const fullHeight = shareAreaRef.current.scrollHeight;
      // change the height to this number instead of auto, since then we get an animation
      shareAreaRef.current.style.height = fullHeight + 'px';

      // add an event listener to set the height back to auto once the transition is complete
      shareAreaRef.current.addEventListener(
        'transitionend',
        removeDefinedHeight,
      );

      function removeDefinedHeight() {
        shareAreaRef.current.removeEventListener(
          'transitionend',
          removeDefinedHeight,
        );
        shareAreaRef.current.style.height = null; // height will go back to auto

        // handle focus here after everything is complete (helps screen readers follow along)
        shareTokenRef.current.focus();
      }

      // now add in the class to show our other animations
      shareAreaRef.current.classList.add('share-token_show');
    } else {
      // here we are handling slide up, so the height is set to auto to start
      // get the exact size "auto" height has worked out to
      const fullHeight = shareAreaRef.current.scrollHeight;
      // remove transition and save for later, so we don't have to wait when changing height
      const cssTransition = shareAreaRef.current.style.transition;
      shareAreaRef.current.style.transition = '';

      // here we're running callbacks once the browser next renders
      requestAnimationFrame(() => {
        // change the height from auto to the exact pixel number we calculated
        // (since we removed the transition, we can change the height with no issues)
        shareAreaRef.current.style.height = fullHeight + 'px';
        // add the transition back because now we *do* want to see it
        shareAreaRef.current.style.transition = cssTransition;

        requestAnimationFrame(function () {
          // now set the height to 0 and we will see it animate
          shareAreaRef.current.style.height = 0 + 'px';
          // add in the class to show our other animations
          shareAreaRef.current.classList.remove('share-token_show');
        });
      });
    }
  }, [showShare]);

  return (
    <>
      <button
        type="button"
        onClick={handleTokenShare}
        className="button list-header__share-toggle-button share-toggle-button"
        aria-label={`${showShare ? 'Hide List' : 'Share list'}`}
        aria-expanded={showShare}
        aria-controls="share-token"
        aria-describedby="share-token-hint"
      >
        <ShareIcon
          aria-hidden="true"
          focusable="false"
          className="share-toggle-button__icon icon share-icon"
        />
        <strong className="share-toggle-button__strong" htmlFor="shareToken">
          {showShare ? 'Hide list token' : 'Share your list'}
        </strong>
      </button>

      <span
        className={`share-token-hint list-header__share-token-hint ${
          !showShare ? 'share-token-hint_show' : ''
        }`}
        id="share-token-hint"
      >
        Reveal your token and copy to clipboard.
      </span>

      <div
        className="share-token list-header__share-token"
        id="share-token"
        aria-hidden={!showShare}
        ref={shareAreaRef}
      >
        <label className="share-token__label" htmlFor="shareToken">
          Your unique token:
        </label>
        <input
          className="share-token__token text-field"
          type="text"
          id="shareToken"
          name="shareToken"
          value={token}
          ref={shareTokenRef}
          aria-describedby="token-copied"
          focusable={showShare}
          readOnly
        />
        <span className="share-token__copied" id="token-copied">
          Copied to clipboard!
        </span>
      </div>
    </>
  );
};

export default ShareToken;
