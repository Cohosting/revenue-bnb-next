import React, { useRef, useEffect, useState } from 'react';
import circle from '@turf/circle'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { MapDropdown } from './../Components/MapDropdown'
import { AirbnbListing } from './AirbnbListings'
mapboxgl.accessToken = 'pk.eyJ1IjoiaGltZTEyNiIsImEiOiJjbHR3b3BteTkwMGgzMmlxbHVsdzJhM2w5In0.MBIWm9UAEK32hg6c9D2Z4g';

const getHtmlMarker = (value) => {

    return '<div>' + '<div class="lock-container ">' +
        `<p><strong id="map-data"> ${value}</strong> </p>` +
        '</div>' +
        '</div>'
}
const createHomeInstace = (mapIntance, results) => {

    const customMarkerElement = document.createElement('div');
    customMarkerElement.className = 'custom-marker';
    customMarkerElement.innerHTML = '<div class="home-container home-lock">' +
        '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" font-size="18px" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 0 0 .707-1.707l-9-9a.999.999 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 13zm7 7v-5h4v5h-4zm2-15.586 6 6V15l.001 5H16v-5c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v5H6v-9.586l6-6z"></path></svg>'
        +
        '</div>';

    // Add marker to map
    const marker = new mapboxgl.Marker(customMarkerElement)
        .setLngLat(results.coordinates)
        .addTo(mapIntance);

    customMarkerElement.addEventListener('mouseenter', () => {

        const popup = new mapboxgl.Popup({ offset: 25, className: 'home-popup', closeOnClick: true, closeButton: false })
            .setLngLat(marker.getLngLat())
            .setHTML(`<h3 style="font-size: 18px; font-weight: 500 ">${results.location}</h3>`)
            .addTo(mapIntance);


        customMarkerElement.addEventListener('mouseleave', () => {
            popup.remove();


        });
    });


};


const createCompareableInstance = (mapIntance, data, handleToggle) => {

    const customMarkerElement = document.createElement('div');
    customMarkerElement.className = 'custom-marker';
    customMarkerElement.innerHTML = '<div class="lock-container ">' +
        `<p><strong id="map-data"> ${data.average_occupancy_rate_ltm}%</strong> </p>` +
        '</div>';

    // Add marker to map
    const marker = new mapboxgl.Marker(customMarkerElement)
        .setLngLat([data.longitude, data.latitude])
        .addTo(mapIntance);




    customMarkerElement.addEventListener('mouseenter', () => {
        const popup = new mapboxgl.Popup({ offset: 25, className: 'home-popup', closeOnClick: true, closeButton: false })
            .setLngLat(marker.getLngLat())
            .setHTML(`
            <div class="comparable-item">
        <img class="property-image" src=" https://a0.muscache.com/im/pictures/${data.thumbnail_url}?aki_policy=large">
        <div class="details">
            <div class="price">
                <strong>$${data.annual_revenue_ltm}</strong><small>/yr</small>
            </div>
            <div class="features">
                ${data.bedrooms} Br • ${data.bathrooms} Ba • 9 Guests
            </div>
            <div class="property-name">
               ${data.name.slice(0, 25 - 3) + '...'}
            </div>
            <div class="occupancy">
                $${data.average_daily_rate_ltm} ADR ${data.average_occupancy_rate_ltm
                }% Occup.
            </div>
        </div>
    </div>
            
            `)
            .addTo(mapIntance);

        customMarkerElement.addEventListener('mouseleave', () => {
            popup.remove()

        });
    });

    customMarkerElement.addEventListener('click', () => {
        handleToggle(data);
    });

    return marker



}

export const Map = ({ compareableProperty, results }) => {
    const mapContainer = useRef(null);
    const mapRef = useRef(null); // New ref to store the map object
    const [currentSelectedMapDataType, setCurrentSelectedMapDataType] = useState('Occupancy');
    const markers = useRef([]); // Array to store marker references
    const { isOpen, onToggle, onClose } = useDisclosure();
    const [currentClickedProperty, setCurrentClickedProperty] = useState(null);

    console.log({ currentClickedProperty })
    const handleToggle = (data) => {
        setCurrentClickedProperty(data);
        onToggle()
    };

    const handleClose = () => {
        setCurrentClickedProperty(null)
        onClose();
    };
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/outdoors-v12',
            center: results.coordinates,
            zoom: 11.5,
        });
        mapRef.current = map;

        map.on('load', () => {

            console.log(results);
            const center = results.coordinates; // Replace with your circle center coordinates
            const radius = results.radius_used; // Replace with your desired radius in kilometers
            const circlePolygon = circle(center, radius, { units: 'meters' });

            map.addLayer({
                id: 'circle',
                type: 'fill',
                source: {
                    type: 'geojson',
                    data: circlePolygon
                },
                paint: {
                    'fill-color': '#009DAE',
                    'fill-opacity': 0.5
                }
            });

            compareableProperty.forEach((property, index) => {
                const marker = createCompareableInstance(map, {
                    ...property,
                    index,

                }, handleToggle);

                marker.data = property;
                markers.current.push(marker); // Add marker reference to array
            });
            createHomeInstace(map, results);

        });


        return () => map.remove();
    }, []);

    useEffect(() => {
        const map = mapRef.current;


        if (map) {
            markers.current.forEach((marker) => {


                const markerElement = marker.getElement();


                console.log(marker.data)
                // Update marker content based on selected data type
                if (currentSelectedMapDataType === 'Occupancy') {
                    markerElement.innerHTML = getHtmlMarker(marker.data.average_occupancy_rate_ltm + '%'
                    );
                } else if (currentSelectedMapDataType === 'Annual revenue') {

                    markerElement.innerHTML = getHtmlMarker('$' + Math.ceil(marker.data.annual_revenue_ltm / 1000) + 'k'

                    );
                } else {
                    // Handle other data types (optional)

                    markerElement.innerHTML = getHtmlMarker('$' + marker.data.average_daily_rate_ltm

                    );
                }

                // If needed, adjust marker styling or other properties
            });
        }
    }, [currentSelectedMapDataType, mapRef.current]);



    return (
        <Box pos="relative">
            <MapDropdown onSelect={(value) => setCurrentSelectedMapDataType(value)} />
            <Box ref={mapContainer} style={{ width: '100%', height: '600px' }} />
            <Button onClick={() => {
                // You can add your custom marker creation logic here
            }}>
                Show popup
            </Button>
            <AirbnbListing property={currentClickedProperty} isOpen={isOpen} onClose={handleClose} />

        </Box>
    );
};