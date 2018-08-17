import React, { Component } from 'react'
import { withStyles  } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider';
import TimeHelpers from '../../../../util/time-helpers'
import GoalDetailsMap from '../../../../ui/map/component'
import GoalSubmitButton from '../finish-button/component'
import BackButton from '../../../../ui/backButton/backButton'
import styles from './styles.css'
import withWeb3Check from '../../../../ui/wrappers/withWeb3Check'
import withOnboarding from '../../../../ui/wrappers/withOnboarding'
import Alert from '../../../../ui/snackbar/component'

class GoalDetailsComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showSuccess: false,
      successMsg: ""
    }
  }

  componentWillReceiveProps() {
    if (this.props.location.query.success) {
      this.setState({
        showSuccess: true,
        successMsg: "Goal Created. You can do it!"
      })
    }
    if (this.props.location.query.complete) {
      this.setState({
        showSuccess: true,
        successMsg: "Goal Complete. You did it!"
      })
    }
  }

  handleAlertClose(alertType) {
    this.setState({[alertType]: false})
  }

  render() {
    const goal = this.props.goal
    const web3 = this.props.web3
    let formattedStatus
    let chargeDescription
    if (goal.status === "pending") {
      formattedStatus = "In Progress ..."
      chargeDescription = "Pending Ether Charge:"
    } else if (goal.status === "failed") {
      formattedStatus = "Failed"
      chargeDescription = "Ether Charged:"
    } else if (goal.status === "success") {
      formattedStatus = "Completed"
      chargeDescription = "Ether Amount Placed:"
    }
    return (
      <div id="padLayout">
        {goal && web3 &&
          <div>
            <BackButton/>
            <Typography variant="subheading" gutterBottom>
              Goal Details
            </Typography>

            { goal.status === "pending" &&
              <GoalSubmitButton goal={goal} />
            }
            <div id="goal-details-info-section">
              <Typography gutterBottom={true} variant="body1" gutterBottom>
                Status: {formattedStatus}
              </Typography>
              <Divider/>
              <Typography variant="body1" gutterBottom>
                Deadline: {TimeHelpers.formatTime(goal.endTime)}
              </Typography>
              <Divider/>
              <Typography variant="body1" gutterBottom>
                {chargeDescription} {web3.fromWei(goal.amount, "ether")}
              </Typography>
              <Divider/>
              <Typography variant="body1" gutterBottom>
                Address To Reach:
                <br/>
                {goal.formattedAddress}
              </Typography>
              <Divider/>
            </div>
            {goal.latitude &&
              <GoalDetailsMap lat={goal.latitude} lng={goal.longitude}/>
            }

          </div>
        }
        <Alert type="success"
               handleClose={this.handleAlertClose.bind(this, "showSuccess")}
               open={this.state.showSuccess}
               message={this.state.successMsg} />

      </div>
    )
  }
}

export default withOnboarding(withWeb3Check(withStyles(styles)(GoalDetailsComponent)));
