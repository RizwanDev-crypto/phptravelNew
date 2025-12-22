"use client";

import { useState, useEffect } from "react";
import { 
  TextField, 
  Grid, 
  IconButton, 
  InputAdornment, 
  MenuItem, 
  Box, 
  Button,
  Stack,
  useMediaQuery,
  useTheme,
  FormControl,
  OutlinedInput,
  InputLabel,
  Menu,
  Typography
} from "@mui/material";
import { MapPin, Search } from "lucide-react";
import { ExpandMore } from "@mui/icons-material";
import TravellersDropdown from "./TravellersDropDown";

// Sample countriesAirports data (replace with your full array)
const countriesAirports = [
  {
    country: "UAE",
    cities: [
      { city: "Dubai", airport: "Dubai International Airport", code: "DXB" },
      { city: "Abu Dhabi", airport: "Abu Dhabi Intl Airport", code: "AUH" },
    ],
  },
  {
    country: "Pakistan",
    cities: [
      { city: "Karachi", airport: "Jinnah International Airport", code: "KHI" },
      { city: "Lahore", airport: "Allama Iqbal Airport", code: "LHE" },
    ],
  },
  {
    country: "India",
    cities: [
      { city: "Delhi", airport: "Indira Gandhi International Airport", code: "DEL" },
      { city: "Mumbai", airport: "Chhatrapati Shivaji Maharaj Airport", code: "BOM" },
    ],
  },
];

