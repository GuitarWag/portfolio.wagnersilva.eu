import { notFound } from 'next/navigation';
import { Presentation } from '@/components/Presentation';
import { getPresentation, listPresentations } from '@/lib/portfolio';

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Generate static params for all presentations
export async function generateStaticParams() {
    const presentations = listPresentations();
    return presentations.map((slug) => ({ slug }));
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const presentation = getPresentation(slug);

    if (!presentation) {
        return { title: 'Not Found' };
    }

    return {
        title: presentation.title,
        description: `Portfolio presentation: ${presentation.title}`,
    };
}

export default async function PresentationPage({ params }: PageProps) {
    const { slug } = await params;
    const presentation = getPresentation(slug);

    if (!presentation) {
        notFound();
    }

    return <Presentation data={presentation} />;
}
