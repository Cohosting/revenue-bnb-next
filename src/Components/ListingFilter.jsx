import { Select } from "@chakra-ui/react";

const options = [
    { value: "nearest", label: "Nearest" },
    { value: "occupancy-high-to-low", label: "Occupancy: High to Low" },
    { value: "occupancy-low-to-high", label: "Occupancy: Low to High" },
    { value: "rate-high-to-low", label: "Avg-daily rate: High to Low" },

    { value: "rate-low-to-high", label: "Avg-daily rate: Low to High" },
    { value: "revenue-low-to-high", label: "Revenue/mo: Low to High" },
    { value: "revenue-high-to-low", label: "Revenue/mo: High to Low" },
];

export const ListingFilter = ({ onChange, value }) => {
    return (
        <Select bgColor={'white'} value={value} onChange={onChange}  >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </Select>
    );
};

