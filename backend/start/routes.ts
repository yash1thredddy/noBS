/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { handleTrpcRequest } from '#trpc/handler'
import { middleware } from '#start/kernel'
import User from '#models/user'
import env from '#start/env'
import { DateTime } from 'luxon'

// Type for ORCID email response
interface OrcidEmail {
  email: string
  primary: boolean
  verified: boolean
}

// Check if running in development mode
const isDevelopment = env.get('NODE_ENV') === 'development'

// Health check
router.get('/', async () => {
  return {
    name: 'noBS Backend API',
    version: '1.0.0',
    status: 'running',
    trpc: '/trpc',
    auth: '/api/auth/login',
  }
})

// Refresh ORCID token endpoint
router.post('/api/auth/refresh-orcid-token', async ({ auth, response }) => {
  try {
    console.log('🔄 Token refresh requested')
    
    await auth.authenticate()
    const user = auth.user!
    
    if (!user.refreshToken) {
      console.error('❌ No refresh token available')
      return response.badRequest({ error: 'No refresh token available' })
    }
    
    // Exchange refresh token for new access token
    const ORCID_TOKEN_URL = env.get('ORCID_TOKEN_URL')
    const ORCID_CLIENT_ID = env.get('ORCID_CLIENT_ID')
    const ORCID_CLIENT_SECRET = env.get('ORCID_CLIENT_SECRET')
    
    const params = new URLSearchParams({
      client_id: ORCID_CLIENT_ID,
      client_secret: ORCID_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: user.refreshToken,
    })

    const tokenResponse = await fetch(ORCID_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(),
    })
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('❌ Token refresh failed:', errorText)
      return response.badRequest({ error: 'Failed to refresh token' })
    }
    
    const newTokens = await tokenResponse.json()
    
    // Update user with new tokens
    user.accessToken = newTokens.access_token
    user.refreshToken = newTokens.refresh_token || user.refreshToken
    user.tokenExpiresAt = newTokens.expires_in 
      ? DateTime.now().plus({ seconds: newTokens.expires_in })
      : null
    await user.save()
    
    console.log('✅ Token refreshed successfully')
    
    return response.ok({ 
      success: true, 
      message: 'Token refreshed successfully',
      expiresAt: user.tokenExpiresAt?.toISO()
    })
  } catch (error) {
    console.error('❌ Token refresh error:', error)
    return response.internalServerError({ error: 'Failed to refresh token' })
  }
}).use(middleware.auth())

// Check token validity endpoint
router.get('/api/auth/check', async ({ auth, response }) => {
  try {
    await auth.authenticate()
    const user = auth.user!
    
    return response.ok({ 
      authenticated: true, 
      user: user.serialize(),
      tokenValid: true
    })
  } catch (error) {
    return response.unauthorized({ 
      authenticated: false,
      tokenValid: false,
      message: 'Invalid or expired token'
    })
  }
})

