import { DisplayNameClientPage } from "./client-page";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function DynamicProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const username = resolvedParams.username;

  return <DisplayNameClientPage initialDisplayName={username} />;
}

export function generateStaticParams() {
  return [
    { displayName: "최서연" },
  ];
}
