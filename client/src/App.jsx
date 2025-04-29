import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          {/* <Route path="about" element={<About />} />

          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route path="concerts">
            <Route index element={<ConcertsHome />} />
            <Route path=":city" element={<City />} />
            <Route path="trending" element={<Trending />} />
          </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
