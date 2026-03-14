interface Cabin {
  id: string;
  name: string;
  status: string;
}

export default function CabinTable({ cabins }: { cabins: Cabin[] }) {
  if (cabins.length === 0) return <p>No cabins found.</p>;

  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Name</th>
          <th className="p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {cabins.map((cabin) => (
          <tr key={cabin.id} className="border-t">
            <td className="p-2">{cabin.name}</td>
            <td className="p-2">{cabin.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}