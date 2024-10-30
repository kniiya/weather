import { useState, useEffect } from 'react';
import { 
  Box, 
  Text, 
  Heading, 
  VStack, 
  Spinner, 
} from '@chakra-ui/react';
import { Select } from '@chakra-ui/react'; // これを追加


interface WeatherData {
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        humidity: number;
    };
    weather: {
        description: string;
    }[];
    wind: {
        speed: number;
    };
    name: string;
}

const Weather = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [selectedCity, setSelectedCity] = useState('Tokyo');
    const [error, setError] = useState<string | null>(null);
    const apiKey = "5213cdfc12d769901ace0fde782abcad";

    const fetchWeatherData = async (city: string) => {
        if (!city) {
            setError('City name cannot be empty');
            return;
        }

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${encodeURIComponent(apiKey)}`
            );

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid API key');
                } else if (response.status === 404) {
                    throw new Error('City not found');
                } else {
                    throw new Error('Failed to fetch weather data');
                }
            }

            const data = await response.json();
            setWeather(data);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching weather data:', err.message);
            setError(err.message);
        }
    };

    const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const city = event.target.value;
        setSelectedCity(city);
        fetchWeatherData(city);
    };

    useEffect(() => {
        fetchWeatherData(selectedCity);
    }, []);

    return (
        <VStack padding={4}>
            <Heading as="h1" size="xl">Weather in {selectedCity}</Heading>
            
            {error}
            
            <Select 
                value={selectedCity} 
                onChange={handleCityChange} 
                maxWidth="200px" 
                placeholder="Select city"
            >
                <option value="Tokyo">Tokyo</option>
                <option value="New York">New York</option>
                <option value="London">London</option>
                <option value="Paris">Paris</option>
                <option value="Berlin">Berlin</option>
                <option value="Sydney">Sydney</option>
                <option value="Mumbai">Mumbai</option>
            </Select>
            {/* <Select 
    value={selectedCity} 
    onChange={handleCityChange} 
    maxWidth="200px" 
    placeholder="Select city"
>
    <Box as="option" value="Tokyo">Tokyo</Box>
    <Box as="option" value="New York">New York</Box>
    <Box as="option" value="London">London</Box>
    <Box as="option" value="Paris">Paris</Box>
    <Box as="option" value="Berlin">Berlin</Box>
    <Box as="option" value="Sydney">Sydney</Box>
    <Box as="option" value="Mumbai">Mumbai</Box>
</Select> */}


            

            {weather ? (
                <Box 
                    p={5} 
                    shadow="md" 
                    borderWidth="1px" 
                    borderRadius="md" 
                    background="gray.100" 
                    maxWidth="400px"
                    textAlign="center"
                >
                    <Text fontSize="lg">Temperature: {weather.main.temp}°C</Text>
                    <Text fontSize="lg">Feels Like: {weather.main.feels_like}°C</Text>
                    <Text fontSize="lg">Weather: {weather.weather[0].description}</Text>
                    <Text fontSize="lg">Humidity: {weather.main.humidity}%</Text>
                    <Text fontSize="lg">Wind Speed: {weather.wind.speed} m/s</Text>
                </Box>
            ) : (
                !error && <Spinner size="lg" color="blue.500" />
            )}
        </VStack>
    );
};

export default Weather;
