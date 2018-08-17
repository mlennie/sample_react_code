import React, { Component } from 'react'
import { Link } from 'react-router'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import AppBarComponent from '../../../../ui/appBarComponent/appBarComponent';

class GoalDialog extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  handleCancel() {
    this.props.disagreeFunction()
  }

  handleConfirm() {
    this.props.confirmFunction()
  }

  render() {

    const text= "After agreeing, you must open Metamask and sign the signature proving that you own this account."

    const text2 = "By taking this action, you agree to our terms of service. "

    return(
      <div>
        <Dialog
          fullScreen={this.props.fullScreen}
          open={this.props.open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          { this.props.fullScreen &&
            <AppBarComponent />
          }
          <DialogTitle align="center" id="alert-dialog-title">Please Read</DialogTitle>
          <DialogContent>
            <div>
              <DialogContentText id="alert-dialog-description">
                {text}
              </DialogContentText>
              <br />
              <DialogContentText id="alert-dialog-description">
                {text2}
              </DialogContentText>
              <br />
              <Button onClick={this.props.showTerms}
                      fullWidth={true}
                      size="small"
                      color="primary"
                      variant="outlined">
                View Terms of Service
              </Button>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.closeDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.props.confirmFunction} color="primary">
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withMobileDialog()(GoalDialog);
