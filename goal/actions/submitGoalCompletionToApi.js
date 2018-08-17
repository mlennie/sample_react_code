import { browserHistory } from 'react-router'
import store from '../../../store'
import $ from "jquery";

const submitGoalCompletionToApi = async (data) => {
  return new Promise((resolve, reject) => {
    const web3 = store.getState().web3.web3Instance

    if (typeof web3 !== 'undefined') {

      const coinbase = web3.eth.accounts[0]

      if (!coinbase) {
        const noCoinbaseMsg = "We could not find your account address."
        alert(noCoinbaseMsg)
        reject(noCoinbaseMsg)
      }

      data["coinbase"] = coinbase

      $.ajax({
        url: `/goals/submit-completion`,
        method: "PATCH",
        data: data,
        dataType: "json"
      })
      .done(function(result) {
        resolve(result)
      })
      .fail(function(err) {
        console.error(err)
        reject(err)
      });

    } else {
      const noWeb3Msg = 'Web3 is not initialized.'
      console.error(noWeb3Msg)
      reject(noWeb3Msg)
    }
  })
}

export default submitGoalCompletionToApi
