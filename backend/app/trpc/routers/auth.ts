import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, publicProcedure, protectedProcedure } from '#trpc/trpc'
import User from '#models/user'
import env from '#start/env'
import {
  type OrcidTokenResponse,
  type OrcidProfileResponse,
  extractProfileFromOrcidResponse,
} from '#types/orcid'

// ORCID OAuth configuration
const ORCID_TOKEN_URL = env.get('ORCID_TOKEN_URL', 'https://sandbox.orcid.org/oauth/token')
const ORCID_API_URL = env.get('ORCID_API_URL', 'https://pub.sandbox.orcid.org/v3.0')
const ORCID_CLIENT_ID = env.get('ORCID_CLIENT_ID')
const ORCID_CLIENT_SECRET = env.get('ORCID_CLIENT_SECRET')
const ORCID_REDIRECT_URI = env.get('ORCID_REDIRECT_URI')

// Input validation schemas
const loginInput = z.object({
  code: z.string().min(1, 'Authorization code is required'),
})

// Exchange authorization code for ORCID tokens
async function exchangeCodeForTokens(code: string) {
  const params = new URLSearchParams({
    client_id: ORCID_CLIENT_ID!,
    client_secret: ORCID_CLIENT_SECRET!,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: ORCID_REDIRECT_URI!,
  })

  const response = await fetch(ORCID_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: params.toString(),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error_description: 'Token exchange failed' })) as { error_description?: string }
    console.error('❌ Token exchange failed:', error)
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: error.error_description || 'Failed to exchange code for tokens',
    })
  }

  const data = await response.json() as OrcidTokenResponse
  return data
}

// Fetch user profile from ORCID API
async function fetchOrcidProfile(orcid: string, accessToken: string) {
  const response = await fetch(`${ORCID_API_URL}/${orcid}/record`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    console.error('❌ Failed to fetch ORCID profile')
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Failed to fetch ORCID profile',
    })
  }

  const data = await response.json() as OrcidProfileResponse
  const { name, email, institution } = extractProfileFromOrcidResponse(data)

  return { orcid, name, email, institution }
}

// Auth router
export const authRouter = router({
  // Login with ORCID authorization code
  login: publicProcedure
    .input(loginInput)
    .mutation(async ({ input }) => {
      try {
        // Step 1: Exchange code for tokens
        const tokenResponse = await exchangeCodeForTokens(input.code)

        // Step 2: Fetch full profile from ORCID
        const profile = await fetchOrcidProfile(
          tokenResponse.orcid,
          tokenResponse.access_token
        )

        // Step 3: Create or update user in database
        let user = await User.findBy('orcid', profile.orcid)

        if (user) {
          // Update existing user
          user.name = profile.name
          user.email = profile.email
          user.institution = profile.institution
          user.accessToken = tokenResponse.access_token
          user.refreshToken = tokenResponse.refresh_token || null
          await user.save()
        } else {
          // Create new user
          user = await User.create({
            orcid: profile.orcid,
            name: profile.name,
            email: profile.email,
            institution: profile.institution,
            accessToken: tokenResponse.access_token,
            refreshToken: tokenResponse.refresh_token || null,
          })
        }

        // Step 4: Create access token for API authentication
        const token = await User.accessTokens.create(user)

        return {
          user: user.serialize(),
          token: token.value!.release(),
        }
      } catch (error) {
        console.error('❌ Login failed:', error)
        throw error
      }
    }),

  // Logout - revoke access token
  logout: protectedProcedure
    .mutation(async ({ ctx }) => {
      const user = ctx.ctx.auth.user!
      await User.accessTokens.delete(user, user.currentAccessToken!.identifier)
      
      return { success: true }
    }),

  // Get current user profile
  me: protectedProcedure
    .query(async ({ ctx }) => {
      const user = ctx.ctx.auth.user!
      return user.serialize()
    }),

  // Check if authenticated
  check: publicProcedure
    .query(async ({ ctx }) => {
      try {
        await ctx.ctx.auth.authenticate()
        return { authenticated: true, user: ctx.ctx.auth.user?.serialize() }
      } catch {
        return { authenticated: false, user: null }
      }
    }),
})

export type AuthRouter = typeof authRouter

