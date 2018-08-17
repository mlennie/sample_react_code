import { connect } from 'react-redux'
import newGoal from './new'

const mapStateToProps = (state, ownProps) => {
  return {
    usableBalance: parseFloat(state.account.usable_balance),
    web3: state.web3,
    web3Instance: state.web3.web3Instance
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

const newGoalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(newGoal)

export default newGoalContainer
