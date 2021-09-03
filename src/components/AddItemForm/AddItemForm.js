import { useState, useRef, useEffect } from 'react';

import firebase from 'firebase/app';

import './AddItemForm.css';

const AddItemForm = ({ db, listId, listItems, showAddItem }) => {
  /** Default Values **/
  const defaultFormValues = {
    itemName: '',
    purchaseInterval: '7',
  };

  /** Form State Variables and Refs **/
  const [formValues, setFormValues] = useState(defaultFormValues);
  const itemNameRef = useRef(); // ref for the item name field
  const [addItemFormError, setAddItemFormError] = useState('');
  const [itemErrorMessage, setItemErrorMessage] = useState('');

  /** Functions **/

  // generic function updates formValues state for any of the below form inputs
  const handleChange = (event) => {
    // if input field changes, reset error messages
    setAddItemFormError('');
    setItemErrorMessage('');

    const inputName = event.target.name;
    setFormValues({ ...formValues, [inputName]: event.target.value });
  };

  // on form submit, add user input and other default values to database
  const handleSubmit = async (event) => {
    event.preventDefault();

    // clear any old errors when the form is submitted for accessibility to provide feedback after 1st submission
    setAddItemFormError('');
    setItemErrorMessage('');

    // check if itemName already exists in Firestore
    const itemNames = listItems.docs.map((doc) =>
      normalizeInput(doc.data().itemName),
    );

    // if item exists, show error message and put focus on field
    // otherwise, continue with adding to database
    if (itemNames.includes(normalizeInput(formValues.itemName))) {
      setItemErrorMessage('Item already exists in Shopping List.');
      itemNameRef.current.focus();
    } else {
      addItemToDatabase();
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
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    try {
      await db.collection(`lists/${listId}/items`).add(newItem); // add item to Firestore database
      setFormValues(defaultFormValues); // after saving to database, reset form values to defaults
    } catch (err) {
      console.error(err);
      setAddItemFormError(
        'Sorry, there was a problem adding your item. Please check your connection and try again.',
      );
    }
  };

  useEffect(() => {
    if (showAddItem) itemNameRef.current.focus();
  }, [showAddItem]);

  return (
    <form
      name="addItemForm"
      onSubmit={handleSubmit}
      className={`add-item-form ${showAddItem ? 'add-item-form_open' : ''}`}
      role="region"
      aria-hidden={!showAddItem}
    >
      <h3 className="add-item-form__heading">Add a new item</h3>
      <div
        role="alert"
        className={`error error_type_summary ${
          addItemFormError ? 'error_on' : ''
        }`}
      >
        {addItemFormError}
      </div>

      <label
        className="add-item-form__label add-item-form__label_type_text label"
        htmlFor="itemName"
      >
        Item name:
      </label>
      <input
        ref={itemNameRef}
        className={`add-item-form__text-field text-field text-field_mode_dark ${
          itemErrorMessage ? 'text-field_has-error' : ''
        }`} // errorMessage ternary adds className
        type="text"
        id="itemName"
        name="itemName"
        aria-describedby="itemErrorMessage"
        aria-invalid={Boolean(itemErrorMessage)} // aria-invalid helps screenreader indicate invalid field
        value={formValues.itemName}
        onChange={handleChange}
        maxLength="100"
        required
      />
      <div
        id="itemErrorMessage"
        className={`error error_type_field ${
          itemErrorMessage ? 'error_on' : ''
        }`}
      >
        {itemErrorMessage}
      </div>

      <fieldset className="fieldset fieldset_type_check-radio add-item-form__options">
        <legend className="legend legend_type_check-radio add-item-form__option-legend">
          How soon will you need to buy this again?
        </legend>

        <div className="fieldset__check-radio-group">
          <input
            type="radio"
            id="soonOption"
            className="radio"
            name="purchaseInterval"
            value="7"
            onChange={handleChange}
            checked={formValues.purchaseInterval === '7'}
          />
          <label htmlFor="soonOption" className="label label_type_check-radio">
            soon
          </label>

          <input
            type="radio"
            className="radio"
            id="kindOfSoonOption"
            name="purchaseInterval"
            value="14"
            onChange={handleChange}
            checked={formValues.purchaseInterval === '14'}
          />
          <label
            htmlFor="kindOfSoonOption"
            className="label label_type_check-radio"
          >
            kind of soon
          </label>

          <input
            type="radio"
            className="radio"
            id="notSoonOption"
            name="purchaseInterval"
            value="30"
            onChange={handleChange}
            checked={formValues.purchaseInterval === '30'}
          />
          <label
            htmlFor="notSoonOption"
            className="label label_type_check-radio"
          >
            not soon
          </label>
        </div>
      </fieldset>

      <button
        type="submit"
        className="add-item-form__submit button button_type_primary button_mode_dark"
      >
        Add Item
      </button>
    </form>
  );
};

export default AddItemForm;
