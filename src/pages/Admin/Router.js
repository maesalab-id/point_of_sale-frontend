import { Navigate, Route, Routes } from "react-router-dom";
import { Categories } from "./Categories";
import { Customers } from "./Customers";
import { Orders } from "./Orders";
import { Products } from "./Products";
import { Receipts } from "./Receipts";
import { Users } from "./Users";
import { Vendors } from "./Vendors";
import { Vouchers } from "./Vouchers";

export const Router = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="orders" />} />
      <Route path="vouchers" element={<Vouchers />} />
      <Route path="vendors" element={<Vendors />} />
      <Route path="customers" element={<Customers />} />
      <Route path="users" element={<Users />} />
      <Route path="products" element={<Products />} />
      <Route path="categories" element={<Categories />} />
      <Route path="receipts" element={<Receipts />} />
      <Route path="orders" element={<Orders />} />
    </Routes>
  );
};
