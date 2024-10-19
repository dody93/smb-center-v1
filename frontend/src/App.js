import {BrowserRouter, Routes, Route} from "react-router-dom"
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import NewPassword from "./components/NewPassword";
import VerifyOTP from "./components/VerifyOTP";
import ForgotPassword from "./components/ForgotPassword";
import PasswordChangeSuccess from "./components/PasswordChangeSuccess";
import BusinessSectorSelection from "./components/BusinessSectorSelection";
import PrivateRoute from "./components/PrivateRoute";
import Users from "./pages/Users";
import Employee from "./pages/Employee";
import ShiftTableList from "./pages/ShiftTableList";
import Shift from "./pages/Shift";
import Absen from "./pages/Absen";
import AbsensiOffice from "./pages/AbsensiOffice";
import AbsensiRekap from "./pages/AbsensiRekap";
import Task from "./pages/Task";
import AddEmployee from "./pages/AddEmployee";
import AddSchedule from "./pages/AddSchedule";
import Products from "./pages/Products";
import AddUser from "./pages/AddUser";
//import AddEmployee from "./pages/AddEmployee";
import EditUser from "./pages/EditUser";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";




function App() {
  return (
    <div >
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/new-password" element={<NewPassword />} />
            <Route path="/password-change-success" element={<PasswordChangeSuccess />} />
            <Route path="/business-sector-selection" element={<BusinessSectorSelection />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/employee" element={<PrivateRoute element={<Employee />} />} />
            <Route path="/shift" element={<PrivateRoute element={<Shift />} />} />
            <Route path="/absen" element={<PrivateRoute element={<Absen />} />} />
            <Route path="/absen-office" element={<PrivateRoute element={<AbsensiOffice />} />} />
            <Route path="/absen-rekap" element={<PrivateRoute element={<AbsensiRekap />} />} />
            <Route path="/listtask" element={<PrivateRoute element={<Task />} />} />
            <Route path="/addemployee" element={<PrivateRoute element={<AddEmployee />} />} />
            <Route path="/addschedule" element={<PrivateRoute element={<AddSchedule />} />} />
             <Route path="/ShiftTableList" element={<PrivateRoute element={<ShiftTableList />} />} />
            <Route path="/users" element={<PrivateRoute element={<Users />} />} />
            <Route path="/users/add" element={<PrivateRoute element={<AddUser />} />} />
            <Route path="/users/edit/:id" element={<PrivateRoute element={<EditUser />} />} />
            <Route path="/products" element={<PrivateRoute element={<Products />} />} />
            <Route path="/products/add" element={<PrivateRoute element={<AddProduct />} />} />
            <Route path="/products/edit/:id" element={<PrivateRoute element={<EditProduct />} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
