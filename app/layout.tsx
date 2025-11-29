import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import { GA_TRACKING_ID } from '@/lib/analytics'

export const metadata: Metadata = {
    title: 'Wagner Silva - Full Stack Web Developer',
    description: 'Professional presentation portfolio',
}

const isProduction = process.env.NODE_ENV === 'production'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
            {isProduction && <GoogleAnalytics gaId={GA_TRACKING_ID} />}
        </html>
    )
}
