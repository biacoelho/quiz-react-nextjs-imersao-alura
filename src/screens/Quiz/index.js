/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import { CheckCircle, Dislike } from '@styled-icons/boxicons-regular';
import { Lottie } from '@crello/react-lottie';
import QuizContainer from '../../components/QuizContainer';
import QuizBackground from '../../components/QuizBackground';
import QuizLogo from '../../components/QuizLogo';
import Widget from '../../components/Widget';
import Button from '../../components/Button';
import AlternativesForm from '../../components/AlternativesForm';
import GitHubCorner from '../../components/GitHubCorner';
import BackLinkArrow from '../../components/BackLinkArrow';
import QuizPlayAgain from '../../components/QuizPlayAgain';
import loadingAnimation from './animations/loading.json';
import QuizCorrectAnswersLink from '../../components/QuizCorrectAnswersLink';
import ShareSocialMedia from '../../components/ShareSocialMedia';

const StatusAnswer = styled.span`
  display: flex;
  justify-content: center;
  margin-bottom: -24px;
`;

function ResultWidget({ results }) {
  function getScore() {
    return results.reduce((somatoria, resultadoAtual) => {
      const isAcerto = resultadoAtual === true;
      if (isAcerto) {
        return somatoria + 1;
      }
      return somatoria;
    }, 0);
  }

  function scoreDescription() {
    return results.map((result, index) => (
      <li key={`result__${result}`}>
        {`Pergunta ${index + 1} : `}
        {result ? '✅ acertou' : '❌ errou'}
      </li>
    ));
  }

  return (
    <Widget>
      <Widget.Header>
        <h1>
          <strong>
            🏁
            {' '}
            <i>SUA PONTUAÇÃO :</i>
          </strong>
        </h1>
      </Widget.Header>

      <Widget.Content>
        <h2>
          <strong>
            {`Você acertou ${
              getScore() === 1
                ? `${getScore()} Notícia`
                : `${getScore()} Notícias`
            }`}
          </strong>
        </h2>
        <ul>{scoreDescription()}</ul>
      </Widget.Content>
      <GitHubCorner projectUrl="https://github.com/biacoelho" />
      <ShareSocialMedia />
      <QuizPlayAgain href="/" />
    </Widget>
  );
}

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        <strong>JÁ VAI COMEÇAR</strong>
      </Widget.Header>

      <Widget.Content style={{ display: 'flex', justifyContent: 'center' }}>
        <Lottie
          width="200px"
          height="200px"
          className="lottie-container basic"
          config={{
            animationData: loadingAnimation,
            loop: true,
            autoplay: true,
          }}
        />
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  totalQuestions,
  questionIndex,
  onSubmit,
  addResult,
}) {
  const [selectedAlternative, setSelectedAlternative] = React.useState(
    undefined,
  );
  const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;

  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>{`Pergunta ${questionIndex + 1} de ${totalQuestions}`}</h3>
      </Widget.Header>

      <img
        src={question.image}
        alt=""
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
      />

      <Widget.Content>
        <h2>{question.title}</h2>
        <p>{question.description}</p>
      </Widget.Content>

      <AlternativesForm
        onSubmit={(infosDoEvento) => {
          infosDoEvento.preventDefault();
          setIsQuestionSubmited(true);
          setTimeout(() => {
            addResult(isCorrect);
            onSubmit();
            setIsQuestionSubmited(false);
            setSelectedAlternative(undefined);
          }, 3 * 1000);
        }}
      >
        {question.alternatives.map((alternative, alternativeIndex) => {
          const alternativeId = `alternative__${alternativeIndex}`;
          const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
          const isSelected = selectedAlternative === alternativeIndex;

          return (
            <Widget.Topic
              as="label"
              htmlFor={alternativeId}
              key={alternativeId}
              data-selected={isSelected}
              data-status={isQuestionSubmited && alternativeStatus}
            >
              <input
                name={questionId}
                type="radio"
                id={alternativeId}
                onChange={() => setSelectedAlternative(alternativeIndex)}
                checked={false}
              />
              {alternative}
            </Widget.Topic>
          );
        })}

        {isQuestionSubmited && isCorrect && (
          <StatusAnswer style={{ color: '#68DF03' }}>
            <CheckCircle size={32} title="Right Answer" />
          </StatusAnswer>
        )}

        {isQuestionSubmited && !isCorrect && (
          <StatusAnswer style={{ color: '#9C0614' }}>
            <Dislike size={32} title="Wrong Answer" />
          </StatusAnswer>
        )}

        <Button type="submit" disabled={!hasAlternativeSelected}>
          Confirmar →
        </Button>
      </AlternativesForm>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

function QuizPage({ externalQuestions, externalBg }) {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [results, setResults] = React.useState([]);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = externalQuestions[questionIndex];
  const totalQuestions = externalQuestions.length;
  const bg = externalBg;

  function addResult(result) {
    setResults([...results, result]);
  }

  React.useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 2000);
  }, []);

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
            addResult={addResult}
          />
        )}
        {screenState === screenStates.LOADING && <LoadingWidget />}
        {screenState === screenStates.RESULT && (
          <>
            <ResultWidget results={results} />
            <QuizCorrectAnswersLink />
          </>
        )}
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/biacoelho" />
    </QuizBackground>
  );
}

export default QuizPage;
