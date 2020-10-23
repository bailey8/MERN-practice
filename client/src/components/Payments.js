import React, { Component } from "react";
import StripeCheckout from "react-stripe-checkout";
import { connect } from "react-redux";
import * as actions from "../actions";

class Payments extends Component {
  render() {
    return (
      <StripeCheckout
        name="Emaily"
        description="$5 for 5 email credits"
        // 500 cents = 5 dollars
        amount={500}
        token={(token) => this.props.handleToken(token)}
        // This handles the token we get back from stripe
        stripeKey={process.env.REACT_APP_STRIPE_KEY}
      >

        {/* This replaces the default ugly stripe button*/}
        <button className="btn">Add Credits</button>
      </StripeCheckout>
    );
  }
}

export default connect(null, actions)(Payments);

// export const handleToken = token => async dispatch => {
//     const res = await axios.post('/api/stripe', token);

//     dispatch({ type: FETCH_USER, payload: res.data });
//   };
