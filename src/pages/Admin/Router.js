import { Navigate, Route, Routes } from "react-router-dom"
import { Categories } from "./Categories"
import { Orders } from "./Orders"
import { Products } from "./Products"
import { Receipts } from "./Receipts"
import { Users } from "./Users"

export const Router = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="orders" />} />
      <Route path="users" element={<Users />} />
      <Route path="products" element={<Products />} />
      <Route path="categories" element={<Categories />} />
      <Route path="receipts" element={<Receipts />} />
      <Route path="orders" element={<Orders />} />
    </Routes>
  )
}