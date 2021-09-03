import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import LogoHeader from '../../components/LogoHeader/LogoHeader';
import phoneSample from '../../images/phone.png';
import './AboutView.css';

const AboutView = ({ listId }) => {
  return (
    <div className="page_view_about page-view">
      <Helmet>
        <title>About - Peasy</title>
      </Helmet>

      <LogoHeader />

      <main className="page-view__main about-text">
        <h1 className="about-text__header">How Peasy Works</h1>

        <section className="about-text__section about-section">
          <img
            src={phoneSample}
            alt="Screenshot of adding items to your list"
            className="about-section__image"
          />
          <div className="about-section__description">
            <h2 className="about-section__heading">
              Add groceries to your list
            </h2>
            <p className="about-section__paragraph">
              Add items you regularly buy to your list. When you add a new item,
              Peasy will ask you to estimate how soon you'll need to buy it
              again.
            </p>
          </div>
        </section>

        <section className="about-text__section about-section">
          <img
            src={phoneSample}
            alt="Screenshot of adding items to your list"
            className="about-section__image"
          />
          <div className="about-section__description">
            <h2 className="about-section__heading">
              Check items off as you buy
            </h2>
            <p className="about-section__paragraph">
              As you buy your groceries, check them off your list to help Peasy
              learn how often you need different items.
            </p>
          </div>
        </section>

        <section className="about-text__section about-section">
          <img
            src={phoneSample}
            alt="Screenshot of adding items to your list"
            className="about-section__image"
          />
          <div className="about-section__description">
            <h2 className="about-section__heading">
              Peasy predicts what you'll need to buy next
            </h2>
            <p className="about-section__paragraph">
              Your list gets smarter with time! Peasy uses your buying history
              to predict what you'll need to buy next and sort your list
              automatically.
            </p>
            <p className="about-section__paragraph">
              Items you are likely to need soon will rise to the top of your
              list, while items you probably won't need for a while will appear
              lower on the list.
            </p>
          </div>
        </section>

        <section className="about-text__section about-section">
          <img
            src={phoneSample}
            alt="Screenshot of adding items to your list"
            className="about-section__image"
          />
          <div className="about-section__description">
            <h2 className="about-section__heading">
              Share your list with your household
            </h2>
            <p className="about-section__paragraph">
              You can share the same list with everyone who shops for your
              household. Simply provide your lists's three word token to your
              friend or family member, and they can use it to join your list
              from Peasy's home screen.
            </p>
          </div>
        </section>

        {listId ? (
          <NavLink
            to="/"
            className="button button_type_primary about-text__button"
          >
            Back To List
          </NavLink>
        ) : (
          <NavLink
            to="/"
            className="button button_type_primary about-text__button"
          >
            Get Started &raquo;
          </NavLink>
        )}
      </main>

      <footer className="page-view__footer about-footer">
        <p className="about-footer__attribution">
          Made with{' '}
          <span role="img" aria-label="heart">
            💚
          </span>{' '}
          by&nbsp;
          <a
            className="link link_footer"
            href="https://github.com/anderswift/"
            target="_blank"
            rel="noreferrer"
          >
            Ander
          </a>
          , Connie, Nick, & Sheila in partnership with&nbsp;
          <a
            className="link link_footer"
            href="https://the-collab-lab.codes/"
            target="_blank"
            rel="noreferrer"
          >
            The Collab Lab
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

export default AboutView;
