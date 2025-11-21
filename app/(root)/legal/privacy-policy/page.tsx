import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
                    Nike Privacy Policy
                </h1>
                <p className="mb-8 text-caption text-dark-700">
                    Last Updated: November 20, 2025
                </p>

                <div className="space-y-8">
                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            1. Introduction
                        </h2>
                        <p className="text-body text-dark-700">
                            Nike is committed to protecting your privacy. This
                            Privacy Policy explains how we collect, use,
                            disclose, and safeguard your information when you
                            visit our website and make purchases.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            2. Information We Collect
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            We collect information that you provide directly to
                            us, including:
                        </p>
                        <div className="space-y-4">
                            <div className="rounded-lg bg-light-200 p-6">
                                <h3 className="mb-3 text-body-medium font-medium text-dark-900">
                                    Personal Information
                                </h3>
                                <ul className="list-disc space-y-2 pl-5 text-body text-dark-700">
                                    <li>Name and contact information</li>
                                    <li>Email address and phone number</li>
                                    <li>Shipping and billing addresses</li>
                                    <li>Payment information</li>
                                    <li>Account credentials</li>
                                </ul>
                            </div>
                            <div className="rounded-lg bg-light-200 p-6">
                                <h3 className="mb-3 text-body-medium font-medium text-dark-900">
                                    Automatically Collected Information
                                </h3>
                                <ul className="list-disc space-y-2 pl-5 text-body text-dark-700">
                                    <li>IP address and browser type</li>
                                    <li>Device information</li>
                                    <li>Pages visited and time spent</li>
                                    <li>Referring website addresses</li>
                                    <li>Cookies and tracking technologies</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            3. How We Use Your Information
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc space-y-2 pl-5 text-body text-dark-700">
                            <li>Process and fulfill your orders</li>
                            <li>Communicate with you about your purchases</li>
                            <li>Provide customer support</li>
                            <li>
                                Send marketing communications (with consent)
                            </li>
                            <li>Improve our website and services</li>
                            <li>Prevent fraud and enhance security</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            4. Information Sharing
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            We may share your information with:
                        </p>
                        <ul className="list-disc space-y-2 pl-5 text-body text-dark-700">
                            <li>Service providers who assist in operations</li>
                            <li>Payment processors for transaction handling</li>
                            <li>Shipping companies for order delivery</li>
                            <li>Analytics providers to improve our services</li>
                            <li>Law enforcement when required by law</li>
                        </ul>
                        <p className="mt-4 text-body text-dark-700">
                            We do not sell your personal information to third
                            parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            5. Cookies and Tracking
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            We use cookies and similar tracking technologies to
                            enhance your browsing experience. You can control
                            cookie preferences through your browser settings.
                        </p>
                        <div className="rounded-lg bg-light-200 p-6">
                            <h3 className="mb-3 text-body-medium font-medium text-dark-900">
                                Types of Cookies We Use
                            </h3>
                            <ul className="list-disc space-y-2 pl-5 text-body text-dark-700">
                                <li>
                                    Essential cookies for site functionality
                                </li>
                                <li>Performance cookies for analytics</li>
                                <li>Functional cookies for preferences</li>
                                <li>Marketing cookies for advertising</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            6. Data Security
                        </h2>
                        <p className="text-body text-dark-700">
                            We implement appropriate technical and
                            organizational measures to protect your personal
                            information. However, no method of transmission over
                            the internet is 100% secure, and we cannot guarantee
                            absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            7. Your Rights
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            You have the right to:
                        </p>
                        <ul className="list-disc space-y-2 pl-5 text-body text-dark-700">
                            <li>Access your personal information</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Object to data processing</li>
                            <li>Request data portability</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            8. Children&apos;s Privacy
                        </h2>
                        <p className="text-body text-dark-700">
                            Our website is not intended for children under 13
                            years of age. We do not knowingly collect personal
                            information from children under 13.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            9. International Data Transfers
                        </h2>
                        <p className="text-body text-dark-700">
                            Your information may be transferred to and processed
                            in countries other than your own. We ensure
                            appropriate safeguards are in place for such
                            transfers.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            10. Changes to This Policy
                        </h2>
                        <p className="text-body text-dark-700">
                            We may update this Privacy Policy from time to time.
                            We will notify you of any changes by posting the new
                            policy on this page with an updated effective date.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            11. Contact Us
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            If you have questions about this Privacy Policy or
                            our data practices, please contact us at:
                        </p>
                        <div className="rounded-lg bg-light-200 p-6">
                            <p className="text-body text-dark-700">
                                Email: privacy@nike.com
                                <br />
                                Phone: 1-800-NIKE-PRIVACY
                                <br />
                                Address: Nike Privacy Office, One Bowerman
                                Drive, Beaverton, OR 97005
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
