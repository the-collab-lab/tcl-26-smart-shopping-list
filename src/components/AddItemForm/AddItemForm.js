const AddItemForm = () => {
  return (
    <form>
      <label htmlFor="item-name">Item name:</label>
      <input
        id="item-name"
        name=""
        type="text"
        aria-describedby="item-name-hint"
      />
      <span id="item-name-hint"></span>

      <fieldset>
        <legend>How soon will you buy this again?</legend>

        <input
          id="soon-option"
          name="how-soon"
          type="radio"
          value="7"
          checked
        />
        <label htmlFor="soon-option">Soon</label>

        <input id="kinda-soon-option" name="how-soon" type="radio" value="14" />
        <label htmlFor="kinda-soon-option">Kind of Soon</label>

        <input id="not-soon-option" name="how-soon" type="radio" value="30" />
        <label htmlFor="not-soon-option">Not Soon</label>

        <button type="submit">Add Item</button>
      </fieldset>
    </form>
  );
};

export default AddItemForm;
