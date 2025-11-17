import Image from 'next/image';
import Link from 'next/link';

export const FeatureSection = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-linear-to-r from-white to-orange-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
                    {/* Left Content */}
                    <div className="p-8 lg:p-16">
                        <p className="text-pink-500 font-semibold mb-4">
                            Bold & Sporty
                        </p>
                        <h2 className="text-4xl lg:text-5xl font-bold text-dark-900 mb-6 leading-tight">
                            NIKE REACT
                            <br />
                            PRESTO BY YOU
                        </h2>
                        <p className="text-dark-700 text-lg mb-8 max-w-md">
                            Take advantage of brand new, proprietary cushioning
                            technology with a fresh pair of Nike react shoes.
                        </p>
                        <Link
                            href="/products"
                            className="inline-block bg-dark-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-dark-800 transition-colors"
                        >
                            Shop Now
                        </Link>
                    </div>

                    {/* Right Image */}
                    <div className="relative h-64 lg:h-full min-h-[400px] hidden lg:block">
                        <div className="absolute inset-0 bg-linear-to-br from-orange-300 to-orange-400 transform skew-x-12 origin-top-left"></div>
                        <Image
                            src="/feature.png"
                            alt="Nike React Presto"
                            className="absolute inset-0 w-full h-full object-contain z-10 p-8"
                            fill
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
