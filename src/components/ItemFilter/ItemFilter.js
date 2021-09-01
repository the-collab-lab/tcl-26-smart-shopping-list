import { ReactComponent as ClearIcon } from '../../images/icon-x.svg';
import './ItemFilter.css';

const ItemFilter = ({ filter, setFilter }) => {
  return (
    <div className="list-view__filter filter form-group">
      <label htmlFor="filterInput" className="form-group__label label">
        Filter items
      </label>
      <input
        type="text"
        id="filterInput"
        name="filterInput"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="filter__text-field form-group__text-field text-field"
        placeholder=" "
      />
      {filter && (
        <button
          type="button"
          aria-label="Clear filter"
          className="filter__clear form-group__field-button icon-only-button"
          onClick={() => setFilter('')}
        >
          <ClearIcon aria-hidden="true" focusable="false" />
        </button>
      )}
    </div>
  );
};

export default ItemFilter;
