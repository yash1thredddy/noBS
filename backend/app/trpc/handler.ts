import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '#trpc/routers/index'
import type { HttpContext } from '@adonisjs/core/http'

// Handle tRPC requests
export async function handleTrpcRequest(httpCtx: HttpContext) {
  const { request, response } = httpCtx

  // Convert AdonisJS request to Web Request
  const url = new URL(request.url(true), `http://${request.header('host')}`)
  
  const webRequest = new Request(url.toString(), {
    method: request.method(),
    headers: Object.fromEntries(
      Object.entries(request.headers()).map(([key, value]) => [key, String(value)])
    ),
    body: ['GET', 'HEAD'].includes(request.method()) 
      ? undefined 
      : JSON.stringify(request.body()),
  })

  // Handle the request with tRPC
  const trpcResponse = await fetchRequestHandler({
    endpoint: '/trpc',
    req: webRequest,
    router: appRouter,
    createContext: () => ({ ctx: httpCtx }),
  })

  // Convert Web Response back to AdonisJS response
  response.status(trpcResponse.status)
  
  trpcResponse.headers.forEach((value, key) => {
    response.header(key, value)
  })

  const body = await trpcResponse.text()
  return response.send(body)
}

