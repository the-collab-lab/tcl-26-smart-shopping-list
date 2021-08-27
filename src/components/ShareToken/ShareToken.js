import { useState } from 'react';

import './ShareToken.css';

const ShareToken = () => {
  const token = 'test token';
  const [showMobileShare, setShowMobileShare] = useState(false);

  function copyToken() {
    navigator.clipboard.writeText(token).catch((err) => {
      console.log(err);
    });
  }

  return (
    <div className="share-token">
      {showMobileShare && (
        <div className="share-token__wrapper">
          <label htmlFor="shareToken">Share Your Shopping List</label>
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
      )}

      <button type="button" className="share-token__toggle-button">
        Share
      </button>
    </div>
  );
};

export default ShareToken;
