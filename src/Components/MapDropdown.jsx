import React from 'react';
import { Select } from '@chakra-ui/react';

export const MapDropdown = ({ onSelect }) => {
    const [occupancy, setOccupancy] = React.useState('');

    const handleOccupancyChange = (event) => {
        const value = event.target.value
        setOccupancy(value);
        onSelect(value)
    };

    return (
        <Select
            pos={'absolute'}
            top={5}
            zIndex={99}
            backgroundColor={'white'}
            value={occupancy}
            onChange={handleOccupancyChange}
            width={'170px'}
            left={'45%'}
            fontWeight={'semibold'}
            fontSize={'14px'}
            size={'sm'}
            borderRadius={'6px'}
            boxShadow={'0 4px 6px -1px rgba(0, 0, 0, 0.1),0 2px 4px -1px rgba(0, 0, 0, 0.06)'}
        >
            <option value="Occupancy">Occupancy</option>
            <option value="Annual revenue">Annual revenue</option>
            <option value="Average daily rate">Average daily rate</option>
        </Select>
    );
};

