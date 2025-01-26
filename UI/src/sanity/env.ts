export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-19'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const apiKey = assertValue(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  'Missing environment variable: NEXT_PUBLIC_FIREBASE_API_KEY'
)

export const authDomain = assertValue(
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  'Missing environment variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'
)

export const firebaseprojectId = assertValue(
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID'
)

export const storageBucket = assertValue(
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  'Missing environment variable: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'
)

export const messagingSenderId = assertValue(
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  'Missing environment variable: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'
)

export const appId = assertValue(
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  'Missing environment variable: NEXT_PUBLIC_FIREBASE_APP_ID'
)

export const measurementId = assertValue(
  process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  'Missing environment variable: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
