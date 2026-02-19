import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function App() {
  return (
    // <AuthProvider>

    // </AuthProvider>
    <RouterProvider router={router} />
  );
}

export default App;
