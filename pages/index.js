import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

import db from '../db.json'
import Widget from '../src/components/Widget'
import Link from '../src/components/Link'
import QuizBackground from '../src/components/QuizBackground'
import QuizLogo from '../src/components/QuizLogo'
import QuizContainer from '../src/components/QuizContainer'
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

        <Widget
          as={motion.section}
          transition={{ delay: 0, duration: 0.5 }}
          variants={{
            show: { y: 0, opacity: 1 },
            hidden: { y: '-100%', opacity: 0 }
          }}
          initial="hidden"
          animate="show"
        >
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

        <Widget
          as={motion.section}
          transition={{ delay: 0.5, duration: 0.5 }}
          variants={{
            show: { x: 0, opacity: 1 },
            hidden: { x: '-100%', opacity: 0 }
          }}
          initial="hidden"
          animate="show"
        >
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

        <Widget
          as={motion.section}
          transition={{ delay: 1, duration: 0.5 }}
          variants={{
            show: { x: 0, opacity: 1 },
            hidden: { x: '100%', opacity: 0 }
          }}
          initial="hidden"
          animate="show"
        >
          <Widget.Content>
            <h1>Projetos dos amigos de boteco:</h1>

            <ul>
              {db.external.map((projetoLink) => {
                const [projectName, gitHubUser] = projetoLink
                  .replace(/https:\/\//g, '')
                  .replace(/.vercel.app/g, '')
                  .split('.')

                return (
                  <li key={projetoLink}>
                    <Widget.Topic 
                      as={Link}
                      href={`/quiz/${projectName}___${gitHubUser}`}
                    >
                      {`${gitHubUser}/${projectName}`}
                    </Widget.Topic>
                  </li>
                )
              })}
            </ul>
          </Widget.Content>
        </Widget>
        
        <Footer
          as={motion.footer}
          transition={{ delay: 1.5, duration: 0.5 }}
          variants={{
            show: { y: 0, opacity: 1 },
            hidden: { y: '20%', opacity: 0 }
          }}
          initial="hidden"
          animate="show"
        />
      </QuizContainer>
      <GitHubCorner projectUrl={db.gitHubUrl} />
    </QuizBackground>
  )
}
