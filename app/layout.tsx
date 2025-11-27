import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Wagner Silva - Full Stack Web Developer',
    description: 'Professional presentation portfolio',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
