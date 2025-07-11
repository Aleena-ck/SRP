import DonorSidebar from "./DonorSidebar";

const DonorDashboardPage = ({ children }) => {
  return (
    <div className="flex">
      <DonorSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default DonorDashboardPage;
