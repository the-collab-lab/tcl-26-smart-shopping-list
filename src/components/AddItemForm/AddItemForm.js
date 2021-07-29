import { useState } from 'react';
import { db } from '../../lib/firebase.js';
import { useCollection } from 'react-firebase-hooks/firestore';

const AddItemForm = ({ listId }) => {
  const defaultFormValues = {
    itemName: '',
    purchaseInterval: '7',
  };

  const [formValues, setFormValues] = useState(defaultFormValues);
  const [inputMessage, setInputMessage] = useState('Sheila is great');

  const isItemDuplicate = (item, array) => {
    // TODO: Potential to remove all spaces in item and items in array
    const itemToCompare = item.toLowerCase().trim(); // transform and remove leading and/or trailing whitespace

    // if .indexOf returns -1, the item does not exist in array, aka it's not a duplicate, aka false
    return array.indexOf(itemToCompare) === -1 ? false : true;
  };

  const addItemToDatabase = async () => {
    const newItem = {
      ...formValues,
      purchaseInterval: Number(formValues.purchaseInterval),
      lastPurchaseDate: null,
      numberOfPurchases: 0,
    };

    try {
      await db.collection(`lists/${listId}/items`).add(newItem); // add item to Firestore database
      setFormValues(defaultFormValues); // after saving to database, reset form values to defaults
    } catch (err) {
      console.log(err);
    }
  };

  // generic function updates formValues state for any of the below form inputs
  const handleChange = (event) => {
    const inputName = event.target.name;
    setFormValues({ ...formValues, [inputName]: event.target.value });
  };

  // on form submit, add user input and other default values to database
  const handleSubmit = async (event) => {
    event.preventDefault();

    // check if itemName already exists in Firestore
    try {
      // get array of listItems from Firestore
      await db
        .collection(`lists/${listId}/items`)
        .get()
        .then(async (querySnapshot) => {
          // create array (dbItemArray) by returning itemNames from Firestore response (querySnapshot)
          let dbItemArray = querySnapshot.docs.map((doc) => {
            return doc.data().itemName;
          });

          const duplicateResult = isItemDuplicate(
            formValues.itemName,
            dbItemArray,
          );

          // if item exists, show error message, otherwise, continue with adding to database
          if (duplicateResult === true) {
            setInputMessage('Item already exists in Shopping List');
          } else {
            addItemToDatabase();
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form name="addItemForm" onSubmit={handleSubmit} className="add-item-form">
      <label
        className="add-item-form__label add-item-form__label_type_text label"
        htmlFor="itemName"
      >
        Item name:
      </label>
      <input
        className="add-item-form__text-field text-field"
        type="text"
        id="itemName"
        name="itemName"
        aria-describedby="itemNameMessage"
        value={formValues.itemName}
        onChange={handleChange}
        maxLength="100"
        required
      />
      <span id="itemNameMessage">{inputMessage}</span>

      <fieldset>
        <legend>How soon will you buy this again?</legend>

        <input
          type="radio"
          id="soonOption"
          className="add-item-form__radio"
          name="purchaseInterval"
          value="7"
          onChange={handleChange}
          checked={formValues.purchaseInterval === '7'}
        />
        <label
          htmlFor="soonOption"
          className="add-item-form__label add-item-form__label_type_radio label"
        >
          Soon
        </label>

        <input
          type="radio"
          className="add-item-form__radio"
          id="kindaSoonOption"
          name="purchaseInterval"
          value="14"
          onChange={handleChange}
          checked={formValues.purchaseInterval === '14'}
        />
        <label
          htmlFor="kindaSoonOption"
          className="add-item-form__label add-item-form__label_type_radio label"
        >
          Kind of Soon
        </label>

        <input
          type="radio"
          className="add-item-form__radio"
          id="notSoonOption"
          name="purchaseInterval"
          value="30"
          onChange={handleChange}
          checked={formValues.purchaseInterval === '30'}
        />
        <label
          htmlFor="notSoonOption"
          className="add-item-form__label add-item-form__label_type_radio label"
        >
          Not Soon
        </label>
      </fieldset>

      <button type="submit" className="add-item-form__submit button">
        Add Item
      </button>
    </form>
  );
};

export default AddItemForm;
