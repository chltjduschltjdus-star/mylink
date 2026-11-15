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
    { username: "최서연" },
    { username: "%EC%B5%9C%EC%84%9C%EC%97%B0" },
    { username: "user" },
  ];
}
