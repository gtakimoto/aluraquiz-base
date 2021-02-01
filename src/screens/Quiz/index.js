import React from 'react'
import db from '../../../db.json'
import Widget from '../../components/Widget'
import QuizLogo from '../../components/QuizLogo'
import QuizBackground from '../../components/QuizBackground'
import QuizContainer from '../../components/QuizContainer'
import Button from '../../components/Button'
import AltenativesForm from '../../components/AltenativesForm'
import BackLinkArrow from '../../components/BackLinkArrow'

function ResultWidget({ results }) {
  return (
    <Widget>
      <Widget.Header>
        Resultado final:
      </Widget.Header>

      <Widget.Content>
        <p>Você acertou {results.filter((x) => x).length} de {results.length} perguntas.</p>
        <ul>
          {results.map((result, resultIndex) => (
            <li key={`result__${result}`}>
              Pergunta #{resultIndex + 1 < 10 ? `0${resultIndex + 1}` : resultIndex + 1}: {result ? 'acertou!' : 'errou!'} 
            </li>
          ))}
        </ul>
      </Widget.Content>
    </Widget>
  )
}

function LoadingWidget({ dbLoadingImage }) {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        <img src={dbLoadingImage !== undefined ? dbLoadingImage : db.loading_image } width="150px" />
      </Widget.Content>
    </Widget>
  )
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  correctAnswer,
  wrongImage,
  correctImage,
  addResult
}) {
  const [selectedAlternative, setSelectedAlternative] = React.useState(undefined)
  const questionId = `question__${questionIndex}`
  const [questionImage, setQuestionImage] = React.useState(question.image)
  const [isQuestionSubmitted, setIsQuestionSubmitted] = React.useState(false)
  const hasAlternativeSelected = selectedAlternative !== undefined
  const alternativeAnswer = selectedAlternative === question.answer

  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={questionImage}
      />
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>

        <AltenativesForm
          onSubmit={(infosDoEvento) => {
            infosDoEvento.preventDefault()
            setIsQuestionSubmitted(true)
            
            setTimeout(() => {
              addResult(alternativeAnswer)
              onSubmit()
              setIsQuestionSubmitted(false)
              setSelectedAlternative(undefined)
            }, 500)

          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`
            const alternativeStatus = alternativeAnswer ? 'SUCCESS' : 'ERROR'
            const isSelected = selectedAlternative === alternativeIndex

            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmitted && alternativeStatus}
                onMouseEnter={() => alternativeIndex == correctAnswer ? setQuestionImage(correctImage) : setQuestionImage(wrongImage) }
                onMouseLeave={() => setQuestionImage(question.image)}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  type="radio"
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                />
                {alternative}
              </Widget.Topic>
            )
          })}

          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>
        </AltenativesForm>
      </Widget.Content>
    </Widget>
  )
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
}

export default function QuizPage({ externalQuestions, externalBg, externalLoading }) {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING)
  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [results, setResults] = React.useState([])
  const totalQuestions = externalQuestions.length
  const questionIndex = currentQuestion
  const question = externalQuestions[questionIndex]
  const correctAnswer = externalQuestions[questionIndex].answer

  function addResult(result) {
    setResults([
      ...results,
      result
    ])
  }

  React.useEffect(() => {
    setTimeout(() => {
        setScreenState(screenStates.QUIZ)
    }, 1 * 1000)
  }, [])

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion)
    } else {
      setScreenState(screenStates.RESULT)
    }
  }

  return (
    <QuizBackground backgroundImage={externalBg}>
      <QuizContainer>
        <QuizLogo />
          {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
            correctAnswer={correctAnswer} 
            wrongImage={externalQuestions.answer_images !== undefined ? externalQuestions.answer_images.wrong : db.answer_images.wrong} 
            correctImage={externalQuestions.answer_images !== undefined ? externalQuestions.answer_images.correct : db.answer_images.correct}
            addResult={addResult}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget dbLoadingImage={externalLoading} />}

        {screenState === screenStates.RESULT && <ResultWidget results={results} />}
      </QuizContainer>
    </QuizBackground>
  )
}