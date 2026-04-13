import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";

const StatCard = ({ label, icon, stat }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <p className="font-medium">{label}</p>
          <CardDescription>{icon}</CardDescription>
        </div>
      </CardHeader>
      <CardFooter>
        <CardTitle>{stat}</CardTitle>
      </CardFooter>
    </Card>
  );
};

export default StatCard;
