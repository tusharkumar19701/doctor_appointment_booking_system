import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Sep","Oct","Nov","Dec"];
    
    const currency = '₹';

    const formatSlotDate = (slotDate) => {
        const date = slotDate.split('_');
        return date[0] +" "+ months[Number(date[1])] +" "+ date[2];
    }

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);

        let age = today.getFullYear() - birthDate.getFullYear();
        return age;
    }
    const value = {
        calculateAge,formatSlotDate,currency
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;