"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  Button,
  TextField,
  MenuItem,
  IconButton,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  Typography,
  OutlinedInput,
  Menu,
} from "@mui/material";

import { ArrowRightAlt, SwapHoriz, Search, ExpandMore } from "@mui/icons-material";
import TravellersDropdown from "./TravellersDropDown";

// Example countriesAirports array - outside component to prevent re-renders
const countriesAirports = [
  { city: "Dubai", airport: "Dubai International Airport", code: "DXB" },
  { city: "Abu Dhabi", airport: "Abu Dhabi Intl Airport", code: "AUH" },
  { city: "Karachi", airport: "Jinnah International Airport", code: "KHI" },
  { city: "Lahore", airport: "Allama Iqbal Airport", code: "LHE" },
  { city: "Delhi", airport: "Indira Gandhi International Airport", code: "DEL" },
  { city: "Mumbai", airport: "Chhatrapati Shivaji Maharaj Airport", code: "BOM" },
  { city: "Riyadh", airport: "King Khalid Intl Airport", code: "RUH" },
  { city: "Jeddah", airport: "King Abdulaziz Intl Airport", code: "JED" },
  { city: "Berlin", airport: "Berlin Brandenburg Airport", code: "BER" },
  { city: "Frankfurt", airport: "Frankfurt Airport", code: "FRA" },
];

// Custom Airport Dropdown Component - useMemo se optimize kiya
const AirportDropdown = ({ label, value, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchTerm("");
  };

  const handleSelect = (airport) => {
    onChange(airport.code);
    handleClose();
  };

  const selectedAirport = useMemo(() => 
    countriesAirports.find(a => a.code === value),
    [value]
  );

  const filteredAirports = useMemo(() => 
    countriesAirports.filter(
      (airport) =>
        airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.airport.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.code.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm]
  );

  return (
    <>
      <FormControl fullWidth variant="outlined" size="small">
        <OutlinedInput
          value={selectedAirport ? `${selectedAirport.city} (${selectedAirport.code})` : ""}
          onClick={handleClick}
          readOnly
          startAdornment={
            <InputAdornment position="start">
              <ArrowRightAlt sx={{ fontSize: 16 }} />
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
            height: 40,
            fontSize: "12px",
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
      width: 200,
      mt: 1,
    },
  }}
