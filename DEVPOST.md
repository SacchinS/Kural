## Inspiration

Nearly 35,000 Americans live with ALS, with 5,000 new diagnoses every year. As the disease progresses, patients lose the ability to speak — but not the ability to think, feel, or connect. Current AAC (Augmentative and Alternative Communication) devices let patients spell words letter by letter using eye tracking, achieving 10–20 words per minute. They speak in a generic synthesized voice that sounds nothing like them.

We asked: what if someone could keep their voice, even after losing it?

## What It Does

Kural (குரல் — Tamil for "voice") is an AI-powered AAC device that lets ALS patients communicate in their own cloned voice using eye tracking and contextual sentence generation.

Instead of spelling letter by letter, patients gaze at semantic intent tiles — broad categories like "I need...", "I feel...", "Talk about...". Two eye movements narrow down their intent. Amazon Bedrock generates a complete, personalized sentence based on the patient's communication style, relationships, and conversation history. The patient selects it, and it plays back in their own cloned voice.

Before significant disease progression, patients record 300 Harvard Sentences — a phonetically balanced corpus used in speech research. We fine-tune an XTTS v2 voice cloning model on these recordings. Every sentence Kural speaks sounds like the patient, not a machine.

## How We Built It

**Voice Cloning Pipeline**
- Patients record 300 Harvard Sentences on iPhone Voice Memos
- Audio is converted to WAV (22050Hz mono) and uploaded to Amazon S3
- XTTS v2 is fine-tuned on Amazon SageMaker (ml.g4dn.xlarge) for 10 epochs
- The fine-tuned model is packaged and deployed as a SageMaker real-time endpoint

**Sentence Generation**
- Amazon Bedrock (Claude Haiku 4.5) generates 3 contextually personalized sentence options per intent selection
- The prompt includes the patient's full profile: communication style, relationships, interests, preferred phrasing, and the last 20 exchanges of conversation
- Responses are ordered by most likely first and returned in under 2 seconds

**Async Voice Synthesis**
- API Gateway has a hard 29-second timeout — too short for voice synthesis
- We built a fully async pattern: the frontend receives a job_id immediately, fires a background Lambda that calls the synthesis endpoint, saves the WAV to S3, and returns a presigned URL
- The frontend polls every 2 seconds and plays audio when ready, falling back to browser TTS if synthesis fails

**Frontend**
- Next.js PWA installable on iPad in fullscreen landscape mode
- iOS 18 built-in Eye Tracking (Settings → Accessibility → Eye Tracking) drives selection — the OS simulates a tap when the user's gaze dwells on a tile, so the app uses standard click handlers with no custom dwell logic
- Static tile layout preserves muscle memory — tiles never reorder
- Conversation panel logs exchanges with timestamps for caregiver context

**AWS Stack**
Amazon Bedrock · Amazon SageMaker · AWS Lambda · Amazon API Gateway · Amazon DynamoDB · Amazon S3 · AWS Amplify

## Challenges We Faced

**Voice synthesis deployment** was our biggest technical challenge. Deploying XTTS v2 to SageMaker required resolving cascading dependency conflicts between TTS, torch, torchaudio, and the base container environment. Every version of the model package revealed a new incompatibility. We went through 8 iterations of the model package before finding a working configuration.

**API Gateway timeout** forced us to rethink the synthesis architecture entirely. We designed an async job queue pattern using DynamoDB and Lambda self-invocation to decouple the synthesis request from the response.

**Latency vs. identity tradeoff** — we discovered that voice cloning quality improves significantly with more training data, but recording 300+ sentences before losing speech is already a race against time for ALS patients. We optimized inference by precomputing speaker conditioning latents and caching common phrases.

## What We Learned

- Voice cloning at the quality needed for identity preservation requires careful data collection long before it's needed — ideally at diagnosis
- Async architecture patterns are essential when working with long-running ML inference behind API Gateway
- ALS patients need predictable, stable interfaces — even small UX decisions like static tile placement have profound impact on usability

## What's Next

- Self-learning loop using selection history to personalize sentence generation over time
- Cross-session memory so Kural remembers what was discussed in previous conversations
- Clinical validation with UW Neurology and the ALS Association of Washington
