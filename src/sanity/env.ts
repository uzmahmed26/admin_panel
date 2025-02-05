export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-30'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "skf7wSMaZ85gvCdwiVDo7BUFGWcJtizMKXaxM2MlpluNCmDsLA2w7q1vpCBitaRrWHI2NAEzQnL7tkYW0BUnJn67odsvq1HKc5Km2DX5ijXEfd5UWhMFO86gZbH3z1rS56isR9CnVPB5Mcdaz5dbE0ejIT6zt3sJRsIg7QI2PdPdjLPIQUQH",
  'Missing environment variable: SANITY_READ_TOKEN'
)


function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