>

        {/* Search Input */}
        <Box sx={{ p: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 36,
                fontSize: "12px",
              },
            }}
            // Prevent event bubbling
            onClick={(e) => e.stopPropagation()}
          />
        </Box>

        {/* Airport List */}
        {filteredAirports.length === 0 ? (
          <MenuItem disabled sx={{ fontSize: "12px", py: 1 }}>
            No airports found
          </MenuItem>
        ) : (
          filteredAirports.map((airport) => (
            <MenuItem
              key={airport.code}
              onClick={() => handleSelect(airport)}
              sx={{
                fontSize: "12px",
                py: 1,
                borderBottom: "1px solid #f0f0f0",
                "&:last-child": {
                  borderBottom: "none",
                },
                "&:hover": {
                  backgroundColor: "#f0f7ff",
                },
              }}
            >
              <Box>
                <Typography fontWeight={700} sx={{ fontSize: "10px" }}>
                  {airport.city} ({airport.code})
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {airport.airport}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default function FlightSearchForm() {
  // ---------------- STATES ----------------
  const [flyingFrom, setFlyingFrom] = useState("");
  const [destinationTo, setDestinationTo] = useState("");
  const [selectedTripType, setSelectedTripType] = useState("one-way");
  const [selectedCabinClass, setSelectedCabinClass] = useState("economy");
  const [travellers, setTravellers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // Initial dates - simpler approach
  useEffect(() => {
    const today = new Date();
    const plus7 = new Date();
    plus7.setDate(today.getDate() + 7);
    
    setDepartDate(today.toISOString().split('T')[0]);
    setReturnDate(plus7.toISOString().split('T')[0]);
  }, []);

  const tripTypeOptions = useMemo(() => [
    { value: "one-way", label: "One Way" },
    { value: "return", label: "Return" },
  ], []);

  const cabinClassOptions = useMemo(() => [
    { value: "economy", label: "Economy" },
    { value: "premium-economy", label: "Premium Economy" },
    { value: "business", label: "Business" },
    { value: "first-class", label: "First Class" },
  ], []);

  // ----------------- JSX -----------------
  return (
    <Box sx={{ p: 2, maxWidth: 900, mx: "auto" }}>
      {/* Trip type + cabin */}
      <Grid
        container
        spacing={2}
        mb={2}
        justifyContent={{ xs: "center", sm: "flex-start" }}
      >
        <Grid item xs={12} sm={3}>
          <FormControl
            size="small"
            sx={{ width: { xs: "100%", sm: "100%" }}}
          >
            <Select
              value={selectedTripType}
              onChange={(e) => setSelectedTripType(e.target.value)}
              sx={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#000",
                height: 24,
                right: { xs: "4px", md: "-10px", lg: "-5px" }
              }}
            >
              {tripTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value} sx={{ fontSize: "10px" }}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl
            size="small"
            sx={{ width: { xs: "100%", sm: "100%" }}}
          >
            <Select
              value={selectedCabinClass}
              onChange={(e) => setSelectedCabinClass(e.target.value)}
              sx={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#000",
                height: 24,
              }}
            >
              {cabinClassOptions.map((option) => (
                <MenuItem key={option.value} value={option.value} sx={{ fontSize: "10px" }}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Main Grid */}
      <Grid container spacing={1} alignItems="center" pl={0.4}
        sx={{
          flexDirection: { xs: "column", md: "row" }
        }}>
        
        {/* Flying From and Destination To with Swap */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            position: "relative",
            width: { xs: "100%", md: "auto" },
            flexDirection: { xs: "column", md: "row" }
          }}
        >
          {/* Flying From */}
          <Box sx={{ width: { xs: "100%", md: 186 } }}>
            <AirportDropdown 
              label="Flying From"
              value={flyingFrom}
              onChange={setFlyingFrom}
            />
          </Box>

          {/* Swap Button */}
          <IconButton
            onClick={() => {
              const temp = flyingFrom;
              setFlyingFrom(destinationTo);
              setDestinationTo(temp);
            }}
            size="small"
            sx={{
              bgcolor: "#3366ff",
              color: "white",
              height: 30,
              width: 30,
              zIndex: 10,
              "&:hover": { bgcolor: "#00BFFF" },

              /* Position */
              position: { xs: "relative", md: "absolute" },
              left: { xs: "40%", md: "50%" },
              top: { md: "5px" },
              transform: { md: "translateX(-50%)" },
              marginTop: { xs: "-10px", md: 0 },
              marginBottom: { xs: "-10px", md: 0 },
            }}
          >
            <SwapHoriz
              sx={{
                fontSize: 20,
                transform: { xs: "rotate(90deg)", md: "rotate(0deg)" },
                transition: "transform 0.3s ease",
              }}
            />
          </IconButton>

          {/* Destination To */}
          <Box sx={{ width: { xs: "100%", md: 186 } }}>
            <AirportDropdown 
              label="Destination To"
              value={destinationTo}
              onChange={setDestinationTo}
            />
          </Box>
        </Box>

        {/* Dates */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            width: { xs: "100%", md: 200 },
            flexDirection: { xs: "column", md: "row" },
            mt: { xs: "5px",md:"0.4px" ,lg: "0.4px" }
          }}
        >
          {/* Depart Date */}
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel shrink sx={{ fontSize: "12px", top: "-3px" }}>
              Depart Date
            </InputLabel>
            <OutlinedInput
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              inputProps={{
                style: {
                  height: 40,
                  padding: "0 8px",
                  fontSize: "12px",
                },
              }}
              sx={{
                height: 40,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#c0c0c0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
                "&:hover": {
                  backgroundColor: "#f0f7ff",
                },
              }}
              label="Depart Date"
            />
          </FormControl>

          {/* Return Date (only on Return trip) */}
          {selectedTripType === "return" && (
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel shrink sx={{ fontSize: "12px", top: "-4px", mt: { xs: "2px" } }}>
                Return Date
              </InputLabel>
              <OutlinedInput
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                inputProps={{
                  style: {
                    height: 40,
                    padding: "0 8px",
                    fontSize: "12px",
                  },
                }}
                sx={{
                  height: 40,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#c0c0c0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                  "&:hover": {
                    backgroundColor: "#f0f7ff",
                  },
                }}
                label="Return Date"
              />
            </FormControl>
          )}
        </Box>

        {/* Travellers */}
        <Grid item xs={12} sm={2}>
          <TravellersDropdown
            travellers={travellers}
            onTravellersChange={setTravellers}
            size="small"
            sx={{
              height: 40,
              "& .MuiButton-root": {
                height: 40,
                fontSize: "12px",
                borderColor: "#c0c0c0",
                "&:hover": { 
                  borderColor: "#1976d2", 
                  backgroundColor: "#f0f7ff" 
                },
              },
              "& .MuiTypography-root": { fontSize: "12px" },
            }}
          />
        </Grid>

        {/* Search */}
        <Grid item xs={12} sm={1}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Search sx={{ height: 40, pl: "12px", py: "5px" }} />}
            sx={{
              width: { xs: "238px", md:"4px", lg: "40px" },
              alignItems: "center",
              height: 40,
              margin: "auto",
              "&:hover": { 
                borderColor: "#1976d2", 
                backgroundColor: "#1565c0",
                mt: { xs: "2px" }
              },
            }}
          ></Button>
        </Grid>
      </Grid>
    </Box>
  );
}