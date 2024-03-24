import React, { useState, useRef, useEffect } from 'react';
import {
    LoadScript,
    GoogleMap,
    Marker,
    InfoWindow,
} from '@react-google-maps/api';

const libraries = ['places']; // Include Places library for marker details

export const GoogleMapComponent = () => {
    const [map, setMap] = useState(null);
    const [infoWindowContent, setInfoWindowContent] = useState(null);
    const infoWindowRef = useRef(null);

    const handleInfoWindowOpen = (marker) => {
        setInfoWindowContent(marker.infoContent);
    };

    const handleInfoWindowClose = () => {
        setInfoWindowContent(null);
    };

    const markerData = [
        {
            lat: 40.7128,
            lng: -74.0059,
            infoContent: (
                <div>
                    <h3>Central Park</h3>
                    <p>A large, public park in the center of Manhattan.</p>
                </div>
            ),
        },
        // Add more markers with their corresponding infoContent here
    ];

    const mapContainerStyle = {
        width: '100vw', // Adjust width and height as needed
        height: '400px',
    };

    const options = {
        disableDefaultUI: true,
        zoomControl: true,
    };

    const center = {
        lat: 40.7128,
        lng: -74.0059,
    };

    // Replace with your actual Google Maps API key
    const apiKey = 'AIzaSyACG5L2DljUhpdY662RbuLFpXMnDxSu8CQ';

    const handleMapLoad = (mapInstance) => {
        setMap(mapInstance);

        // Create the marker element
        const markerElement = document.createElement("div");
        markerElement.id = "marker";

        // Set the marker position (adjust based on your needs)
        markerElement.style.left = "50px";
        markerElement.style.top = "50px";

        // Append the marker to the map container (outside viewport initially)
        document.getElementById("map").appendChild(markerElement);

/*         infowindow.open(mapInstance, marker);
 */    };

    useEffect(() => {
        const listener = (event) => {
            if (!infoWindowRef.current || infoWindowRef.current !== event.target) {
                handleInfoWindowClose();
            }
        };
        window.addEventListener('click', listener);

        return () => {
            window.removeEventListener('click', listener);
        };
    }, []);

    return (
        <LoadScript
            googleMapsApiKey={apiKey}
            libraries={libraries}
            mapIds={'map'}
        >
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={10}
                center={center}
                options={options}
                onLoad={handleMapLoad}
            >

            </GoogleMap>
        </LoadScript>
    );
};

