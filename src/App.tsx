import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css'

import Terminals from './routes/terminals';

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path:"/test",
    element: <Terminals/>
  }
]);

function App() {

  return (
    <>
      <div>
        <RouterProvider router={router} />
      </div>
    </>
  )
}

export default App
