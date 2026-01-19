import PaymentPage from "@/components/PaymentPage";

const Username = async ({ params }) => {
  const { username } = await params; // ✅ MUST await

  return <PaymentPage username={username} />;
};

export default Username;
