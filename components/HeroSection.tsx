import Link from 'next/link';

export const HeroSection = () => {
    return (
        <section className="relative from-gray-100 to-gray-200 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left Content */}
                    <div className="space-y-6 z-10">
                        <p className="text-pink-500 font-semibold text-sm uppercase tracking-wide">
                            Bold & Sporty
                        </p>
                        <h1 className="text-5xl lg:text-6xl font-black text-dark-900 leading-tight">
                            Style That Moves
                            <br />
                            With You.
                        </h1>
                        <p className="text-lg text-dark-700 max-w-md">
                            Not just style. Not just comfort. Footwear that
                            effortlessly moves with your every step.
                        </p>
                        <Link
                            href="/products"
                            className="inline-block bg-dark-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-dark-800 transition-colors"
                        >
                            Find Your Shoe
                        </Link>
                    </div>

                    {/* Right Content - Shoe Image */}
                    <div className="relative">
                        {/* Background decorative elements */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-96 h-96 bg-pink-200 rounded-full opacity-30 blur-3xl"></div>
                        </div>

                        {/* Shoe Image */}
                        <div className="relative z-10">
                            <img
                                src="/hero-shoe.png"
                                alt="Nike Air Jordan"
                                className="w-full h-auto transform hover:scale-105 transition-transform duration-300"
                            />
                            {/* AIR Text */}
                            <div className="absolute top-1/4 right-0 text-orange-500 font-black text-6xl lg:text-8xl opacity-80">
                                AIR
                            </div>
                            {/* JORDEN Text */}
                            <div className="absolute bottom-1/4 right-0 text-dark-900 font-black text-5xl lg:text-7xl">
                                JORDEN
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background silhouettes */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-10 left-20 text-9xl">👟</div>
                <div className="absolute bottom-20 right-40 text-9xl">👟</div>
            </div>
        </section>
    );
};
