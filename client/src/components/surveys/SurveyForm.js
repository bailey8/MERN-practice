// SurveyForm shows a form for a user to add input
import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';

class SurveyForm extends Component {
  renderFields() {
    // When you type into a field, redux form takes your input and stores in in the redux store under a key equal to the "name" property in the <Field>

    // Take the label and name out of each field and build a form with it
    return _.map(formFields, ({ label, name }) => {
      return (  
        <Field
          key={name}
          component={SurveyField}
          type="text"
          label={label}
          name={name}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  // This is a function in /utils
  errors.recipients = validateEmails(values.recipients || '');

  // Easy way to check if all fields are filled out
  _.each(formFields, ({ name }) => {
    if (!values[name]) {
      errors[name] = 'You must provide a value';
    }
  });

  // If the error object returned is empty, then redux form assumes the form is valid
  // If a key in this object matches the "name" property of any <Field> component, then redux form will pass the error as a prop to that custom field component
  return errors;
}


// Identicle to how connect works
export default reduxForm({
  validate:validate,
  form: 'surveyForm',
  // This persists form fields even when the form has been unmounted
  destroyOnUnmount: false
})(SurveyForm);