import ResumeForm from "@/components/resume/ResumeForm";

export default function BuildResumePage() {
  return (
    <div style={{ padding: "30px", paddingTop: "100px" }}>
     <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mb-6 flex items-center text-center justify-center">
  Build Resume
</h1>
      <ResumeForm />
    </div>
  );
}
