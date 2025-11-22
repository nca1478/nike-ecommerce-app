import { CartPageContent } from '@/components/Cart/CartPageContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cart | Nike',
    description: 'Your shopping cart',
};

export default function CartPage() {
    return <CartPageContent />;
}
