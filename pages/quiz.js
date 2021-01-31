import React from 'react'
import db from '../db.json'
import Widget from '../src/components/Widget'
import QuizLogo from '../src/components/QuizLogo'
import QuizBackground from '../src/components/QuizBackground'
import QuizContainer from '../src/components/QuizContainer'
import Button from '../src/components/Button'
import AltenativesForm from '../src/components/AltenativesForm'

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

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        <img src={db.loading_image} width="150px" />
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
  const questionId = `question__${questionIndex}`
  const [questionImage, setQuestionImage] = React.useState(question.image)
  const [selectedAlternative, setSelectedAlternative] = React.useState(undefined)
  const [isQuestionSubmitted, setIsQuestionSubmitted] = React.useState(false)
  const hasAlternativeSelected = selectedAlternative !== undefined
  const alternativeAnswer = selectedAlternative === question.answer

  return (
    <Widget>
      <Widget.Header>
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
              setSelectedAlternative(undefined)
              onSubmit()
              setIsQuestionSubmitted(false)
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

export default function QuizPage() {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING)
  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [results, setResults] = React.useState([])
  const totalQuestions = db.questions.length
  const questionIndex = currentQuestion
  const question = db.questions[questionIndex]
  const correctAnswer = db.questions[questionIndex].answer

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
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
          {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
            correctAnswer={correctAnswer} 
            wrongImage={db.answer_images.wrong} 
            correctImage={db.answer_images.correct}
            addResult={addResult}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && <ResultWidget results={results} />}
      </QuizContainer>
    </QuizBackground>
  )
}