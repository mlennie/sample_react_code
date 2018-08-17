import store from '../../../store'
import $ from "jquery";

export const GET_GOALS = 'GET_GOALS'

function setGoals(goals) {
  return {
    type: GET_GOALS,
    payload: goals
  }
}

export function getGoals(cb) {
  let web3 = store.getState().web3.web3Instance

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    web3.eth.getCoinbase((error, coinbase) => {
      // Log errors, if any.
      if (error) {
        console.error(error);
      }

      $.ajax({
        url: `/goals?ethAddress=${coinbase}`,
        dataType: "json"
      })
      .done(function(result) {
        return store.dispatch(setGoals(result))
        //cb(null);
      })
      .fail(function(err) {
        console.error(err);
        //cb({type: "alert", "Could not find account"});
      });

    })
  } else {
    console.error('Web3 is not initialized.');
  }
}
