export default function SuccessPage({ searchParams }: any) {
  return (
    <div style={{ padding: 40 }}>
      <h1>✅ Approved Successfully</h1>
      <p>Reference ID: {searchParams.ref}</p>
      <p>📄 PDF generated & sent to email</p>
    </div>
  );
}