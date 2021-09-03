import screenshot from './desktop-screen.png';
import './about-view.css';
import { NavLink } from 'react-router-dom';
const { Helmet } = require('react-helmet');

const AboutView = ({ listId }) => {
  return (
    <div className="page_view_about page-view ">
      <Helmet>
        <title>About - Peasy</title>
      </Helmet>
      <div className="about-images">
        <img src={screenshot} alt="desktop view" className="desktop__image" />
      </div>
      <main className="about-text">
        <h1 className="about-text__header">How Peasy Works</h1>
        <section className="about-section">
          <h2 className="about-section__header">
            Add items to your grocery list
          </h2>
          <p className="about-section__paragraph">
            Add items you regularly buy to your list. When you add a new item, Peasy will ask you to estimate how 
            soon you'll need to buy it again.
          </p>
        </section>
        <section className="about-section">
          <h2 className="about-section__header">Check items off your list</h2>
          <p className="about-section__paragraph">
            As you buy your groceries, check them off your grocery list.
          </p>
        </section>
        <section className="about-section">
          <h2 className="about-section__header">
            Predict when you'll buy next
          </h2>
          <p className="about-section__paragraph">
            Your list gets smarter with time. The app predicts when you'll buy
            different items next.
          </p>
          <p className="about-section__paragraph">
            If an item is likely to be bought soon, it rises to the top of your
            grocery list.
          </p>
        </section>
        <section className="about-section">
          <h2 className="about-section__header">Share your list</h2>
          <p className="about-section__paragraph">
            Share your list's three-word token with friends and family.
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
              'Made with love <3 by Ander, Connie, Nick, & Sheila in partnership with ',
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
