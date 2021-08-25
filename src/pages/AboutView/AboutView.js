import screenshot from './app-screen.png';
import './AboutView.css';
import { NavLink } from 'react-router-dom';
const { Helmet } = require('react-helmet');

const AboutView = ({ listId }) => {
  return (
    <>
      <Helmet>
        <title>Your List - Smart Shopping List</title>
      </Helmet>
      <div className="flex">
        <div className="flex flex--image">
          <NavLink
            to="/"
            className="nav-menu__item"
            activeClassName="nav-menu__item_current"
          >
            Back
          </NavLink>
          <img className="left-image" src={screenshot} alt="screenshot" />
        </div>
        <div className="flex flex--info">
          <h1 className="info-title">How Peasy Works</h1>
          <div className="info-item">
            <img className="info-item__icon" src="" alt="" />
            <h2 className="info-item__title">Add items to your grocery list</h2>
            <p className="info-item__body">
              Add items to your grocery list and select how soon you'll need to
              buy your next shopping item.
            </p>
          </div>
          <div className="info-item">
            <img className="info-item__icon" src="" alt="" />
            <h2 className="info-item__title">Check items off your list</h2>
            <p className="info-item__body">
              As you buy your groceries, check them off your grocery list.
            </p>
          </div>
          <div className="info-item">
            <img className="info-item__icon" src="" alt="" />
            <h2 className="info-item__title">Predict when you'll buy next</h2>
            <p className="info-item__body">
              Your list gets smarter with time. The app predicts when you'll buy
              different items next.
            </p>
            <p className="info-item__body">
              If an item is likely to be bought soon, it rises to the top of
              your grocery list.
            </p>
          </div>
          <div className="info-item">
            <img className="info-item__icon" src="" alt="" />
            <h2 className="info-item__title">Share your list</h2>
            <p className="info-item__body">
              Share your list's three-word token with friends and family.
            </p>
          </div>
          {listId ? (
            <NavLink
              to="/"
              className="nav-menu__item"
              activeClassName="nav-menu__item_current"
            >
              Back To List
            </NavLink>
          ) : (
            <NavLink
              to="/"
              className="nav-menu__item"
              activeClassName="nav-menu__item_current"
            >
              Get Started
            </NavLink>
          )}
          <p className="footnote">
            {[
              'Made with love <3 by Ander, Connie, Nick, & Sheila in partnership with ',
              <a href="https://the-collab-lab.codes/">The Collab Lab</a>,
            ]}
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutView;
