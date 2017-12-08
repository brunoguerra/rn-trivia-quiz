import React from 'react'
import { View, Modal } from 'react-native'
import DebugConfig from '../../App/Config/DebugConfig'
import RoundedButton from '../../App/Components/RoundedButton'
import PresentationScreen from './PresentationScreen'

export default class DevscreensButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: false,
      startTime: new Date(),
    }
  }

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal,
      startTime: !this.state.showModal? new Date() : this.state.startTime,
    })
  }

  render () {
    if (DebugConfig.showDevScreens) {
      return (
        <View>
          <RoundedButton onPress={this.toggleModal}>
            Start Quiz
          </RoundedButton>
          <Modal
            visible={this.state.showModal}
            onRequestClose={this.toggleModal}>
            <PresentationScreen
              screenProps={{ toggle: this.toggleModal, startTime: this.state.startTime, }}
            />
          </Modal>
        </View>
      )
    } else {
      return <View />
    }
  }
}
