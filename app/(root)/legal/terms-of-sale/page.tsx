import Link from 'next/link';

export default function TermsOfSalePage() {
    return (
        <div className="min-h-screen bg-light-100">
            <div className="mx-auto max-w-4xl px-6 py-12">
                <Link
                    href="/"
                    className="mb-8 inline-block text-body text-dark-700 hover:text-dark-900"
                >
                    ← Back to Home
                </Link>

                <h1 className="mb-4 text-heading-2 font-bold text-dark-900">
                    Terms of Sale
                </h1>
                <p className="mb-8 text-caption text-dark-700">
                    Last Updated: November 20, 2025
                </p>

                <div className="space-y-8">
                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            1. Agreement to Terms
                        </h2>
                        <p className="text-body text-dark-700">
                            By placing an order through Nike&apos;s e-commerce
                            platform, you agree to be bound by these Terms of
                            Sale. Please read them carefully before making a
                            purchase.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            2. Product Information
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            We strive to provide accurate product descriptions,
                            images, and pricing. However:
                        </p>
                        <ul className="list-disc space-y-2 pl-5 text-body text-dark-700">
                            <li>
                                Colors may vary slightly due to screen settings
                            </li>
                            <li>
                                Product specifications are subject to change
                            </li>
                            <li>
                                We reserve the right to correct pricing errors
                            </li>
                            <li>
                                Availability is not guaranteed until order
                                confirmation
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            3. Pricing and Payment
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            All prices are listed in USD and include applicable
                            taxes unless otherwise stated.
                        </p>
                        <div className="rounded-lg bg-light-200 p-6">
                            <h3 className="mb-3 text-body-medium font-medium text-dark-900">
                                Accepted Payment Methods
                            </h3>
                            <ul className="list-disc space-y-2 pl-5 text-body text-dark-700">
                                <li>
                                    Credit and debit cards (Visa, Mastercard,
                                    American Express)
                                </li>
                                <li>Digital wallets (Apple Pay, Google Pay)</li>
                                <li>PayPal</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            4. Order Processing
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            Orders are typically processed within 1-2 business
                            days. You will receive:
                        </p>
                        <ul className="list-disc space-y-2 pl-5 text-body text-dark-700">
                            <li>Order confirmation email immediately</li>
                            <li>Shipping confirmation with tracking number</li>
                            <li>Delivery updates via email</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            5. Shipping and Delivery
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            Shipping times vary by location and method selected:
                        </p>
                        <ul className="list-disc space-y-2 pl-5 text-body text-dark-700">
                            <li>Standard Shipping: 5-7 business days</li>
                            <li>Express Shipping: 2-3 business days</li>
                            <li>
                                Next Day Delivery: Available in select areas
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            6. Returns and Refunds
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            We accept returns within 30 days of delivery for
                            unworn items in original packaging.
                        </p>
                        <div className="rounded-lg bg-light-200 p-6">
                            <h3 className="mb-3 text-body-medium font-medium text-dark-900">
                                Refund Timeline
                            </h3>
                            <p className="text-body text-dark-700">
                                Refunds are processed within 5-10 business days
                                after we receive your return.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            7. Limitation of Liability
                        </h2>
                        <p className="text-body text-dark-700">
                            Nike is not liable for any indirect, incidental, or
                            consequential damages arising from the use of our
                            products or services.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            8. Contact Information
                        </h2>
                        <p className="text-body text-dark-700">
                            For questions about these Terms of Sale, please
                            contact our customer service team.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
