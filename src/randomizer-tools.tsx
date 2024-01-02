import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useKingdomContext } from "./kingdom-context";

interface Props {}

const RandomizerTools: FC<Props> = () => {
    const navigate = useNavigate();
    const { reroll, getRandomKotW } = useKingdomContext();

    const randomKotwClick = () => {
        getRandomKotW();
        // navigate('/kotw');
    }

    const randomSupplyClick = () => {
        reroll();
        // navigate('/');
    }

    return <>
        <button onClick={randomKotwClick}>
            Random KotW
        </button>
        <button onClick={randomSupplyClick}>
            Random Supply
        </button>
    </>;
}

export default RandomizerTools;