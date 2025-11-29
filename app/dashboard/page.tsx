import Link from 'next/link';
import { listPresentations, getPresentation } from '@/lib/portfolio';

export default function Dashboard() {
    const presentations = listPresentations();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-2">Portfolio Presentations</h1>
                <p className="text-slate-400 mb-8">Select a presentation to view</p>

                <div className="grid gap-4">
                    {presentations.map((slug) => {
                        const presentation = getPresentation(slug);
                        if (!presentation) return null;

                        return (
                            <Link
                                key={slug}
                                href={`/p/${slug}`}
                                className="block p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-700/50 hover:border-slate-600 transition-all"
                            >
                                <h2 className="text-xl font-semibold text-white mb-1">
                                    {presentation.title}
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    {presentation.slides.length} slides • /p/{slug}
                                </p>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-12 p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-3">Quick Start</h3>
                    <p className="text-slate-400 text-sm mb-4">
                        Create new presentations by composing projects in <code className="text-blue-400">lib/portfolio/presentations/</code>
                    </p>
                    <div className="text-xs text-slate-500 font-mono bg-slate-900/50 p-4 rounded-lg overflow-x-auto">
                        <pre>{`import { buildPresentation } from '@/lib/portfolio';

const myPresentation = buildPresentation({
  id: 'my-presentation',
  roleType: 'full-stack',
  target: { companyName: 'Acme', roleName: 'Developer', roleType: 'full-stack' },
  projectIds: ['page-builder', 'rag-system'],
  includeTechStack: true,
  includeWhyStockholm: true,
});`}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
