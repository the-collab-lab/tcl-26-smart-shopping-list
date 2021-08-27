import { useState } from 'react';

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
        className="header__share-toggle-button share-toggle-button"
      >
        Share
      </button>

      <div
        className={`share-token header__share-token ${
          showMobileShare ? 'share-token_mobile_show' : ''
        }`}
      >
        <label className="share-token__label" htmlFor="shareToken">
          Share your shopping list:
        </label>
        <input
          type="text"
          id="shareToken"
          name="shareToken"
          value={token}
          readOnly
        />
        <button
          type="button"
          className="share-token__copy-button"
          onClick={copyToken}
        >
          Copy
        </button>
      </div>
    </>
  );
};

export default ShareToken;
