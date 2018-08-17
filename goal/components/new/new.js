import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import moment from 'moment';
import { Link } from 'react-router'
import { withStyles  } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import store from '../../../../store'
import Geolocation from '../../../../ui/geolocation/component'
import DeadlineFields from '../../../../ui/deadlineField/component'
import AmountToChargeField from '../../../../ui/amountToChargeField/component'
import AddressField from '../../../../ui/address/addressField/addressField'
import { signGoalSig } from '../../actions/signSig'
import submitNewGoalDataToApi from '../../actions/submitGoalData'
import BackButton from '../../../../ui/backButton/backButton'
import styles from './new.css'
import withWeb3Check from '../../../../ui/wrappers/withWeb3Check'
import withOnboarding from '../../../../ui/wrappers/withOnboarding'
import GoalDialog from '../GoalDialog/component.js'
import TermsDialog from '../../../../layouts/Terms/Dialog/component'
import Alert from '../../../../ui/snackbar/component'
import CircularProgress from '@material-ui/core/CircularProgress';
import { initiateData } from '../../../common/actions/initiateData'

class NewGoal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      formattedAddress: null,
      latitude: null,
      longitude: null,
      askForGeolocation: false,
      showGeolocationDeniedMessage: false,
      amount: null,
      endTimeHuman: null,
      endTimeUnix: null,
      currentLatitude: null,
      currentLongitude: null,
      showError: false,
      errorMsg: "",
      dialogOpen: false,
      termsOpen: false,
      showSpinner: false,
      showAcceptTransactionMsg: false,
      gotResponse: false,
    }
  }

  updateFormInfo(infoToUpdate) {
    this.setState(infoToUpdate)
  }

  handleAlertClose(alertType) {
    this.setState({[alertType]: false})
  }

  closeDialog() {
    this.setState({dialogOpen: false})
  }

  showTerms() {
    this.setState({
      dialogOpen: false,
      termsOpen: true
    })
  }

  closeTerms() {
    this.setState({
      dialogOpen: true,
      termsOpen: false
    })
  }

  closeSuccessDialog() {
    this.setState({
      successDialogOpen: false
    })
    return browserHistory.push('/')
  }

  showError(error) {
    let errMsg = "There was an issue creating goal"
    if (error.message) { errMsg = errMsg + ": " + error.message }
    alert(errMsg)
    this.setState({
      showError: true,
      depositErrorMsg: errMsg
    })
  }

  validateFormData() {
    const {
      formattedAddress,
      latitude,
      longitude,
      amount,
      endTimeHuman,
      endTimeUnix
    } = this.state;

    const rawUsableBalance = this.props.usableBalance
    const usableBalanceString = this.props.web3Instance
                                    .fromWei(rawUsableBalance, "ether")
    const usableBalance = parseFloat(usableBalanceString)

    let errorMsg = false

    if (!formattedAddress || !latitude || !longitude) {
      errorMsg = "Valid Address Required"
    } else if (!endTimeHuman) {
      errorMsg = "Deadline Required"
    } else if (endTimeUnix <= moment(new Date()).unix()) {
      errorMsg = "Deadline must be later than now"
    } else if (!amount) {
      errorMsg = "Amount Required"
    } else if (isNaN(usableBalance) || (parseFloat(amount) > usableBalance)) {
      errorMsg = "The amount you entered is greater than your current usable" +
            " balance. Please lower amount or deposit more funds."
    }

    if (errorMsg) {
      this.setState({
        showError: true,
        errorMsg: errorMsg
      })
      return false
    } else {
      return true
    }

  }

  async createGoalAfterConfirmation() {
    this.setState({
      dialogOpen: false,
      showSpinner: true,
      showAcceptTransactionMsg: true
    })

    // create sig
    const { endTimeHuman, endTimeUnix, amount, formattedAddress,
            latitude, longitude } = this.state
    const data = {
      startTimeHuman: new Date(),
      startTimeUnix: moment(new Date()).unix(),
      endTimeHuman: endTimeHuman,
      endTimeUnix: endTimeUnix,
      amount: amount,
      formattedAddress: formattedAddress,
      latitude: latitude,
      longitude: longitude
    }

    // Create Signature
    let result = null
    try {
      result = await signGoalSig(data)
    } catch(error) {
      alert("There was an issue signing signature: " + error.message)
      this.setState({
        showSpinner: false,
        showAcceptTransactionMsg: false,
      })
      return false
    }
    if (!result) {
      alert("There was an issue signing signature")
      this.setState({
        showSpinner: false,
        showAcceptTransactionMsg: false,
      })
      return false
    }
    data.signature = result
    alert("Signature Received")
    this.setState({showAcceptTransactionMsg: false})

    try {
      const response = await submitNewGoalDataToApi(data)
      await initiateData()
      browserHistory.push(`/goal-details/${response.id}?success=true`)
    } catch(error) {
      console.error(error)
      this.setState({
        showSpinner: false,
        showAcceptTransactionMsg: false,
        showError: true,
        errorMsg: "Goal could not be created. Please try again soon."
      })
      return false
    }
  }

  async handleFormSubmit() {
    this.setState({showError: false})
    // validate fields
    if (this.validateFormData()) {
      this.setState({
        dialogOpen: true,
        inputError: false
      })
    }
  }

  render() {
    const web3 = this.props.web3Instance

    return(
      <div id="padLayout">
        <BackButton/>
        <Typography variant="subheading" gutterBottom>
          Add a Goal
        </Typography>
        {this.state.showSpinner &&
          <CircularProgress/>
        }
        <Geolocation updateFormInfo={this.updateFormInfo.bind(this)}/>
        { !this.state.askForGeolocation &&
          !this.state.showGeolocationDeniedMessage &&
          this.state.currentLatitude && this.state.currentLongitude &&
          <div>
            <AddressField updateFormInfo={this.updateFormInfo.bind(this)}
                          currentLatitude={this.state.currentLatitude}
                          currentLongitude={this.state.currentLongitude}/>
            <DeadlineFields updateFormInfo={this.updateFormInfo.bind(this)}/>
            <AmountToChargeField updateFormInfo={this.updateFormInfo.bind(this)}/>
            <div>
              <Button id="goalSubmitButton" variant="outlined" color="primary"
                      onClick={this.handleFormSubmit.bind(this)}>
                Submit
              </Button>
            </div>
            {this.state.showSpinner &&
              <CircularProgress/>
            }

          </div>
        }
        <GoalDialog confirmFunction={this.createGoalAfterConfirmation.bind(this)}
                       showTerms={this.showTerms.bind(this)}
                       closeDialog={this.closeDialog.bind(this)}
                       open={this.state.dialogOpen} />
        <TermsDialog closeDialog={this.closeTerms.bind(this)}
                     open={this.state.termsOpen} />
        <Alert type="info"
               open={this.state.showAcceptTransactionMsg}
               duration={120000}
               handleClose={this.handleAlertClose.bind(this, "showAcceptTransactionMsg")}
               message="ATTENTION: We are waiting to receive the confirmation signature. You must open Metamask and sign the signature proving you are the account owner" />

        <Alert type="error"
               open={this.state.showError}
               handleClose={this.handleAlertClose.bind(this, "showError")}
               message={this.state.errorMsg} />

      </div>
    )
  }
}

export default withOnboarding(withWeb3Check(withStyles(styles)(NewGoal)));
