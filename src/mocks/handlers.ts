import { http, HttpResponse } from 'msw'
import terminalsData from "./terminal.json"
import other from "./other.json"

export const handlers = [
  
  http.get('https://api.sunucu.com/terminals', () => {
    return HttpResponse.json(terminalsData)
  }),
  http.get('https://api.sunucu.com/terminal/*', () => {
    return HttpResponse.json(other['first-screen'].data)
  })
]