function setCorsHeaders(request, response) {
  const origin = request.headers.origin

  if (origin) {
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Vary', 'Origin')
  }

  response.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function normalize(body = {}) {
  return {
    formType: String(body.formType || 'contact').trim(),
    name: String(body.name || '').trim(),
    email: String(body.email || '').trim(),
    phone: String(body.phone || '').trim(),
    topic: String(body.topic || '').trim(),
    date: String(body.date || '').trim(),
    time: String(body.time || '').trim(),
    guests: String(body.guests || '').trim(),
    occasion: String(body.occasion || '').trim(),
    seating: String(body.seating || '').trim(),
    pickupTime: String(body.pickupTime || '').trim(),
    entree: String(body.entree || '').trim(),
    quantity: Number(body.quantity || 0),
    spice: String(body.spice || '').trim(),
    extras: Array.isArray(body.extras) ? body.extras.map((item) => String(item)) : [],
    updates: Boolean(body.updates),
    message: String(body.message || '').trim(),
  }
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function handler(request, response) {
  setCorsHeaders(request, response)

  if (request.method === 'OPTIONS') {
    return response.status(204).end()
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed.' })
  }

  const payload = normalize(request.body)

  if (!payload.name || !payload.email || !payload.message) {
    return response.status(400).json({ message: 'Please complete all required fields.' })
  }

  if (!isEmail(payload.email)) {
    return response.status(400).json({ message: 'Please provide a valid email address.' })
  }

  return response.status(201).json({
    id: `VX-${Date.now()}`,
    message: 'Submission received successfully.',
  })
}
