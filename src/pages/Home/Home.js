import { useHistory } from 'react-router-dom';

function Home({ createList }) {
  let history = useHistory();

  function handleClick() {
    createList()
      .then((success) => {
        console.log(success);
        history.push('/list');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <main>
      <h1>Welcome To Your Smart Shopping List</h1>
      <button type="button" onClick={handleClick}>
        Create a new list
      </button>
    </main>
  );
}

export default Home;
