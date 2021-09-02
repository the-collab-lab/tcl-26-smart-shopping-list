import { useState, useRef, useEffect } from 'react';

import './ShareToken.css';

import { ReactComponent as ShareIcon } from '../../images/icon-share.svg';

const ShareToken = ({ token }) => {
  const [showMobileShare, setShowMobileShare] = useState(false);
  const [showDesktopShare, setShowDesktopShare] = useState(false);
  const shareTokenRef = useRef();

  function copyToken() {
    navigator.clipboard.writeText(token).catch((err) => {
      document.execCommand(token); // possible fallback for older browsers
    });
  }

  const handleTokenShare = () => {
    copyToken();

    // toggle mobile token visibility
    setShowMobileShare(!showMobileShare);

    // show token on desktop and direct focus to field
    setShowDesktopShare(true);
  };

  // when share area is shown, direct focus to field (important for screen readers to follow along)
  useEffect(() => {
    if (showMobileShare) shareTokenRef.current.focus();
  }, [showMobileShare]);

  /* this extra listener ensures the token is still hidden on click away if it's opened on a narrower/mobile 
    view, then the user changes screen orientation or browser size to wider view. Otherwise it can get stuck 
    open if the onBlur event on the text field has already happened.  */
  useEffect(() => {
    const handleTokenHide = (e) => {
      if (!shareTokenRef.current.contains(e.target)) setShowDesktopShare(false);
    };

    if (showDesktopShare) {
      // when share area is shown, direct focus to field (important for screen readers to follow along)
      shareTokenRef.current.focus();
      document.addEventListener('click', handleTokenHide);
    }

    return () => {
      document.removeEventListener('click', handleTokenHide);
    };
  }, [showDesktopShare]);

  return (
    <>
      <button
        type="button"
        onClick={handleTokenShare}
        className="button list-header__share-toggle-button share-toggle-button"
        aria-label={`${
          showDesktopShare ? 'Copied to clipboard' : 'Share list'
        }`}
        aria-describedby="share-toke-hint"
      >
        <ShareIcon
          aria-hidden="true"
          focusable="false"
          className="share-toggle-button__icon icon share-icon"
        />
        <strong className="share-toggle-button__strong" htmlFor="shareToken">
          Share your list
        </strong>
      </button>

      <span
        className={`share-token-hint list-header__share-token-hint ${
          !showDesktopShare ? 'share-token-hint_show' : ''
        }`}
        id="share-toke-hint"
      >
        Reveal your token and copy to clipboard.
      </span>

      <div
        className={`share-token list-header__share-token ${
          showMobileShare ? 'share-token_mobile_show' : ''
        } ${showDesktopShare ? 'share-token_desktop_show' : ''}`}
        id="share-token"
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
          onBlur={() => setShowDesktopShare(false)}
          aria-describedby="token-copied"
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
