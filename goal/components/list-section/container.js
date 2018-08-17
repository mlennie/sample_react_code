import { connect } from 'react-redux'
import GoalListSectionComponent from './component'

const mapStateToProps = (state, ownProps) => {

  let pendingGoals = {}
  let nonPendingGoals = {}
  let goal

  if (state.goals && Object.keys(state.goals).length > 0) {
    const keys = Object.keys(state.goals)
    for (let i = 0; i < keys.length; i++) {
      goal = state.goals[keys[i]]
      if (goal["status"] === "pending") {
        pendingGoals[keys[i]] = goal
      } else {
        nonPendingGoals[keys[i]] = goal
      }
    }
  }

  return {
    pendingGoals: pendingGoals,
    nonPendingGoals: nonPendingGoals,
    web3: state.web3.web3Instance
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

const GoalListSectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GoalListSectionComponent)

export default GoalListSectionContainer
