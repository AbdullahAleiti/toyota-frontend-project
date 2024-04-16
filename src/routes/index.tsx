import { createFileRoute, createRootRouteWithContext, Outlet ,redirect} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createFileRoute('/')({
  loader:()=>{
    throw redirect({to:'/terminals'})
  }
})