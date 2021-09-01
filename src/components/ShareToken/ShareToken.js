import { useState } from 'react';

import './ShareToken.css';

import { ReactComponent as ShareIcon } from '../../images/icon-share.svg';
import { ReactComponent as CopyIcon } from '../../images/icon-copy.svg';
import { ReactComponent as CheckIcon } from '../../images/icon-checkbox.svg';

const ShareToken = ({ token }) => {
  const [showMobileShare, setShowMobileShare] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showDesktopShare, setDesktopShare] = useState(false);

  function copyToken() {
    navigator.clipboard
      .writeText(token)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 5000);
      })
      .catch((err) => {
        document.execCommand(token); // possible fallback for older browsers
        console.log(err);
      });
  }

  const showTokenDesktop = () => {
    setDesktopShare(showDesktopShare ? false : true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowMobileShare(!showMobileShare)}
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
        className={`share-token list-header__share-token, share-token_desktop_show ${
          showMobileShare ? 'share-token_mobile_show' : ''
        }`}
        id="share-token"
        role="region"
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
          <button
            type="button"
            className={`share-token__copy-button ${
              copySuccess ? 'share-token__copy-button_copied' : ''
            } icon-only-button form-group__field-button`}
            onClick={(e) => {
              copySuccess ? e.preventDefault() : copyToken();
            }}
            aria-label={copySuccess ? 'Copied!' : 'Copy  to clipboard'}
          >
            {copySuccess ? (
              <CheckIcon
                aria-hidden="true"
                focusable="false"
                className="icon copied-icon"
              />
            ) : (
              <CopyIcon aria-hidden="true" focusable="false" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ShareToken;
