import React, { Component } from 'react'
import { browserHistory  } from 'react-router';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TimeHelpers from '../../../../util/time-helpers'

class GoalListItemComponent extends Component {

  constructor(props) {
    super(props)
  }

  goToDetailsPage() {
    browserHistory.push(`/goal-details/${this.props.id}`)
  }

  render() {
    const goal = this.props.goal
    const web3 = this.props.web3
    return (
      <ListItem key={this.props.id}
                divider={!this.props.lastOne}
                onClick={this.goToDetailsPage.bind(this)} button>
        <ListItemText primary="Deadline" secondary={TimeHelpers.formatTime(goal.endTime)} />
        <ListItemText primary="Location" secondary={goal.formattedAddress.substring(0,25) + "..."} />
      </ListItem>
    )
  }
}

export default GoalListItemComponent;