// Logout endpoint - revoke token
router.post('/api/auth/logout', async ({ auth, response }) => {
  try {
    console.log('🚪 Logout request received')
    
    // Authenticate the user
    await auth.authenticate()
    const user = auth.user!
    
    // Revoke the current access token
    await User.accessTokens.delete(user, user.currentAccessToken!.identifier)
    
    console.log('✅ User logged out - ORCID:', user.orcid)
    
    return response.ok({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.error('❌ Logout error:', error)
    // Even if there's an error, return success (token might already be invalid)
    return response.ok({ success: true, message: 'Logged out' })
  }
}).use(middleware.auth())

// Simple REST endpoint for ORCID login
router.post('/api/auth/login', async ({ request, response }) => {
  try {
    const { code } = request.body()

    console.log('🔐 ORCID Login initiated')

    // Input validation
    if (!code || typeof code !== 'string') {
      return response.badRequest({ error: 'Authorization code is required' })
    }

    // Validate code format (alphanumeric, reasonable length)
    if (code.length < 6 || code.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(code)) {
      return response.badRequest({ error: 'Invalid authorization code format' })
    }

    // Step 1: Exchange code for tokens
    const ORCID_TOKEN_URL = env.get('ORCID_TOKEN_URL')
    const ORCID_CLIENT_ID = env.get('ORCID_CLIENT_ID')
    const ORCID_CLIENT_SECRET = env.get('ORCID_CLIENT_SECRET')
    const ORCID_REDIRECT_URI = env.get('ORCID_REDIRECT_URI')

    console.log('📤 Exchanging authorization code for tokens...')

    const params = new URLSearchParams({
      client_id: ORCID_CLIENT_ID,
      client_secret: ORCID_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: ORCID_REDIRECT_URI,
    })

    const tokenResponse = await fetch(ORCID_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('❌ Token exchange failed:', errorText)
      return response.badRequest({ error: 'Failed to exchange code for tokens' })
    }

    const tokenData = await tokenResponse.json()
    console.log('✅ Token exchange successful - ORCID:', tokenData.orcid)

    // Step 2: Fetch profile from ORCID
    const ORCID_API_URL = env.get('ORCID_API_URL')
    console.log('👤 Fetching ORCID profile...')

    const profileResponse = await fetch(`${ORCID_API_URL}/${tokenData.orcid}/record`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json',
      },
    })

    if (!profileResponse.ok) {
      console.error('❌ Failed to fetch profile')
      return response.badRequest({ error: 'Failed to fetch ORCID profile' })
    }

    const profileData = await profileResponse.json()
    
    // Extract profile info
    const person = profileData.person
    const givenName = person?.name?.['given-names']?.value || ''
    const familyName = person?.name?.['family-name']?.value || ''
    const name = `${givenName} ${familyName}`.trim() || 'Unknown User'

    const emails: OrcidEmail[] = person?.emails?.email || []
    const email = emails.find((e) => e.primary)?.email || emails[0]?.email || null

    const employments = profileData['activities-summary']?.employments?.['affiliation-group'] || []
    const institution = employments[0]?.summaries?.[0]?.['employment-summary']?.organization?.name || null

    console.log('✅ Profile fetched - Name:', name, '| Email:', email || 'N/A')

    // Step 3: Create or update user
    console.log('💾 Saving user to database...')
    let user = await User.findBy('orcid', tokenData.orcid)

    if (user) {
      console.log('   Updating existing user')
      user.name = name
      user.email = email
      user.institution = institution
      user.accessToken = tokenData.access_token
      user.refreshToken = tokenData.refresh_token || null
      user.tokenExpiresAt = tokenData.expires_in 
        ? DateTime.now().plus({ seconds: tokenData.expires_in })
        : null
      await user.save()
    } else {
      console.log('   Creating new user')
      user = await User.create({
        orcid: tokenData.orcid,
        name: name,
        email: email,
        institution: institution,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        tokenExpiresAt: tokenData.expires_in 
          ? DateTime.now().plus({ seconds: tokenData.expires_in })
          : null,
      })
    }

    // Step 4: Create API token (expires in 7 days)
    console.log('🎫 Creating API access token...')
    const token = await User.accessTokens.create(user, ['*'], {
      expiresIn: '7 days'
    })

    console.log('✅ Login successful - User ID:', user.id)

    return response.ok({
      user: user.serialize(),
      token: token.value!.release(),
    })

  } catch (error) {
    console.error('❌ Login error:', error)

    // In development, include error details for debugging
    const errorMessage = isDevelopment && error instanceof Error
      ? `Authentication failed: ${error.message}`
      : 'Authentication failed'

    return response.internalServerError({ error: errorMessage })
  }
})

// tRPC endpoints - available for future use
// Currently the app uses REST endpoints, but tRPC is configured and ready
router.any('/trpc/*', async (ctx) => {
  return handleTrpcRequest(ctx)
})

router.any('/trpc', async (ctx) => {
  return handleTrpcRequest(ctx)
})
