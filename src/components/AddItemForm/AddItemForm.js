import { useState } from 'react';
import { db } from '../../lib/firebase.js';

const AddItemForm = ({ listId }) => {
  /** Default Values **/
  const defaultFormValues = {
    itemName: '',
    purchaseInterval: '7',
  };

  /** State **/
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [errorMessage, setErrorMessage] = useState('');

  /** Functions **/

  // generic function updates formValues state for any of the below form inputs
  const handleChange = (event) => {
    setErrorMessage(''); // if input field changes, reset error message

    const inputName = event.target.name;
    setFormValues({ ...formValues, [inputName]: event.target.value });
  };

  // on form submit, add user input and other default values to database
  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage(''); // clear any old errors when the form is submitted for accessibility to provide feedback after 1st submission

    // check if itemName already exists in Firestore
    try {
      // get array of listItems from Firestore
      await db
        .collection(`lists/${listId}/items`)
        .get()
        .then(async (querySnapshot) => {
          // create array of normalized item names from Firestore response (querySnapshot)
          const dbItemArray = querySnapshot.docs.map((doc) =>
            normalizeInput(doc.data().itemName),
          );

          // if item exists, show error message, otherwise, continue with adding to database
          if (dbItemArray.includes(normalizeInput(formValues.itemName))) {
            setErrorMessage('Item already exists in Shopping List');
          } else {
            addItemToDatabase();
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  // used when comparing entered item and array of db items for duplicates
  const normalizeInput = (item) => {
    return item.toLowerCase().replace(/\W/g, ''); // remove non-word characters aka remove punctuation and all spaces
  };

  const addItemToDatabase = async () => {
    const newItem = {
      itemName: formValues.itemName.trim(), // remove extra whitespace from itemName to keep data clean
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
        aria-describedby="itemErrorMessage"
        value={formValues.itemName}
        onChange={handleChange}
        maxLength="100"
        required
      />
      <span id="itemErrorMessage">{errorMessage}</span>

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
          className="add-item-form__label add-item-form__label_type_radio label label_check-radio"
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
          className="add-item-form__label add-item-form__label_type_radio label label_check-radio"
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
          className="add-item-form__label add-item-form__label_type_radio label label_check-radio"
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
