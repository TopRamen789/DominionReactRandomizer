import { FC } from "react";
import D from 'dominionrandomizercore';
import styles from './card.module.css';

interface Props { 
    variant: CardVariant;
    card: D.ICard;
    randomize: (card: D.ICard) => void;
}

export enum CardVariant {
    Sideboard,
    Supply
}

const Card: FC<Props> = (
{
    variant,
    card,
    randomize
}: Props) => {
    let height, width;
    if(variant === CardVariant.Sideboard) {
        height = 200;
        width = 320;
    }
    if(variant === CardVariant.Supply) {
        height = 320;
        width = 200;
    }

    // const randomizeCard = useCallback(() => {
    //     ;
    // }, [card]);

    return <button className={styles.button} onClick={() => randomize(card)}>
        <img height={height} width={width} src={card.image as string} />;
    </button>;
}

export default Card;