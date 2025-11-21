import Link from 'next/link';

export default function GuidesPage() {
    return (
        <div className="min-h-screen bg-light-100">
            <div className="mx-auto max-w-4xl px-6 py-12">
                <Link
                    href="/"
                    className="mb-8 inline-block text-body text-dark-700 hover:text-dark-900"
                >
                    ← Back to Home
                </Link>

                <h1 className="mb-8 text-heading-2 font-bold text-dark-900">
                    Nike Guides
                </h1>

                <div className="space-y-8">
                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            Size Guide
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            Finding the perfect fit is essential for comfort and
                            performance. Use our comprehensive size charts to
                            determine your ideal Nike shoe size.
                        </p>
                        <div className="rounded-lg bg-light-200 p-6">
                            <h3 className="mb-3 text-body-medium font-medium text-dark-900">
                                How to Measure Your Feet
                            </h3>
                            <ol className="list-decimal space-y-2 pl-5 text-body text-dark-700">
                                <li>Place your foot on a flat surface</li>
                                <li>
                                    Measure from heel to longest toe in
                                    centimeters
                                </li>
                                <li>Compare with our size chart</li>
                                <li>
                                    If between sizes, we recommend sizing up
                                </li>
                            </ol>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            Care Instructions
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            Proper care extends the life of your Nike products.
                            Follow these guidelines to keep your shoes looking
                            fresh.
                        </p>
                        <div className="rounded-lg bg-light-200 p-6">
                            <h3 className="mb-3 text-body-medium font-medium text-dark-900">
                                General Care Tips
                            </h3>
                            <ul className="list-disc space-y-2 pl-5 text-body text-dark-700">
                                <li>Clean with a soft brush and mild soap</li>
                                <li>Air dry at room temperature</li>
                                <li>Avoid direct heat or sunlight</li>
                                <li>Store in a cool, dry place</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            Shipping & Returns
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            We offer free standard shipping on orders over $50
                            and easy returns within 30 days of purchase.
                        </p>
                        <div className="rounded-lg bg-light-200 p-6">
                            <h3 className="mb-3 text-body-medium font-medium text-dark-900">
                                Return Process
                            </h3>
                            <ol className="list-decimal space-y-2 pl-5 text-body text-dark-700">
                                <li>Initiate return from your account</li>
                                <li>Print the prepaid shipping label</li>
                                <li>Pack items in original packaging</li>
                                <li>Drop off at any carrier location</li>
                            </ol>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            Product Technology
                        </h2>
                        <p className="text-body text-dark-700">
                            Learn about Nike&apos;s innovative technologies
                            designed to enhance your performance and comfort.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
