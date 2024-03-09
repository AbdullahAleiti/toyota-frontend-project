import { createFileRoute } from '@tanstack/react-router'
import { Terminal } from '../Domain'
import axios from 'axios'
import Select from "../components/Select"
import { useMemo } from 'react'

export const Route = createFileRoute('/terminal/$terminalId')({
  loader: ({context:{ queryClient }, params:{terminalId}}) => 
  queryClient.ensureQueryData({
    queryKey: ["terminal",{terminalId}],
    queryFn : ()=>fetchTerminal(terminalId)
  }),
  component: TerminalLogin
})

const fetchTerminal= async (terminalId: string) => {
  const post = await axios
    .get<Terminal[]>(`https://api.sunucu.com/terminal/${terminalId}`)
    .then((r) => r.data)
    .catch((err) => {
      throw err
    })

  return post
}

function TerminalLogin(){
  const terminalData = Route.useLoaderData()

  // TODO Test if useMemo is required here!
  const options = useMemo(()=>(
    terminalData.map((terminal)=>({value:terminal.termName,label:terminal.termName}))
  ),[terminalData])

  return (
      <div className="mx-auto min-w-100 w-1/2">
          <Select options={options}/>
      </div>
  )
}
