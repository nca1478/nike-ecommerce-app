import Link from 'next/link';

export default function TermsOfUsePage() {
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
                    Terms of Use
                </h1>
                <p className="mb-8 text-caption text-dark-700">
                    Last Updated: November 20, 2025
                </p>

                <div className="space-y-8">
                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-body text-dark-700">
                            By accessing and using this website, you accept and
                            agree to be bound by these Terms of Use and all
                            applicable laws and regulations. If you do not agree
                            with any of these terms, you are prohibited from
                            using this site.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            2. Use License
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            Permission is granted to temporarily access the
                            materials on Nike&apos;s website for personal,
                            non-commercial transitory viewing only.
                        </p>
                        <div className="rounded-lg bg-light-200 p-6">
                            <h3 className="mb-3 text-body-medium font-medium text-dark-900">
                                This license does not permit you to:
                            </h3>
                            <ul className="list-disc space-y-2 pl-5 text-body text-dark-700">
                                <li>Modify or copy the materials</li>
                                <li>Use materials for commercial purposes</li>
                                <li>
                                    Attempt to reverse engineer any software
                                </li>
                                <li>
                                    Remove copyright or proprietary notations
                                </li>
                                <li>Transfer materials to another person</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            3. User Account
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            To access certain features, you may be required to
                            create an account. You are responsible for:
                        </p>
                        <ul className="list-disc space-y-2 pl-5 text-body text-dark-700">
                            <li>
                                Maintaining the confidentiality of your account
                            </li>
                            <li>
                                All activities that occur under your account
                            </li>
                            <li>
                                Notifying us immediately of unauthorized use
                            </li>
                            <li>Providing accurate registration information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            4. Prohibited Activities
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            You may not use this website to:
                        </p>
                        <ul className="list-disc space-y-2 pl-5 text-body text-dark-700">
                            <li>Violate any applicable laws or regulations</li>
                            <li>Infringe upon intellectual property rights</li>
                            <li>Transmit harmful code or malicious software</li>
                            <li>Engage in fraudulent activities</li>
                            <li>Harass or harm other users</li>
                            <li>Collect user information without consent</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            5. Intellectual Property
                        </h2>
                        <p className="text-body text-dark-700">
                            All content on this website, including text,
                            graphics, logos, images, and software, is the
                            property of Nike and protected by international
                            copyright and trademark laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            6. User-Generated Content
                        </h2>
                        <p className="mb-4 text-body text-dark-700">
                            By submitting content to our website (reviews,
                            comments, etc.), you grant Nike a non-exclusive,
                            worldwide, royalty-free license to use, reproduce,
                            and display such content.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            7. Disclaimer
                        </h2>
                        <p className="text-body text-dark-700">
                            The materials on Nike&apos;s website are provided
                            &quot;as is&quot;. Nike makes no warranties,
                            expressed or implied, and hereby disclaims all other
                            warranties including, without limitation, implied
                            warranties of merchantability or fitness for a
                            particular purpose.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            8. Limitations
                        </h2>
                        <p className="text-body text-dark-700">
                            Nike shall not be held liable for any damages
                            arising out of the use or inability to use the
                            materials on this website, even if Nike has been
                            notified of the possibility of such damage.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            9. Modifications
                        </h2>
                        <p className="text-body text-dark-700">
                            Nike may revise these Terms of Use at any time
                            without notice. By using this website, you agree to
                            be bound by the current version of these terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-heading-3 font-medium text-dark-900">
                            10. Governing Law
                        </h2>
                        <p className="text-body text-dark-700">
                            These terms are governed by and construed in
                            accordance with the laws of the United States, and
                            you irrevocably submit to the exclusive jurisdiction
                            of the courts in that location.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
