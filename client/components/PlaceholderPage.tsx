import { Layout } from "./Layout";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export const PlaceholderPage = ({
  title,
  description = "This module is coming soon. Continue prompting to fill in this page contents.",
}: PlaceholderPageProps) => {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 mb-6">{description}</p>
          <div className="text-primary text-6xl mb-6 opacity-20">✦</div>
        </div>
      </div>
    </Layout>
  );
};
