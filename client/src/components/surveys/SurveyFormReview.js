// SurveyFormReview shows users their form inputs for review
import _ from 'lodash';
import React, {useState} from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions';

// withrouter allows us to pass in the history object as props
const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {

  const [disableButton, setDisableButton] = useState(false)

  const reviewFields = _.map(formFields, ({ name, label }) => {
    return (
      <div key={name}>
        <label>{label}</label>
        <div>
          {formValues[name]}
        </div>
      </div>
    );
  });

  const onSubmit = () => {
      setDisableButton(true)
      submitSurvey(formValues, history)
  };

  return (
    <div>
      <h5>Please confirm your entries</h5>
      {reviewFields}
      <button
        className="yellow darken-3 white-text btn-flat"
        onClick={onCancel}
      >
        Back
      </button>
      <button
        onClick={onSubmit}
        disabled={disableButton}
        className="green btn-flat right white-text"
      >
        Send Survey
        <i className="material-icons right">email</i>
      </button>
    </div>
  );
};

function mapStateToProps(state) {
  return { formValues: state.form.surveyForm.values };
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));