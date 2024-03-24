import { getAddress } from "../lib/mapbox";

// Function to retrieve the user's current location
export async function getCurrentLocation(
  setLocation,
  onClose,
  onLocationError
) {
  try {
    // Show loading spinner or perform any necessary UI actions
    // This can be handled by the caller function before invoking getCurrentLocation

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { coords } = position;

          try {
            const address = await getAddress(coords.longitude, coords.latitude);
            if (address && address.isError && address.isError === true) {
              onClose(); // Close any loading indicators
              onLocationError();
            } else {
              // Update the location with  address
              setLocation(address);
              onClose(); // Close any loading indicators
            }
          } catch (error) {
            console.error("Error occurred while fetching address:", error);
            onClose(); // Close any loading indicators
            onLocationError(); // Handle location error
          }
        },
        (error) => {
          console.error("Error occurred while fetching geolocation:", error);
          onClose(); // Close any loading indicators
          onLocationError(); // Handle location error
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser");
      onClose(); // Close any loading indicators
      onLocationError(); // Handle location error
    }
  } catch (error) {
    console.error(
      "An error occurred while retrieving the current location:",
      error
    );
    onClose(); // Close any loading indicators
    onLocationError(); // Handle location error
  }
}
