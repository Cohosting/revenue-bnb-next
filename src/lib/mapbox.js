const ACCESS_TOKEN =
  'pk.eyJ1IjoiaGltZWwxMjYiLCJhIjoiY2wxZ2FoeHM4MDd2OTNyb3JlcHZub3R4biJ9.iXUC5niBfA83FT2MYlWvpg';

const URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

export const getLatLngFromString = async (text) => {
  const response = await fetch(
    `${URL}${text}.json?access_token=${ACCESS_TOKEN}`
  );

  const data = await response.json();

  // first one is longitude and second is latitude

  return data.features[0].geometry.coordinates;
};


export const getAddress = async (lng, lat) => {
  try {
    console.log({ lng, lat })
    const response = await fetch(
      ` https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=poi&access_token=${ACCESS_TOKEN}`
    );
    const data = await response.json();

    if (data.features && data.features.length !== 0) {
      return data.features[0].place_name

    } else {

      return {
        isError: true
      }
    }



  } catch (err) {
    console.log(err)
  }

}