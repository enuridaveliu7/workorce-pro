import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import DeleteButton from "./DeleteButton";

const DepartmentsList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [listView, setListView] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/departments`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch departments.");
        }

        const data = await response.json();

        setDepartments(data);
      } catch (error) {
        setError(error.message || "Failed to fetch departments.");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleDelete = (departmentId) => {
    setDepartments((currentDepartments) =>
      currentDepartments.filter((department) => department.id !== departmentId)
    );
  };

  if (loading) {
    return <h1>Fetching data...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  if (departments.length === 0) {
    return <h1>No data found</h1>;
  }

  return (
    <div className="w-full mt-8">
      {/*Switch */}
      <div className="w-fit ml-auto gap-2 flex">
        <Button
          variant={listView ? "default" : "outline"}
          onClick={() => setListView(true)}
        >
          List
        </Button>
        <Button
          variant={listView ? "outline" : "default"}
          onClick={() => setListView(false)}
        >
          Card
        </Button>
      </div>
      {listView ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.length > 0 &&
              departments?.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>{department.name}</TableCell>
                  <TableCell>
                    {department.employee_count ||
                      department.employee_list?.length ||
                      0}
                  </TableCell>
                  <TableCell className="flex gap-2 justify-end">
                    <Button variant="outline" asChild>
                      <Link to={`/edit-department/${department.id}`}>
                        <Pencil />
                      </Link>
                    </Button>
                    <DeleteButton
                      departmentId={department.id}
                      departmentName={department.name}
                      onDelete={() => handleDelete(department.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {departments.length > 0 &&
            departments?.map((department) => (
              <Card key={department.id}>
                <CardHeader>
                  <CardTitle>{department.name}</CardTitle>
                </CardHeader>
                <CardFooter className="justify-between">
                  <CardDescription>
                    Employees:{" "}
                    {department.employee_count ||
                      department.employee_list?.length ||
                      0}
                  </CardDescription>
                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link to={`/edit-department/${department.id}`}>
                        <Pencil />
                      </Link>
                    </Button>
                    <DeleteButton
                      departmentId={department.id}
                      departmentName={department.name}
                      onDelete={() => handleDelete(department.id)}
                    />
                  </div>
                </CardFooter>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentsList;
