import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import db from '../db.json'
import QuizContainer from '../src/components/QuizContainer'
import QuizBackground from '../src/components/QuizBackground'
import QuizLogo from '../src/components/QuizLogo'
import Widget from '../src/components/Widget'
import Footer from '../src/components/Footer'
import GitHubCorner from '../src/components/GitHubCorner'
import Input from '../src/components/Input'
import Button from '../src/components/Button'

export default function Home() {
  const router = useRouter()
  const [name, setName] = React.useState('')

  return (
    <QuizBackground backgroundImage={db.bg}>
      <Head>
        <title>Alura Beer Quiz</title>
      </Head>
      <QuizContainer>
        <QuizLogo />

        <Widget>
          <Widget.Header>
            <h1>{db.title}</h1>
          </Widget.Header>

          <Widget.Content>
            <form onSubmit={(e) => {
              e.preventDefault()
              router.push(`/quiz?nome=${name}`)
            }}>
              <Input type="text" placeholder="Seu nome aqui!" onChange={(e) => setName(e.target.value)} />
              <Button type="submit" disabled={!name.length}>Jogar como '{name.length ? name : '?'}'</Button>
            </form>
          </Widget.Content>
        </Widget>

        <Widget>
          <Widget.Content>
            Seja bem-vindo, {name.length ? name : 'Pinguço(a)'}!
            <br /><br />
            Contribua para aquele suco:
            <br /><br />
            <form action="https://www.paypal.com/donate" method="post" target="_blank"> 
              <input type="hidden" name="business" value="guilhermetakimoto@hotmail.com" />
              <input type="hidden" name="item_name" value="Beer!" />
              <input type="hidden" name="currency_code" value="BRL" />
              <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
              <img alt="" border="0" src="https://www.paypal.com/en_BR/i/scr/pixel.gif" width="1" height="1" />
            </form>

          </Widget.Content>
        </Widget>

        <Widget>
          <Widget.Content>
            <h1>Projetos dos amigos de boteco:</h1>

            <ul>
              {db.external.map((projetoLink) => {
                return (
                  <li key={projetoLink}>
                    <Widget.Topic href={projetoLink}>
                      {projetoLink.replace(/https:\/\//g, '').replace(/.vercel.app/g, '').replace('.', '/')}
                    </Widget.Topic>
                  </li>
                )
              })}
            </ul>
          </Widget.Content>
        </Widget>
        
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl={db.gitHubUrl} />
    </QuizBackground>
  )
}
