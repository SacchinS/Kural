# Kural

AI-powered AAC (Augmentative and Alternative Communication) device for ALS patients — eye tracking + voice cloning + LLM context awareness to restore communication in their own voice.

---

## Team

| Name | GitHub |
|---|---|
| Sacchin Sarav | [@SacchinS](https://github.com/SacchinS) |
| Farid Hassanov | — |
| Christian Madrigal | — |
| Dawit Bekele | — |

---

## Track

**DubHacks — Best Use of AWS**

---

## What Was Built

### AAC Interface (`/aac`)
- Full-screen tile-based communication board with 3-level category hierarchy (L1 → L2 → L3 → sentences)
- Eye-tracking dwell selection — hover a tile for 2.5 seconds to select, with an SVG progress ring as visual feedback
- AI-generated contextual sentences via Amazon Bedrock (Claude), tailored to the patient's intent path and conversation history
- Sentence regeneration with nudge prompts ("More formal", "Shorter", etc.)
- Yes/No and Quick Phrase boards for instant responses
- Keyboard fallback for manual text input (grouped letter tiles)
- Browser speech synthesis fallback when voice model is unavailable
- Offline fallback tile set when Bedrock is unreachable
- Conversation panel with caregiver speech-to-text (Web Speech API), auto-send after silence, and conversation history
- PWA support — installable on iPad/iPhone, full-screen, works offline for tier-1 responses

### Voice Synthesis Pipeline
- Async synthesis via Lambda → XTTS v2 fine-tuned model → S3 presigned URL
- Client polls for audio readiness and plays cloned voice when ready
- Graceful fallback to browser TTS on timeout or model failure

### Auth & Patient Profile
- Amazon Cognito sign-in/sign-up (email + password)
- Patient profile stored in DynamoDB, loaded on AAC page mount
- JWT-gated API routes (`/api/profile`, `/api/voice`)

### Voice Banking (`/onboard` — Step 3)
- Real `MediaRecorder` recording of Harvard sentences for voice sample collection
- Per-sentence audio playback for review
- Samples uploaded to S3 under `patients/{id}/voice/`

### Marketing Site
- Landing page with animated hero, problem/solution sections, tech architecture diagram, caregiver dashboard mockup
- 5-step onboarding flow with animated transitions

---

## What Was Not Built / Left Incomplete

- **Voice cloning in production** — XTTS v2 runs on a SageMaker notebook (GPU instance) exposed via an ngrok static tunnel. The notebook must be manually started before each demo and the Flask server re-launched. A proper SageMaker inference endpoint or EC2 deployment was not completed in time.
- **Onboarding → AAC handoff** — the onboarding flow (voice banking, profile setup) does not automatically populate the AAC page with the patient's profile. Patient name and ID are loaded from Cognito + DynamoDB independently on the AAC page.
- **Patient profile loading edge cases** — if Cognito auth is slow or the DynamoDB read fails, the AAC page degrades silently (no patient name, anonymous patient ID used for API calls).
- **ngrok tunnel management** — no auto-restart or health check on the Flask/ngrok side; if the SageMaker notebook stops, voice synthesis silently fails until the notebook is restarted manually.

---

## AWS Services Used

| Service | How It's Used |
|---|---|
| **Amazon Bedrock** (Claude) | Generates contextual AAC sentences based on patient intent path and conversation history |
| **AWS Lambda** | API backend — handles `generate`, `regenerate`, `log_selection`, `append_exchange`, `synthesize_async`, `check_audio` actions |
| **Amazon API Gateway** | REST endpoint fronting Lambda (`/prod/generate`) |
| **Amazon DynamoDB** | Stores patient profiles (`kural-patients`) and async audio job status (`kural-audio-jobs`) |
| **Amazon S3** | Stores voice banking audio samples and synthesized audio output (`voiceclone-audio-samples`) |
| **Amazon Cognito** | User authentication — sign-up, sign-in, JWT tokens for API auth |
| **Amazon SageMaker** | Hosts the XTTS v2 fine-tuned voice cloning model on a GPU notebook instance |

---

## Pre-existing Code / Templates

Built entirely from scratch. No boilerplate, starter templates, or third-party UI component libraries were used.

**Open-source dependencies of note:**
- [Next.js 16](https://nextjs.org/) — React framework
- [Framer Motion](https://www.framer.com/motion/) — animations
- [XTTS v2](https://github.com/coqui-ai/TTS) — open-source voice cloning model (Coqui TTS)
- [AWS Amplify JS](https://docs.amplify.aws/) — Cognito auth client
- [Lucide React](https://lucide.dev/) — icons
