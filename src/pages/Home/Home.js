import './Home.css';
import JoinListForm from '../../components/JoinListForm/JoinListForm.js';

function Home({ createList, joinList }) {
  return (
    <>
      <main>
        <h1 className="header__welcome">
          Get started with your Smart Shopping List
        </h1>

        <JoinListForm createList={createList} joinList={joinList} />
      </main>
    </>
  );
}

export default Home;
