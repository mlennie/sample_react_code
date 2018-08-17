import React, { Component } from 'react'
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import GoalListItem from '../list-item/component'

class GoalListComponent extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    let ListItems = (
      <ListItem>
        <ListItemText secondary="No Goals Yet" />
      </ListItem>
    )

    let _this = this
    let lastOne
    const goalKeys = Object.keys(this.props.goals)
    let goal
    let goalId

    if (goalKeys.length > 0) {
      ListItems = goalKeys.map((key) => {
        goal = this.props.goals[key]
        goalId = goal.id
        lastOne = goalKeys[goalKeys.length - 1] === key ? true : false
        return <GoalListItem web3={this.props.web3}
                             goal={goal}
                             pending={this.props.pending}
                             key={goalId}
                             lastOne={lastOne}
                             id={goalId} />
      })
    }

    return(
      <Paper>
        <List>
          {ListItems}
        </List>
      </Paper>
    )
  }
}

export default GoalListComponent
