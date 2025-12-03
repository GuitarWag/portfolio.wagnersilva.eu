import { notFound } from 'next/navigation';
import { Presentation } from '@/components/Presentation';
import { getPresentation } from '@/lib/portfolio';

export const metadata = {
    title: 'Projects Portfolio',
    description: 'Comprehensive portfolio demonstrating end-to-end expertise.',
};

export default function ProjectsPage() {
    const presentation = getPresentation('general-portfolio');

    if (!presentation) {
        notFound();
    }

    return <Presentation data={presentation} />;
}
