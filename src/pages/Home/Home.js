import { NavLink } from 'react-router-dom';

import './Home.css';
import LogoHeader from '../../components/LogoHeader/LogoHeader';
import GetStartedForm from '../../components/GetStartedForm/GetStartedForm.js';

function Home({ createList, joinList }) {
  return (
    <div className="page-view page-view_home">
      <LogoHeader isHome={true} />

      <main className="page-view__main home-intro">
        <h2 className="home-intro__tagline">
          Your <strong className="home-intro__tagline-keyword">smart</strong>{' '}
          shopping list.
        </h2>

        <GetStartedForm createList={createList} joinList={joinList} />
      </main>

      <footer className="page-view__footer">
        <NavLink to="/about" className="link help-link page-view__footer-link">
          Learn how Peasy works &raquo;
        </NavLink>
      </footer>
    </div>
  );
}

export default Home;
