import { Presentation } from '@/components/Presentation';
import { getPresentation } from '@/lib/portfolio';

export default function Home() {
    const presentation = getPresentation('stockholm-full-portfolio');

    if (!presentation) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <p className="text-white">Presentation not found</p>
            </div>
        );
    }

    return <Presentation data={presentation} />;
}
