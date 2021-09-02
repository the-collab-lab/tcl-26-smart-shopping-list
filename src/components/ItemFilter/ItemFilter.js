import { ReactComponent as ClearIcon } from '../../images/icon-x.svg';
import './ItemFilter.css';

const ItemFilter = ({ filter, setFilter }) => {
  return (
    <div className="list-view__filter filter">
      <label htmlFor="filterInput" className="label">
        Filter items
      </label>
      <input
        type="text"
        id="filterInput"
        name="filterInput"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="filter__text-field text-field"
        placeholder=" "
      />
      {filter && (
        <button
          type="button"
          aria-label="Clear filter"
          className="filter__clear icon-only-button"
          onClick={() => setFilter('')}
        >
          <ClearIcon aria-hidden="true" focusable="false" />
        </button>
      )}
    </div>
  );
};

export default ItemFilter;
