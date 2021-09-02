import { useState, useRef } from 'react';

import './ShareToken.css';

import { ReactComponent as ShareIcon } from '../../images/icon-share.svg';

const ShareToken = ({ token }) => {
  const [showMobileShare, setShowMobileShare] = useState(false);
  const shareTokenRef = useRef();

  function copyToken() {
    navigator.clipboard.writeText(token).catch((err) => {
      document.execCommand(token); // possible fallback for older browsers
    });
  }

  const handleTokenShare = () => {
    copyToken();
    setShowMobileShare(!showMobileShare);
    shareTokenRef.current.focus();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleTokenShare}
        className="button list-header__share-toggle-button share-toggle-button"
        aria-expanded={showMobileShare}
        aria-controls="share-token"
        aria-label="Share list"
      >
        <ShareIcon
          aria-hidden="true"
          focusable="false"
          className="share-toggle-button__icon icon share-icon"
        />
        <strong className="share-toggle-button__strong" htmlFor="shareToken">
          Share your list
        </strong>
        <span className="share-toggle-button__hint">
          Reveal your token and copy to clipboard.
        </span>
      </button>

      <div
        className={`share-token list-header__share-token ${
          showMobileShare ? 'share-token_mobile_show' : ''
        }`}
        id="share-token"
        role="region"
        tabIndex="-1"
        ref={shareTokenRef}
      >
        <label className="share-token__label" htmlFor="shareToken">
          Your unique token:
        </label>
        <div className="form-group clipboard-copy clipboard-copy">
          <input
            className="share-token__token text-field form-group__text-field"
            type="text"
            id="shareToken"
            name="shareToken"
            value={token}
            readOnly
          />
        </div>
      </div>
    </>
  );
};

export default ShareToken;
