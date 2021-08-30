import peasyLogoMark from '../../images/peasy-logomark.svg';

import './LogoHeader.css';

const LogoHeader = ({ isHome = false }) => {
  return (
    <header className={`logo ${isHome ? 'logo_home' : ''}`}>
      {isHome /* Make the logo the h1 on home page only */ ? (
        <h1 className="logo__text logo__text">Peasy</h1>
      ) : (
        <h1 className="logo__text logo__text">Peasy</h1>
      )}
      <img className="logo__image logo__image" src={peasyLogoMark} alt="logo" />
    </header>
  );
};

export default LogoHeader;