// Custom CityDropdown Component
const CityDropdown = ({ label, value, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchTerm("");
  };

  // Flatten all cities
  const allCities = countriesAirports.flatMap((country) =>
    country.cities.map((city) => ({
      ...city,
      country: country.country,
    }))
  );

  const selectedCity = allCities.find(c => `${c.city}, ${c.country}` === value);

  const filteredCities = allCities.filter(
    (city) =>
      city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (city) => {
    onChange(`${city.city}, ${city.country}`);
    handleClose();
  };

  return (
    <>
      <FormControl fullWidth variant="outlined" size="small">
        <OutlinedInput
          value={value || ""}
          onClick={handleClick}
          readOnly
          startAdornment={
            <InputAdornment position="start">
              <MapPin size={18} />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <ExpandMore 
                sx={{ 
                  fontSize: 16,
                  transform: anchorEl ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                  cursor: "pointer"
                }}
                onClick={handleClick}
              />
            </InputAdornment>
          }
          sx={{
            height: 44,
            fontSize: "14px",
            cursor: "pointer",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#c0c0c0",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1976d2",
            },
            "&:hover": {
              backgroundColor: "#f0f7ff",
            },
            "& input": {
              cursor: "pointer",
            },
            fontFamily: "'Inter', sans-serif",
          }}
          placeholder={label}
        />
      </FormControl>

      <Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleClose}
  disableScrollLock
  PaperProps={{
    sx: {
      maxHeight: 200,
      width: 270,
      mt: 1,
    },
  }}
>
        {/* Search Input */}
        <Box sx={{ p: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{

              "& .MuiOutlinedInput-root": {
                height: 26,
               
                fontSize: "12px",
                fontFamily: "'Inter', sans-serif",
              },
            }}
          />
        </Box>

        {/* City List */}
        {filteredCities.length === 0 ? (
          <MenuItem disabled sx={{ fontSize: "10px", py: 1, fontFamily: "'Inter', sans-serif" }}>
            No cities found
          </MenuItem>
        ) : (
          filteredCities.map((city) => (
            <MenuItem
              key={`${city.city}-${city.country}`}
              onClick={() => handleSelect(city)}
              sx={{
                fontSize: "10px",
                py: 1,
                borderBottom: "1px solid #f0f0f0",
                "&:last-child": {
                  borderBottom: "none",
                },
                "&:hover": {
                  backgroundColor: "#f0f7ff",
                },
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Box>
               <Typography fontWeight={700} sx={{ fontSize: "10px" }} fontFamily="'Inter', sans-serif">
                  {city.city}, {city.country}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontFamily="'Inter', sans-serif">
                  {city.code} - {city.airport}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

const HotelSearchForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const [citySearch, setCitySearch] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [travellers, setTravellers] = useState({ adults: 2, children: 0, infants: 0 });
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  // Set initial dates
  useEffect(() => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    setCheckInDate(today.toISOString().split("T")[0]);
    setCheckOutDate(nextWeek.toISOString().split("T")[0]);
  }, []);

  return (
    <Box sx={{ 
      fontFamily: "'Inter', sans-serif",
      p: isMobile ? 2 : 0,
    }}>
      {isMobile ? (
        // MOBILE LAYOUT - STACKED COLUMNS
        <Stack spacing={2}>
          {/* City Search */}
          <Box>
            <CityDropdown 
              label="Search by city"
              value={selectedCity ? `${selectedCity.city}, ${selectedCity.country}` : citySearch}
              onChange={(value) => {
                const city = countriesAirports.flatMap(c => c.cities).find(c => `${c.city}, ${c.country}` === value);
                setSelectedCity(city);
                setCitySearch(value);
              }}
            />
          </Box>

          {/* Check-In and Check-Out - Mobile Stacked */}
          <Stack spacing={2}>
            {/* Check-In */}
            <Box>
              <TextField
                label="Check-In Date"
                type="date"
                size="small"
                fullWidth
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                sx={{
                  "& .MuiInputBase-root": { 
                    height: 44,
                    fontFamily: "'Inter', sans-serif",
                  },
                }}
                inputProps={{ 
                  style: { 
                    height: 44,
                    fontSize: "14px",
                    fontFamily: "'Inter', sans-serif",
                  }
                }}
                InputLabelProps={{
                  style: { 
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                  }
                }}
              />
            </Box>

            {/* Check-Out */}
            <Box>
              <TextField
                label="Check-Out Date"
                type="date"
                size="small"
                fullWidth
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                sx={{
                  "& .MuiInputBase-root": { 
                    height: 44,
                    fontFamily: "'Inter', sans-serif",
                  },
                }}
                inputProps={{ 
                  style: { 
                    height: 44,
                    fontSize: "14px",
                    fontFamily: "'Inter', sans-serif",
                  }
                }}
                InputLabelProps={{
                  style: { 
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                  }
                }}
              />
            </Box>
          </Stack>

          {/* Travellers */}
          <Box>
            <TravellersDropdown 
              travellers={travellers} 
              onTravellersChange={setTravellers} 
              sx={{
                fontFamily: "'Inter', sans-serif",
                "& .MuiButton-root": {
                  height: 44,
                  fontSize: "14px",
                  fontFamily: "'Inter', sans-serif",
                },
              }}
            />
          </Box>

          {/* Search Button - Mobile */}
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Search size={20} />}
              fullWidth
              sx={{
                height: 44,
                fontSize: "16px",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 1,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Search Hotels
            </Button>
          </Box>
        </Stack>
      ) : (
        // DESKTOP LAYOUT - ORIGINAL GRID
        <Grid container spacing={1} alignItems="center" margin={2} paddingTop={2} paddingBottom={2}>
          {/* City */}
          <Grid item xs={12} sm={4}>
            <Box sx={{ width: 270 }}>
              <CityDropdown 
                label="Search by city"
                value={selectedCity ? `${selectedCity.city}, ${selectedCity.country}` : citySearch}
                onChange={(value) => {
                  const city = countriesAirports.flatMap(c => c.cities).find(c => `${c.city}, ${c.country}` === value);
                  setSelectedCity(city);
                  setCitySearch(value);
                }}
              />
            </Box>
          </Grid>

          {/* Check-In and Check-Out - Desktop Side by Side */}
          <Box sx={{ display: "flex", justifyContent: "space-around", gap: 1 }}>
            <Grid item xs={12} sm={2}>
              <TextField
                label="Check-In"
                type="date"
                size="small"
                fullWidth
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                sx={{
                  "& .MuiInputBase-root": { 
                    height: 40,
                    fontFamily: "'Inter', sans-serif",
                  },
                }}
                inputProps={{ 
                  style: { 
                    height: 40,
                    width: "160px", 
                    padding: "0 8px", 
                    fontSize: "12px",
                    fontFamily: "'Inter', sans-serif",
                  }
                }}
                InputLabelProps={{
                  style: { fontFamily: "'Inter', sans-serif" }
                }}
              />
            </Grid>

            {/* Check-Out */}
            <Grid item xs={12} sm={2}>
              <TextField
                label="Check-Out"
                type="date"
                size="small"
                fullWidth
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                sx={{
                  "& .MuiInputBase-root": { 
                    height: 40,
                    fontFamily: "'Inter', sans-serif",
                  },
                }}
                inputProps={{ 
                  style: { 
                    height: 40,
                    width: "160px", 
                    padding: "0 8px", 
                    fontSize: "12px",
                    fontFamily: "'Inter', sans-serif",
                  }
                }}
                InputLabelProps={{
                  style: { fontFamily: "'Inter', sans-serif" }
                }}
              />
            </Grid>
          </Box>

          {/* Travellers */}
          <Grid item xs={12} sm={3}>
            <TravellersDropdown 
              travellers={travellers} 
              onTravellersChange={setTravellers} 
              sx={{
                fontFamily: "'Inter', sans-serif",
                "& .MuiButton-root": {
                  height: 40,
                  width: { xs: 189 , lg:160}, 
                  fontSize: "12px",
                  fontFamily: "'Inter', sans-serif",
                },
              }}
            />
          </Grid>

          {/* Search Button */}
          <Grid item xs={12} sm={2}>
            <IconButton
              color="primary"
              size="small"
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#115293" },
                width: "100%",
                height: 40,
                px:1,
                borderRadius: 1,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Search style={{ color: "white" }} />
            </IconButton>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default HotelSearchForm;