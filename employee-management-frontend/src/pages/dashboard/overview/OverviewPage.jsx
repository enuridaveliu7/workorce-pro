import Header from "../../../components/shared/dashboard/Header";
import CreateDepartmentDialog from "../../../components/shared/dashboard/overview/department/CreateDepartmentDialog";
import DepartmentsList from "../../../components/shared/dashboard/overview/department/DepartmentsList";
import Stats from "../../../components/shared/dashboard/overview/stats/Stats";
import Layout from "../Layout";

const OverviewPage = () => {
    return (
        <Layout>
            <Header
                title="Dashboard"
                subtitle="Here you can manage all the departments, users and tasks."
            >
                <CreateDepartmentDialog />
            </Header>

            {/* Stat Cards */}
            <Stats />

            {/* Departments List */}
            <DepartmentsList />
        </Layout>
    );
};

export default OverviewPage;
