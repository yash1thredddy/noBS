// Shared ORCID API types

export interface OrcidEmail {
  email: string
  primary: boolean
  verified?: boolean
}

export interface OrcidTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
  orcid: string
}

export interface OrcidProfileResponse {
  person?: {
    name?: {
      'given-names'?: { value?: string }
      'family-name'?: { value?: string }
    }
    emails?: {
      email?: OrcidEmail[]
    }
  }
  'activities-summary'?: {
    employments?: {
      'affiliation-group'?: Array<{
        summaries?: Array<{
          'employment-summary'?: {
            organization?: { name?: string }
          }
        }>
      }>
    }
  }
}

/**
 * Extract profile data from ORCID API response
 */
export function extractProfileFromOrcidResponse(data: OrcidProfileResponse) {
  const person = data.person
  const givenName = person?.name?.['given-names']?.value || ''
  const familyName = person?.name?.['family-name']?.value || ''
  const name = `${givenName} ${familyName}`.trim() || 'Unknown User'

  const emails: OrcidEmail[] = person?.emails?.email || []
  const email = emails.find((e) => e.primary)?.email || emails[0]?.email || null

  const employments = data['activities-summary']?.employments?.['affiliation-group'] || []
  const institution = employments[0]?.summaries?.[0]?.['employment-summary']?.organization?.name || null

  return { name, email, institution }
}
