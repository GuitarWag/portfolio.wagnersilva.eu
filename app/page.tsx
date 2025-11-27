import { Presentation } from '@/components/Presentation';
import { portfolioData } from '@/lib/data/new-presentation';

export default function Home() {
    return <Presentation data={portfolioData} />;
}
