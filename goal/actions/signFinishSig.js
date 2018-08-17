import { signSig } from '../../../util/signSig'
import store from '../../../store'

exports.signGoalFinishSig = (data) => {

  return new Promise((resolve, reject) => {

    const web3 = store.getState().web3.web3Instance

  	var msgParams = [
    	{
      	type: "string",
      	name: "Goal Submit",
      	value: "I made it!"
    	},
  	];

    if (web3) {
      signSig(msgParams, web3.eth.accounts[0], (err, sig) => {
        if (err) { reject(err) }
        resolve(sig)
      });
    } else {
      reject("Could not find web3")
    }
  })
}

