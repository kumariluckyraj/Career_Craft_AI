import connectDB from "@/db/connectDb";
import Profile from "@/lib/models/Profile";

export default async function ProfilesPage() {
  await connectDB();
  const profiles = await Profile.find({ status: "approved" }).lean();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Recommended LinkedIn Profiles</h1>

      {profiles.map((p) => (
        <div key={p._id} className="border p-4 rounded">
          <a
            href={p.profileUrl}
            target="_blank"
            className="font-semibold underline"
          >
            {p.name || "LinkedIn Profile"}
          </a>
          <p className="text-sm mt-1">{p.description}</p>
        </div>
      ))}
    </div>
  );
}
