import React from 'react'
import { ScrollView, Text, Image, View, TouchableOpacity, Modal } from 'react-native'
import { Images } from './DevTheme'
import ButtonBox from './ButtonBox'
import { StackNavigator } from 'react-navigation'
import RoundedButton from '../../App/Components/RoundedButton'

// Styles
import styles from './Styles/PresentationScreenStyles'

const API = 'https://opentdb.com/api.php?amount=10&difficulty=easy&type=boolean'
const getScore = ({
  questions,
  answers
}) => questions.reduce((mem, question, index) =>
  question.correct_answer === answers[index]? mem+1 : mem
, 0)

const diffSecs = (startDate, endDate) => {
  return (endDate.getTime() - startDate.getTime()) / 1000;
}

const getQuestions = () => {
  return fetch(API)
    .then(response => response.json())
    .then(responseJson => {
      return responseJson.results;
    })
    .catch(error => {
      console.error(error);
    });
}

class PresentationScreen extends React.Component {
  state = {
    questions: [],
    answers: {},
  }

  componentWillMount() {
    getQuestions().then((questions) =>
      this.setState({
        questions
      })
    )
  }

  answer = (index, response) => this.setState({
    answers: {
      ...this.state.answers,
      [index]: response,
    },
    showModal: Object.keys(this.state.answers).length+1===this.state.questions.length
  })

  restart = () =>
    getQuestions().then((questions) =>
      this.setState({
        showModal: false,
        answers: {},
        questions,
      })
    )

  render () {
    console.log('rendering', this.props, this.state)
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <TouchableOpacity onPress={this.props.screenProps.toggle} style={{
          position: 'absolute',
          paddingTop: 30,
          paddingHorizontal: 10,
          zIndex: 10
        }}>
          <Image source={Images.closeButton} />
        </TouchableOpacity>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={styles.container}>
          {this.state.questions.map((question, index) => (
            <View key={index}>
              <Text style={styles.sectionText}>
                {question.question}
              </Text>
              <View style={styles.buttonsContainer}>
                <ButtonBox onPress={() => this.answer(index, 'True')} selected={this.state.answers[index]==='True'} style={styles.componentButton} selectedStyle={styles.componentButtonSelected} image={Images.components} text='True' />
                <ButtonBox onPress={() => this.answer(index, 'False')} selected={this.state.answers[index]==='False'} style={styles.usageButton} selectedStyle={styles.usageButtonSelected} image={Images.usageExamples} text='False' />
              </View>
            </View>
          ))}
        </ScrollView>
        <Modal
          visible={this.state.showModal}
          onRequestClose={this.toggleModal}>
            <View style={styles.mainContainer}>
              <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
              <View style={styles.container}>
                {this.state.showModal &&
                  <Text style={styles.scoreText}>
                    Your Score {getScore(this.state)} in
                    {' ' + diffSecs(this.props.screenProps.startTime, new Date())} seconds
                  </Text>
                }
                <RoundedButton onPress={this.restart}>
                  Restart Quiz
                </RoundedButton>
              </View>
            </View>
        </Modal>
      </View>
    )
  }
}

export default StackNavigator({
  PresentationScreen: {screen: PresentationScreen},
}, {
  cardStyle: {
    opacity: 1,
    backgroundColor: '#3e243f'
  },
  initialRouteName: 'PresentationScreen',
  headerMode: 'none',
  // Keeping this here for future when we can make
  navigationOptions: {
    header: {
      left: (
        <TouchableOpacity onPress={() => window.alert('pop')} ><Image source={Images.closeButton} style={{marginHorizontal: 10}} /></TouchableOpacity>
      ),
      style: {
        backgroundColor: '#3e243f'
      }
    }
  }
})
