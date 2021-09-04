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

  // when share area is shown, direct focus to field (helps screen readers follow along)
  useEffect(() => {
    if (showShare) {
      const fullHeight = shareAreaRef.current.scrollHeight;
      shareAreaRef.current.style.height = fullHeight + 'px';

      shareAreaRef.current.addEventListener(
        'transitionend',
        removeDefinedHeight,
      );

      function removeDefinedHeight() {
        shareAreaRef.current.removeEventListener(
          'transitionend',
          removeDefinedHeight,
        );
        shareAreaRef.current.style.height = null;

        // handle focus here after everything is complete
        shareTokenRef.current.focus();
      }
      shareAreaRef.current.classList.add('share-token_show');
    } else {
      const fullHeight = shareAreaRef.current.scrollHeight;
      const cssTransition = shareAreaRef.current.style.transition;
      shareAreaRef.current.style.transition = '';

      requestAnimationFrame(() => {
        shareAreaRef.current.style.height = fullHeight + 'px';
        shareAreaRef.current.style.transition = cssTransition;

        requestAnimationFrame(function () {
          shareAreaRef.current.style.height = 0 + 'px';
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
