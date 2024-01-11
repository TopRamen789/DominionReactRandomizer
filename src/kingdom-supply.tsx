import Card, { CardVariant } from "./card";
import { FC } from 'react';
import { useKingdomContext } from "./kingdom-context";

interface Props {}

const KingdomSupply: FC<Props> = () => {
    const { kingdomCards, randomizeSupplyCard } = useKingdomContext();

    return <div>
        {kingdomCards.map((card, index) =>
            <Card key={index} variant={CardVariant.Supply} card={card} randomize={randomizeSupplyCard} />
        )}
    </div>
}

export default KingdomSupply;