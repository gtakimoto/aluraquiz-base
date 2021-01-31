import styled from 'styled-components'

const QuizContainer = styled.div`
  width: 30%;
  max-width: 350px;
  padding-top: 45px;
  margin: auto 10%;
  /* margin-left: 10%;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 0px; */
  @media screen and (max-width: 500px) {
    margin: auto;
    padding: 15px;
  }
`;

export default QuizContainer;