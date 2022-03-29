import { Route, Routes } from "react-router-dom"
import { Home } from "./Home"
import { Transactions } from "./Transactions"

export const Router = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="transactions" element={<Transactions />} />
    </Routes>
  )
}