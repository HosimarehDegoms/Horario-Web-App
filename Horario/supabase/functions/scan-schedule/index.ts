// Reference implementation — NOT deployed yet.
//
// This is the server-side counterpart to src/services/scanner/scannerService.ts.
// The frontend currently talks to a temporary in-memory mock there (see that
// file for why) because no Supabase project has been created for this app
// yet. Once one exists, deploy this function with `supabase functions deploy
// scan-schedule` and point scannerService.scanScheduleFile at its URL —
// nothing else in the app needs to change, since the mock and this function
// return the same shape: a validated array of scanned schedule entries.
//
// Required Supabase secrets (`supabase secrets set ...`):
//   OPENAI_API_KEY       - never exposed to the frontend
//   OPENAI_VISION_MODEL  - optional, defaults to DEFAULT_MODEL below; confirm
//                          the current recommended OpenAI vision model name
//                          against OpenAI's docs at deploy time, since model
//                          names change over time.
//
// Known limitation: PDF uploads are accepted by the frontend's file picker
// (see constants/scanner.ts) but this function only forwards images to
// OpenAI. OpenAI's Chat Completions vision input accepts JPEG/PNG/WEBP, not
// raw PDF bytes. Before enabling PDF scanning end-to-end, add a PDF -> image
// conversion step (e.g. render the first page client-side with pdf.js before
// upload, or rasterize it here) and pass the resulting image to
// callOpenAiVision. Uploading a PDF today will return a 400 explaining this.

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const DEFAULT_MODEL = 'gpt-4o'
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

declare const Deno: {
  serve(handler: (req: Request) => Response | Promise<Response>): void
  env: { get(key: string): string | undefined }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const apiKey = Deno.env.get('OPENAI_API_KEY')
  if (!apiKey) {
    return jsonResponse({ error: 'Server is not configured for schedule scanning yet.' }, 500)
  }

  let file: File
  try {
    const formData = await req.formData()
    const uploaded = formData.get('file')
    if (!(uploaded instanceof File)) {
      return jsonResponse({ error: 'No file uploaded.' }, 400)
    }
    file = uploaded
  } catch {
    return jsonResponse({ error: 'Could not read the uploaded file.' }, 400)
  }

  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    return jsonResponse(
      { error: 'Unsupported file type for scanning yet. Please upload a JPG, PNG, or WEBP image.' },
      400,
    )
  }
  if (file.size === 0 || file.size > MAX_FILE_SIZE_BYTES) {
    return jsonResponse({ error: 'File is empty or exceeds the 10MB limit.' }, 400)
  }

  let rawEntries: unknown
  try {
    rawEntries = await callOpenAiVision(file, apiKey)
  } catch (error) {
    console.error('OpenAI vision call failed', error)
    return jsonResponse({ error: 'AI extraction failed. Please try again.' }, 502)
  }

  const entries = parseScannedEntries(rawEntries)
  return jsonResponse({ entries }, 200)
})

async function callOpenAiVision(file: File, apiKey: string): Promise<unknown> {
  const buffer = await file.arrayBuffer()
  const base64 = toBase64(new Uint8Array(buffer))
  const model = Deno.env.get('OPENAI_VISION_MODEL') || DEFAULT_MODEL

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You extract class/work schedules from timetable images. Respond with strict JSON only, no ' +
            'text outside the JSON object: {"entries": [{"title": string, "dayOfWeek": ' +
            '"monday"|"tuesday"|"wednesday"|"thursday"|"friday"|"saturday"|"sunday"|null, ' +
            '"startTime": "HH:mm"|null, "endTime": "HH:mm"|null, "location": string|null, ' +
            '"notes": string|null, "confidence": number between 0 and 1}]}. ' +
            'Use null for any field you cannot read confidently instead of guessing.',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extract every schedule entry from this image.' },
            { type: 'image_url', image_url: { url: `data:${file.type};base64,${base64}` } },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`)
  }

  const payload = await response.json()
  const content = payload?.choices?.[0]?.message?.content
  if (typeof content !== 'string') {
    throw new Error('Unexpected OpenAI response shape')
  }

  const parsed = JSON.parse(content)
  return parsed?.entries
}

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

// --- Response validation: never trust arbitrary AI-generated JSON. ---
// Kept in sync by hand with src/utils/scanValidation.ts, which runs the same
// checks again on the frontend as defense-in-depth once this function is wired up.

const VALID_DAYS = new Set(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

function parseScannedEntries(raw: unknown): unknown[] {
  if (!Array.isArray(raw)) return []

  const results: unknown[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const candidate = item as Record<string, unknown>
    const title = typeof candidate.title === 'string' ? candidate.title.trim() : ''
    if (!title) continue

    results.push({
      title,
      dayOfWeek:
        typeof candidate.dayOfWeek === 'string' && VALID_DAYS.has(candidate.dayOfWeek) ? candidate.dayOfWeek : null,
      startTime:
        typeof candidate.startTime === 'string' && TIME_PATTERN.test(candidate.startTime)
          ? candidate.startTime
          : null,
      endTime:
        typeof candidate.endTime === 'string' && TIME_PATTERN.test(candidate.endTime) ? candidate.endTime : null,
      location: typeof candidate.location === 'string' ? candidate.location : undefined,
      notes: typeof candidate.notes === 'string' ? candidate.notes : undefined,
      confidence:
        typeof candidate.confidence === 'number' && candidate.confidence >= 0 && candidate.confidence <= 1
          ? candidate.confidence
          : 0,
    })
  }
  return results
}
