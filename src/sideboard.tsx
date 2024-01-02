import { FC } from "react";
import Card, { CardVariant } from './card';
import { useKingdomContext } from './kingdom-context';

interface Props {}

const Sideboard: FC<Props> = () => {
    const { sideboardCards, randomizeSideboardCard } = useKingdomContext();

    return <div>
        {sideboardCards.map((card, index) =>
            <Card key={index} variant={CardVariant.Sideboard} card={card} randomize={randomizeSideboardCard} />
        )}
    </div>;
}

export default Sideboard;