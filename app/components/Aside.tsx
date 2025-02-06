import { createContext, type ReactNode, useContext, useState } from "react"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "./ui/drawer"

type AsideType = "search" | "cart" | "mobile" | "closed"
type AsideContextValue = {
    type: AsideType
    open: (mode: AsideType) => void
    close: () => void
}

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
    children,
    heading,
    type,
}: {
    children?: React.ReactNode
    type: AsideType
    heading: React.ReactNode
}) {
    const { type: activeType, close } = useAside()
    const expanded = type === activeType
    console.log(type)
    console.log(activeType)

    return (
        <Drawer
            onOpenChange={(open) => {
                if (!open) {
                    close()
                }
            }}
            open={expanded}
        >
            {/* <DrawerTrigger>Open</DrawerTrigger> */}
            <DrawerContent className="max-w-4xl mx-auto grid">
                <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>
                        This action cannot be undone.
                    </DrawerDescription>
                </DrawerHeader>
                <main>{children}</main>
                <DrawerFooter>
                    <button>Submit</button>
                    <DrawerClose>
                        <button>Cancel</button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
        // <div
        //     aria-modal
        //     className={`overlay ${expanded ? "expanded" : ""}`}
        //     role="dialog"
        // >
        //     <button className="close-outside" onClick={close} />
        //     <aside>
        //         <header>
        //             <h3>{heading}</h3>
        //             <button className="close reset" onClick={close}>
        //                 &times;
        //             </button>
        //         </header>
        //         <main>{children}</main>
        //     </aside>
        // </div>
    )
}

const AsideContext = createContext<AsideContextValue | null>(null)

Aside.Provider = function AsideProvider({ children }: { children: ReactNode }) {
    const [type, setType] = useState<AsideType>("closed")

    return (
        <AsideContext.Provider
            value={{
                type,
                open: setType,
                close: () => setType("closed"),
            }}
        >
            {children}
        </AsideContext.Provider>
    )
}

export function useAside() {
    const aside = useContext(AsideContext)
    if (!aside) {
        throw new Error("useAside must be used within an AsideProvider")
    }
    return aside
}
