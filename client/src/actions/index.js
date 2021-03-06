 

import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  // Verify the user is logged in
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
  // First send token to our backend to process payment
  const res = await axios.post('/api/stripe', token);
  // The server responds with the updated user object (showing updated credits)
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitSurvey = (values, history) => async dispatch => {

  const res = await axios.post('/api/surveys', values);
  history.push('/surveys');
  // Update user with 1 less credit bc survey was made
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchSurveys = () => async dispatch => {
  const res = await axios.get('/api/surveys');

  dispatch({ type: FETCH_SURVEYS, payload: res.data });
};