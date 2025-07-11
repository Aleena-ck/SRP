import AdminSidebar from "./AdminSidebar";

const AdminDashboardPage = ({ children }) => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default AdminDashboardPage;
