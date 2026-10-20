import GlobalNetwork3D from "../components/network/GlobalNetwork3D";

export default function NetworkPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">شبکه ارتباطی جشنواره</h1>
      <p className="text-sm text-gray-500 mb-6">
        هر خط یک بازخورد واقعی است؛ بین کسی که بازخورد داده و کسی که درخواست کرده بود. روی هر نقطه کلیک کنید تا پروفایل باز شود.
      </p>
      <GlobalNetwork3D />
    </main>
  );
}
