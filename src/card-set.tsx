import { FC } from "react";
import KingdomSupply from "./kingdom-supply";
import Sideboard from "./sideboard";

interface Props {}

const CardSet: FC<Props> = () => {
    return <>
        <KingdomSupply />
        <Sideboard />
    </>;
}

export default CardSet;