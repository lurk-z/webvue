import express from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 3001
const dataDirectory = path.join(__dirname, 'data')
const dataFile = path.join(dataDirectory, 'submissions.json')

app.use(express.json())

app.use((request, response, next) => {
  const origin = request.headers.origin

  if (origin) {
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Vary', 'Origin')
  }

  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (request.method === 'OPTIONS') {
    return response.sendStatus(204)
  }

  return next()
})

async function ensureDataFile() {
  await fs.mkdir(dataDirectory, { recursive: true })

  try {
    await fs.access(dataFile)
  } catch {
    await fs.writeFile(dataFile, '[]\n', 'utf8')
  }
}

async function readSubmissions() {
  await ensureDataFile()
  const raw = await fs.readFile(dataFile, 'utf8')
  return JSON.parse(raw)
}

async function saveSubmissions(submissions) {
  await fs.writeFile(dataFile, `${JSON.stringify(submissions, null, 2)}\n`, 'utf8')
}

function normalize(body) {
  return {
    formType: body.formType?.trim() || 'contact',
    name: body.name?.trim() || '',
    email: body.email?.trim() || '',
    phone: body.phone?.trim() || '',
    topic: body.topic?.trim() || '',
    date: body.date?.trim() || '',
    time: body.time?.trim() || '',
    guests: body.guests?.trim() || '',
    occasion: body.occasion?.trim() || '',
    seating: body.seating?.trim() || '',
    pickupTime: body.pickupTime?.trim() || '',
    entree: body.entree?.trim() || '',
    quantity: Number(body.quantity || 0),
    spice: body.spice?.trim() || '',
    extras: Array.isArray(body.extras) ? body.extras.map((item) => String(item)) : [],
    updates: Boolean(body.updates),
    message: body.message?.trim() || '',
  }
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true })
})

app.post('/api/contact', async (request, response) => {
  const payload = normalize(request.body)

  if (!payload.name || !payload.email || !payload.message) {
    return response.status(400).json({ message: 'Please complete all required fields.' })
  }

  if (!isEmail(payload.email)) {
    return response.status(400).json({ message: 'Please provide a valid email address.' })
  }

  const submissions = await readSubmissions()
  const id = `NX-${Date.now()}`

  submissions.push({
    id,
    ...payload,
    createdAt: new Date().toISOString(),
  })

  await saveSubmissions(submissions)

  return response.status(201).json({
    id,
    message: 'Submission saved successfully.',
  })
})

ensureDataFile()
  .then(() => {
    app.listen(port, () => {
      console.log(`API server listening on http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('Failed to start API server', error)
    process.exit(1)
  })
