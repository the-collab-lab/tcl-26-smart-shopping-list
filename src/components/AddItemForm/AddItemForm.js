import { useState } from 'react';

const AddItemForm = () => {
  const [formValues, setFormValues] = useState({
    itemName: '',
    purchaseInterval: '7',
  });

  // Generic function that works for any of the below form inputs
  const handleChange = (event) => {
    const inputName = event.target.name;
    setFormValues({ ...formValues, [inputName]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // handle submitting form values to database here
  };

  return (
    <form>
      <label htmlFor="itemName">Item name:</label>
      <input
        type="text"
        id="itemName"
        name="itemName"
        aria-describedby="itemNameHint"
        value={formValues.itemName}
        onChange={handleChange}
        maxLength="100"
        required
      />
      <span id="itemNameHint"></span>

      <fieldset>
        <legend>How soon will you buy this again?</legend>

        <input
          type="radio"
          id="soonOption"
          name="purchaseInterval"
          value="7"
          onChange={handleChange}
          checked={formValues.purchaseInterval === '7'}
        />
        <label htmlFor="soonOption">Soon</label>

        <input
          type="radio"
          id="kindaSoonOption"
          name="purchaseInterval"
          value="14"
          onChange={handleChange}
          checked={formValues.purchaseInterval === '14'}
        />
        <label htmlFor="kindaSoonOption">Kind of Soon</label>

        <input
          type="radio"
          id="notSoonOption"
          name="purchaseInterval"
          value="30"
          onChange={handleChange}
          checked={formValues.purchaseInterval === '30'}
        />
        <label htmlFor="notSoonOption">Not Soon</label>
      </fieldset>

      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddItemForm;
