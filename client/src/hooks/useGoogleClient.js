import { useState, useEffect } from "react";
import axios from "axios";

const useGoogleClient = () => {
  const [googleClient, setGoogleClient] = useState(null);
  useEffect(() => {
    const fetchGoogleKey = async () => {
      const { data: googleId } = await axios.get(`/api/config/google`);
      setGoogleClient(googleId);
    };
    fetchGoogleKey();
  }, []);

  return googleClient;
};

export default useGoogleClient;
