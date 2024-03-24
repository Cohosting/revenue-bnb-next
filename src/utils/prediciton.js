import { setBaseResultDoc } from "./../lib/reports";

export const calculatePrediction = async (
  location,
  bedrooms,
  bathrooms,
  currentUser,
  counts,
  propertyCoordinates,
  guests
) => {
  // Check if all required data are available
  if (!location || !bedrooms || !bathrooms) {
    return;
  }
  const id = await setBaseResultDoc({
    ...counts,
    coordinates: propertyCoordinates,
    createdBy: currentUser.id,
    location,
  });

  await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      location,
      bedrooms,
      bathrooms,
      guests,
      coordinates: propertyCoordinates,
      createdByEmail: currentUser.email,
      createdBy: currentUser.id,
      reportId: id,
      existingUser: true,
      email: currentUser.email,
      fullName: currentUser.fullName,
      userType: currentUser.userType,
    }),
  });

  return { id: id };
};
