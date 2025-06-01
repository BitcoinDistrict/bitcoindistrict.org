import Image from "next/image";
import Link from "next/link";
import { features, Feature } from "@/data/features";

export default function FeatureSection({ title = "Features", limit = 3 }: { title?: string; limit?: number }) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.slice(0, limit).map((feature: Feature) => (
            <div
              key={feature.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <Image
                src={feature.image}
                alt={feature.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold">
                  {feature.title}
                  {feature.isNew && (
                    <span className="ml-2 inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs font-semibold px-2 py-1 rounded">
                      New
                    </span>
                  )}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{feature.description}</p>
                <Link
                  href={feature.link}
                  className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  {feature.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}