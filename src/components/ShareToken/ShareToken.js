import { useState } from 'react';

import { ReactComponent as ShareIcon } from '../../images/icon-share.svg';
import { ReactComponent as CopyIcon } from '../../images/icon-copy.svg';
import './ShareToken.css';

const ShareToken = ({ token }) => {
  const [showMobileShare, setShowMobileShare] = useState(false);

  function copyToken() {
    navigator.clipboard.writeText(token).catch((err) => {
      document.execCommand(token); // possible fallback for older browsers
      console.log(err);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowMobileShare(!showMobileShare)}
        className="icon-only-button header__share-toggle-button share-toggle-button"
        aria-label="Share list"
      >
        <ShareIcon aria-hidden="true" focusable="false" />
      </button>

      <div
        className={`share-token header__share-token ${
          showMobileShare ? 'share-token_mobile_show' : ''
        }`}
      >
        <label className="share-token__label" htmlFor="shareToken">
          Share your shopping list:
        </label>
        <div className="form-group">
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
            className="share-token__copy-button icon-only-button form-group__field-button"
            onClick={copyToken}
          >
            <CopyIcon aria-hidden="true" focusable="false" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ShareToken;
