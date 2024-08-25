"use client";  
import { RecoilRoot } from "recoil";
// 'import {useBalance} from "@repo/store/useBalance"
export const Providers = ({children}: {children: React.ReactNode}) => {
    return <RecoilRoot>
        {children}
    </RecoilRoot>
}