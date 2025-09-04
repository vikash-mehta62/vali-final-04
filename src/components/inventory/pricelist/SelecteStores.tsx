import React, { useEffect, useState } from 'react';
import Select from "react-select";
import { getAllStoresAPI } from "@/services2/operations/auth";

function SelecteStores({ setSelectedStore, selectedStore }) {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const storesData = await getAllStoresAPI();
                const formattedStores = storesData.map(({ email, storeName }) => ({
                    value: email,
                    label: storeName,
                }));
                setStores(formattedStores);
            } catch (error) {
                console.error("Error fetching stores:", error);
            }
        };

        fetchStores();
    }, []);

    return (
        <div>
            <Select
                options={stores}
                value={selectedStore}
                onChange={setSelectedStore}
                placeholder="Search and select stores..."
                isSearchable
                isMulti
            />
        </div>
    );
}

export default SelecteStores;
