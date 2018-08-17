import { signSig } from '../../../util/signSig'
import store from '../../../store'

exports.signGoalSig = (data) => {

  return new Promise((resolve, reject) => {

    const web3 = store.getState().web3.web3Instance

  	var msgParams = [
    	{
      	type: "string",
      	name: "New Goal!",
      	value: "Reach location on time"
    	},
    	{
      	type: "string",
      	name: "Start time",
      	value: String(data.startTimeHuman)
    	},
    	{
      	type: "string",
      	name: "End time",
      	value: String(data.endTimeHuman)
    	},
    	{
      	type: "string",
      	name: "Amount to charge in Ether if goal not met",
      	value: String(data.amount)
    	},
    	{
      	type: "string",
      	name: "Address to reach",
      	value: data.formattedAddress
    	},
    	{
      	type: "string",
      	name: "Terms and Conditions",
      	value: "If location is not reached before goal end time then the" +
               " specified amount to charge will be deducted from account" +
               " balance. By submitting and creating this signature," +
               " you agree to these terms."
    	}
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

