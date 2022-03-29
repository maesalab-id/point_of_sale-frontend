import { Navigate, Route, Routes } from "react-router-dom"
import { Categories } from "./Categories"
import { Orders } from "./Orders"
import { Products } from "./Products"

export const Router = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="orders" />} />
      <Route path="orders" element={<Orders />} />
      <Route path="products" element={<Products />} />
      <Route path="categories" element={<Categories />} />
    </Routes>
  )
}