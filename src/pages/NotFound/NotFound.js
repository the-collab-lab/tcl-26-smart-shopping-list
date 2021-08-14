import { Helmet } from 'react-helmet';

const NotFound = () => {
  return (
    <main>
      <Helmet>
        <title>Page Not Found - Smart Shopping List</title>
      </Helmet>
      <h1>404: Page Not Found</h1>
      <p>Lost? Try navigating to your list or adding an item below:</p>
    </main>
  );
};

export default NotFound;
