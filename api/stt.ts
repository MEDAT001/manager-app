import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { audio, format } = req.body

  if (!audio || typeof audio !== 'string') {
    return res.status(400).json({ error: 'Audio data is required' })
  }

  const apiKey = process.env.DEEPGRAM_API_KEY
  if (!apiKey) {
    console.error('DEEPGRAM_API_KEY not set')
    return res.status(500).json({ error: 'Deepgram API key not configured' })
  }

  const contentType = format === 'mp3' ? 'audio/mpeg' : 'audio/webm'

  console.log('Deepgram STT request:', { format, audioLength: audio.length })

  try {
    const audioBuffer = Buffer.from(audio, 'base64')

    const response = await fetch(
      'https://api.deepgram.com/v1/listen?model=nova-3&language=fr&smart_format=true',
      {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': contentType,
        },
        body: audioBuffer,
      }
    )

    console.log('Deepgram response:', response.status)

    if (!response.ok) {
      const errText = await response.text()
      console.error('Deepgram error:', response.status, errText)
      return res.status(response.status).json({ error: `Deepgram failed: ${response.status}`, detail: errText })
    }

    const data = await response.json()
    const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript || ''

    console.log('Deepgram result:', transcript.substring(0, 50))

    return res.status(200).json({ text: transcript })
  } catch (err) {
    console.error('Deepgram exception:', err)
    return res.status(500).json({ error: 'Failed to reach Deepgram', detail: String(err) })
  }
}
