import React from 'react'
import { ThemeProvider } from 'styled-components'
import QuizScreen from '../../src/screens/Quiz'

export default function QuizDaGalera({ dbExterno }) {

    return (
        <ThemeProvider theme={dbExterno.theme}>
            <QuizScreen 
                externalQuestions={dbExterno.questions} 
                externalBg={dbExterno.bg}
            />
        </ThemeProvider>
    )
}

export async function getServerSideProps(context) {
    const [projectName, gitHubUser] = context.query.id.split('___')

    const dbExterno = await fetch(`https://${projectName}.${gitHubUser}.vercel.app/api/db`)
        .then((serverResponse) => {
            if (serverResponse.ok) {
                return serverResponse.json()
            }
            throw new Error('Falha ao obter os dados')
        })
        .then((serverResponseObject) => serverResponseObject)
        .catch((err) => console.log(err))

    return {
        props: {
            dbExterno
        }
    }
}