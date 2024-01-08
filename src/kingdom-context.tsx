import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from "react";
import D from 'dominionrandomizercore';

interface Props extends PropsWithChildren {}

interface Kingdom {
    getRandomKotW: () => void;
    reroll: () => void;
    randomizeSideboardCard: (card: D.ICard) => void;
    randomizeSupplyCard: (card: D.ICard) => void;
    sideboardCards: D.ICard[];
    kingdomCards: D.ICard[];
}

const KingdomContext = createContext<Kingdom|undefined>(undefined);

const NUM_SUPPLY_CARDS: number = 10;
const NUM_SIDEBOARD_CARDS: number = 3;
const KOTW_PATH: string = '../data/KotW/';

const KingdomContextProvider: FC<Props> = (
    {
        children
    }: Props
) => { 
    const cardUtilities = new D.CardUtilities();
    const allKingdomCards = cardUtilities.getKingdomSupplyCards(D.Cards);
    const [kingdomCards, setKingdomCards] = useState<D.ICard[]>([]);
    const [kingdomCardsNotInSupply, setKingdomCardsNotInSupply] = useState<D.ICard[]>([]);

    const events = cardUtilities.getEventCards();
    const projects = cardUtilities.getProjectCards();
    const landmarks = cardUtilities.getLandmarkCards();
    const ways = cardUtilities.getWayCards();
    // const allies = cardUtils.getAlliesCards();
    const allSideboardCards = [...events, ...projects, ...landmarks, ...ways/*, allies */];

    const [sideboardCards, setSideboardCards] = useState<D.ICard[]>([]);
    const [sideboardNotInSupply, setSideboardNotInSupply] = useState<D.ICard[]>([]);

    const randomize = (originalCardSet: D.ICard[], cardToRandomize: D.ICard, fromCardSet: D.ICard[]) => {
        const newCards = originalCardSet.filter(c => c.name !== cardToRandomize.name);
        const newCard = cardUtilities.pickRandomCardsFromCardSet(fromCardSet, 1)[0] as D.ICard;
        newCards.push(newCard);
        return newCards;
    };

    const randomizeSideboardCard = useCallback((card: D.ICard) => {
        const newSideboardCards = randomize(sideboardCards, card, allSideboardCards);
        setSideboardCards(newSideboardCards);
        setSideboardNotInSupply(cardUtilities.filterByOtherCardSet(allSideboardCards, sideboardNotInSupply));
    }, [sideboardCards, sideboardNotInSupply]);

    const randomizeSupplyCard = useCallback((card: D.ICard) => {
        const newKingdomCards = randomize(kingdomCards, card, kingdomCardsNotInSupply);
        setKingdomCards(newKingdomCards);
        setKingdomCardsNotInSupply(cardUtilities.filterByOtherCardSet(allKingdomCards, newKingdomCards));
    }, [kingdomCards, kingdomCardsNotInSupply]);

    const rollRandomKingdomSupply = useCallback(() => {
        const kingdomCards = cardUtilities.pickRandomCardsFromCardSet(allKingdomCards, NUM_SUPPLY_CARDS) as D.ICard[]
        const kingdomCardsNotInSupply = cardUtilities.filterByOtherCardSet(allKingdomCards, kingdomCards);
        setKingdomCards(kingdomCards);
        setKingdomCardsNotInSupply(kingdomCardsNotInSupply);
    }, []);

    const rollRandomSideboardSupply = useCallback(() => {
        const sideboardCards = cardUtilities.pickRandomCardsFromCardSet(allSideboardCards, NUM_SIDEBOARD_CARDS) as D.ICard[]
        const sideboardCardsNotInSupply = cardUtilities.filterByOtherCardSet(allSideboardCards, sideboardCards);
        setSideboardCards(sideboardCards);
        setSideboardNotInSupply(sideboardCardsNotInSupply);
    }, []);

    const reroll = useCallback(() => {
        rollRandomKingdomSupply();
        rollRandomSideboardSupply();
    }, [rollRandomKingdomSupply, rollRandomSideboardSupply]);

    const getRandomFile = async () => {
        const response = await fetch('/kotws');
        const data = await response.json();

        // Pick a random file
        const randomIndex = Math.floor(Math.random() * data.files.length);
        const selectedFile = data.files[randomIndex];
        console.log(data.files);

        // Set the state with the selected file
        return selectedFile;
    };

    const getKotW = useCallback((fileName: string) => {
        console.log(`/kotw/${fileName}`);
        fetch(`/kotw/${fileName}`)
            .then((resp) => resp.text())
            .then((data) => {
                console.log(data);

                const cardNames = data.split(',');

                const kingdomOfTheWeek = cardUtilities.filterByNames(D.Cards, cardNames);
                const eventCards = cardUtilities.getEventCards();
                const projectCards = cardUtilities.getProjectCards();
                const landmarkCards = cardUtilities.getLandmarkCards();
                const wayCards  = cardUtilities.getWayCards();
                const artifactCards = cardUtilities.getArtifactCards();
                const nonKingdomCards = [...eventCards, ...projectCards, ...landmarkCards, ...wayCards, ...artifactCards];

                const supply = cardUtilities.filterByOtherCardSet(kingdomOfTheWeek, nonKingdomCards);
                const sideboard = cardUtilities.filterByNames(kingdomOfTheWeek, nonKingdomCards.map(k => k.name));
                console.log(supply, sideboard);
                setKingdomCards(supply);
                setSideboardCards(sideboard);
            });
    }, []);

    const getRandomKotW = useCallback(async () => {
        const regex = /^(?!KotW_)\w+_\d{2}_\d{4}\.txt$/;
        let randomFile = await getRandomFile();
        console.log(randomFile);

        while(!regex.test(randomFile)) {
            randomFile = await getRandomFile();
            console.log(randomFile);
        }

        getKotW(randomFile); 
    }, []);

    const contextValue: Kingdom = {
        getRandomKotW,
        reroll,
        randomizeSideboardCard,
        randomizeSupplyCard,
        sideboardCards,
        kingdomCards
    };

    return <KingdomContext.Provider value={contextValue}>
        {children}
    </KingdomContext.Provider>;
};

const useKingdomContext = () => {
    const context = useContext(KingdomContext);
    if(!context) {
        throw new Error("Must be used within a KingdomContext!");
    }
    return context;
}

export { KingdomContextProvider, useKingdomContext };