import { useState, useRef, useEffect } from 'react';

import './ShareToken.css';

import { ReactComponent as ShareIcon } from '../../images/icon-share.svg';

const ShareToken = ({ token }) => {
  const [showShare, setShowShare] = useState(false);
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
    if (showShare) shareTokenRef.current.focus();
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
        className={`share-token list-header__share-token ${
          showShare ? 'share-token_show' : ''
        }`}
        id="share-token"
        aria-hidden={!showShare}
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
