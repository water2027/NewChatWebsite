import process from 'node:process'
// server/api/chat.post.ts
import { defineEventHandler, readBody } from 'h3'
import { OpenAI } from 'openai'

const baseURL = process.env.BASE_URL
const apiKey = process.env.API_KEY

interface EventBody {
  model: string
  messages: {
    role: 'user' | 'assistant'
    content: string
  }[]
}

const client = new OpenAI({
  baseURL,
  apiKey,
})

export default defineEventHandler(async (event) => {
  const { res } = event.node
  const body: EventBody = await readBody(event)
  // res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()
  const { model, messages } = body
  try {
    const response = await client.chat.completions.create({
      model,
      messages,
      stream: true,
    })
    try {
      for await (const chunk of response) {
        const value = chunk.choices[0].delta.content
        value && res.write(chunk.choices[0].delta.content)
      }
    }
    catch (e) {
      console.error(e)
      res.end()
    }
    res.end()
  }
  catch (error) {
    console.error(error)
    event.node.res.statusCode = 500
    return { error: '这个模型暂时用不了:-(试试别的模型吧' }
  }
})
