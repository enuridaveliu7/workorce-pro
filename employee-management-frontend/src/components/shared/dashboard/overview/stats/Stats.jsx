import { DollarSign, ListChecks, ListTodo, Users } from "lucide-react";
import StatCard from "./StatCard";
const Stats = () => {
  return (
    <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-6">
      <StatCard
        label="Departments"
        icon={<DollarSign size={22} />}
        stat="$4500"
      />
      <StatCard label="Total Users" icon={<Users size={22} />} stat="$1500" />
      <StatCard
        label="Total Tasks"
        icon={<ListTodo size={22} />}
        stat="$2000"
      />
      <StatCard
        label="Done Tasks"
        icon={<ListChecks size={22} />}
        stat="$4500"
      />
    </div>
  );
};

export default Stats;
