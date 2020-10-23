import axios from 'axios';
import { FETCH_USER } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
    // First send token to our backend to process payment
    const res = await axios.post('/api/stripe', token);
    // The server responds with the updated user object (showing updated credits)
    dispatch({ type: FETCH_USER, payload: res.data });
  };