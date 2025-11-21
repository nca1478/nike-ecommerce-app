'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DownloadInvoiceButtonProps {
    orderId: string;
    orderNumber: string;
}

export function DownloadInvoiceButton({
    orderId,
    orderNumber,
}: DownloadInvoiceButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);

        try {
            const response = await fetch(`/api/orders/${orderId}/invoice`);

            if (!response.ok) {
                throw new Error('Error al generar la factura');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `factura-${orderNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success('Factura descargada correctamente');
        } catch (error) {
            console.error('Error al descargar factura:', error);
            toast.error('Error al descargar la factura');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 bg-white text-black border-2 border-black px-6 py-3 rounded-full hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
        >
            <Download className="w-5 h-5" />
            {isDownloading ? 'Descargando...' : 'Descargar Factura'}
        </button>
    );
}
