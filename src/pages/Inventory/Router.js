import { Categories } from "pages/Admin/Categories"
import { Products } from "pages/Admin/Products"
import { Vendors } from "../Admin/Vendors"
import { Navigate, Route, Routes } from "react-router-dom"
import { Orders } from "./Orders"

export const Router = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="orders" />} />
      <Route path="vendors" element={<Vendors />} />
      <Route path="orders" element={<Orders />} />
      <Route path="products" element={<Products />} />
      <Route path="categories" element={<Categories />} />
    </Routes>
  )
}