import { Star } from 'lucide-react';
import { getProductReviews } from '@/lib/actions/product';

interface ProductReviewsProps {
    productId: string;
}

export async function ProductReviews({ productId }: ProductReviewsProps) {
    const reviews = await getProductReviews(productId);

    if (reviews.length === 0) {
        return (
            <div className="py-6">
                <p className="text-body text-dark-700">
                    No reviews yet. Be the first to review this product!
                </p>
            </div>
        );
    }

    const averageRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length;

    return (
        <div className="space-y-6">
            {/* Rating Summary */}
            <div className="flex items-center gap-3">
                <div className="flex">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-5 h-5 ${
                                i < Math.floor(averageRating)
                                    ? 'fill-dark-900 text-dark-900'
                                    : 'text-dark-500'
                            }`}
                        />
                    ))}
                </div>
                <span className="text-body-medium text-dark-900">
                    {averageRating.toFixed(1)} out of 5
                </span>
                <span className="text-body text-dark-700">
                    ({reviews.length}{' '}
                    {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="border-t border-light-300 pt-4"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${
                                                    i < review.rating
                                                        ? 'fill-dark-900 text-dark-900'
                                                        : 'text-dark-500'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-body-medium text-dark-900">
                                        {review.author}
                                    </span>
                                </div>
                                {review.title && (
                                    <h4 className="text-body-medium text-dark-900 mb-1">
                                        {review.title}
                                    </h4>
                                )}
                            </div>
                            <span className="text-caption text-dark-700">
                                {new Date(review.createdAt).toLocaleDateString(
                                    'en-US',
                                    {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    },
                                )}
                            </span>
                        </div>
                        <p className="text-body text-dark-700 leading-relaxed">
                            {review.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
