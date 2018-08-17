import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import Button from '@material-ui/core/Button';
import Geolocation from '../../../../ui/geolocation/component'
import { signGoalFinishSig } from '../../actions/signFinishSig'
import submitGoalCompletionToApi from '../../actions/submitGoalCompletionToApi'
import { withStyles  } from '@material-ui/core/styles';
import styles from './styles.css'
import GoalDialog from '../GoalDialog/component.js'
import TermsDialog from '../../../../layouts/Terms/Dialog/component'
import Alert from '../../../../ui/snackbar/component'
import CircularProgress from '@material-ui/core/CircularProgress';
import { initiateData } from '../../../common/actions/initiateData'

class GoalFinishButtonComponent extends Component {

  constructor(props) {
    super(props)

    this.child = React.createRef();

    this.state = {
      askForGeolocation: false,
      showGeolocationDeniedMessage: false,
      currentLatitude: null,
      currentLongitude: null,
      dialogOpen: false,
      termsOpen: false,
      showSpinner: false,
      showError: false,
      errorMsg: "",
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
    let errMsg = "There was an issue completing deposit"
    if (error.message) { errMsg = errMsg + ": " + error.message }
    alert(errMsg)
    this.setState({
      showError: true,
      depositErrorMsg: errMsg
    })
  }

  getLatLng() {
    return this.child.current.getLocation()
  }

  async completeGoalAfterConfirmation() {
    this.setState({
      dialogOpen: false,
      showSpinner: true,
      showAcceptTransactionMsg: true
    })

    // get lat lng
    await this.getLatLng()
    let data = {
      goalId: this.props.goal.id,
      currentLatitude: this.state.currentLatitude,
      currentLongitude: this.state.currentLongitude
    }
    // Create Signature
    let result = null
    try {
      result = await signGoalFinishSig(data)
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

    // Send data to api
    try {
      await submitGoalCompletionToApi(data)
      await initiateData()
      browserHistory.push(`/goal-details/${String(this.props.goal.id)}?complete=true`)
    } catch(error) {
      console.error(error)
      this.setState({
        showSpinner: false,
        showAcceptTransactionMsg: false,
        showError: true,
        errorMsg: "Goal could not be completed. Please make sure you are within 100 feet of goal location"
      })
      return false
    }
  }

  async handleFormSubmit() {
    if (this.state.showSpinner) {return}
    this.setState({dialogOpen: true})
  }


  render() {
    const goal = this.props.goal
    return (
      <div>
        <Geolocation ref={this.child}
                     updateFormInfo={this.updateFormInfo.bind(this)}/>
        { goal &&
          goal.status === "pending" &&
          !this.state.askForGeolocation &&
          !this.state.showGeolocationDeniedMessage &&
          this.state.currentLatitude && this.state.currentLongitude &&
          <div>
            <Button variant="outlined"
                    id="goalFinishButton"
                    color="primary"
                    onClick={this.handleFormSubmit.bind(this)}>
              Tap me when goal destination is reached
            </Button>
            <br />
            <br />
            {this.state.showSpinner &&
              <CircularProgress/>
            }
          </div>
        }
        <GoalDialog confirmFunction={this.completeGoalAfterConfirmation.bind(this)}
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

export default withStyles(styles)(GoalFinishButtonComponent);
