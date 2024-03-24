import { createFileRoute } from '@tanstack/react-router'
import { Terminal } from '../Domain'
import axios, { AxiosError } from 'axios'
import Select from "../components/Select"
import { useMemo, useState } from 'react'
import { useForm, SubmitHandler,Controller } from "react-hook-form"
import { TerminalLoginForm, terminalLoginFormSchema } from '../Forms'
import { Input , Button , CircularProgress, Alert,Snackbar} from '@mui/material'
import {zodResolver} from "@hookform/resolvers/zod"
import Grid from '@mui/material/Unstable_Grid2';


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
  const [loginError,setLoginError]   = useState(false)
  const {setValue, handleSubmit,control,register,formState:{errors,isSubmitting}} = useForm<TerminalLoginForm>({
    resolver: zodResolver(terminalLoginFormSchema)
  })

  const onSubmit : SubmitHandler<TerminalLoginForm> = async (data) => {
    try {
      console.log(data)
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await axios.post<TerminalLoginForm>("https://api.sunucu.com/login/",data)
      console.log(response);
    } catch (e) {
      setLoginError(true)
    }
  }
  
  interface Options {
    value?: string,
    label?: string
  }
  
  // TODO Test if useMemo is really required here!
  const options = useMemo(()=>(
    terminalData.map<Options>((terminal)=>({value:terminal.termName,label:terminal.termName}))
  ),[terminalData])

  return (
      <form className="mx-auto min-w-100 w-1/3 mt-10" onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowSpacing={4} direction={"column"}>
          <Grid>
            <Controller 
            control={control}
            name="termId"
            render={({field:{onChange}})=>(
                <Select options={options} onChange={(e) => {
                  onChange(e);
                  setValue("termId",(e as Options).value as string)
                }} />
            )}
            />
          </Grid>
          <Grid>
            <Input className="w-full" type='number' placeholder='Sicil no' {...register("sicilNo",{
              setValueAs: (value) => Number(value),
            })}/>
          </Grid>

          <Grid>
            <Input className="w-full" placeholder='Şifre' type='password' {...register("password")}/>
          </Grid>

          <Grid>
            <Input className="w-full" type="number" placeholder='Montaj No' {...register("montajNo",{
              setValueAs: (value) => Number(value),
            })}/>
          </Grid>

          <Grid>
            <Button className="w-full" variant="outlined" type="submit" disabled={isSubmitting}>{ isSubmitting ? <CircularProgress/> : "Submit"}</Button>  
          </Grid>
          {errors.sicilNo && (<div>{errors.sicilNo.message}</div>)}
          {errors.termId && (<div>{errors.termId.message}</div>)}
          <Snackbar open={loginError} autoHideDuration={3000} onClose={()=>setLoginError(false)} anchorOrigin={{vertical:"top",horizontal:"center"}}>
            <Alert
              severity="error"
              variant="filled"
              sx={{ width: '100%' }}
            >
              Başarısız giriş!
            </Alert>
          </Snackbar>
        </Grid>
      </form>
  )
}