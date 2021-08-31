import { useState } from 'react';

import './ShareToken.css';

import { ReactComponent as ShareIcon } from '../../images/icon-share.svg';
import { ReactComponent as CopyIcon } from '../../images/icon-copy.svg';
import { ReactComponent as CheckIcon } from '../../images/icon-checkbox.svg';

const ShareToken = ({ token }) => {
  const [showMobileShare, setShowMobileShare] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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

  return (
    <>
      <button
        type="button"
        onClick={() => setShowMobileShare(!showMobileShare)}
        className="icon-only-button list-header__share-toggle-button share-toggle-button"
        aria-label="Share list"
        aria-expanded={showMobileShare}
        aria-controls="share-token"
      >
        <ShareIcon aria-hidden="true" focusable="false" />
      </button>

      <div
        className={`share-token list-header__share-token ${
          showMobileShare ? 'share-token_mobile_show' : ''
        }`}
        id="share-token"
        role="region"
      >
        <h4 className="share-token__heading" htmlFor="shareToken">
          Share your shopping list
        </h4>
        <label className="share-token__label" htmlFor="shareToken">
          Your list token:
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
