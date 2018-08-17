import { connect } from 'react-redux'
import GoalDetailsComponent from './component'
import _ from 'lodash'

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.params.id
  const goal = state.goals[_.findKey(state.goals, {'id': +id})] || {}
  return {
    goal: goal,
    web3: state.web3.web3Instance
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

const GoalDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GoalDetailsComponent)

export default GoalDetailsContainer
