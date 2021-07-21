import { useState } from 'react';
import { db } from '../../lib/firebase.js';

const AddItemForm = ({ listId }) => {
  const [formValues, setFormValues] = useState({
    itemName: '',
    purchaseInterval: '7',
  });

  // generic function updates formValues state for any of the below form inputs
  const handleChange = (event) => {
    const inputName = event.target.name;
    setFormValues({ ...formValues, [inputName]: event.target.value });
  };

  // on form submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    const newItem = formValues;
    newItem.purchaseInterval = parseInt(newItem.purchaseInterval); // convert purchaseInterval to integer
    newItem.lastPurchaseDate = null;
    newItem.numberOfPurchases = 0;

    try {
      await db
        .collection('lists')
        .doc(listId)
        .collection('items')
        .add(formValues); // add item to Firestore database
      setFormValues({ itemName: '', purchaseInterval: '7' }); // after saving to db, reset form values to defaults
    } catch (err) {
      console.log(err);
    }
  };

  // ***IMPORTANT: this form won't work without local storage token, and should check for it before allowing someone to add an item
  return (
    <form name="addItemForm" onSubmit={handleSubmit}>
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
