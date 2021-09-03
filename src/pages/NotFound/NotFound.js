import { Helmet } from 'react-helmet';
import LogoHeader from '../../components/LogoHeader/LogoHeader';

const NotFound = () => {
  return (
    <div className="page-view">
      <Helmet>
        <title>Page Not Found - Peasy</title>
      </Helmet>

      <LogoHeader />

      <main className="page-view__main">
        <h1 className="header">404: Page Not Found</h1>
        <p className="paragraph">
          Lost? Try navigating to your list or adding an item below:
        </p>
      </main>
    </div>
  );
};

export default NotFound;
