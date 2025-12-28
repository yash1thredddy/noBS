import { initTRPC, TRPCError } from '@trpc/server'
import type { HttpContext } from '@adonisjs/core/http'

// Context type - available in all procedures
export interface Context {
  ctx: HttpContext
}

// Initialize tRPC
const t = initTRPC.context<Context>().create()

// Export reusable router and procedure helpers
export const router = t.router
export const publicProcedure = t.procedure

// Middleware to check if user is authenticated
const isAuthed = t.middleware(async ({ ctx, next }) => {
  try {
    await ctx.ctx.auth.authenticate()
    const user = ctx.ctx.auth.user
    
    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in',
      })
    }

    return next({
      ctx: {
        ...ctx,
        user,
      },
    })
  } catch (error) {
    // Log the real error for debugging
    console.error('Authentication error:', error)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired token',
    })
  }})

// Protected procedure - requires authentication
export const protectedProcedure = t.procedure.use(isAuthed)



