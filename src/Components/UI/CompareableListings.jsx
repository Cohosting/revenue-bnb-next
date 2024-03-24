import { Flex, Box } from "@chakra-ui/react";
import { ListingFilter } from './../ListingFilter'
import { useState } from "react";

const labels = ['Property name', 'Revenue', 'Nightly Name', "Occupancy", 'Pool', 'Hot tub'];


const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // meters = earth's radius (approx)

    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const dLat = lat2Rad - lat1Rad;
    const dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // distance in meters
};
const TableBox = ({ value, ...otherProps }) => {

    return (
        <Box
            flex="0 0 auto"  // Allow data to grow, but don't shrink
            width="200px"  // Set a fixed width for each data cell
            height="100px"  // Set a fixed height for each data cell
            {...otherProps}
        >
            {value}
        </Box>
    )
}

export const CompareableListings = ({ listings, results }) => {
    const [filter, setFilter] = useState('nearest');
    function filterProperties(data, selectedOption, baseLocation) {

        console.log(baseLocation.coordinates);
        if (selectedOption === "nearest") {
            return data.sort((propertyA, propertyB) => {
                const distanceA = calculateDistance(
                    baseLocation.coordinates[1],
                    baseLocation.coordinates[0],
                    propertyA.latitude,
                    propertyA.longitude
                );
                const distanceB = calculateDistance(
                    baseLocation.coordinates[1],
                    baseLocation.coordinates[0],
                    propertyB.latitude,
                    propertyB.longitude
                );
                return distanceA - distanceB;
            });
        } else {
            // Existing logic for regular filtering based on selectedOption (occupancy, rate, revenue)
            switch (selectedOption) {
                case "occupancy-high-to-low":
                    return data.sort((a, b) => b.average_occupancy_rate_ltm - a.average_occupancy_rate_ltm);
                case "occupancy-low-to-high":
                    return data.sort((a, b) => a.average_occupancy_rate_ltm - b.average_occupancy_rate_ltm);
                case "rate-low-to-high":
                    return data.sort((a, b) => a.average_daily_rate_ltm - b.average_daily_rate_ltm);
                case "rate-high-to-low":
                    return data.sort((a, b) => b.average_daily_rate_ltm - a.average_daily_rate_ltm);
                case "revenue-low-to-high":
                    return data.sort((a, b) => a.annual_revenue_ltm - b.annual_revenue_ltm);
                case "revenue-high-to-low":
                    return data.sort((a, b) => b.annual_revenue_ltm - a.annual_revenue_ltm);
                default:
                    return data;
            }
        }
    }
    return (
        <>
            <ListingFilter value={filter} onChange={(e) => setFilter(e.target.value)} />
            <Flex
                overflowX="auto"  // Enable horizontal scrolling if content overflows
                css={{
                    "&::-webkit-scrollbar": {
                        height: "7px",  // Adjust scrollbar height as needed
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "#888",  // Adjust scrollbar color as needed
                        borderRadius: "8px",
                    },
                }}
            >
                {/* Wrapper for table labels and data */}
                <Box minWidth="100%">
                    {/* Table labels */}
                    <Flex mb={'15px'}>
                        {
                            labels.map((label, idx) => (
                                <Box
                                    flex="0 0 auto"  // Allow labels to grow, but don't shrink
                                    textAlign={idx !== 0 ? "center" : ""}
                                    width="200px"  // Set a fixed width for each label
                                >
                                    {label}
                                </Box>
                            ))
                        }

                    </Flex>

                    {/* Table data */}
                    {
                        filterProperties(listings, filter, results).map((list, idx) => (
                            <Flex>
                                <TableBox cursor={'pointer'} onClick={() => window.open(`https://www.airbnb.com/rooms/${list.listing_id}`, '_blank')} textOverflow={'ellipsis'} textDecor={'underline'} value={idx + 1 + '.' + ' ' + list.name} />
                                <TableBox textAlign={'center'} value={`${Math.floor(list.annual_revenue_ltm / 12)}$`} />
                                <TableBox textAlign={'center'} value={`${list.average_daily_rate_ltm}$`} />
                                <TableBox textAlign={'center'} value={`${list.average_occupancy_rate_ltm}%`} />
                                <TableBox textAlign={'center'} value={list.amenities.pool ? '✅' : '❌'} />
                                <TableBox textAlign={'center'} value={list.amenities.hot_tub ? '✅' : '❌'} />

                            </Flex>
                        ))
                    }
                </Box>
            </Flex>
        </>
    );
};

