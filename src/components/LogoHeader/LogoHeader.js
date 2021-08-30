import peasyLogoMark from '../../images/peasy-logomark.svg';

import './LogoHeader.css';

const LogoHeader = ({ isHome = false }) => {
  return (
    <header className={`logo ${isHome ? 'logo_home' : ''}`}>
      {isHome /* Make the logo the h1 on home page only */ ? (
        <h1 className="logo__heading logo__heading_home">
          Peasy
          <img
            className="logo__image logo__image_home"
            src={peasyLogoMark}
            alt="logo"
          />
        </h1>
      ) : (
        <div className="logo__heading">
          Peasy
          <img className="logo__image" src={peasyLogoMark} alt="logo" />
        </div>
      )}
    </header>
  );
};

export default LogoHeader;
