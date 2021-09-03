import screenshot from './desktop-screen.png';
import './about-view.css';
import { NavLink } from 'react-router-dom';
const { Helmet } = require('react-helmet');

const AboutView = ({ listId }) => {
  return (
    <div className="page_view_about page-view">
      <Helmet>
        <title>About - Peasy</title>
      </Helmet>
      <div className="about-images">
        <img src={screenshot} alt="desktop view" className="desktop__image" />
      </div>
      <main className="page-view__main about-text">
        <h1 className="about-text__header">How Peasy Works</h1>
        <section className="about-section">
          <h2 className="about-section__header">
            Add items to your grocery list
          </h2>
          <p className="about-section__paragraph">
            Add items you regularly buy to your list. When you add a new item,
            Peasy will ask you to estimate how soon you'll need to buy it again.
          </p>
        </section>
        <section className="about-section">
          <h2 className="about-section__header">Check items off your list</h2>
          <p className="about-section__paragraph">
            As you buy your groceries, check them off your list to help Peasy
            learn how often you need different items.
          </p>
        </section>
        <section className="about-section">
          <h2 className="about-section__header">
            Peasy predicts what you'll need to buy next
          </h2>
          <p className="about-section__paragraph">
            Your list gets smarter with time! Peasy uses your buying history to
            predict what you'll need to buy next and sort your list
            automatically.
          </p>
          <p className="about-section__paragraph">
            Items you are likely to need soon will rise to the top of your list,
            while items you probably won't need for a while will appear lower on
            the list.
          </p>
        </section>
        <section className="about-section">
          <h2 className="about-section__header">Share your list</h2>
          <p className="about-section__paragraph">
            You can share the same list with everyone who shops for your
            household. Simply provide your lists's three word token to your
            friend or family member, and they can use it to join your list from
            Peasy's home screen.
          </p>
        </section>
        <footer className=".page-view__footer">
          {listId ? (
            <NavLink to="/" className="about-button">
              Back To List
            </NavLink>
          ) : (
            <NavLink to="/" className="about-button">
              Get Started
            </NavLink>
          )}
          <p className=".page-view__footer about-footer">
            {[
              'Made with 💚 by Ander, Connie, Nick, & Sheila in partnership with ',
              <a
                className=".about-footer__attribution"
                href="https://the-collab-lab.codes/"
              >
                The Collab Lab
              </a>,
            ]}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default AboutView;
