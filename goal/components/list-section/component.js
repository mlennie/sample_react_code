import React, { Component } from 'react'
import GoalList from "../list/component"
import Typography from '@material-ui/core/Typography'
import { withStyles  } from '@material-ui/core/styles';
import styles from './styles.css'

class GoalListSectionComponent extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div>
        <Typography type="display1" gutterBottom>
          Current Goals
        </Typography>
        <GoalList web3={this.props.web3}
                  goals={this.props.pendingGoals}
                  pending={true}/>
        <Typography id="nonPendingGoalList" type="display1" gutterBottom>
          Past Goals
        </Typography>
        <GoalList web3={this.props.web3}
                  goals={this.props.nonPendingGoals}
                  pending={false}/>
      </div>
    )
  }
}

export default withStyles(styles)(GoalListSectionComponent);
