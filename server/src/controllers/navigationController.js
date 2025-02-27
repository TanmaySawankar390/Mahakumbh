import Camera from '../models/Camera.js';

const getTrafficCategory = (traffic) => {
  if (traffic < 50) return 'safe';
  if (traffic < 150) return 'medium';
  return 'crowded';
};

export const getSafeRoute = async (req, res) => {
  try {
    const { longitude, latitude } = req.query;
    if (!longitude || !latitude) {
      return res.status(400).json({ error: 'Longitude and latitude are required.' });
    }
    
    console.log(`Received coordinates: longitude=${longitude}, latitude=${latitude}`);
    
    // Increase search radius to 3 km (for example)
    const radiusInRadians = 5000 / 6378137;
    
    const nearbyCameras = await Camera.find({
      location: {
        $geoWithin: {
          $centerSphere: [[parseFloat(longitude), parseFloat(latitude)], radiusInRadians]
        }
      }
    }).sort({ traffic: 1 });
    
    console.log(`Found ${nearbyCameras.length} cameras near the location`);
    
    if (nearbyCameras.length === 0) {
      return res.status(404).json({ error: 'No cameras found near your location.' });
    }
    
    const categorizedCameras = nearbyCameras.map(camera => ({
      _id: camera._id,
      cameraName: camera.cameraName,
      ipAddress: camera.ipAddress,
      location: camera.location,
      traffic: camera.traffic,
      description: camera.description,
      trafficCategory: getTrafficCategory(camera.traffic)
    }));
    
    const recommendedZone = categorizedCameras[0];
    
    res.json({
      recommendedZone,
      nearbyCameras: categorizedCameras
    });
  } catch (error) {
    console.error('Error in getSafeRoute:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
