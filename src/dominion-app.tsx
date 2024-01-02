import { FC, PropsWithChildren } from "react";
import { KingdomContextProvider } from "./kingdom-context";
import { BrowserRouter } from "react-router-dom";

const DominionApp: FC<PropsWithChildren> = (
    {
        children
    }: PropsWithChildren
) => {
    return (
        <BrowserRouter>
            <KingdomContextProvider>
                {children}
            </KingdomContextProvider>
        </BrowserRouter>
    )
};

export default DominionApp;